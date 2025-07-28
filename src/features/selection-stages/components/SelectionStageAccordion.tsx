import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Plus, Calendar, User, Edit, Mail } from 'lucide-react';
import { SelectionHistory, Evaluation } from '@/features/applicants/types/applicant';
import { Applicant } from '@/features/applicants/types/applicant';
import { formatDateTime } from '@/shared/utils/date';
import { StageDisplayFactory } from './StageDisplayFactory';
import { useTaskManagement } from '@/features/tasks/hooks/useTaskManagement';
import { TaskStatus, ContactStatus, CONTACT_STATUSES } from '@/features/tasks/types/task';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export type StageType = 
  | 'エントリー'
  | '書類選考'
  | '会社説明会'
  | '適性検査'
  | '職場見学'
  | '職務体験'
  | '個別面接'
  | '集団面接'
  | '最終選考'
  | '内定'
  | '不採用';

interface SelectionStageAccordionProps {
  applicant: Applicant;
  history: SelectionHistory[];
  evaluations: Evaluation[];
  stageDetails?: Record<string, Record<string, unknown>>;
}

export function SelectionStageAccordion({ 
  applicant, 
  history, 
  evaluations,
  stageDetails = {}
}: SelectionStageAccordionProps) {
  const { 
    getApplicantTasks, 
    getApplicantTasksByStage,
    getDaysUntilDue, 
    getDueStatus, 
    updateTaskStatus, 
    setTaskDueDate, 
    assignTask 
  } = useTaskManagement();

  const [editingTask, setEditingTask] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');

  const getTaskStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case '進行中':
        return <Clock className="h-3 w-3 text-yellow-600" />;
      case '未着手':
        return <Clock className="h-3 w-3 text-gray-400" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getTaskStatusColor = (status: TaskStatus) => {
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

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '完了':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '進行中':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case '不採用':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };



  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>選考履歴</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            次の段階に進める
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-gray-600 text-center py-8">選考履歴がありません。</p>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {history.map((item) => {
              const currentStageData = stageDetails[item.id];
              const stageTasks = getApplicantTasksByStage(applicant, item.stage);
              
              return (
                <AccordionItem 
                  key={item.id} 
                  value={item.id} 
                  className={`border rounded-lg ${
                    item.status === '進行中' 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800' 
                      : item.status === '完了'
                      ? 'bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-700'
                      : item.status === '不採用'
                      ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div className="text-left">
                          <h3 className="font-medium">{item.stage}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(item.startDate)}
                            {item.endDate && ` 〜 ${formatDateTime(item.endDate)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-gray-100 text-gray-800">
                          {item.status}
                        </Badge>

                        {currentStageData && Object.keys(currentStageData).length > 0 && (
                          <Badge className="bg-gray-100 text-green-600">
                            データ入力済み
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-6">
                      {/* 1. 段階詳細情報 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">段階詳細情報</h4>
                        
                        {/* 選考段階固有の表示 */}
                        <StageDisplayFactory 
                          stageType={item.stage as StageType}
                          data={currentStageData}
                          applicantId={applicant.id}
                          applicantName={applicant.name}
                          applicantEmail={applicant.email}
                        />
                      </div>

                      {/* 2. タスク一覧 */}
                      {stageTasks.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">タスク</h4>
                          <div className="space-y-2">
                            {stageTasks.map((task) => {
                              const daysUntilDue = task.dueDate ? getDaysUntilDue(task.dueDate) : undefined;
                              const dueStatus = task.dueDate ? getDueStatus(task.dueDate, task.status) : undefined;

                              return (
                                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                  <div className="flex items-center space-x-3">
                                    {isContactTask(task.type) ? (
                                      <Clock className="h-3 w-3 text-gray-400" />
                                    ) : (
                                      getTaskStatusIcon(task.status)
                                    )}
                                    <div>
                                      <h5 className="text-sm font-medium">{task.title}</h5>
                                      <p className="text-xs text-gray-600">{task.description}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4">
                                    {/* ステータス管理 */}
                                    <div className="flex items-center space-x-2">
                                      {isContactTask(task.type) ? (
                                        <Select
                                          value={task.contactStatus || '未'}
                                          onValueChange={(value: ContactStatus) => handleContactStatusChange(task.id, value)}
                                        >
                                          <SelectTrigger className="w-20 h-8">
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
                                      ) : (
                                        <Select
                                          value={task.status}
                                          onValueChange={(value: TaskStatus) => handleStatusChange(task.id, value)}
                                        >
                                          <SelectTrigger className="w-24 h-8">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="未着手">未着手</SelectItem>
                                            <SelectItem value="進行中">進行中</SelectItem>
                                            <SelectItem value="完了">完了</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      )}
                                    </div>

                                    {/* バッジ表示 */}
                                    <div className="flex items-center space-x-2">
                                      {isContactTask(task.type) ? (
                                        <Badge className="text-xs bg-purple-100 text-purple-800">
                                          {task.contactStatus || '未'}
                                        </Badge>
                                      ) : (
                                        <Badge className={`text-xs ${getTaskStatusColor(task.status)}`}>
                                          {task.status}
                                        </Badge>
                                      )}
                                    </div>

                                    {/* 期限・担当者情報 */}
                                    <div className="flex items-center space-x-2">
                                      {task.dueDate && (
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="h-3 w-3 text-gray-400" />
                                          <span className="text-xs text-gray-600">
                                            {formatDateTime(task.dueDate)}
                                          </span>
                                          {dueStatus && dueStatus !== 'normal' && (
                                            <Badge className={`text-xs ${
                                              dueStatus === 'overdue' 
                                                ? 'bg-red-100 text-red-800'
                                                : dueStatus === 'urgent'
                                                ? 'bg-orange-100 text-orange-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                              {dueStatus === 'overdue' 
                                                ? `期限切れ (${Math.abs(daysUntilDue!)}日前)`
                                                : `あと${daysUntilDue}日`
                                              }
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                      {task.assignedTo && (
                                        <div className="flex items-center space-x-1">
                                          <User className="h-3 w-3 text-gray-400" />
                                          <span className="text-xs text-gray-600">{task.assignedTo}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* アクションボタン */}
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditTask(task)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      {task.type === '詳細連絡' && (
                                        <Button size="sm">
                                          <Mail className="h-3 w-3 mr-1" />
                                          メール送信
                                        </Button>
                                      )}
                                      {task.type === '結果連絡' && (
                                        <Button size="sm">
                                          <Mail className="h-3 w-3 mr-1" />
                                          結果連絡
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 3. 備考 */}
                      {item.notes && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">備考</h4>
                          <p className="text-sm text-gray-600">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        {/* タスク編集ダイアログ */}
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