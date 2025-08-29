// ステータス管理ページ

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Edit, Trash2, Save, RefreshCw, FileDown, RotateCcw, Wand2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusEditDialog } from '../components/statuses/StatusEditDialog';
import { useIntegratedStatusConfig } from '../hooks/useIntegratedStatusConfig';
import { useIntegratedStageConfig } from '../hooks/useIntegratedStageConfig';
import { COLOR_SCHEME_DISPLAY } from '@/features/system-config/types';
import { STATUS_TEMPLATES, STATUS_CATEGORIES } from '@/lib/dataAccess/integratedStatusDataAccess';
import type { CreateStatusDefinitionInput, StatusCategory } from '@/lib/dataAccess/integratedStatusDataAccess';

export const StatusConfigPage = () => {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  
  if (!stageId) {
    return <div>無効なステージIDです</div>;
  }

  const { getStageById } = useIntegratedStageConfig();
  const { 
    statuses,
    workingStatuses,
    setWorkingStatuses,
    hasUnsavedChanges,
    loading, 
    error,
    saveStatuses,
    addStatus,
    updateStatus,
    removeStatus,
    reorderStatuses,
    resetStatuses,
    applyTemplate,
    validateStatuses
  } = useIntegratedStatusConfig(stageId);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const [stage, setStage] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // 段階情報を取得
  useEffect(() => {
    const stageInfo = getStageById(stageId);
    setStage(stageInfo);
  }, [stageId, getStageById]);

  const handleCreateStatus = () => {
    setEditingIndex(undefined);
    setEditDialogOpen(true);
  };

  const handleEditStatus = (index: number) => {
    setEditingIndex(index);
    setEditDialogOpen(true);
  };

  const handleDeleteStatus = (index: number) => {
    if (window.confirm('このステータスを削除しますか？')) {
      removeStatus(index);
    }
  };

  const handleSaveStatus = (data: CreateStatusDefinitionInput) => {
    if (editingIndex !== undefined) {
      updateStatus(editingIndex, data);
    } else {
      addStatus(data);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      await saveStatuses(workingStatuses);
      alert('ステータス設定を保存しました');
    } catch (error) {
      console.error('Failed to save statuses:', error);
      alert(`保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateApply = (templateName: string) => {
    if (window.confirm(`「${templateName}」テンプレートを適用しますか？現在の設定は上書きされます。`)) {
      applyTemplate(templateName);
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    reorderStatuses(fromIndex, toIndex);
  };

  const getStatusCategoryInfo = (category: StatusCategory) => {
    return STATUS_CATEGORIES.find(cat => cat.value === category);
  };

  const renderStatusItem = (status: CreateStatusDefinitionInput, index: number) => {
    const categoryInfo = getStatusCategoryInfo(status.statusCategory);
    const colorInfo = COLOR_SCHEME_DISPLAY[status.colorScheme || 'blue'];
    
    return (
      <div key={index} className="flex items-center justify-between p-4 bg-white border rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>{categoryInfo?.icon || '❔'}</span>
            <Badge className={colorInfo.class}>
              {status.displayName}
            </Badge>
            {status.isFinal && (
              <Badge variant="outline" className="text-xs">
                最終
              </Badge>
            )}
          </div>
          <div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>値: {status.statusValue}</span>
              <span>順序: {status.sortOrder}</span>
              <span>カテゴリ: {categoryInfo?.label}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={status.isActive ? 'default' : 'secondary'}>
            {status.isActive ? 'アクティブ' : '無効'}
          </Badge>
          
          <div className="flex gap-1">
            {index > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReorder(index, index - 1)}
              >
                ↑
              </Button>
            )}
            {index < workingStatuses.length - 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReorder(index, index + 1)}
              >
                ↓
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditStatus(index)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteStatus(index)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
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
            onClick={() => navigate('/system-config/stages')} 
            className="mt-4"
          >
            段階管理に戻る
          </Button>
        </div>
      </div>
    );
  }

  const validationErrors = validateStatuses(workingStatuses);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/system-config/stages')}>
              <ArrowLeft className="h-4 w-4" />
              段階管理に戻る
            </Button>
            <div>
              <h1 className="text-2xl font-bold">ステータス管理</h1>
              <p className="text-gray-600">
                段階「{stage?.displayName || 'Unknown'}」のステータス設定
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-yellow-600">
                未保存の変更があります
              </Badge>
            )}
            
            <Button
              variant="outline"
              onClick={resetStatuses}
              disabled={!hasUnsavedChanges}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              リセット
            </Button>
            
            <Button
              onClick={handleSaveAll}
              disabled={saving || validationErrors.length > 0}
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              保存
            </Button>
          </div>
        </div>
      </div>

      {/* バリデーションエラー表示 */}
      {validationErrors.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium mb-2">設定に問題があります</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* コントロールパネル */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">テンプレート適用</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Select onValueChange={handleTemplateApply}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="テンプレートを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">基本（合格・不合格・辞退）</SelectItem>
                  <SelectItem value="interview">面接用（保留・キャンセルあり）</SelectItem>
                  <SelectItem value="event">イベント用（参加予定・参加）</SelectItem>
                  <SelectItem value="final">最終選考用（内定・保留）</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline">
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>総ステータス数:</span>
                <span className="font-medium">{workingStatuses.length}</span>
              </div>
              <div className="flex justify-between">
                <span>アクティブ:</span>
                <span className="font-medium text-green-600">
                  {workingStatuses.filter(s => s.isActive).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>最終ステータス:</span>
                <span className="font-medium text-red-600">
                  {workingStatuses.filter(s => s.isFinal).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">アクション</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateStatus}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規追加
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ステータス一覧 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ステータス一覧</CardTitle>
            <div className="text-sm text-gray-600">
              {workingStatuses.length}個のステータス
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {workingStatuses.length > 0 ? (
            <div className="space-y-3">
              {workingStatuses.map((status, index) => 
                renderStatusItem(status, index)
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="h-12 w-12 mx-auto mb-4 text-gray-300">⚡</div>
              <p className="text-lg font-medium">ステータスがありません</p>
              <p className="text-sm mb-4">「新規追加」ボタンまたはテンプレートから最初のステータスを作成してください</p>
              <div className="flex justify-center gap-2">
                <Button onClick={handleCreateStatus}>
                  <Plus className="h-4 w-4 mr-2" />
                  ステータスを追加
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleTemplateApply('basic')}
                >
                  基本テンプレート適用
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <StatusEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        status={editingIndex !== undefined ? workingStatuses[editingIndex] : undefined}
        stageId={stageId}
        stageName={stage?.displayName || ''}
        onSave={handleSaveStatus}
        maxSortOrder={Math.max(...workingStatuses.map(s => s.sortOrder), 0)}
      />
    </div>
  );
};