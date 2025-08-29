// 選考段階管理ページ

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Settings, CheckSquare, GitBranch } from 'lucide-react';
import { DragDropList } from '../components/common/DragDropList';
import { StageEditDialog } from '../components/stages/StageEditDialog';
import { useIntegratedStageConfig } from '../hooks/useIntegratedStageConfig';
import type { SelectionStageDefinition } from '../types';

export const StageConfigPage = () => {
  const navigate = useNavigate();
  const { 
    stages, 
    loading, 
    createStage, 
    updateStage, 
    deleteStage, 
    reorderStages 
  } = useIntegratedStageConfig();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<SelectionStageDefinition | undefined>();

  const handleCreateStage = () => {
    setEditingStage(undefined);
    setEditDialogOpen(true);
  };

  const handleEditStage = (stage: SelectionStageDefinition) => {
    setEditingStage(stage);
    setEditDialogOpen(true);
  };

  const handleSaveStage = async (data: any) => {
    if (editingStage) {
      await updateStage(editingStage.id, data);
    } else {
      await createStage(data);
    }
  };

  const handleReorder = (reorderedStages: SelectionStageDefinition[]) => {
    const orders = reorderedStages.map((stage, index) => ({
      id: stage.id,
      sortOrder: index + 1
    }));
    reorderStages(orders);
  };

  const renderStageItem = (stage: SelectionStageDefinition) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-4 h-4 rounded-full bg-${stage.colorScheme}-500`} />
        <div>
          <h3 className="font-medium">{stage.displayName}</h3>
          <p className="text-sm text-gray-600">グループ: {stage.stageGroup}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant={stage.isActive ? 'default' : 'secondary'}>
          {stage.isActive ? 'アクティブ' : '無効'}
        </Badge>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditStage(stage)}
        >
          編集
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/system-config/stages/${stage.id}/tasks`)}
        >
          <CheckSquare className="h-4 w-4" />
          タスク
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/system-config/stages/${stage.id}/statuses`)}
        >
          <GitBranch className="h-4 w-4" />
          ステータス
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="container mx-auto px-4 py-8">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/system-config')}>
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Button>
            <div>
              <h1 className="text-2xl font-bold">選考段階管理</h1>
              <p className="text-gray-600">選考段階の設定・順序変更</p>
            </div>
          </div>
          
          <Button onClick={handleCreateStage}>
            <Plus className="h-4 w-4 mr-2" />
            新規追加
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>選考段階一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropList
            items={stages}
            onReorder={handleReorder}
            renderItem={renderStageItem}
            keyExtractor={(stage) => stage.id}
          />
        </CardContent>
      </Card>

      <StageEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        stage={editingStage}
        onSave={handleSaveStage}
        maxSortOrder={Math.max(...stages.map(s => s.sortOrder), 0)}
      />
    </div>
  );
};