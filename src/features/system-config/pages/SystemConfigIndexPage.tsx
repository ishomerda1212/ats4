// システム設定トップページ

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Layers, 
  CheckSquare, 
  GitBranch, 
  Download,
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { ConfigSummaryCard } from '../components/common/ConfigSummaryCard';
import { useIntegratedSystemConfig } from '../hooks/useIntegratedSystemConfig';
import { useIntegratedStageConfig } from '../hooks/useIntegratedStageConfig';

export const SystemConfigIndexPage = () => {
  const navigate = useNavigate();
  const { 
    summary, 
    loading, 
    systemStatus,
    exportConfiguration,
    performIntegrityCheck,
    isConfigured,
    configurationScore,
    error
  } = useIntegratedSystemConfig();
  
  const { stages } = useIntegratedStageConfig();
  const [isExporting, setIsExporting] = useState(false);
  const [isCheckingIntegrity, setIsCheckingIntegrity] = useState(false);

  // エラー状態の表示
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">システム設定</h1>
          </div>
          <p className="text-gray-600">選考プロセスの設定を管理します</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-800">エラーが発生しました</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="bg-gray-100 p-4 rounded text-sm font-mono text-gray-800 overflow-auto">
            <p>デバッグ情報:</p>
            <p>Loading: {loading ? 'true' : 'false'}</p>
            <p>Summary: {summary ? 'loaded' : 'null'}</p>
            <p>SystemStatus: {systemStatus ? 'calculated' : 'null'}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            ページを再読み込み
          </button>
        </div>
      </div>
    );
  }

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportConfiguration();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleIntegrityCheck = async () => {
    try {
      setIsCheckingIntegrity(true);
      const result = await performIntegrityCheck();
      console.log('Integrity check result:', result);
    } catch (error) {
      console.error('Integrity check failed:', error);
    } finally {
      setIsCheckingIntegrity(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">システム設定</h1>
        </div>
        <p className="text-gray-600">選考プロセスの設定を管理します</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* サマリーカード */}
        <div className="lg:col-span-2">
          {summary && (
            <ConfigSummaryCard 
              summary={summary} 
              systemStatus={systemStatus || undefined}
            />
          )}
        </div>

        {/* クイックアクション */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              クイックアクション
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleIntegrityCheck}
              variant="outline"
              className="w-full justify-start"
              disabled={isCheckingIntegrity}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              整合性チェック
            </Button>
            
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full justify-start"
              disabled={isExporting || !summary}
            >
              <Download className="h-4 w-4 mr-2" />
              設定エクスポート
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 設定管理カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* 選考段階管理 */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/system-config/stages')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">選考段階管理</CardTitle>
                  <p className="text-sm text-gray-600">段階の追加・編集・順序変更</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{summary?.activeStages || 0}</p>
                  <p className="text-xs text-gray-500">アクティブ</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">{summary?.totalStages || 0}</p>
                  <p className="text-xs text-gray-500">総数</p>
                </div>
              </div>
              
              <Badge variant={summary?.activeStages ? 'default' : 'secondary'}>
                {summary?.activeStages ? '設定済み' : '未設定'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* タスク管理 */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/system-config/tasks')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">タスク管理</CardTitle>
                  <p className="text-sm text-gray-600">段階ごとのタスク設定</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{summary?.totalTasks || 0}</p>
                <p className="text-xs text-gray-500">設定済み</p>
              </div>
              
              <Badge variant={summary?.totalTasks ? 'default' : 'secondary'}>
                {summary?.totalTasks ? '設定済み' : '未設定'}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mt-3">
              段階別にタスクを管理するには、先に選考段階を設定してください。
            </p>
          </CardContent>
        </Card>

        {/* ステータス管理 */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/system-config/statuses')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GitBranch className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">ステータス管理</CardTitle>
                  <p className="text-sm text-gray-600">段階ごとの結果設定</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{summary?.totalStatuses || 0}</p>
                <p className="text-xs text-gray-500">定義済み</p>
              </div>
              
              <Badge variant={summary?.totalStatuses ? 'default' : 'secondary'}>
                {summary?.totalStatuses ? '設定済み' : '未設定'}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mt-3">
              段階別にステータスを管理するには、先に選考段階を設定してください。
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 設定ガイド */}
      {!isConfigured && (
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">🚀 設定を開始しましょう</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-blue-700">
                システム設定が完了していません。以下の順番で設定を行うことをお勧めします：
              </p>
              
              <ol className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">1</Badge>
                  <span>選考段階を設定する</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">2</Badge>
                  <span>各段階のタスクを定義する</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">3</Badge>
                  <span>各段階のステータスを設定する</span>
                </li>
              </ol>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => navigate('/system-config/stages')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  選考段階設定を開始
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 設定完了度 */}
      {configurationScore < 100 && summary && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">設定進捗</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">全体の設定完了度</span>
                <span className="text-sm font-bold">{configurationScore}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${configurationScore}%` }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>選考段階</span>
                  <Badge variant={summary.activeStages > 0 ? 'default' : 'secondary'}>
                    {summary.activeStages > 0 ? '完了' : '未完了'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>固定タスク</span>
                  <Badge variant={summary.totalTasks > 0 ? 'default' : 'secondary'}>
                    {summary.totalTasks > 0 ? '完了' : '未完了'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>ステータス定義</span>
                  <Badge variant={summary.totalStatuses > 0 ? 'default' : 'secondary'}>
                    {summary.totalStatuses > 0 ? '完了' : '未完了'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};