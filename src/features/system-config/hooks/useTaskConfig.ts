// 固定タスク設定管理フック

import { useState, useCallback } from 'react';
import { SystemConfigDataAccess } from '@/lib/dataAccess/systemConfigDataAccess';
import { toast } from '@/hooks/use-toast';
import type {
  FixedTaskDefinition,
  CreateFixedTaskInput,
  UpdateFixedTaskInput
} from '@/features/system-config/types';

export const useTaskConfig = (stageId?: string) => {
  const [tasks, setTasks] = useState<FixedTaskDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 特定段階のタスク一覧を取得
  const fetchTasks = useCallback(async (targetStageId?: string) => {
    const id = targetStageId || stageId;
    if (!id) {
      setError('段階IDが指定されていません');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await SystemConfigDataAccess.getFixedTasksForStage(id);
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの取得に失敗しました';
      setError(errorMessage);
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [stageId]);

  // タスクを作成
  const createTask = useCallback(async (input: CreateFixedTaskInput): Promise<FixedTaskDefinition> => {
    try {
      setLoading(true);
      const newTask = await SystemConfigDataAccess.createFixedTask(input);
      
      // ローカル状態を更新
      setTasks(prev => [...prev, newTask].sort((a, b) => a.sortOrder - b.sortOrder));
      
      toast({
        title: 'タスクを作成しました',
        description: `${newTask.displayName}が正常に作成されました。`,
      });

      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの作成に失敗しました';
      setError(errorMessage);
      toast({
        title: '作成に失敗しました',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // タスクを更新
  const updateTask = useCallback(async (id: string, input: UpdateFixedTaskInput): Promise<void> => {
    try {
      setLoading(true);
      await SystemConfigDataAccess.updateFixedTask(id, input);
      
      // ローカル状態を更新
      setTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? { ...task, ...input, updatedAt: new Date() }
            : task
        ).sort((a, b) => a.sortOrder - b.sortOrder)
      );
      
      toast({
        title: 'タスクを更新しました',
        description: 'タスクが正常に更新されました。',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの更新に失敗しました';
      setError(errorMessage);
      toast({
        title: '更新に失敗しました',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // タスクを削除
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await SystemConfigDataAccess.deleteFixedTask(id);
      
      // ローカル状態を更新
      const deletedTask = tasks.find(t => t.id === id);
      setTasks(prev => prev.filter(task => task.id !== id));
      
      toast({
        title: 'タスクを削除しました',
        description: deletedTask ? `${deletedTask.displayName}を削除しました。` : 'タスクを削除しました。',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'タスクの削除に失敗しました';
      setError(errorMessage);
      toast({
        title: '削除に失敗しました',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  // 順序を更新
  const updateTaskOrder = useCallback(async (taskOrders: { id: string; sortOrder: number }[]): Promise<void> => {
    try {
      setLoading(true);
      await SystemConfigDataAccess.updateTaskOrder(taskOrders);
      
      // ローカル状態を更新
      setTasks(prev => {
        const updatedTasks = [...prev];
        taskOrders.forEach(({ id, sortOrder }) => {
          const taskIndex = updatedTasks.findIndex(t => t.id === id);
          if (taskIndex >= 0) {
            updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], sortOrder };
          }
        });
        return updatedTasks.sort((a, b) => a.sortOrder - b.sortOrder);
      });
      
      toast({
        title: '順序を更新しました',
        description: 'タスクの順序が正常に更新されました。',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '順序の更新に失敗しました';
      setError(errorMessage);
      toast({
        title: '順序更新に失敗しました',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 必須/任意の切り替え
  const toggleTaskRequired = useCallback(async (id: string, isRequired: boolean): Promise<void> => {
    await updateTask(id, { isRequired });
  }, [updateTask]);

  // 有効/無効の切り替え
  const toggleTaskActive = useCallback(async (id: string, isActive: boolean): Promise<void> => {
    await updateTask(id, { isActive });
  }, [updateTask]);

  // 特定のIDでタスクを取得
  const getTaskById = useCallback((id: string): FixedTaskDefinition | undefined => {
    return tasks.find(task => task.id === id);
  }, [tasks]);

  // タスクタイプでフィルタ
  const getTasksByType = useCallback((type: string): FixedTaskDefinition[] => {
    return tasks.filter(task => task.taskType === type);
  }, [tasks]);

  // バリデーション
  const validateTask = useCallback((input: CreateFixedTaskInput | UpdateFixedTaskInput, excludeId?: string): string[] => {
    const errors: string[] = [];

    if ('name' in input && input.name) {
      // 名前の重複チェック（同一段階内）
      const duplicateTask = tasks.find(t => t.name === input.name && t.id !== excludeId);
      if (duplicateTask) {
        errors.push('この名前は既に使用されています');
      }

      // 名前の形式チェック
      if (input.name.trim().length === 0) {
        errors.push('名前は必須です');
      }
      if (input.name.length > 100) {
        errors.push('名前は100文字以内で入力してください');
      }
    }

    if ('displayName' in input && input.displayName) {
      if (input.displayName.trim().length === 0) {
        errors.push('表示名は必須です');
      }
      if (input.displayName.length > 100) {
        errors.push('表示名は100文字以内で入力してください');
      }
    }

    if ('description' in input && input.description && input.description.length > 500) {
      errors.push('説明は500文字以内で入力してください');
    }

    if ('dueOffsetDays' in input && input.dueOffsetDays !== undefined) {
      if (input.dueOffsetDays < 0 || input.dueOffsetDays > 365) {
        errors.push('期限は0日から365日の間で設定してください');
      }
    }

    return errors;
  }, [tasks]);

  // タスクの複製
  const duplicateTask = useCallback(async (sourceId: string, newName?: string): Promise<FixedTaskDefinition> => {
    const sourceTask = getTaskById(sourceId);
    if (!sourceTask) {
      throw new Error('複製元のタスクが見つかりません');
    }

    const duplicateInput: CreateFixedTaskInput = {
      stageId: sourceTask.stageId,
      name: newName || `${sourceTask.name}_コピー`,
      displayName: `${sourceTask.displayName} (コピー)`,
      description: sourceTask.description,
      taskType: sourceTask.taskType,
      sortOrder: Math.max(...tasks.map(t => t.sortOrder)) + 1,
      isRequired: sourceTask.isRequired,
      isActive: sourceTask.isActive,
      dueOffsetDays: sourceTask.dueOffsetDays,
      emailTemplateId: sourceTask.emailTemplateId
    };

    return await createTask(duplicateInput);
  }, [tasks, getTaskById, createTask]);

  return {
    // データ
    tasks,
    loading,
    error,

    // アクション
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskOrder,
    toggleTaskRequired,
    toggleTaskActive,
    duplicateTask,

    // ユーティリティ
    getTaskById,
    getTasksByType,
    validateTask,

    // 統計情報
    totalTasks: tasks.length,
    requiredTasks: tasks.filter(t => t.isRequired).length,
    activeTasks: tasks.filter(t => t.isActive).length,
    tasksByType: tasks.reduce((acc, task) => {
      acc[task.taskType] = (acc[task.taskType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
};