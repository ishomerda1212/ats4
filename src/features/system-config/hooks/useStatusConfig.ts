// ステータス設定管理フック

import { useState, useCallback } from 'react';
import { SystemConfigDataAccess } from '@/lib/dataAccess/systemConfigDataAccess';
import { toast } from '@/hooks/use-toast';
import type {
  StageStatusDefinition,
  CreateStageStatusInput,
  UpdateStageStatusInput,
  STATUS_TEMPLATES
} from '@/features/system-config/types';

export const useStatusConfig = (stageId?: string) => {
  const [statuses, setStatuses] = useState<StageStatusDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 特定段階のステータス一覧を取得
  const fetchStatuses = useCallback(async (targetStageId?: string) => {
    const id = targetStageId || stageId;
    if (!id) {
      setError('段階IDが指定されていません');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await SystemConfigDataAccess.getStatusesForStage(id);
      setStatuses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ステータスの取得に失敗しました';
      setError(errorMessage);
      console.error('Failed to fetch statuses:', err);
    } finally {
      setLoading(false);
    }
  }, [stageId]);

  // ステータスを作成
  const createStatus = useCallback(async (input: CreateStageStatusInput): Promise<StageStatusDefinition> => {
    try {
      setLoading(true);
      const newStatus = await SystemConfigDataAccess.createStageStatus(input);
      
      // ローカル状態を更新
      setStatuses(prev => [...prev, newStatus].sort((a, b) => a.sortOrder - b.sortOrder));
      
      toast({
        title: 'ステータスを作成しました',
        description: `${newStatus.displayName}が正常に作成されました。`,
      });

      return newStatus;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ステータスの作成に失敗しました';
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

  // ステータスを更新
  const updateStatus = useCallback(async (id: string, input: UpdateStageStatusInput): Promise<void> => {
    try {
      setLoading(true);
      await SystemConfigDataAccess.updateStageStatus(id, input);
      
      // ローカル状態を更新
      setStatuses(prev => 
        prev.map(status => 
          status.id === id 
            ? { ...status, ...input, updatedAt: new Date() }
            : status
        ).sort((a, b) => a.sortOrder - b.sortOrder)
      );
      
      toast({
        title: 'ステータスを更新しました',
        description: 'ステータスが正常に更新されました。',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ステータスの更新に失敗しました';
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

  // ステータスを削除
  const deleteStatus = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await SystemConfigDataAccess.deleteStageStatus(id);
      
      // ローカル状態を更新
      const deletedStatus = statuses.find(s => s.id === id);
      setStatuses(prev => prev.filter(status => status.id !== id));
      
      toast({
        title: 'ステータスを削除しました',
        description: deletedStatus ? `${deletedStatus.displayName}を削除しました。` : 'ステータスを削除しました。',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ステータスの削除に失敗しました';
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
  }, [statuses]);

  // 順序を更新
  const updateStatusOrder = useCallback(async (statusOrders: { id: string; sortOrder: number }[]): Promise<void> => {
    try {
      setLoading(true);
      await SystemConfigDataAccess.updateStatusOrder(statusOrders);
      
      // ローカル状態を更新
      setStatuses(prev => {
        const updatedStatuses = [...prev];
        statusOrders.forEach(({ id, sortOrder }) => {
          const statusIndex = updatedStatuses.findIndex(s => s.id === id);
          if (statusIndex >= 0) {
            updatedStatuses[statusIndex] = { ...updatedStatuses[statusIndex], sortOrder };
          }
        });
        return updatedStatuses.sort((a, b) => a.sortOrder - b.sortOrder);
      });
      
      toast({
        title: '順序を更新しました',
        description: 'ステータスの順序が正常に更新されました。',
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

  // 有効/無効の切り替え
  const toggleStatusActive = useCallback(async (id: string, isActive: boolean): Promise<void> => {
    await updateStatus(id, { isActive });
  }, [updateStatus]);

  // 最終ステータスの切り替え
  const toggleStatusFinal = useCallback(async (id: string, isFinal: boolean): Promise<void> => {
    await updateStatus(id, { isFinal });
  }, [updateStatus]);

  // 特定のIDでステータスを取得
  const getStatusById = useCallback((id: string): StageStatusDefinition | undefined => {
    return statuses.find(status => status.id === id);
  }, [statuses]);

  // カテゴリでフィルタ
  const getStatusesByCategory = useCallback((category: string): StageStatusDefinition[] => {
    return statuses.filter(status => status.statusCategory === category);
  }, [statuses]);

  // テンプレートからステータスを一括作成
  const createStatusesFromTemplate = useCallback(async (templateKey: keyof typeof STATUS_TEMPLATES, targetStageId?: string): Promise<void> => {
    const id = targetStageId || stageId;
    if (!id) {
      throw new Error('段階IDが指定されていません');
    }

    try {
      setLoading(true);
      const template = STATUS_TEMPLATES[templateKey];
      if (!template) {
        throw new Error('指定されたテンプレートが見つかりません');
      }

      // テンプレートのデータを現在の段階IDで更新
      const statusesToCreate = template.map(status => ({
        ...status,
        stageId: id
      }));

      // 既存のステータスの最大ソート番号を取得
      const maxSortOrder = Math.max(...statuses.map(s => s.sortOrder), 0);

      // 順番にステータスを作成
      const createdStatuses: StageStatusDefinition[] = [];
      for (let i = 0; i < statusesToCreate.length; i++) {
        const statusInput = {
          ...statusesToCreate[i],
          sortOrder: maxSortOrder + i + 1
        };
        const createdStatus = await SystemConfigDataAccess.createStageStatus(statusInput);
        createdStatuses.push(createdStatus);
      }

      // ローカル状態を更新
      setStatuses(prev => [...prev, ...createdStatuses].sort((a, b) => a.sortOrder - b.sortOrder));

      toast({
        title: 'テンプレートからステータスを作成しました',
        description: `${createdStatuses.length}個のステータスが作成されました。`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'テンプレートからの作成に失敗しました';
      setError(errorMessage);
      toast({
        title: 'テンプレート作成に失敗しました',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [stageId, statuses]);

  // バリデーション
  const validateStatus = useCallback((input: CreateStageStatusInput | UpdateStageStatusInput, excludeId?: string): string[] => {
    const errors: string[] = [];

    if ('statusValue' in input && input.statusValue) {
      // 値の重複チェック（同一段階内）
      const duplicateStatus = statuses.find(s => s.statusValue === input.statusValue && s.id !== excludeId);
      if (duplicateStatus) {
        errors.push('このステータス値は既に使用されています');
      }

      // 値の形式チェック
      if (input.statusValue.trim().length === 0) {
        errors.push('ステータス値は必須です');
      }
      if (input.statusValue.length > 50) {
        errors.push('ステータス値は50文字以内で入力してください');
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

    return errors;
  }, [statuses]);

  return {
    // データ
    statuses,
    loading,
    error,

    // アクション
    fetchStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    updateStatusOrder,
    toggleStatusActive,
    toggleStatusFinal,
    createStatusesFromTemplate,

    // ユーティリティ
    getStatusById,
    getStatusesByCategory,
    validateStatus,

    // 統計情報
    totalStatuses: statuses.length,
    activeStatuses: statuses.filter(s => s.isActive).length,
    finalStatuses: statuses.filter(s => s.isFinal).length,
    statusesByCategory: statuses.reduce((acc, status) => {
      acc[status.statusCategory] = (acc[status.statusCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
};