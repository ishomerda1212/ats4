// 統合ステータス管理データアクセス層
// 段階ごとのステータス定義を管理

import { supabase } from '@/lib/supabase';
import { performanceMonitor } from '@/shared/utils/performanceMonitor';

// 統合ステータス定義型
export interface IntegratedStatusDefinition {
  id: string;
  stageId: string; // events.id への参照
  stageName: string; // events.stage
  statusValue: string; // ステータス値（例：合格、不合格）
  displayName: string; // 表示名
  statusCategory: StatusCategory;
  colorScheme: ColorScheme;
  sortOrder: number;
  isActive: boolean;
  isFinal: boolean; // 最終ステータス（これ以上進めない）
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStatusDefinitionInput {
  stageId: string;
  statusValue: string;
  displayName: string;
  statusCategory: StatusCategory;
  colorScheme?: ColorScheme;
  sortOrder: number;
  isActive?: boolean;
  isFinal?: boolean;
}

export interface UpdateStatusDefinitionInput {
  statusValue?: string;
  displayName?: string;
  statusCategory?: StatusCategory;
  colorScheme?: ColorScheme;
  sortOrder?: number;
  isActive?: boolean;
  isFinal?: boolean;
}

export type StatusCategory = 'passed' | 'failed' | 'pending' | 'declined' | 'cancelled';

export type ColorScheme = 
  | 'green' | 'red' | 'yellow' | 'blue' | 'gray'
  | 'purple' | 'indigo' | 'orange' | 'teal' | 'cyan' 
  | 'pink' | 'violet' | 'emerald' | 'amber';

// ステータステーブル（新規作成）
interface RawStatusDefinition {
  id: string;
  stage_id: string;
  status_value: string;
  display_name: string;
  status_category: string;
  color_scheme: string;
  sort_order: number;
  is_active: boolean;
  is_final: boolean;
  created_at: string;
  updated_at: string;
}

// データ変換関数
const transformToIntegratedStatus = async (rawStatus: RawStatusDefinition): Promise<IntegratedStatusDefinition> => {
  // stageIdからevent情報を取得
  const { data: event } = await supabase
    .from('events')
    .select('stage, name')
    .eq('id', rawStatus.stage_id)
    .single();

  return {
    id: rawStatus.id,
    stageId: rawStatus.stage_id,
    stageName: event?.stage || '',
    statusValue: rawStatus.status_value,
    displayName: rawStatus.display_name,
    statusCategory: rawStatus.status_category as StatusCategory,
    colorScheme: rawStatus.color_scheme as ColorScheme,
    sortOrder: rawStatus.sort_order,
    isActive: rawStatus.is_active,
    isFinal: rawStatus.is_final,
    createdAt: new Date(rawStatus.created_at),
    updatedAt: new Date(rawStatus.updated_at)
  };
};

export class IntegratedStatusDataAccess {
  /**
   * ステータス定義テーブルを初期化（テーブルが存在しない場合のみ）
   */
  static async initializeStatusTable(): Promise<void> {
    try {
      // テーブル存在確認
      const { data, error } = await supabase
        .from('stage_status_definitions')
        .select('id')
        .limit(1);

      // テーブルが存在しない場合は、events.stage_config にステータス情報を保存する方式を採用
      if (error && error.code === '42P01') {
        console.info('stage_status_definitions table does not exist, using events.stage_config approach');
        return;
      }
    } catch (error) {
      console.warn('Status table initialization check failed:', error);
    }
  }

  /**
   * 特定段階のステータス定義を取得
   */
  static async getStatusesByStageId(stageId: string): Promise<IntegratedStatusDefinition[]> {
    return await performanceMonitor.measure('IntegratedStatusDataAccess.getStatusesByStageId', async () => {
      try {
        // まず専用テーブルから取得を試行
        try {
          const { data: statuses, error } = await supabase
            .from('stage_status_definitions')
            .select('*')
            .eq('stage_id', stageId)
            .order('sort_order', { ascending: true });

          if (!error && statuses && statuses.length > 0) {
            const transformPromises = (statuses as RawStatusDefinition[]).map(transformToIntegratedStatus);
            return await Promise.all(transformPromises);
          }
        } catch (tableError) {
          // テーブルが存在しない場合は events.stage_config から取得
        }

        // events.stage_config からステータス定義を取得
        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('id, stage, name, stage_config')
          .eq('id', stageId)
          .single();

        if (eventError || !event) {
          return [];
        }

        // stage_config からステータス情報を抽出
        const stageConfig = event.stage_config || {};
        const statuses = stageConfig.statuses || this.getDefaultStatusesForStage(event.stage);

        return statuses.map((status: any, index: number): IntegratedStatusDefinition => ({
          id: `${stageId}-status-${index}`,
          stageId: stageId,
          stageName: event.stage,
          statusValue: status.statusValue || status.value || '不明',
          displayName: status.displayName || status.name || status.statusValue || '不明',
          statusCategory: status.statusCategory || 'pending',
          colorScheme: status.colorScheme || this.getDefaultColorForCategory(status.statusCategory || 'pending'),
          sortOrder: status.sortOrder || index + 1,
          isActive: status.isActive !== false,
          isFinal: status.isFinal || false,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      } catch (error) {
        console.error('Error in getStatusesByStageId:', error);
        throw error;
      }
    });
  }

  /**
   * ステータス定義を作成/更新（events.stage_config を使用）
   */
  static async saveStatusesToStage(stageId: string, statuses: CreateStatusDefinitionInput[]): Promise<IntegratedStatusDefinition[]> {
    return await performanceMonitor.measure('IntegratedStatusDataAccess.saveStatusesToStage', async () => {
      try {
        // 既存のstage_configを取得
        const { data: event, error: fetchError } = await supabase
          .from('events')
          .select('stage_config')
          .eq('id', stageId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        const currentConfig = event.stage_config || {};
        
        // ステータス情報を更新
        const updatedConfig = {
          ...currentConfig,
          statuses: statuses.map((status, index) => ({
            statusValue: status.statusValue,
            displayName: status.displayName,
            statusCategory: status.statusCategory,
            colorScheme: status.colorScheme || this.getDefaultColorForCategory(status.statusCategory),
            sortOrder: status.sortOrder || index + 1,
            isActive: status.isActive !== false,
            isFinal: status.isFinal || false
          })),
          statusesUpdatedAt: new Date().toISOString()
        };

        // stage_configを更新
        const { error: updateError } = await supabase
          .from('events')
          .update({ stage_config: updatedConfig })
          .eq('id', stageId);

        if (updateError) {
          throw updateError;
        }

        // 更新されたステータス一覧を返す
        return await this.getStatusesByStageId(stageId);
      } catch (error) {
        console.error('Error in saveStatusesToStage:', error);
        throw error;
      }
    });
  }

  /**
   * 段階に応じたデフォルトステータスを取得
   */
  private static getDefaultStatusesForStage(stageName: string): any[] {
    const commonStatuses = [
      { statusValue: '合格', displayName: '合格', statusCategory: 'passed', colorScheme: 'green', sortOrder: 1, isFinal: false },
      { statusValue: '不合格', displayName: '不合格', statusCategory: 'failed', colorScheme: 'red', sortOrder: 2, isFinal: true },
      { statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', colorScheme: 'gray', sortOrder: 3, isFinal: true }
    ];

    // 段階固有のステータスを追加
    if (['会社説明会', '職場見学', '仕事体験', 'CEOセミナー'].includes(stageName)) {
      return [
        { statusValue: '参加予定', displayName: '参加予定', statusCategory: 'pending', colorScheme: 'blue', sortOrder: 1 },
        { statusValue: '参加', displayName: '参加', statusCategory: 'passed', colorScheme: 'green', sortOrder: 2 },
        { statusValue: 'キャンセル', displayName: 'キャンセル', statusCategory: 'cancelled', colorScheme: 'gray', sortOrder: 3 },
        ...commonStatuses.slice(2) // 辞退のみ追加
      ];
    }

    if (['人事面接', '集団面接', '最終選考'].includes(stageName)) {
      return [
        ...commonStatuses,
        { statusValue: '保留', displayName: '保留', statusCategory: 'pending', colorScheme: 'yellow', sortOrder: 4 },
        { statusValue: 'キャンセル', displayName: 'キャンセル', statusCategory: 'cancelled', colorScheme: 'gray', sortOrder: 5 },
        { statusValue: '無断欠席', displayName: '無断欠席', statusCategory: 'failed', colorScheme: 'red', sortOrder: 6, isFinal: true }
      ];
    }

    if (stageName === '内定面談') {
      return [
        { statusValue: '承諾', displayName: '承諾', statusCategory: 'passed', colorScheme: 'green', sortOrder: 1, isFinal: true },
        { statusValue: '未承諾', displayName: '未承諾', statusCategory: 'failed', colorScheme: 'red', sortOrder: 2, isFinal: true },
        { statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', colorScheme: 'gray', sortOrder: 3, isFinal: true }
      ];
    }

    return commonStatuses;
  }

  /**
   * ステータスカテゴリに応じたデフォルト色を取得
   */
  private static getDefaultColorForCategory(category: StatusCategory): ColorScheme {
    const colorMap: Record<StatusCategory, ColorScheme> = {
      passed: 'green',
      failed: 'red',
      pending: 'yellow',
      declined: 'gray',
      cancelled: 'gray'
    };
    return colorMap[category] || 'blue';
  }

  /**
   * 全段階のステータス統計を取得
   */
  static async getStatusStatistics(): Promise<{
    totalStatuses: number;
    statusesByCategory: Record<StatusCategory, number>;
    statusesByStage: Record<string, number>;
  }> {
    return await performanceMonitor.measure('IntegratedStatusDataAccess.getStatusStatistics', async () => {
      try {
        // 全イベントのstage_configからステータス情報を集計
        const { data: events, error } = await supabase
          .from('events')
          .select('stage, stage_config');

        if (error) {
          throw error;
        }

        let totalStatuses = 0;
        const statusesByCategory: Record<StatusCategory, number> = {
          passed: 0,
          failed: 0,
          pending: 0,
          declined: 0,
          cancelled: 0
        };
        const statusesByStage: Record<string, number> = {};

        (events as any[]).forEach(event => {
          const statuses = event.stage_config?.statuses || this.getDefaultStatusesForStage(event.stage);
          const activeStatuses = statuses.filter((s: any) => s.isActive !== false);
          
          totalStatuses += activeStatuses.length;
          statusesByStage[event.stage] = activeStatuses.length;
          
          activeStatuses.forEach((status: any) => {
            const category = status.statusCategory as StatusCategory;
            if (statusesByCategory.hasOwnProperty(category)) {
              statusesByCategory[category]++;
            }
          });
        });

        return {
          totalStatuses,
          statusesByCategory,
          statusesByStage
        };
      } catch (error) {
        console.error('Error in getStatusStatistics:', error);
        throw error;
      }
    });
  }
}

// ステータスカテゴリの定義
export const STATUS_CATEGORIES: { value: StatusCategory; label: string; description: string; icon: string; defaultColor: ColorScheme }[] = [
  { value: 'passed', label: '通過', description: '選考を通過・成功した状態', icon: '✅', defaultColor: 'green' },
  { value: 'failed', label: '不通過', description: '選考で不合格・失敗した状態', icon: '❌', defaultColor: 'red' },
  { value: 'pending', label: '保留', description: '結果待ち・検討中の状態', icon: '⏳', defaultColor: 'yellow' },
  { value: 'declined', label: '辞退', description: '応募者が辞退した状態', icon: '🚫', defaultColor: 'gray' },
  { value: 'cancelled', label: 'キャンセル', description: 'キャンセル・中止された状態', icon: '⭕', defaultColor: 'gray' }
];

// よく使用されるステータステンプレート
export const STATUS_TEMPLATES: Record<string, CreateStatusDefinitionInput[]> = {
  'basic': [
    { stageId: '', statusValue: '合格', displayName: '合格', statusCategory: 'passed', sortOrder: 1, colorScheme: 'green' },
    { stageId: '', statusValue: '不合格', displayName: '不合格', statusCategory: 'failed', sortOrder: 2, colorScheme: 'red', isFinal: true },
    { stageId: '', statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', sortOrder: 3, colorScheme: 'gray', isFinal: true }
  ],
  'interview': [
    { stageId: '', statusValue: '合格', displayName: '合格', statusCategory: 'passed', sortOrder: 1, colorScheme: 'green' },
    { stageId: '', statusValue: '不合格', displayName: '不合格', statusCategory: 'failed', sortOrder: 2, colorScheme: 'red', isFinal: true },
    { stageId: '', statusValue: '保留', displayName: '保留', statusCategory: 'pending', sortOrder: 3, colorScheme: 'yellow' },
    { stageId: '', statusValue: 'キャンセル', displayName: 'キャンセル', statusCategory: 'cancelled', sortOrder: 4, colorScheme: 'gray' },
    { stageId: '', statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', sortOrder: 5, colorScheme: 'gray', isFinal: true },
    { stageId: '', statusValue: '無断欠席', displayName: '無断欠席', statusCategory: 'failed', sortOrder: 6, colorScheme: 'red', isFinal: true }
  ],
  'event': [
    { stageId: '', statusValue: '参加予定', displayName: '参加予定', statusCategory: 'pending', sortOrder: 1, colorScheme: 'blue' },
    { stageId: '', statusValue: '参加', displayName: '参加', statusCategory: 'passed', sortOrder: 2, colorScheme: 'green' },
    { stageId: '', statusValue: 'キャンセル', displayName: 'キャンセル', statusCategory: 'cancelled', sortOrder: 3, colorScheme: 'gray' },
    { stageId: '', statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', sortOrder: 4, colorScheme: 'gray', isFinal: true },
    { stageId: '', statusValue: '無断欠席', displayName: '無断欠席', statusCategory: 'failed', sortOrder: 5, colorScheme: 'red', isFinal: true }
  ],
  'final': [
    { stageId: '', statusValue: '内定', displayName: '内定', statusCategory: 'passed', sortOrder: 1, colorScheme: 'green' },
    { stageId: '', statusValue: '不合格', displayName: '不合格', statusCategory: 'failed', sortOrder: 2, colorScheme: 'red', isFinal: true },
    { stageId: '', statusValue: '保留', displayName: '保留', statusCategory: 'pending', sortOrder: 3, colorScheme: 'yellow' },
    { stageId: '', statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', sortOrder: 4, colorScheme: 'gray', isFinal: true }
  ]
};