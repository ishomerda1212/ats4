// 統合タスク設定フック
// 既存の fixed_tasks テーブルを活用したタスク管理

import { useState, useEffect, useCallback } from 'react';
import { 
  IntegratedTaskDataAccess,
  type IntegratedTaskDefinition,
  type CreateTaskDefinitionInput,
  type UpdateTaskDefinitionInput,
  type TaskType
} from '@/lib/dataAccess/integratedTaskDataAccess';

interface UseIntegratedTaskConfigReturn {
  // データ
  tasks: IntegratedTaskDefinition[];
  loading: boolean;
  error: string | null;

  // アクション
  createTask: (taskData: CreateTaskDefinitionInput) => Promise<IntegratedTaskDefinition>;
  updateTask: (id: string, taskData: UpdateTaskDefinitionInput) => Promise<IntegratedTaskDefinition>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (taskOrders: { id: string; sortOrder: number }[]) => Promise<void>;

  // ユーティリティ
  refreshTasks: () => Promise<void>;
  getTaskById: (id: string) => IntegratedTaskDefinition | undefined;
  getTasksByType: (taskType: TaskType) => IntegratedTaskDefinition[];
  validateTask: (taskData: CreateTaskDefinitionInput | UpdateTaskDefinitionInput) => string[];
}

export const useIntegratedTaskConfig = (stageId?: string): UseIntegratedTaskConfigReturn => {
  const [tasks, setTasks] = useState<IntegratedTaskDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // タスクデータを読み込み
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let tasksData: IntegratedTaskDefinition[];
      
      if (stageId) {
        tasksData = await IntegratedTaskDataAccess.getTasksByStageId(stageId);
      } else {
        tasksData = await IntegratedTaskDataAccess.getAllTasks();
      }

      setTasks(tasksData);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(err instanceof Error ? err.message : 'タスクの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [stageId]);

  // 初期読み込み
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // タスク作成
  const createTask = useCallback(async (taskData: CreateTaskDefinitionInput): Promise<IntegratedTaskDefinition> => {
    try {
      // バリデーション
      const validationErrors = validateTask(taskData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const newTask = await IntegratedTaskDataAccess.createTask(taskData);
      
      // ローカルステートを更新
      setTasks(prev => [...prev, newTask].sort((a, b) => a.sortOrder - b.sortOrder));

      return newTask;
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  }, []);

  // タスク更新
  const updateTask = useCallback(async (id: string, taskData: UpdateTaskDefinitionInput): Promise<IntegratedTaskDefinition> => {
    try {
      // バリデーション
      const validationErrors = validateTask(taskData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const updatedTask = await IntegratedTaskDataAccess.updateTask(id, taskData);
      
      // ローカルステートを更新
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ).sort((a, b) => a.sortOrder - b.sortOrder));

      return updatedTask;
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  }, []);

  // タスク削除
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      await IntegratedTaskDataAccess.deleteTask(id);
      
      // ローカルステートを更新
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  }, []);

  // タスク並び替え
  const reorderTasks = useCallback(async (taskOrders: { id: string; sortOrder: number }[]): Promise<void> => {
    try {
      await IntegratedTaskDataAccess.updateTaskOrder(taskOrders);
      
      // ローカルステートを更新
      setTasks(prev => {
        const updatedTasks = prev.map(task => {
          const orderUpdate = taskOrders.find(order => order.id === task.id);
          return orderUpdate ? { ...task, sortOrder: orderUpdate.sortOrder } : task;
        });
        return updatedTasks.sort((a, b) => a.sortOrder - b.sortOrder);
      });
    } catch (err) {
      console.error('Failed to reorder tasks:', err);
      throw err;
    }
  }, []);

  // データ再読み込み
  const refreshTasks = useCallback(async (): Promise<void> => {
    await loadTasks();
  }, [loadTasks]);

  // ID によるタスク取得
  const getTaskById = useCallback((id: string): IntegratedTaskDefinition | undefined => {
    return tasks.find(task => task.id === id);
  }, [tasks]);

  // タイプ別タスク取得
  const getTasksByType = useCallback((taskType: TaskType): IntegratedTaskDefinition[] => {
    return tasks.filter(task => task.taskType === taskType);
  }, [tasks]);

  // バリデーション
  const validateTask = useCallback((taskData: CreateTaskDefinitionInput | UpdateTaskDefinitionInput): string[] => {
    const errors: string[] = [];

    // 必須フィールドのチェック
    if ('name' in taskData && !taskData.name?.trim()) {
      errors.push('タスク名は必須です');
    }

    if ('displayName' in taskData && !taskData.displayName?.trim()) {
      errors.push('表示名は必須です');
    }

    // タスク名の重複チェック（同一段階内）
    if ('name' in taskData && taskData.name && stageId) {
      const existingTask = tasks.find(task => 
        task.name === taskData.name && 
        task.stageId === stageId &&
        (!('id' in taskData) || task.id !== taskData.id)
      );
      if (existingTask) {
        errors.push('このタスク名は既に使用されています');
      }
    }

    // 順序番号のチェック
    if ('sortOrder' in taskData && typeof taskData.sortOrder === 'number') {
      if (taskData.sortOrder < 0) {
        errors.push('順序番号は0以上である必要があります');
      }
    }

    // 相対期限のチェック
    if ('dueOffsetDays' in taskData && typeof taskData.dueOffsetDays === 'number') {
      if (taskData.dueOffsetDays < 0) {
        errors.push('相対期限は0以上である必要があります');
      }
    }

    return errors;
  }, [tasks, stageId]);

  return {
    // データ
    tasks,
    loading,
    error,

    // アクション
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,

    // ユーティリティ
    refreshTasks,
    getTaskById,
    getTasksByType,
    validateTask
  };
};