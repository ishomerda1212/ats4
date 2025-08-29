// システム設定サマリーカードコンポーネント

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { SystemConfigSummary } from '@/features/system-config/types';

interface ConfigSummaryCardProps {
  summary: SystemConfigSummary;
  systemStatus?: {
    isConfigured: boolean;
    configurationScore: number;
    issues: string[];
    recommendations: string[];
    messages: string[];
  };
}

export const ConfigSummaryCard = ({ summary, systemStatus }: ConfigSummaryCardProps) => {
  const getStatusIcon = () => {
    if (!systemStatus) return <CheckCircle className="h-5 w-5 text-green-600" />;
    
    if (systemStatus.isConfigured) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (systemStatus.issues.length > 0) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    if (!systemStatus) return 'bg-green-100 text-green-800';
    
    if (systemStatus.isConfigured) {
      return 'bg-green-100 text-green-800';
    } else if (systemStatus.issues.length > 0) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = () => {
    if (!systemStatus) return '正常';
    
    if (systemStatus.isConfigured) {
      return '正常';
    } else if (systemStatus.issues.length > 0) {
      return 'エラー';
    } else {
      return '注意';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">システム状態</CardTitle>
          <Badge className={getStatusColor()}>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              {getStatusText()}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 統計情報 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">選考段階</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">{summary.activeStages}</span>
              <span className="text-sm text-gray-500">/ {summary.totalStages}</span>
            </div>
            <p className="text-xs text-gray-500">アクティブ / 総数</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">固定タスク</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">{summary.totalTasks}</span>
            </div>
            <p className="text-xs text-gray-500">設定済み</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">ステータス</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-600">{summary.totalStatuses}</span>
            </div>
            <p className="text-xs text-gray-500">定義済み</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">最終更新</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                {summary.lastUpdated.toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {summary.lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* システム状態メッセージ */}
        {systemStatus && systemStatus.messages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">状態詳細</p>
            <div className="space-y-1">
              {systemStatus.messages.map((message, index) => (
                <p key={index} className="text-sm text-gray-700">
                  • {message}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* 設定完了度 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">設定完了度</p>
            <span className="text-sm font-medium">
              {Math.round((summary.activeStages > 0 && summary.totalTasks > 0 && summary.totalStatuses > 0) ? 100 : 
                (summary.totalStages > 0 ? 33 : 0) + 
                (summary.totalTasks > 0 ? 33 : 0) + 
                (summary.totalStatuses > 0 ? 34 : 0)
              )}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${Math.round((summary.activeStages > 0 && summary.totalTasks > 0 && summary.totalStatuses > 0) ? 100 : 
                  (summary.totalStages > 0 ? 33 : 0) + 
                  (summary.totalTasks > 0 ? 33 : 0) + 
                  (summary.totalStatuses > 0 ? 34 : 0)
                )}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};