// 統合ステータス設定フック
// 段階ごとのステータス定義を管理

import { useState, useEffect, useCallback } from 'react';
import { 
  IntegratedStatusDataAccess,
  type IntegratedStatusDefinition,
  type CreateStatusDefinitionInput,
  type UpdateStatusDefinitionInput,
  type StatusCategory,
  STATUS_TEMPLATES
} from '@/lib/dataAccess/integratedStatusDataAccess';

interface UseIntegratedStatusConfigReturn {
  // データ
  statuses: IntegratedStatusDefinition[];
  loading: boolean;
  error: string | null;

  // アクション
  saveStatuses: (statuses: CreateStatusDefinitionInput[]) => Promise<IntegratedStatusDefinition[]>;
  addStatus: (status: CreateStatusDefinitionInput) => void;
  updateStatus: (index: number, status: Partial<CreateStatusDefinitionInput>) => void;
  removeStatus: (index: number) => void;
  reorderStatuses: (fromIndex: number, toIndex: number) => void;
  resetStatuses: () => void;
  applyTemplate: (templateName: string) => void;

  // 作業用データ
  workingStatuses: CreateStatusDefinitionInput[];
  setWorkingStatuses: (statuses: CreateStatusDefinitionInput[]) => void;
  hasUnsavedChanges: boolean;

  // ユーティリティ
  refreshStatuses: () => Promise<void>;
  getStatusById: (id: string) => IntegratedStatusDefinition | undefined;
  getStatusesByCategory: (category: StatusCategory) => IntegratedStatusDefinition[];
  validateStatuses: (statuses: CreateStatusDefinitionInput[]) => string[];
}

export const useIntegratedStatusConfig = (stageId?: string): UseIntegratedStatusConfigReturn => {
  const [statuses, setStatuses] = useState<IntegratedStatusDefinition[]>([]);
  const [workingStatuses, setWorkingStatuses] = useState<CreateStatusDefinitionInput[]>([]);
  const [originalStatuses, setOriginalStatuses] = useState<CreateStatusDefinitionInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ステータスデータを読み込み
  const loadStatuses = useCallback(async () => {
    if (!stageId) {
      setStatuses([]);
      setWorkingStatuses([]);
      setOriginalStatuses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const statusesData = await IntegratedStatusDataAccess.getStatusesByStageId(stageId);
      setStatuses(statusesData);

      // 作業用データに変換
      const workingData: CreateStatusDefinitionInput[] = statusesData.map(status => ({
        stageId: status.stageId,
        statusValue: status.statusValue,
        displayName: status.displayName,
        statusCategory: status.statusCategory,
        colorScheme: status.colorScheme,
        sortOrder: status.sortOrder,
        isActive: status.isActive,
        isFinal: status.isFinal
      }));

      setWorkingStatuses(workingData);
      setOriginalStatuses(JSON.parse(JSON.stringify(workingData))); // Deep copy
    } catch (err) {
      console.error('Failed to load statuses:', err);
      setError(err instanceof Error ? err.message : 'ステータスの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [stageId]);

  // 初期読み込み
  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  // 未保存の変更があるかチェック
  const hasUnsavedChanges = JSON.stringify(workingStatuses) !== JSON.stringify(originalStatuses);

  // ステータス保存
  const saveStatuses = useCallback(async (statusesToSave: CreateStatusDefinitionInput[]): Promise<IntegratedStatusDefinition[]> => {
    if (!stageId) {
      throw new Error('Stage ID is required');
    }

    try {
      // バリデーション
      const validationErrors = validateStatuses(statusesToSave);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const savedStatuses = await IntegratedStatusDataAccess.saveStatusesToStage(stageId, statusesToSave);
      
      // ローカルステートを更新
      setStatuses(savedStatuses);
      
      // 作業用データも更新
      const newWorkingData = savedStatuses.map(status => ({
        stageId: status.stageId,
        statusValue: status.statusValue,
        displayName: status.displayName,
        statusCategory: status.statusCategory,
        colorScheme: status.colorScheme,
        sortOrder: status.sortOrder,
        isActive: status.isActive,
        isFinal: status.isFinal
      }));
      
      setWorkingStatuses(newWorkingData);
      setOriginalStatuses(JSON.parse(JSON.stringify(newWorkingData)));

      return savedStatuses;
    } catch (err) {
      console.error('Failed to save statuses:', err);
      throw err;
    }
  }, [stageId]);

  // ステータス追加
  const addStatus = useCallback((status: CreateStatusDefinitionInput) => {
    if (!stageId) return;

    const newStatus = {
      ...status,
      stageId,
      sortOrder: Math.max(...workingStatuses.map(s => s.sortOrder), 0) + 1
    };

    setWorkingStatuses(prev => [...prev, newStatus]);
  }, [stageId, workingStatuses]);

  // ステータス更新
  const updateStatus = useCallback((index: number, updates: Partial<CreateStatusDefinitionInput>) => {
    setWorkingStatuses(prev => 
      prev.map((status, i) => 
        i === index ? { ...status, ...updates } : status
      )
    );
  }, []);

  // ステータス削除
  const removeStatus = useCallback((index: number) => {
    setWorkingStatuses(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ステータス並び替え
  const reorderStatuses = useCallback((fromIndex: number, toIndex: number) => {
    setWorkingStatuses(prev => {
      const newStatuses = [...prev];
      const [movedStatus] = newStatuses.splice(fromIndex, 1);
      newStatuses.splice(toIndex, 0, movedStatus);
      
      // 順序番号を更新
      return newStatuses.map((status, index) => ({
        ...status,
        sortOrder: index + 1
      }));
    });
  }, []);

  // ステータスリセット
  const resetStatuses = useCallback(() => {
    setWorkingStatuses(JSON.parse(JSON.stringify(originalStatuses)));
  }, [originalStatuses]);

  // テンプレート適用
  const applyTemplate = useCallback((templateName: string) => {
    if (!stageId) return;

    const template = STATUS_TEMPLATES[templateName];
    if (!template) return;

    const templatedStatuses: CreateStatusDefinitionInput[] = template.map((status, index) => ({
      ...status,
      stageId,
      sortOrder: index + 1
    }));

    setWorkingStatuses(templatedStatuses);
  }, [stageId]);

  // データ再読み込み
  const refreshStatuses = useCallback(async (): Promise<void> => {
    await loadStatuses();
  }, [loadStatuses]);

  // ID によるステータス取得
  const getStatusById = useCallback((id: string): IntegratedStatusDefinition | undefined => {
    return statuses.find(status => status.id === id);
  }, [statuses]);

  // カテゴリ別ステータス取得
  const getStatusesByCategory = useCallback((category: StatusCategory): IntegratedStatusDefinition[] => {
    return statuses.filter(status => status.statusCategory === category);
  }, [statuses]);

  // バリデーション
  const validateStatuses = useCallback((statusesToValidate: CreateStatusDefinitionInput[]): string[] => {
    const errors: string[] = [];

    if (statusesToValidate.length === 0) {
      errors.push('最低1つのステータスを設定してください');
      return errors;
    }

    // 必須フィールドのチェック
    statusesToValidate.forEach((status, index) => {
      if (!status.statusValue?.trim()) {
        errors.push(`${index + 1}番目のステータス値は必須です`);
      }
      if (!status.displayName?.trim()) {
        errors.push(`${index + 1}番目の表示名は必須です`);
      }
    });

    // 重複チェック
    const statusValues = statusesToValidate.map(s => s.statusValue.trim().toLowerCase());
    const duplicates = statusValues.filter((value, index) => statusValues.indexOf(value) !== index);
    if (duplicates.length > 0) {
      errors.push('重複するステータス値があります');
    }

    // 最低限必要なカテゴリの存在チェック
    const categories = statusesToValidate.map(s => s.statusCategory);
    const hasPassedStatus = categories.includes('passed');
    const hasFailedOrDeclined = categories.includes('failed') || categories.includes('declined');

    if (!hasPassedStatus) {
      errors.push('「通過」カテゴリのステータスを最低1つ設定してください');
    }
    if (!hasFailedOrDeclined) {
      errors.push('「不通過」または「辞退」カテゴリのステータスを最低1つ設定してください');
    }

    return errors;
  }, []);

  return {
    // データ
    statuses,
    loading,
    error,

    // アクション
    saveStatuses,
    addStatus,
    updateStatus,
    removeStatus,
    reorderStatuses,
    resetStatuses,
    applyTemplate,

    // 作業用データ
    workingStatuses,
    setWorkingStatuses,
    hasUnsavedChanges,

    // ユーティリティ
    refreshStatuses,
    getStatusById,
    getStatusesByCategory,
    validateStatuses
  };
};