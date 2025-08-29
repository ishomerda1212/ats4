// システム設定統合管理フック

import { useState, useEffect, useCallback } from 'react';
import { SystemConfigDataAccess } from '@/lib/dataAccess/systemConfigDataAccess';
import type { SystemConfigSummary } from '@/features/system-config/types';

export const useSystemConfig = () => {
  const [summary, setSummary] = useState<SystemConfigSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // システム設定サマリーを取得
  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SystemConfigDataAccess.getSystemConfigSummary();
      setSummary(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'システム設定サマリーの取得に失敗しました';
      setError(errorMessage);
      console.error('Failed to fetch system config summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 整合性チェック
  const performIntegrityCheck = useCallback(async () => {
    // TODO: 実装する場合は以下のようなチェックを行う
    // - 孤立したタスクやステータスの検出
    // - 重複データの検出
    // - 必須項目の不備チェック
    // - 循環参照の検出
    console.log('Integrity check would be performed here');
    return {
      isValid: true,
      errors: [],
      warnings: []
    };
  }, []);

  // 設定データのエクスポート
  const exportConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      const [stages, tasks, statuses] = await Promise.all([
        SystemConfigDataAccess.getAllSelectionStages(),
        // 全段階のタスクを取得するには、まず段階一覧を取得してからタスクを取得する必要がある
        SystemConfigDataAccess.getAllSelectionStages().then(stages => 
          Promise.all(stages.map(stage => SystemConfigDataAccess.getFixedTasksForStage(stage.id)))
        ),
        // 全段階のステータスを取得するには、まず段階一覧を取得してからステータスを取得する必要がある
        SystemConfigDataAccess.getAllSelectionStages().then(stages => 
          Promise.all(stages.map(stage => SystemConfigDataAccess.getStatusesForStage(stage.id)))
        )
      ]);

      const exportData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        data: {
          stages,
          tasks: tasks.flat(),
          statuses: statuses.flat()
        }
      };

      // JSONファイルとしてダウンロード
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return exportData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'エクスポートに失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // システム状態の概要取得
  const getSystemStatus = useCallback(() => {
    if (!summary) return null;

    const status = {
      overall: 'healthy' as 'healthy' | 'warning' | 'error',
      messages: [] as string[]
    };

    // 基本的なチェック
    if (summary.activeStages === 0) {
      status.overall = 'error';
      status.messages.push('アクティブな選考段階がありません');
    } else if (summary.activeStages < 3) {
      status.overall = 'warning';
      status.messages.push('選考段階が少なすぎる可能性があります');
    }

    if (summary.totalTasks === 0) {
      status.overall = 'error';
      status.messages.push('固定タスクが設定されていません');
    }

    if (summary.totalStatuses === 0) {
      status.overall = 'error';
      status.messages.push('ステータス定義が設定されていません');
    }

    if (status.messages.length === 0) {
      status.messages.push('システム設定は正常です');
    }

    return status;
  }, [summary]);

  // クイック設定テンプレートの適用
  const applyQuickTemplate = useCallback(async (templateType: 'basic' | 'full' | 'minimal') => {
    // TODO: 実装する場合は、テンプレートに応じて段階・タスク・ステータスを一括作成
    console.log(`Would apply ${templateType} template`);
  }, []);

  // 初回データ取得
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    // データ
    summary,
    loading,
    error,
    systemStatus: getSystemStatus(),

    // アクション
    fetchSummary,
    performIntegrityCheck,
    exportConfiguration,
    applyQuickTemplate,

    // ユーティリティ
    isConfigured: summary ? (summary.totalStages > 0 && summary.totalTasks > 0 && summary.totalStatuses > 0) : false,
    configurationScore: summary ? Math.min(100, (
      (summary.activeStages > 0 ? 25 : 0) +
      (summary.totalTasks > 0 ? 25 : 0) +
      (summary.totalStatuses > 0 ? 25 : 0) +
      (summary.totalStages >= 5 ? 25 : summary.totalStages * 5)
    )) : 0
  };
};