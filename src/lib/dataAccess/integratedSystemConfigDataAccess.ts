// 統合システム設定データアクセス層
// 既存の events テーブルを活用して新設定システムの機能を提供

import { supabase } from '@/lib/supabase';
import { performanceMonitor } from '@/shared/utils/performanceMonitor';
import type {
  SelectionStageDefinition,
  CreateSelectionStageInput,
  UpdateSelectionStageInput,
  StageGroup,
  ColorScheme,
  SessionType,
  SystemConfigSummary
} from '@/features/system-config/types';

// 既存 events テーブルの型定義
interface RawEvent {
  id: string;
  name: string;
  description: string | null;
  stage: string;
  venue: string | null;
  max_participants: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  sort_order: number | null;
  stage_config: any; // JSONB
}

// stage_config の標準構造
interface StageConfig {
  display_name?: string;
  description?: string;
  stage_group?: StageGroup;
  is_active?: boolean;
  color_scheme?: ColorScheme;
  icon?: string;
  estimated_duration_minutes?: number;
  requires_session?: boolean;
  session_types?: SessionType[];
  created_by_system?: boolean;
  config_version?: number;
}

// デフォルト設定値
const DEFAULT_STAGE_CONFIG: Required<StageConfig> = {
  display_name: '',
  description: '',
  stage_group: 'その他',
  is_active: true,
  color_scheme: 'blue',
  icon: '',
  estimated_duration_minutes: 60,
  requires_session: false,
  session_types: [],
  created_by_system: true,
  config_version: 1
};

// データ変換関数：events テーブル → SelectionStageDefinition
const transformEventToStageDefinition = (event: RawEvent): SelectionStageDefinition => {
  const config: StageConfig = event.stage_config || {};
  
  return {
    id: event.id,
    name: event.stage, // events.stage を name として使用
    displayName: config.display_name || event.name || event.stage,
    description: config.description || event.description || '',
    stageGroup: config.stage_group || 'その他',
    sortOrder: event.sort_order || 0,
    isActive: config.is_active ?? true,
    colorScheme: config.color_scheme || 'blue',
    icon: config.icon || '',
    estimatedDurationMinutes: config.estimated_duration_minutes || 60,
    requiresSession: config.requires_session || false,
    sessionTypes: config.session_types || [],
    createdAt: new Date(event.created_at),
    updatedAt: new Date(event.updated_at)
  };
};

// データ変換関数：SelectionStageDefinition → events テーブル更新データ
const transformStageDefinitionToEventUpdate = (
  stage: CreateSelectionStageInput | UpdateSelectionStageInput,
  existingEvent?: RawEvent
): Partial<RawEvent> => {
  const existingConfig: StageConfig = existingEvent?.stage_config || {};
  
  const newConfig: StageConfig = {
    ...DEFAULT_STAGE_CONFIG,
    ...existingConfig,
    display_name: stage.displayName,
    description: stage.description,
    stage_group: stage.stageGroup,
    is_active: stage.isActive ?? true,
    color_scheme: stage.colorScheme,
    icon: stage.icon,
    estimated_duration_minutes: stage.estimatedDurationMinutes,
    requires_session: stage.requiresSession,
    session_types: stage.sessionTypes,
    config_version: (existingConfig.config_version || 0) + 1
  };

  return {
    name: stage.displayName || existingEvent?.name,
    description: stage.description || existingEvent?.description,
    stage: stage.name || existingEvent?.stage,
    sort_order: stage.sortOrder ?? existingEvent?.sort_order,
    stage_config: newConfig,
    updated_at: new Date().toISOString()
  };
};

export class IntegratedSystemConfigDataAccess {
  /**
   * 全選考段階を取得（events テーブルから）
   */
  static async getAllSelectionStages(): Promise<SelectionStageDefinition[]> {
    return await performanceMonitor.measure('IntegratedSystemConfig.getAllSelectionStages', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Failed to fetch selection stages from events:', error);
          throw error;
        }

        return (data as RawEvent[]).map(transformEventToStageDefinition);
      } catch (error) {
        console.error('Error in getAllSelectionStages:', error);
        throw error;
      }
    });
  }

  /**
   * アクティブな選考段階のみを取得
   */
  static async getActiveSelectionStages(): Promise<SelectionStageDefinition[]> {
    return await performanceMonitor.measure('IntegratedSystemConfig.getActiveSelectionStages', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .or('stage_config->is_active.eq.true,stage_config.is.null') // is_active が true または未設定
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Failed to fetch active selection stages:', error);
          throw error;
        }

        return (data as RawEvent[])
          .map(transformEventToStageDefinition)
          .filter(stage => stage.isActive);
      } catch (error) {
        console.error('Error in getActiveSelectionStages:', error);
        throw error;
      }
    });
  }

  /**
   * 特定の選考段階を取得
   */
  static async getSelectionStageById(id: string): Promise<SelectionStageDefinition | null> {
    return await performanceMonitor.measure('IntegratedSystemConfig.getSelectionStageById', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // レコードが見つからない
          }
          console.error('Failed to fetch selection stage by id:', error);
          throw error;
        }

        return transformEventToStageDefinition(data as RawEvent);
      } catch (error) {
        console.error('Error in getSelectionStageById:', error);
        throw error;
      }
    });
  }

  /**
   * 新しい選考段階を作成（events テーブルに追加）
   */
  static async createSelectionStage(stageInput: CreateSelectionStageInput): Promise<SelectionStageDefinition> {
    return await performanceMonitor.measure('IntegratedSystemConfig.createSelectionStage', async () => {
      try {
        const updateData = transformStageDefinitionToEventUpdate(stageInput);
        
        const { data, error } = await supabase
          .from('events')
          .insert({
            ...updateData,
            status: 'アクティブ' // 適切なデフォルトステータス
          })
          .select()
          .single();

        if (error) {
          console.error('Failed to create selection stage:', error);
          throw error;
        }

        return transformEventToStageDefinition(data as RawEvent);
      } catch (error) {
        console.error('Error in createSelectionStage:', error);
        throw error;
      }
    });
  }

  /**
   * 選考段階を更新（events テーブルの stage_config を更新）
   */
  static async updateSelectionStage(id: string, stageInput: UpdateSelectionStageInput): Promise<SelectionStageDefinition> {
    return await performanceMonitor.measure('IntegratedSystemConfig.updateSelectionStage', async () => {
      try {
        // 既存データを取得
        const existingEvent = await this.getEventById(id);
        if (!existingEvent) {
          throw new Error(`Selection stage with id ${id} not found`);
        }

        const updateData = transformStageDefinitionToEventUpdate(stageInput, existingEvent);

        const { data, error } = await supabase
          .from('events')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Failed to update selection stage:', error);
          throw error;
        }

        return transformEventToStageDefinition(data as RawEvent);
      } catch (error) {
        console.error('Error in updateSelectionStage:', error);
        throw error;
      }
    });
  }

  /**
   * 選考段階を削除（論理削除：is_active を false に設定）
   */
  static async deleteSelectionStage(id: string): Promise<void> {
    return await performanceMonitor.measure('IntegratedSystemConfig.deleteSelectionStage', async () => {
      try {
        // 既存の stage_config を取得
        const existingEvent = await this.getEventById(id);
        if (!existingEvent) {
          throw new Error(`Selection stage with id ${id} not found`);
        }

        const updatedConfig = {
          ...existingEvent.stage_config,
          is_active: false,
          config_version: (existingEvent.stage_config?.config_version || 0) + 1
        };

        const { error } = await supabase
          .from('events')
          .update({
            stage_config: updatedConfig,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) {
          console.error('Failed to delete selection stage:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error in deleteSelectionStage:', error);
        throw error;
      }
    });
  }

  /**
   * 選考段階の順序を更新
   */
  static async updateStageOrder(stageOrders: { id: string; sortOrder: number }[]): Promise<void> {
    return await performanceMonitor.measure('IntegratedSystemConfig.updateStageOrder', async () => {
      try {
        // バッチ更新を実行
        const updates = stageOrders.map(({ id, sortOrder }) => 
          supabase
            .from('events')
            .update({ 
              sort_order: sortOrder,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
        );

        const results = await Promise.all(updates);
        
        // エラーチェック
        for (const { error } of results) {
          if (error) {
            console.error('Failed to update stage order:', error);
            throw error;
          }
        }
      } catch (error) {
        console.error('Error in updateStageOrder:', error);
        throw error;
      }
    });
  }

  /**
   * システム設定サマリーを取得
   */
  static async getSystemConfigSummary(): Promise<SystemConfigSummary> {
    return await performanceMonitor.measure('IntegratedSystemConfig.getSystemConfigSummary', async () => {
      try {
        const stages = await this.getAllSelectionStages();
        const activeStages = stages.filter(stage => stage.isActive);

        // タスクとステータスの統計は既存テーブルから取得（テーブルが存在しない場合は0を返す）
        let totalTasks = 0;
        let totalStatuses = 0;

        try {
          const [{ count: tasksCount }, { count: statusesCount }] = await Promise.all([
            supabase.from('fixed_tasks').select('*', { count: 'exact', head: true }),
            supabase.from('task_instances').select('*', { count: 'exact', head: true })
          ]);
          totalTasks = tasksCount || 0;
          totalStatuses = statusesCount || 0;
        } catch (tableError) {
          console.warn('Some tables may not exist, using default values:', tableError);
          // テーブルが存在しない場合はデフォルト値を使用
          totalTasks = 0;
          totalStatuses = 0;
        }

        return {
          totalStages: stages.length,
          activeStages: activeStages.length,
          totalTasks,
          totalStatuses,
          lastUpdated: new Date()
        };
      } catch (error) {
        console.error('Error in getSystemConfigSummary:', error);
        throw error;
      }
    });
  }

  /**
   * 内部ユーティリティ：events テーブルから生データを取得
   */
  private static async getEventById(id: string): Promise<RawEvent | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as RawEvent;
  }

  /**
   * 設定整合性チェック
   */
  static async validateConfigIntegrity(): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const stages = await this.getAllSelectionStages();
      const errors: string[] = [];
      const warnings: string[] = [];

      // 重複チェック
      const stageNames = stages.map(s => s.name);
      const duplicates = stageNames.filter((name, index) => stageNames.indexOf(name) !== index);
      if (duplicates.length > 0) {
        errors.push(`重複した段階名があります: ${duplicates.join(', ')}`);
      }

      // アクティブ段階の存在チェック
      const activeStages = stages.filter(s => s.isActive);
      if (activeStages.length === 0) {
        warnings.push('アクティブな選考段階が設定されていません');
      }

      // 順序の整合性チェック
      const sortOrders = stages.map(s => s.sortOrder).sort((a, b) => a - b);
      for (let i = 1; i < sortOrders.length; i++) {
        if (sortOrders[i] === sortOrders[i - 1]) {
          warnings.push('同じ順序番号の段階があります');
          break;
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      console.error('Error in validateConfigIntegrity:', error);
      return {
        isValid: false,
        errors: ['設定整合性チェックでエラーが発生しました'],
        warnings: []
      };
    }
  }
}