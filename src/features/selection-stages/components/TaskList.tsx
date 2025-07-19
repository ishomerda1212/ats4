import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, CheckCircle, AlertCircle, User, Calendar, Mail, Edit, Trash2 } from 'lucide-react';
import { Task, TaskStatus } from '@/features/tasks/types/task';
import { TaskForm } from '@/features/tasks/components/TaskForm';
import { EmailComposer } from '@/features/tasks/components/EmailComposer';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { Applicant } from '@/features/applicants/types/applicant';
import { formatDate } from '@/shared/utils/date';
import { TaskStatusBadge } from '@/shared/components/common/TaskStatusBadge';
import { useState } from 'react';

interface TaskListProps {
  selectionHistoryId: string;
  applicant: Applicant;
}

export function TaskList({ selectionHistoryId, applicant }: TaskListProps) {
  const { getTasksBySelectionHistory, updateTask, deleteTask } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [emailTask, setEmailTask] = useState<Task | null>(null);
  
  const tasks = getTasksBySelectionHistory(selectionHistoryId);

  // タスクタイプを判定する関数
  const getTaskType = (task: Task): TaskType => {
    if (task.type) return task.type;
    if (task.emailTemplateId) return 'email';
    if (task.title.includes('メール')) return 'email';
    if (task.title.includes('面接')) return 'interview';
    return 'general';
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '進行中':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case '未着手':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleStatusToggle = (task: Task) => {    
    const newStatus: TaskStatus = task.status === '完了' ? '未着手' : 
                                 task.status === '未着手' ? '進行中' : '完了';
    updateTask(task.id, { 
      status: newStatus,
      completedAt: newStatus === '完了' ? new Date().toISOString() : undefined
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (task: Task) => {
    if (window.confirm('このタスクを削除しますか？')) {
      deleteTask(task.id);
    }
  };

  const handleEmailTask = (task: Task) => {
    setEmailTask(task);
  };

  const handleTaskFormSuccess = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleTaskFormCancel = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleEmailSuccess = () => {
    setEmailTask(null);
  };

  const handleEmailCancel = () => {
    setEmailTask(null);
  };

  // メール作成モードの場合
  if (emailTask) {
    return (
      <EmailComposer
        task={emailTask}
        applicant={applicant}
        onCancel={handleEmailCancel}
        onSuccess={handleEmailSuccess}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">タスク一覧 ({tasks.length}件)</h4>
        <Button size="sm" variant="outline" onClick={() => setShowTaskForm(true)}>
          <Plus className="h-3 w-3 mr-1" />
          タスク追加
        </Button>
      </div>
      
      {showTaskForm && (
        <div className="mb-4">
          <TaskForm
            selectionHistoryId={selectionHistoryId}
            task={editingTask || undefined}
            onCancel={handleTaskFormCancel}
            onSuccess={handleTaskFormSuccess}
          />
        </div>
      )}
      
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          タスクがありません
        </p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const taskType = getTaskType(task);
            
            return (
            <div
              key={task.id}
              className="flex items-start space-x-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                checked={task.status === '完了'}
                onCheckedChange={() => handleStatusToggle(task)}
                className="mt-0.5"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(task.status)}
                      <h5 className={`text-sm font-medium ${
                        task.status === '完了' ? 'line-through text-muted-foreground' : ''
                      }`}>
                        {task.title}
                      </h5>
                      <TaskStatusBadge status={task.status} />
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          task.priority === '高' ? 'border-red-300 text-red-700' :
                          task.priority === '中' ? 'border-yellow-300 text-yellow-700' :
                          'border-gray-300 text-gray-700'
                        }`}
                      >
                        {task.priority}
                      </Badge>
                      {taskType === 'email' && (
                        <Badge variant="outline" className="text-xs">
                          <Mail className="h-3 w-3 mr-1" />
                          メール
                        </Badge>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {task.assignee && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{task.assignee}</span>
                        </div>
                      )}
                      
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>期限: {formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      
                      {task.completedAt && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>完了: {formatDate(task.completedAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      {taskType === 'email' && task.status !== '完了' && (
                        <Button
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEmailTask(task)}
                          className="h-6 px-2 text-xs"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          メール作成
                        </Button>
                      )}
                      {taskType === 'email' && task.status === '完了' && (
                        <Badge variant="default" className="text-xs">
                          <Mail className="h-3 w-3 mr-1" />
                          送信済み
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTask(task)}
                        className="h-6 px-2 text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        編集
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTask(task)}
                        className="h-6 px-2 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        削除
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}