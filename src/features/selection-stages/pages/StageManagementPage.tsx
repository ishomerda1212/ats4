import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { StageTemplateForm } from '../components/StageTemplateForm';
import { DefaultTaskForm } from '../components/DefaultTaskForm';
import { useSelectionStages } from '../hooks/useSelectionStages';
import { SelectionStageTemplate, DefaultTask } from '../types/selectionStage';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function StageManagementPage() {
  const {
    stageTemplates,
    deleteStageTemplate,
    deleteDefaultTask,
  } = useSelectionStages();

  const [showStageForm, setShowStageForm] = useState(false);
  const [editingStage, setEditingStage] = useState<SelectionStageTemplate | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<{ stageId: string; task?: DefaultTask } | null>(null);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());

  const handleEditStage = (stage: SelectionStageTemplate) => {
    setEditingStage(stage);
    setShowStageForm(true);
  };

  const handleDeleteStage = (stage: SelectionStageTemplate) => {
    if (window.confirm(`「${stage.name}」を削除しますか？`)) {
      deleteStageTemplate(stage.id);
    }
  };

  const handleAddTask = (stageId: string) => {
    setEditingTask({ stageId });
    setShowTaskForm(true);
  };

  const handleEditTask = (stageId: string, task: DefaultTask) => {
    setEditingTask({ stageId, task });
    setShowTaskForm(true);
  };

  const handleDeleteTask = (stageId: string, task: DefaultTask) => {
    if (window.confirm(`「${task.title}」を削除しますか？`)) {
      deleteDefaultTask(stageId, task.id);
    }
  };

  const handleStageFormSuccess = () => {
    setShowStageForm(false);
    setEditingStage(null);
  };

  const handleTaskFormSuccess = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const toggleStageExpansion = (stageId: string) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStages(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">選考段階管理</h1>
          <p className="text-muted-foreground mt-1">選考段階とデフォルトタスクの設定</p>
        </div>
        
        <Button onClick={() => setShowStageForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新規段階追加
        </Button>
      </div>

      {showStageForm && (
        <div className="mb-6">
          <StageTemplateForm
            template={editingStage || undefined}
            onCancel={() => {
              setShowStageForm(false);
              setEditingStage(null);
            }}
            onSuccess={handleStageFormSuccess}
          />
        </div>
      )}

      {showTaskForm && editingTask && (
        <div className="mb-6">
          <DefaultTaskForm
            stageId={editingTask.stageId}
            task={editingTask.task}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            onSuccess={handleTaskFormSuccess}
          />
        </div>
      )}

      <div className="space-y-4">
        {stageTemplates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">選考段階が設定されていません。</p>
            </CardContent>
          </Card>
        ) : (
          stageTemplates.map((stage) => (
            <Card key={stage.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Collapsible>
                      <CollapsibleTrigger
                        onClick={() => toggleStageExpansion(stage.id)}
                        className="flex items-center space-x-2"
                      >
                        {expandedStages.has(stage.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                    </Collapsible>
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle>{stage.order}. {stage.name}</CardTitle>
                        <Badge className="bg-gray-100 text-gray-800">
                          {stage.isActive ? '有効' : '無効'}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          {stage.defaultTasks.length}タスク
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stage.description}
                      </p>
                      {stage.estimatedDuration && (
                        <p className="text-xs text-muted-foreground">
                          予想期間: {stage.estimatedDuration}日
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditStage(stage)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      編集
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteStage(stage)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      削除
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <Collapsible open={expandedStages.has(stage.id)}>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">デフォルトタスク</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddTask(stage.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          タスク追加
                        </Button>
                      </div>
                      
                      {stage.defaultTasks.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          デフォルトタスクが設定されていません
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {stage.defaultTasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h5 className="font-medium">{task.title}</h5>
                                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                                    {task.type}
                                  </Badge>
                                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                                    {task.priority}
                                  </Badge>
                                  {task.isRequired && (
                                    <Badge className="bg-red-100 text-red-800 text-xs">
                                      必須
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {task.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                  {task.assignee && (
                                    <span>担当: {task.assignee}</span>
                                  )}
                                  {task.dueOffsetDays && (
                                    <span>期限: {task.dueOffsetDays}日後</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditTask(stage.id, task)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  編集
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteTask(stage.id, task)}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  削除
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}