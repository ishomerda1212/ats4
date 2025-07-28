import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Edit,
  User
} from 'lucide-react';
import { useTaskManagement } from '../hooks/useTaskManagement';
import { Applicant } from '@/features/applicants/types/applicant';
import { TaskStatus, ContactStatus, CONTACT_STATUSES, TaskInstance } from '../types/task';
import { formatDate } from '@/shared/utils/date';

interface TaskSectionProps {
  applicant: Applicant;
}

export function TaskSection({ applicant }: TaskSectionProps) {
  const { 
    getApplicantTasks, 
    updateTaskStatus, 
    setTaskDueDate, 
    assignTask,
    getDaysUntilDue,
    getDueStatus
  } = useTaskManagement();
  
  const [editingTask, setEditingTask] = useState<TaskInstance | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');

  const tasks = getApplicantTasks(applicant);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '進行中':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case '未着手':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return 'bg-green-100 text-green-800';
      case '進行中':
        return 'bg-yellow-100 text-yellow-800';
      case '未着手':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueStatusColor = (dueStatus?: string) => {
    switch (dueStatus) {
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'urgent':
        return 'bg-orange-100 text-orange-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueStatusText = (dueStatus?: string, daysUntilDue?: number) => {
    if (!dueStatus || !daysUntilDue) return '';
    
    switch (dueStatus) {
      case 'overdue':
        return `期限切れ (${Math.abs(daysUntilDue)}日前)`;
      case 'urgent':
        return `緊急 (あと${daysUntilDue}日)`;
      case 'upcoming':
        return `期限間近 (あと${daysUntilDue}日)`;
      default:
        return '';
    }
  };

  const handleEditTask = (task: TaskInstance) => {
    setEditingTask(task);
    setDueDate(task.dueDate ? formatDate(task.dueDate, 'YYYY-MM-DD') : '');
    setAssignedTo(task.assignedTo || '');
    setNotes(task.notes || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!editingTask) return;

    if (dueDate) {
      setTaskDueDate(editingTask.id, new Date(dueDate));
    }
    
    if (assignedTo) {
      assignTask(editingTask.id, assignedTo);
    }

    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status);
  };

  const handleContactStatusChange = (taskId: string, contactStatus: ContactStatus) => {
    updateTaskStatus(taskId, '進行中', contactStatus);
  };

  const isContactTask = (taskType: string) => {
    return ['詳細連絡', '日程調整連絡', 'リマインド', '結果連絡'].includes(taskType);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>タスク管理</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              この段階にはタスクがありません
            </p>
          ) : (
            tasks.map((task) => {
              const daysUntilDue = task.dueDate ? getDaysUntilDue(task.dueDate) : undefined;
              const dueStatus = task.dueDate ? getDueStatus(task.dueDate, task.status) : undefined;

              return (
                <div key={task.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="text-sm font-medium">ステータス</label>
                      <Select
                        value={task.status}
                        onValueChange={(value: TaskStatus) => handleStatusChange(task.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="未着手">未着手</SelectItem>
                          <SelectItem value="進行中">進行中</SelectItem>
                          <SelectItem value="完了">完了</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {isContactTask(task.type) && (
                      <div>
                        <label className="text-sm font-medium">連絡状況</label>
                        <Select
                          value={task.contactStatus || '未'}
                          onValueChange={(value: ContactStatus) => handleContactStatusChange(task.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTACT_STATUSES.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      {task.contactStatus && (
                        <Badge className="bg-purple-100 text-purple-800">
                          {task.contactStatus}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      {task.dueDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(task.dueDate)}</span>
                          {dueStatus && dueStatus !== 'normal' && (
                            <Badge className={getDueStatusColor(dueStatus)}>
                              {getDueStatusText(dueStatus, daysUntilDue)}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {task.assignedTo && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{task.assignedTo}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-muted-foreground">
                      予想時間: {task.estimatedDuration}分
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 編集ダイアログ */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>タスク編集</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dueDate">期限</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="assignedTo">担当者</Label>
                <Input
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="担当者名を入力"
                />
              </div>
              <div>
                <Label htmlFor="notes">メモ</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="タスクに関するメモを入力"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleSaveTask}>
                  保存
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 