// 統合システム設定フック
// 既存データを活用したシステム設定管理

import { useState, useEffect, useCallback } from 'react';
import { IntegratedSystemConfigDataAccess } from '@/lib/dataAccess/integratedSystemConfigDataAccess';
import type { SystemConfigSummary } from '@/features/system-config/types';

interface SystemStatus {
  isConfigured: boolean;
  configurationScore: number;
  issues: string[];
  recommendations: string[];
  messages: string[];
}

interface UseIntegratedSystemConfigReturn {
  // データ
  summary: SystemConfigSummary | null;
  systemStatus: SystemStatus | null;
  loading: boolean;
  error: string | null;

  // アクション
  exportConfiguration: () => Promise<void>;
  performIntegrityCheck: () => Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>;
  refreshSummary: () => Promise<void>;

  // 計算値
  isConfigured: boolean;
  configurationScore: number;
}

export const useIntegratedSystemConfig = (): UseIntegratedSystemConfigReturn => {
  const [summary, setSummary] = useState<SystemConfigSummary | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // サマリーデータを読み込み
  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const summaryData = await IntegratedSystemConfigDataAccess.getSystemConfigSummary();
      setSummary(summaryData);

      // システムステータスを計算
      const status = calculateSystemStatus(summaryData);
      setSystemStatus(status);
    } catch (err) {
      console.error('Failed to load system config summary:', err);
      setError(err instanceof Error ? err.message : 'サマリーの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初期読み込み
  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // システムステータス計算
  const calculateSystemStatus = useCallback((summaryData: SystemConfigSummary): SystemStatus => {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // 選考段階の評価（40%）
    if (summaryData.activeStages > 0) {
      score += 40;
    } else {
      issues.push('アクティブな選考段階が設定されていません');
      recommendations.push('選考段階を設定してください');
    }

    // タスクの評価（30%）
    if (summaryData.totalTasks > 0) {
      score += 30;
    } else {
      issues.push('固定タスクが設定されていません');
      recommendations.push('各段階にタスクを設定してください');
    }

    // ステータスの評価（30%）
    if (summaryData.totalStatuses > 0) {
      score += 30;
    } else {
      issues.push('ステータス定義が設定されていません');
      recommendations.push('各段階のステータスを定義してください');
    }

    // 設定完成度の評価
    if (summaryData.activeStages >= 5) {
      score += 10; // ボーナス
    }

    const isConfigured = score >= 70;

    return {
      isConfigured,
      configurationScore: Math.min(score, 100),
      issues,
      recommendations,
      messages: [...issues, ...recommendations]
    };
  }, []);

  // 設定のエクスポート
  const exportConfiguration = useCallback(async (): Promise<void> => {
    try {
      const stages = await IntegratedSystemConfigDataAccess.getAllSelectionStages();
      
      const configData = {
        export_date: new Date().toISOString(),
        system_version: '1.0.0',
        data: {
          selection_stages: stages,
          summary: summary
        }
      };

      // JSONファイルとしてダウンロード
      const blob = new Blob([JSON.stringify(configData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `system_config_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export configuration:', err);
      throw err;
    }
  }, [summary]);

  // 整合性チェック
  const performIntegrityCheck = useCallback(async () => {
    try {
      const result = await IntegratedSystemConfigDataAccess.validateConfigIntegrity();
      return result;
    } catch (err) {
      console.error('Failed to perform integrity check:', err);
      throw err;
    }
  }, []);

  // サマリー再読み込み
  const refreshSummary = useCallback(async (): Promise<void> => {
    await loadSummary();
  }, [loadSummary]);

  // 計算値
  const isConfigured = systemStatus?.isConfigured ?? false;
  const configurationScore = systemStatus?.configurationScore ?? 0;

  return {
    // データ
    summary,
    systemStatus,
    loading,
    error,

    // アクション
    exportConfiguration,
    performIntegrityCheck,
    refreshSummary,

    // 計算値
    isConfigured,
    configurationScore
  };
};