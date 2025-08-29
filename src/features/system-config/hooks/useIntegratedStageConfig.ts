// 統合選考段階設定フック
// 既存の events テーブルを活用した新設定システム

import { useState, useEffect, useCallback } from 'react';
import { IntegratedSystemConfigDataAccess } from '@/lib/dataAccess/integratedSystemConfigDataAccess';
import type {
  SelectionStageDefinition,
  CreateSelectionStageInput,
  UpdateSelectionStageInput
} from '@/features/system-config/types';

interface UseIntegratedStageConfigReturn {
  // データ
  stages: SelectionStageDefinition[];
  activeStages: SelectionStageDefinition[];
  loading: boolean;
  error: string | null;

  // アクション
  createStage: (stageData: CreateSelectionStageInput) => Promise<SelectionStageDefinition>;
  updateStage: (id: string, stageData: UpdateSelectionStageInput) => Promise<SelectionStageDefinition>;
  deleteStage: (id: string) => Promise<void>;
  reorderStages: (stageOrders: { id: string; sortOrder: number }[]) => Promise<void>;
  
  // ユーティリティ
  refreshStages: () => Promise<void>;
  getStageById: (id: string) => SelectionStageDefinition | undefined;
  validateStage: (stageData: CreateSelectionStageInput | UpdateSelectionStageInput) => string[];
}

export const useIntegratedStageConfig = (): UseIntegratedStageConfigReturn => {
  const [stages, setStages] = useState<SelectionStageDefinition[]>([]);
  const [activeStages, setActiveStages] = useState<SelectionStageDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 段階データを読み込み
  const loadStages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [allStages, activeStagesData] = await Promise.all([
        IntegratedSystemConfigDataAccess.getAllSelectionStages(),
        IntegratedSystemConfigDataAccess.getActiveSelectionStages()
      ]);

      setStages(allStages);
      setActiveStages(activeStagesData);
    } catch (err) {
      console.error('Failed to load stages:', err);
      setError(err instanceof Error ? err.message : '段階の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初期読み込み
  useEffect(() => {
    loadStages();
  }, [loadStages]);

  // 段階作成
  const createStage = useCallback(async (stageData: CreateSelectionStageInput): Promise<SelectionStageDefinition> => {
    try {
      // バリデーション
      const validationErrors = validateStage(stageData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const newStage = await IntegratedSystemConfigDataAccess.createSelectionStage(stageData);
      
      // ローカルステートを更新
      setStages(prev => [...prev, newStage].sort((a, b) => a.sortOrder - b.sortOrder));
      if (newStage.isActive) {
        setActiveStages(prev => [...prev, newStage].sort((a, b) => a.sortOrder - b.sortOrder));
      }

      return newStage;
    } catch (err) {
      console.error('Failed to create stage:', err);
      throw err;
    }
  }, []);

  // 段階更新
  const updateStage = useCallback(async (id: string, stageData: UpdateSelectionStageInput): Promise<SelectionStageDefinition> => {
    try {
      // バリデーション
      const validationErrors = validateStage(stageData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const updatedStage = await IntegratedSystemConfigDataAccess.updateSelectionStage(id, stageData);
      
      // ローカルステートを更新
      setStages(prev => prev.map(stage => 
        stage.id === id ? updatedStage : stage
      ).sort((a, b) => a.sortOrder - b.sortOrder));

      setActiveStages(prev => {
        const filtered = prev.filter(stage => stage.id !== id);
        return updatedStage.isActive 
          ? [...filtered, updatedStage].sort((a, b) => a.sortOrder - b.sortOrder)
          : filtered;
      });

      return updatedStage;
    } catch (err) {
      console.error('Failed to update stage:', err);
      throw err;
    }
  }, []);

  // 段階削除（論理削除）
  const deleteStage = useCallback(async (id: string): Promise<void> => {
    try {
      await IntegratedSystemConfigDataAccess.deleteSelectionStage(id);
      
      // ローカルステートを更新
      setStages(prev => prev.map(stage => 
        stage.id === id ? { ...stage, isActive: false } : stage
      ));
      setActiveStages(prev => prev.filter(stage => stage.id !== id));
    } catch (err) {
      console.error('Failed to delete stage:', err);
      throw err;
    }
  }, []);

  // 段階並び替え
  const reorderStages = useCallback(async (stageOrders: { id: string; sortOrder: number }[]): Promise<void> => {
    try {
      await IntegratedSystemConfigDataAccess.updateStageOrder(stageOrders);
      
      // ローカルステートを更新
      setStages(prev => {
        const updatedStages = prev.map(stage => {
          const orderUpdate = stageOrders.find(order => order.id === stage.id);
          return orderUpdate ? { ...stage, sortOrder: orderUpdate.sortOrder } : stage;
        });
        return updatedStages.sort((a, b) => a.sortOrder - b.sortOrder);
      });

      setActiveStages(prev => {
        const updatedStages = prev.map(stage => {
          const orderUpdate = stageOrders.find(order => order.id === stage.id);
          return orderUpdate ? { ...stage, sortOrder: orderUpdate.sortOrder } : stage;
        });
        return updatedStages.sort((a, b) => a.sortOrder - b.sortOrder);
      });
    } catch (err) {
      console.error('Failed to reorder stages:', err);
      throw err;
    }
  }, []);

  // データ再読み込み
  const refreshStages = useCallback(async (): Promise<void> => {
    await loadStages();
  }, [loadStages]);

  // ID による段階取得
  const getStageById = useCallback((id: string): SelectionStageDefinition | undefined => {
    return stages.find(stage => stage.id === id);
  }, [stages]);

  // バリデーション
  const validateStage = useCallback((stageData: CreateSelectionStageInput | UpdateSelectionStageInput): string[] => {
    const errors: string[] = [];

    // 必須フィールドのチェック
    if (!stageData.name?.trim()) {
      errors.push('段階名は必須です');
    }

    if (!stageData.displayName?.trim()) {
      errors.push('表示名は必須です');
    }

    // 段階名の重複チェック
    if (stageData.name) {
      const existingStage = stages.find(stage => 
        stage.name === stageData.name && 
        (!('id' in stageData) || stage.id !== stageData.id)
      );
      if (existingStage) {
        errors.push('この段階名は既に使用されています');
      }
    }

    // 順序番号のチェック
    if (typeof stageData.sortOrder === 'number') {
      if (stageData.sortOrder < 0) {
        errors.push('順序番号は0以上である必要があります');
      }
    }

    // 推定所要時間のチェック
    if (typeof stageData.estimatedDurationMinutes === 'number') {
      if (stageData.estimatedDurationMinutes < 1) {
        errors.push('推定所要時間は1分以上である必要があります');
      }
    }

    return errors;
  }, [stages]);

  return {
    // データ
    stages,
    activeStages,
    loading,
    error,

    // アクション
    createStage,
    updateStage,
    deleteStage,
    reorderStages,

    // ユーティリティ
    refreshStages,
    getStageById,
    validateStage
  };
};