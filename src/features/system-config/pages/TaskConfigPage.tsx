// タスク管理ページ

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Edit, Trash2, Mail, FileText, CheckSquare, Users, Star } from 'lucide-react';
import { DragDropList } from '../components/common/DragDropList';
import { TaskEditDialog } from '../components/tasks/TaskEditDialog';
import { useIntegratedTaskConfig } from '../hooks/useIntegratedTaskConfig';
import { useIntegratedStageConfig } from '../hooks/useIntegratedStageConfig';
import type { IntegratedTaskDefinition, TaskType } from '@/lib/dataAccess/integratedTaskDataAccess';

const TASK_TYPE_ICONS: Record<TaskType, React.ComponentType<any>> = {
  email: Mail,
  document: FileText, 
  general: CheckSquare,
  interview: Users,
  evaluation: Star
};

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  email: 'メール',
  document: '書類',
  general: '一般',
  interview: '面接',
  evaluation: '評価'
};

const TASK_TYPE_COLORS: Record<TaskType, string> = {
  email: 'bg-blue-100 text-blue-800',
  document: 'bg-green-100 text-green-800',
  general: 'bg-gray-100 text-gray-800',
  interview: 'bg-purple-100 text-purple-800',
  evaluation: 'bg-yellow-100 text-yellow-800'
};

export const TaskConfigPage = () => {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  
  if (!stageId) {
    return <div>無効なステージIDです</div>;
  }

  const { getStageById } = useIntegratedStageConfig();
  const { 
    tasks, 
    loading, 
    createTask, 
    updateTask, 
    deleteTask, 
    reorderTasks,
    error 
  } = useIntegratedTaskConfig(stageId);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<IntegratedTaskDefinition | undefined>();
  const [stage, setStage] = useState<any>(null);

  // 段階情報を取得
  useEffect(() => {
    const stageInfo = getStageById(stageId);
    setStage(stageInfo);
  }, [stageId, getStageById]);

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setEditDialogOpen(true);
  };

  const handleEditTask = (task: IntegratedTaskDefinition) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('このタスクを削除しますか？')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('タスクの削除に失敗しました');
      }
    }
  };

  const handleSaveTask = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
  };

  const handleReorder = (reorderedTasks: IntegratedTaskDefinition[]) => {
    const orders = reorderedTasks.map((task, index) => ({
      id: task.id,
      sortOrder: index + 1
    }));
    reorderTasks(orders);
  };

  const renderTaskItem = (task: IntegratedTaskDefinition) => {
    // taskTypeが存在しない場合のフォールバック処理
    const IconComponent = TASK_TYPE_ICONS[task.taskType] || CheckSquare;
    const taskColor = TASK_TYPE_COLORS[task.taskType] || 'bg-gray-100 text-gray-800';
    const taskLabel = TASK_TYPE_LABELS[task.taskType] || 'その他';
    
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <IconComponent className="h-5 w-5 text-gray-600" />
            <Badge className={taskColor}>
              {taskLabel}
            </Badge>
          </div>
          <div>
            <h3 className="font-medium">{task.displayName}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>順序: {task.sortOrder}</span>
              {task.dueOffsetDays && <span>期限: {task.dueOffsetDays}日後</span>}
              {task.isRequired && <Badge variant="outline" className="text-xs">必須</Badge>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={task.isActive ? 'default' : 'secondary'}>
            {task.isActive ? 'アクティブ' : '無効'}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditTask(task)}
          >
            <Edit className="h-4 w-4" />
            編集
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteTask(task.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            削除
          </Button>
        </div>
      </div>
    );
  };

  // タスクを段階ごとにグループ化
  const groupedTasks = tasks.reduce((groups, task) => {
    const stageName = task.stageName || '不明な段階';
    if (!groups[stageName]) {
      groups[stageName] = [];
    }
    groups[stageName].push(task);
    return groups;
  }, {} as Record<string, IntegratedTaskDefinition[]>);

  // 段階名でソート
  const sortedStageNames = Object.keys(groupedTasks).sort();

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
              <h1 className="text-2xl font-bold">タスク管理</h1>
              <p className="text-gray-600">
                段階「{stage?.displayName || 'Unknown'}」のタスク設定
              </p>
            </div>
          </div>
          
          <Button onClick={handleCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            新規追加
          </Button>
        </div>
      </div>

      {/* 概要統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">総タスク数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">アクティブ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.isActive).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">必須タスク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.isRequired).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">メールタスク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {tasks.filter(t => t.taskType === 'email').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* タスク一覧 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>タスク一覧</CardTitle>
            <div className="text-sm text-gray-600">
              {tasks.length}個のタスク
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="space-y-6">
              {sortedStageNames.map((stageName) => (
                <div key={stageName} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">{stageName}</h3>
                    <Badge variant="outline" className="text-sm">
                      {groupedTasks[stageName].length}個のタスク
                    </Badge>
                  </div>
                  <DragDropList
                    items={groupedTasks[stageName]}
                    onReorder={(reorderedTasks) => {
                      // 段階内での並び替え処理
                      const orders = reorderedTasks.map((task, index) => ({
                        id: task.id,
                        sortOrder: index + 1
                      }));
                      reorderTasks(orders);
                    }}
                    renderItem={renderTaskItem}
                    keyExtractor={(task) => task.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">タスクがありません</p>
              <p className="text-sm">「新規追加」ボタンから最初のタスクを作成してください</p>
              <Button onClick={handleCreateTask} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                タスクを追加
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <TaskEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        task={editingTask}
        stageId={stageId}
        stageName={stage?.displayName || ''}
        onSave={handleSaveTask}
        maxSortOrder={Math.max(...tasks.map(t => t.sortOrder), 0)}
      />
    </div>
  );
};