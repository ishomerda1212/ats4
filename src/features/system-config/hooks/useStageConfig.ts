// 選考段階設定管理フック

import { useState, useEffect, useCallback } from 'react';
import { SystemConfigDataAccess } from '@/lib/dataAccess/systemConfigDataAccess';
import { toast } from '@/hooks/use-toast';
import type {
  SelectionStageDefinition,
  CreateSelectionStageInput,
  UpdateSelectionStageInput
} from '@/features/system-config/types';

export const useStageConfig = () => {
  const [stages, setStages] = useState<SelectionStageDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 選考段階一覧を取得
  const fetchStages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SystemConfigDataAccess.getAllSelectionStages();
      setStages(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '選考段階の取得に失敗しました';
      setError(errorMessage);
      console.error('Failed to fetch stages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // アクティブな選考段階のみ取得
  const fetchActiveStages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SystemConfigDataAccess.getActiveSelectionStages();
      setStages(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'アクティブな選考段階の取得に失敗しました';
      setError(errorMessage);
      console.error('Failed to fetch active stages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 選考段階を作成
  const createStage = useCallback(async (input: CreateSelectionStageInput): Promise<SelectionStageDefinition> => {
    try {
      setLoading(true);
      const newStage = await SystemConfigDataAccess.createSelectionStage(input);
      
      // ローカル状態を更新
      setStages(prev => [...prev, newStage].sort((a, b) => a.sortOrder - b.sortOrder));
      
      toast({
        title: '選考段階を作成しました',
        description: `${newStage.displayName}が正常に作成されました。`,
      });

      return newStage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '選考段階の作成に失敗しました';
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

  // 選考段階を更新
  const updateStage = useCallback(async (id: string, input: UpdateSelectionStageInput): Promise<void> => {
    try {
      setLoading(true);
      await SystemConfigDataAccess.updateSelectionStage(id, input);
      
      // ローカル状態を更新
      setStages(prev => 
        prev.map(stage => 
          stage.id === id 
            ? { ...stage, ...input, updatedAt: new Date() }
            : stage
        ).sort((a, b) => a.sortOrder - b.sortOrder)
      );
      
      toast({
        title: '選考段階を更新しました',
        description: '選考段階が正常に更新されました。',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '選考段階の更新に失敗しました';
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

  // 選考段階を削除
  const deleteStage = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await SystemConfigDataAccess.deleteSelectionStage(id);
      
      // ローカル状態を更新
      const deletedStage = stages.find(s => s.id === id);
      setStages(prev => prev.filter(stage => stage.id !== id));
      
      toast({
        title: '選考段階を削除しました',
        description: deletedStage ? `${deletedStage.displayName}を削除しました。` : '選考段階を削除しました。',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '選考段階の削除に失敗しました';
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
  }, [stages]);

  // 順序を更新
  const updateStageOrder = useCallback(async (stageOrders: { id: string; sortOrder: number }[]): Promise<void> => {
    try {
      setLoading(true);
      await SystemConfigDataAccess.updateStageOrder(stageOrders);
      
      // ローカル状態を更新
      setStages(prev => {
        const updatedStages = [...prev];
        stageOrders.forEach(({ id, sortOrder }) => {
          const stageIndex = updatedStages.findIndex(s => s.id === id);
          if (stageIndex >= 0) {
            updatedStages[stageIndex] = { ...updatedStages[stageIndex], sortOrder };
          }
        });
        return updatedStages.sort((a, b) => a.sortOrder - b.sortOrder);
      });
      
      toast({
        title: '順序を更新しました',
        description: '選考段階の順序が正常に更新されました。',
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
  const toggleStageActive = useCallback(async (id: string, isActive: boolean): Promise<void> => {
    await updateStage(id, { isActive });
  }, [updateStage]);

  // 特定のIDで段階を取得
  const getStageById = useCallback((id: string): SelectionStageDefinition | undefined => {
    return stages.find(stage => stage.id === id);
  }, [stages]);

  // 段階グループでフィルタ
  const getStagesByGroup = useCallback((group: string): SelectionStageDefinition[] => {
    return stages.filter(stage => stage.stageGroup === group);
  }, [stages]);

  // バリデーション
  const validateStage = useCallback((input: CreateSelectionStageInput | UpdateSelectionStageInput): string[] => {
    const errors: string[] = [];

    if ('name' in input && input.name) {
      // 名前の重複チェック
      const duplicateStage = stages.find(s => s.name === input.name);
      if (duplicateStage) {
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

    if ('estimatedDurationMinutes' in input && input.estimatedDurationMinutes !== undefined) {
      if (input.estimatedDurationMinutes < 1 || input.estimatedDurationMinutes > 1440) {
        errors.push('推定所要時間は1分から1440分（24時間）の間で設定してください');
      }
    }

    return errors;
  }, [stages]);

  // 初回データ取得
  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  return {
    // データ
    stages,
    loading,
    error,

    // アクション
    fetchStages,
    fetchActiveStages,
    createStage,
    updateStage,
    deleteStage,
    updateStageOrder,
    toggleStageActive,

    // ユーティリティ
    getStageById,
    getStagesByGroup,
    validateStage,

    // 統計情報
    totalStages: stages.length,
    activeStages: stages.filter(s => s.isActive).length,
    stagesByGroup: stages.reduce((acc, stage) => {
      acc[stage.stageGroup] = (acc[stage.stageGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
};