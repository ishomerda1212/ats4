// 統合タスク管理データアクセス層
// 既存の fixed_tasks テーブルを活用した新設定システム

import { supabase } from '@/lib/supabase';
import { performanceMonitor } from '@/shared/utils/performanceMonitor';

// 統合タスク定義型
export interface IntegratedTaskDefinition {
  id: string;
  stageId: string; // events.id への参照
  stageName: string; // events.stage
  name: string; // fixed_tasks.title
  displayName: string; // 表示名
  description: string;
  taskType: TaskType;
  sortOrder: number; // fixed_tasks.order_num
  isRequired: boolean;
  isActive: boolean;
  dueOffsetDays?: number; // 相対期限
  emailTemplateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDefinitionInput {
  stageId: string;
  name: string;
  displayName: string;
  description?: string;
  taskType: TaskType;
  sortOrder: number;
  isRequired?: boolean;
  isActive?: boolean;
  dueOffsetDays?: number;
  emailTemplateId?: string;
}

export interface UpdateTaskDefinitionInput {
  name?: string;
  displayName?: string;
  description?: string;
  taskType?: TaskType;
  sortOrder?: number;
  isRequired?: boolean;
  isActive?: boolean;
  dueOffsetDays?: number;
  emailTemplateId?: string;
}

export type TaskType = 'email' | 'document' | 'general' | 'interview' | 'evaluation';

// 既存 fixed_tasks テーブルの型
interface RawFixedTask {
  id: string;
  stage: string; // events.stage への参照
  title: string;
  description: string | null;
  type: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

// データ変換関数：fixed_tasks → IntegratedTaskDefinition
const transformToIntegratedTask = async (rawTask: RawFixedTask): Promise<IntegratedTaskDefinition> => {
  // stage名からeventを取得してstageIdを特定
  const { data: event } = await supabase
    .from('events')
    .select('id, name')
    .eq('stage', rawTask.stage)
    .single();

  return {
    id: rawTask.id,
    stageId: event?.id || '',
    stageName: rawTask.stage,
    name: rawTask.title,
    displayName: rawTask.title,
    description: rawTask.description || '',
    taskType: rawTask.type as TaskType,
    sortOrder: rawTask.order_num,
    isRequired: true, // fixed_tasksでは基本的に必須
    isActive: true,
    dueOffsetDays: undefined, // 既存データでは未設定
    emailTemplateId: undefined,
    createdAt: new Date(rawTask.created_at),
    updatedAt: new Date(rawTask.updated_at)
  };
};

// データ変換関数：CreateTaskDefinitionInput → fixed_tasks insert data
const transformToFixedTaskInsert = async (input: CreateTaskDefinitionInput) => {
  // stageIdからevent.stageを取得
  const { data: event } = await supabase
    .from('events')
    .select('stage')
    .eq('id', input.stageId)
    .single();

  if (!event) {
    throw new Error(`Event with id ${input.stageId} not found`);
  }

  return {
    stage: event.stage,
    title: input.name,
    description: input.description || null,
    type: input.taskType,
    order_num: input.sortOrder
  };
};

export class IntegratedTaskDataAccess {
  /**
   * 特定段階の全タスクを取得
   */
  static async getTasksByStageId(stageId: string): Promise<IntegratedTaskDefinition[]> {
    return await performanceMonitor.measure('IntegratedTaskDataAccess.getTasksByStageId', async () => {
      try {
        // stageIdからevent.stageを取得
        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('stage')
          .eq('id', stageId)
          .single();

        if (eventError || !event) {
          throw new Error(`Event with id ${stageId} not found`);
        }

        // fixed_tasksからタスクを取得
        const { data: tasks, error } = await supabase
          .from('fixed_tasks')
          .select('*')
          .eq('stage', event.stage)
          .order('order_num', { ascending: true });

        if (error) {
          console.error('Failed to fetch tasks for stage:', error);
          throw error;
        }

        // 並行してデータ変換（パフォーマンス最適化）
        const transformPromises = (tasks as RawFixedTask[]).map(transformToIntegratedTask);
        return await Promise.all(transformPromises);
      } catch (error) {
        console.error('Error in getTasksByStageId:', error);
        throw error;
      }
    });
  }

  /**
   * 全段階の全タスクを取得
   */
  static async getAllTasks(): Promise<IntegratedTaskDefinition[]> {
    return await performanceMonitor.measure('IntegratedTaskDataAccess.getAllTasks', async () => {
      try {
        const { data: tasks, error } = await supabase
          .from('fixed_tasks')
          .select('*')
          .order('stage', { ascending: true })
          .order('order_num', { ascending: true });

        if (error) {
          console.error('Failed to fetch all tasks:', error);
          throw error;
        }

        // 並行してデータ変換
        const transformPromises = (tasks as RawFixedTask[]).map(transformToIntegratedTask);
        return await Promise.all(transformPromises);
      } catch (error) {
        console.error('Error in getAllTasks:', error);
        throw error;
      }
    });
  }

  /**
   * タスクを作成
   */
  static async createTask(taskInput: CreateTaskDefinitionInput): Promise<IntegratedTaskDefinition> {
    return await performanceMonitor.measure('IntegratedTaskDataAccess.createTask', async () => {
      try {
        const insertData = await transformToFixedTaskInsert(taskInput);

        const { data, error } = await supabase
          .from('fixed_tasks')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error('Failed to create task:', error);
          throw error;
        }

        return await transformToIntegratedTask(data as RawFixedTask);
      } catch (error) {
        console.error('Error in createTask:', error);
        throw error;
      }
    });
  }

  /**
   * タスクを更新
   */
  static async updateTask(id: string, taskInput: UpdateTaskDefinitionInput): Promise<IntegratedTaskDefinition> {
    return await performanceMonitor.measure('IntegratedTaskDataAccess.updateTask', async () => {
      try {
        const updateData: Partial<RawFixedTask> = {};

        if (taskInput.name) updateData.title = taskInput.name;
        if (taskInput.description !== undefined) updateData.description = taskInput.description || null;
        if (taskInput.taskType) updateData.type = taskInput.taskType;
        if (typeof taskInput.sortOrder === 'number') updateData.order_num = taskInput.sortOrder;

        const { data, error } = await supabase
          .from('fixed_tasks')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Failed to update task:', error);
          throw error;
        }

        return await transformToIntegratedTask(data as RawFixedTask);
      } catch (error) {
        console.error('Error in updateTask:', error);
        throw error;
      }
    });
  }

  /**
   * タスクを削除
   */
  static async deleteTask(id: string): Promise<void> {
    return await performanceMonitor.measure('IntegratedTaskDataAccess.deleteTask', async () => {
      try {
        const { error } = await supabase
          .from('fixed_tasks')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Failed to delete task:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error in deleteTask:', error);
        throw error;
      }
    });
  }

  /**
   * タスクの順序を更新
   */
  static async updateTaskOrder(taskOrders: { id: string; sortOrder: number }[]): Promise<void> {
    return await performanceMonitor.measure('IntegratedTaskDataAccess.updateTaskOrder', async () => {
      try {
        // バッチ更新を実行
        const updates = taskOrders.map(({ id, sortOrder }) =>
          supabase
            .from('fixed_tasks')
            .update({ order_num: sortOrder })
            .eq('id', id)
        );

        const results = await Promise.all(updates);

        // エラーチェック
        for (const { error } of results) {
          if (error) {
            console.error('Failed to update task order:', error);
            throw error;
          }
        }
      } catch (error) {
        console.error('Error in updateTaskOrder:', error);
        throw error;
      }
    });
  }

  /**
   * 段階名からタスクを取得（既存システム互換）
   */
  static async getTasksByStageName(stageName: string): Promise<IntegratedTaskDefinition[]> {
    return await performanceMonitor.measure('IntegratedTaskDataAccess.getTasksByStageName', async () => {
      try {
        const { data: tasks, error } = await supabase
          .from('fixed_tasks')
          .select('*')
          .eq('stage', stageName)
          .order('order_num', { ascending: true });

        if (error) {
          console.error('Failed to fetch tasks by stage name:', error);
          throw error;
        }

        const transformPromises = (tasks as RawFixedTask[]).map(transformToIntegratedTask);
        return await Promise.all(transformPromises);
      } catch (error) {
        console.error('Error in getTasksByStageName:', error);
        throw error;
      }
    });
  }

  /**
   * タスクタイプの統計を取得
   */
  static async getTaskTypeStatistics(): Promise<Record<TaskType, number>> {
    return await performanceMonitor.measure('IntegratedTaskDataAccess.getTaskTypeStatistics', async () => {
      try {
        const { data: tasks, error } = await supabase
          .from('fixed_tasks')
          .select('type');

        if (error) {
          throw error;
        }

        const stats: Record<TaskType, number> = {
          email: 0,
          document: 0,
          general: 0,
          interview: 0,
          evaluation: 0
        };

        (tasks as { type: string }[]).forEach(task => {
          const taskType = task.type as TaskType;
          if (stats.hasOwnProperty(taskType)) {
            stats[taskType]++;
          }
        });

        return stats;
      } catch (error) {
        console.error('Error in getTaskTypeStatistics:', error);
        throw error;
      }
    });
  }
}

// タスクタイプの定義
export const TASK_TYPES: { value: TaskType; label: string; description: string; icon: string }[] = [
  { value: 'general', label: '一般タスク', description: '汎用的な作業タスク', icon: '📋' },
  { value: 'email', label: 'メール送信', description: 'メール送信タスク', icon: '📧' },
  { value: 'document', label: '書類確認', description: '書類の確認・処理', icon: '📄' },
  { value: 'interview', label: '面接関連', description: '面接の設定・実施', icon: '👥' },
  { value: 'evaluation', label: '評価入力', description: '評価・採点の入力', icon: '⭐' }
];