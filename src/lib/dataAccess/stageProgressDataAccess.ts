import { supabase } from '@/lib/supabase';
import { performanceMonitor } from '@/shared/utils/performanceMonitor';

// 段階進行の状態
export type StageProgressStatus = 
  | 'pending'      // 待機中
  | 'in_progress'  // 進行中
  | 'completed'    // 完了
  | 'failed'       // 失敗
  | 'skipped';     // スキップ

// 段階進行の型定義
export interface StageProgress {
  id: string;
  applicantId: string;
  stageId: string;
  status: StageProgressStatus;
  startedAt?: Date;
  completedAt?: Date;
  score?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 段階進行ルールの型定義
export interface StageTransitionRule {
  id: string;
  fromStageId: string;
  toStageId: string;
  conditionType: 'automatic' | 'manual' | 'conditional';
  conditionConfig: any;
  createdAt: Date;
}

// 生データの型定義
interface RawStageProgress {
  id: string;
  applicant_id: string;
  stage_id: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  score: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface RawStageTransitionRule {
  id: string;
  from_stage_id: string;
  to_stage_id: string;
  condition_type: string;
  condition_config: any;
  created_at: string;
}

// データ変換関数
const transformStageProgress = (raw: RawStageProgress): StageProgress => ({
  id: raw.id,
  applicantId: raw.applicant_id,
  stageId: raw.stage_id,
  status: raw.status as StageProgressStatus,
  startedAt: raw.started_at ? new Date(raw.started_at) : undefined,
  completedAt: raw.completed_at ? new Date(raw.completed_at) : undefined,
  score: raw.score || undefined,
  notes: raw.notes || undefined,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at),
});

const transformStageTransitionRule = (raw: RawStageTransitionRule): StageTransitionRule => ({
  id: raw.id,
  fromStageId: raw.from_stage_id,
  toStageId: raw.to_stage_id,
  conditionType: raw.condition_type as 'automatic' | 'manual' | 'conditional',
  conditionConfig: raw.condition_config,
  createdAt: new Date(raw.created_at),
});

export class StageProgressDataAccess {
  /**
   * 応募者の段階進行状況を取得
   */
  static async getApplicantStageProgress(applicantId: string): Promise<StageProgress[]> {
    return await performanceMonitor.measure('StageProgressDataAccess.getApplicantStageProgress', async () => {
      try {
        const { data, error } = await supabase
          .from('stage_progress')
          .select('*')
          .eq('applicant_id', applicantId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Failed to fetch stage progress:', error);
          throw error;
        }

        return (data as RawStageProgress[]).map(transformStageProgress);
      } catch (error) {
        console.error('Error in getApplicantStageProgress:', error);
        throw error;
      }
    });
  }

  /**
   * 特定の段階の進行状況を取得
   */
  static async getStageProgress(applicantId: string, stageId: string): Promise<StageProgress | null> {
    return await performanceMonitor.measure('StageProgressDataAccess.getStageProgress', async () => {
      try {
        const { data, error } = await supabase
          .from('stage_progress')
          .select('*')
          .eq('applicant_id', applicantId)
          .eq('stage_id', stageId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // レコードが見つからない
          }
          console.error('Failed to fetch stage progress:', error);
          throw error;
        }

        return transformStageProgress(data as RawStageProgress);
      } catch (error) {
        console.error('Error in getStageProgress:', error);
        throw error;
      }
    });
  }

  /**
   * 段階進行を開始
   */
  static async startStage(applicantId: string, stageId: string): Promise<StageProgress> {
    return await performanceMonitor.measure('StageProgressDataAccess.startStage', async () => {
      try {
        const { data, error } = await supabase
          .from('stage_progress')
          .insert({
            applicant_id: applicantId,
            stage_id: stageId,
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('Failed to start stage:', error);
          throw error;
        }

        return transformStageProgress(data as RawStageProgress);
      } catch (error) {
        console.error('Error in startStage:', error);
        throw error;
      }
    });
  }

  /**
   * 段階を完了
   */
  static async completeStage(
    applicantId: string, 
    stageId: string, 
    score?: number, 
    notes?: string
  ): Promise<StageProgress> {
    return await performanceMonitor.measure('StageProgressDataAccess.completeStage', async () => {
      try {
        const { data, error } = await supabase
          .from('stage_progress')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            score: score || null,
            notes: notes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('applicant_id', applicantId)
          .eq('stage_id', stageId)
          .select()
          .single();

        if (error) {
          console.error('Failed to complete stage:', error);
          throw error;
        }

        return transformStageProgress(data as RawStageProgress);
      } catch (error) {
        console.error('Error in completeStage:', error);
        throw error;
      }
    });
  }

  /**
   * 段階をスキップ
   */
  static async skipStage(applicantId: string, stageId: string, notes?: string): Promise<StageProgress> {
    return await performanceMonitor.measure('StageProgressDataAccess.skipStage', async () => {
      try {
        const { data, error } = await supabase
          .from('stage_progress')
          .update({
            status: 'skipped',
            completed_at: new Date().toISOString(),
            notes: notes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('applicant_id', applicantId)
          .eq('stage_id', stageId)
          .select()
          .single();

        if (error) {
          console.error('Failed to skip stage:', error);
          throw error;
        }

        return transformStageProgress(data as RawStageProgress);
      } catch (error) {
        console.error('Error in skipStage:', error);
        throw error;
      }
    });
  }

  /**
   * 次の段階に自動進行
   */
  static async advanceToNextStage(applicantId: string, currentStageId: string): Promise<StageProgress | null> {
    return await performanceMonitor.measure('StageProgressDataAccess.advanceToNextStage', async () => {
      try {
        // 現在の段階を完了
        await this.completeStage(applicantId, currentStageId);

        // 次の段階を取得
        const { data: nextStage, error: nextStageError } = await supabase
          .from('events')
          .select('id')
          .eq('id', currentStageId)
          .single();

        if (nextStageError || !nextStage) {
          console.warn('Next stage not found');
          return null;
        }

        // 次の段階を開始
        return await this.startStage(applicantId, nextStage.id);
      } catch (error) {
        console.error('Error in advanceToNextStage:', error);
        throw error;
      }
    });
  }

  /**
   * 段階進行ルールを取得
   */
  static async getStageTransitionRules(): Promise<StageTransitionRule[]> {
    return await performanceMonitor.measure('StageProgressDataAccess.getStageTransitionRules', async () => {
      try {
        const { data, error } = await supabase
          .from('stage_transition_rules')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Failed to fetch stage transition rules:', error);
          throw error;
        }

        return (data as RawStageTransitionRule[]).map(transformStageTransitionRule);
      } catch (error) {
        console.error('Error in getStageTransitionRules:', error);
        throw error;
      }
    });
  }

  /**
   * 段階進行の条件をチェック
   */
  static async checkStageTransitionConditions(
    applicantId: string, 
    fromStageId: string, 
    toStageId: string
  ): Promise<{ canTransition: boolean; reason?: string }> {
    return await performanceMonitor.measure('StageProgressDataAccess.checkStageTransitionConditions', async () => {
      try {
        // 現在の段階の完了状況をチェック
        const currentProgress = await this.getStageProgress(applicantId, fromStageId);
        
        if (!currentProgress || currentProgress.status !== 'completed') {
          return { 
            canTransition: false, 
            reason: '前の段階が完了していません' 
          };
        }

        // 段階進行ルールをチェック
        const rules = await this.getStageTransitionRules();
        const applicableRule = rules.find(rule => 
          rule.fromStageId === fromStageId && rule.toStageId === toStageId
        );

        if (!applicableRule) {
          return { 
            canTransition: false, 
            reason: '段階進行ルールが定義されていません' 
          };
        }

        // 条件に応じたチェック
        switch (applicableRule.conditionType) {
          case 'automatic':
            return { canTransition: true };
          
          case 'manual':
            return { 
              canTransition: false, 
              reason: '手動承認が必要です' 
            };
          
          case 'conditional':
            // 条件設定に基づいてチェック
            const config = applicableRule.conditionConfig;
            if (config.minScore && currentProgress.score && currentProgress.score < config.minScore) {
              return { 
                canTransition: false, 
                reason: `最低スコア${config.minScore}が必要です（現在: ${currentProgress.score}）` 
              };
            }
            return { canTransition: true };
          
          default:
            return { 
              canTransition: false, 
              reason: '不明な条件タイプです' 
            };
        }
      } catch (error) {
        console.error('Error in checkStageTransitionConditions:', error);
        throw error;
      }
    });
  }
}
