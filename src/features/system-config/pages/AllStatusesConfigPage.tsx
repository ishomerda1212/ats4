// 全段階ステータス管理ページ

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Filter, ExternalLink, TrendingUp, AlertCircle } from 'lucide-react';
import { useIntegratedStageConfig } from '../hooks/useIntegratedStageConfig';
import { IntegratedStatusDataAccess, STATUS_CATEGORIES, type StatusCategory } from '@/lib/dataAccess/integratedStatusDataAccess';
import { COLOR_SCHEME_DISPLAY } from '@/features/system-config/types';
import type { IntegratedStatusDefinition } from '@/lib/dataAccess/integratedStatusDataAccess';

interface StageStatusSummary {
  stageId: string;
  stageName: string;
  stageDisplayName: string;
  requiresSession: boolean;
  sessionTypes: string[];
  statuses: IntegratedStatusDefinition[];
  statusCount: number;
  hasIssues: boolean;
  issues: string[];
}

export const AllStatusesConfigPage = () => {
  const navigate = useNavigate();
  
  const { stages } = useIntegratedStageConfig();
  const [statusSummaries, setStatusSummaries] = useState<StageStatusSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showIssuesOnly, setShowIssuesOnly] = useState(false);
  const [sessionFilter, setSessionFilter] = useState<string>('all'); // 'all', 'with-session', 'without-session'

  // ステータスデータを読み込み
  useEffect(() => {
    const loadAllStatuses = async () => {
      try {
        setLoading(true);
        setError(null);

        const summaries: StageStatusSummary[] = [];

        for (const stage of stages) {
          try {
            const statuses = await IntegratedStatusDataAccess.getStatusesByStageId(stage.id);
            
            // セッション不要の段階ではステータス関連の問題を無視
            const issues = stage.requiresSession ? validateStageStatuses(statuses) : [];
            
            summaries.push({
              stageId: stage.id,
              stageName: stage.name,
              stageDisplayName: stage.displayName,
              requiresSession: stage.requiresSession,
              sessionTypes: stage.sessionTypes,
              statuses,
              statusCount: statuses.length,
              hasIssues: issues.length > 0,
              issues
            });
          } catch (stageError) {
            console.error(`Failed to load statuses for stage ${stage.name}:`, stageError);
            summaries.push({
              stageId: stage.id,
              stageName: stage.name,
              stageDisplayName: stage.displayName,
              requiresSession: stage.requiresSession,
              sessionTypes: stage.sessionTypes,
              statuses: [],
              statusCount: 0,
              hasIssues: true,
              issues: ['ステータスの読み込みに失敗しました']
            });
          }
        }

        setStatusSummaries(summaries);
      } catch (err) {
        console.error('Failed to load status summaries:', err);
        setError(err instanceof Error ? err.message : 'ステータス情報の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (stages.length > 0) {
      loadAllStatuses();
    }
  }, [stages]);

  // 段階ステータスのバリデーション
  const validateStageStatuses = (statuses: IntegratedStatusDefinition[]): string[] => {
    const issues: string[] = [];

    if (statuses.length === 0) {
      issues.push('ステータスが設定されていません');
      return issues;
    }

    const categories = statuses.map(s => s.statusCategory);
    const hasPassedStatus = categories.includes('passed');
    const hasFailedOrDeclined = categories.includes('failed') || categories.includes('declined');

    if (!hasPassedStatus) {
      issues.push('「通過」カテゴリのステータスが不足');
    }
    if (!hasFailedOrDeclined) {
      issues.push('「不通過」「辞退」カテゴリのステータスが不足');
    }

    // 重複チェック
    const statusValues = statuses.map(s => s.statusValue);
    const duplicates = statusValues.filter((value, index) => statusValues.indexOf(value) !== index);
    if (duplicates.length > 0) {
      issues.push('重複するステータスがあります');
    }

    return issues;
  };

  // フィルタリング
  const filteredSummaries = statusSummaries.filter(summary => {
    const matchesSearch = summary.stageDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summary.statuses.some(status => 
                           status.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           status.statusValue.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === 'all' || 
                           summary.statuses.some(status => status.statusCategory === selectedCategory);
    
    const matchesIssueFilter = !showIssuesOnly || summary.hasIssues;
    
    const matchesSessionFilter = sessionFilter === 'all' || 
                                (sessionFilter === 'with-session' && summary.requiresSession) ||
                                (sessionFilter === 'without-session' && !summary.requiresSession);
    
    return matchesSearch && matchesCategory && matchesIssueFilter && matchesSessionFilter;
  });

  // 統計データ
  const stats = {
    totalStages: statusSummaries.length,
    stagesWithIssues: statusSummaries.filter(s => s.hasIssues).length,
    totalStatuses: statusSummaries.reduce((sum, s) => sum + s.statusCount, 0),
    passedStatuses: statusSummaries.reduce((sum, s) => 
      sum + s.statuses.filter(status => status.statusCategory === 'passed').length, 0
    ),
    stagesWithSession: statusSummaries.filter(s => s.requiresSession).length,
    byCategory: STATUS_CATEGORIES.reduce((acc, category) => {
      acc[category.value] = statusSummaries.reduce((sum, summary) => 
        sum + summary.statuses.filter(s => s.statusCategory === category.value).length, 0
      );
      return acc;
    }, {} as Record<StatusCategory, number>)
  };

  const renderStageStatusCard = (summary: StageStatusSummary) => {
    const stage = stages.find(s => s.id === summary.stageId);
    
    return (
      <Card key={summary.stageId} className={`hover:shadow-md transition-shadow ${summary.hasIssues ? 'border-yellow-200' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full bg-${stage?.colorScheme || 'blue'}-500`} />
              <CardTitle className="text-lg">{summary.stageDisplayName}</CardTitle>
              {summary.hasIssues && (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              {!summary.requiresSession && (
                <Badge variant="secondary" className="text-xs">
                  セッション不要
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {summary.requiresSession && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/system-config/stages/${summary.stageId}/statuses`)}
                >
                  <ExternalLink className="h-4 w-4" />
                  設定
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/system-config/stages/${summary.stageId}/edit`)}
              >
                段階設定
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* セッション設定情報 */}
          <div className="mb-3">
            {summary.requiresSession ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>セッション形式:</span>
                {summary.sessionTypes.length > 0 ? (
                  <div className="flex gap-1">
                    {summary.sessionTypes.map(type => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">未設定</span>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                この段階ではセッション予約は不要です
              </div>
            )}
          </div>

          {/* ステータス統計 */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              {summary.requiresSession ? `${summary.statusCount}個のステータス` : 'ステータス不要'}
            </div>
            {summary.hasIssues && summary.requiresSession && (
              <Badge variant="outline" className="text-yellow-600">
                {summary.issues.length}件の問題
              </Badge>
            )}
          </div>

          {/* ステータス一覧 */}
          {summary.requiresSession ? (
            summary.statuses.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {summary.statuses.slice(0, 6).map((status) => {
                    const colorInfo = COLOR_SCHEME_DISPLAY[status.colorScheme];
                    return (
                      <Badge 
                        key={status.id}
                        className={colorInfo.class}
                      >
                        {status.displayName}
                        {status.isFinal && <span className="ml-1">🔒</span>}
                      </Badge>
                    );
                  })}
                  {summary.statuses.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      他{summary.statuses.length - 6}件
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">ステータスが設定されていません</p>
                <p className="text-xs text-gray-400 mt-1">セッション予約が必要な段階です</p>
              </div>
            )
          ) : (
            <div className="text-center py-4 text-gray-400">
              <p className="text-sm italic">セッション不要のためステータスは不要です</p>
            </div>
          )}

          {/* 問題一覧 */}
          {summary.issues.length > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <div className="text-xs font-medium text-yellow-800 mb-1">設定の問題:</div>
              <ul className="text-xs text-yellow-700 space-y-1">
                {summary.issues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">エラーが発生しました</h2>
          <p className="text-red-700">{error}</p>
          <Button 
            onClick={() => navigate('/system-config')} 
            className="mt-4"
          >
            システム設定に戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/system-config')}>
              <ArrowLeft className="h-4 w-4" />
              システム設定に戻る
            </Button>
            <div>
              <h1 className="text-2xl font-bold">ステータス管理（全段階）</h1>
              <p className="text-gray-600">全段階のステータス設定を統合管理</p>
            </div>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">総段階数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">問題のある段階</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.stagesWithIssues}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">総ステータス数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalStatuses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">通過ステータス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.passedStatuses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">セッション必要</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.stagesWithSession}</div>
          </CardContent>
        </Card>
      </div>

      {/* 問題のある段階の警告 */}
      {stats.stagesWithIssues > 0 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              設定に問題があります
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 mb-2">
              {stats.stagesWithIssues}個の段階でステータス設定に問題があります。
              適切に動作させるため、以下の問題を解決してください：
            </p>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• 最低限「通過」と「不通過/辞退」カテゴリのステータスを設定</li>
              <li>• 重複するステータス値の修正</li>
              <li>• 各段階に最低1つのステータスを設定</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* フィルタリング */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            フィルタリング・検索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">キーワード検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="段階名・ステータスで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">カテゴリで絞り込み</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのカテゴリ</SelectItem>
                  {STATUS_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.icon} {category.label} ({stats.byCategory[category.value]}件)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">表示範囲</label>
              <Select 
                value={showIssuesOnly ? 'issues' : 'all'} 
                onValueChange={(value) => setShowIssuesOnly(value === 'issues')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての段階</SelectItem>
                  <SelectItem value="issues">問題のある段階のみ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">セッション設定</label>
              <Select value={sessionFilter} onValueChange={setSessionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての段階</SelectItem>
                  <SelectItem value="with-session">セッション必要</SelectItem>
                  <SelectItem value="without-session">セッション不要</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">アクション</label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setShowIssuesOnly(false);
                  setSessionFilter('all');
                }}
                className="w-full"
              >
                フィルタクリア
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ステータス一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>
            段階別ステータス設定
            {(searchTerm || selectedCategory !== 'all' || showIssuesOnly || sessionFilter !== 'all') && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                （{filteredSummaries.length}件を表示）
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSummaries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSummaries.map(renderStageStatusCard)}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              {searchTerm || selectedCategory !== 'all' || showIssuesOnly || sessionFilter !== 'all' ? (
                <>
                  <p className="text-lg font-medium">条件に一致する段階が見つかりません</p>
                  <p className="text-sm">フィルタ条件を変更してください</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">段階が設定されていません</p>
                  <p className="text-sm">段階を作成してからステータスを設定してください</p>
                  <Button onClick={() => navigate('/system-config/stages')} className="mt-4">
                    段階管理に移動
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};