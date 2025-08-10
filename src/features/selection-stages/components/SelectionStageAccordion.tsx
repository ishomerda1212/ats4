import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Clock, 
  CheckCircle, 
  Calendar,
  Edit,
  User,
  XCircle,
  ChevronDown,
  Mail,
  ExternalLink,
  FileText,
  CalendarCheck,
  Plus,
  ClipboardList
} from 'lucide-react';
import { useTaskManagement } from '@/features/tasks/hooks/useTaskManagement';
import { useEvents } from '@/features/events/hooks/useEvents';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';
import { TaskStatus, ContactStatus, CONTACT_STATUSES, TaskInstance } from '@/features/tasks/types/task';
import { ApplicantEventResponse } from '@/features/applicant-form/types/applicantForm';
import { EventParticipant, ParticipationStatus } from '@/features/events/types/event';
import { mockApplicantResponses } from '@/shared/data/mockApplicantResponseData';
import { mockEventParticipants } from '@/shared/data/mockEventData';
import { formatDateTime, formatDate } from '@/shared/utils/date';
import { Link } from 'react-router-dom';

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
  stageDetails?: Record<string, unknown>;
}

export function SelectionStageAccordion({ 
  applicant, 
  history, 
  stageDetails = {}
}: SelectionStageAccordionProps) {
  
  // デバッグ情報をコンソールに出力
  console.log('SelectionStageAccordion - Component rendered with:', {
    applicant,
    history,
    stageDetails
  });
  
  const { 
    getApplicantTasksByStage,
    getDaysUntilDue, 
    getDueStatus, 
    updateTaskStatus, 
    setTaskDueDate, 
    assignTask 
  } = useTaskManagement();

  const { events, getEventSessions } = useEvents();
  const [applicantResponses] = useLocalStorage<ApplicantEventResponse[]>('applicantResponses', mockApplicantResponses);
  const [eventParticipants, setEventParticipants] = useLocalStorage<EventParticipant[]>('eventParticipants', mockEventParticipants);
  
  // デバッグ情報をコンソールに出力
  console.log('SelectionStageAccordion - Available events:', events);

  const [editingTask, setEditingTask] = useState<TaskInstance | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');
  const [isNextStageDialogOpen, setIsNextStageDialogOpen] = useState(false);

  // 選考段階の順序を定義
  const stageOrder = [
    'エントリー',
    '書類選考', 
    '会社説明会',
    '適性検査',
    '職場見学',
    '仕事体験',
    '個別面接',
    '集団面接',
    'CEOセミナー',
    '人事面接',
    '最終選考',
    '内定',
    '不採用'
  ];

  // 次の選考段階を取得する関数
  const getNextStage = (currentStage: string) => {
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
      return null; // 最後の段階または段階が見つからない場合
    }
    return stageOrder[currentIndex + 1];
  };

  // 次の段階選択ダイアログを開く関数
  const openNextStageDialog = () => {
    setIsNextStageDialogOpen(true);
  };

  // 選択した段階に進む関数
  const advanceToSelectedStage = (selectedStage: string) => {
    console.log('advanceToSelectedStage called with:', selectedStage);
    console.log('Current stage:', applicant.currentStage);
    
    // ここで応募者の現在の段階を更新する処理を実装
    console.log('選択した段階に進む:', { 
      currentStage: applicant.currentStage, 
      selectedStage: selectedStage 
    });
    
    // TODO: 応募者の段階更新APIを呼び出す
    alert(`${selectedStage}段階に進めました。`);
    setIsNextStageDialogOpen(false);
  };

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

  const handleEditTask = (task: TaskInstance) => {
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

  // 応募者の日程調整フォーム回答を取得する関数
  const getApplicantResponse = (stage: string) => {
    const matchingEvent = events.find(event => event.stage === stage);
    if (!matchingEvent) return null;
    
    return applicantResponses.find(response => 
      response.applicantId === applicant.id && response.eventId === matchingEvent.id
    );
  };

  // 応募者の参加予定日（確定日）を取得する関数
  const getApplicantScheduledSessions = (stage: string) => {
    const matchingEvent = events.find(event => event.stage === stage);
    if (!matchingEvent) {
      console.log('No matching event found for stage:', stage);
      return [];
    }
    
    // 該当イベントのセッションを取得
    const eventSessions = getEventSessions(matchingEvent.id);
    console.log('Event sessions for stage:', stage, eventSessions);
    
    // 応募者が確定した参加予定のセッションを取得
    const scheduledSessions = eventParticipants.filter(participant => 
      participant.applicantId === applicant.id && 
      participant.status === '参加' &&
      eventSessions.some(session => session.id === participant.eventId)
    );
    
    console.log('Scheduled sessions for applicant:', applicant.id, 'stage:', stage, scheduledSessions);
    return scheduledSessions;
  };

  // 回答ステータスのバッジを取得
  const getResponseStatusBadge = (status: 'participate' | 'not_participate' | 'pending') => {
    switch (status) {
      case 'participate':
        return <Badge className="bg-green-100 text-green-800">参加</Badge>;
      case 'not_participate':
        return <Badge className="bg-red-100 text-red-800">不参加</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">未回答</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">不明</Badge>;
    }
  };

  // フォーム回答から参加予定日を確定する関数
  const confirmScheduledSessions = (stage: string) => {
    const response = getApplicantResponse(stage);
    if (!response) return;

    const newParticipants: EventParticipant[] = [];

    response.sessionResponses.forEach(sessionResponse => {
      if (sessionResponse.status === 'participate') {
        // 既存の参加情報を削除
        const existingIndex = eventParticipants.findIndex(
          p => p.applicantId === applicant.id && p.eventId === sessionResponse.sessionId
        );
        
        if (existingIndex >= 0) {
          eventParticipants.splice(existingIndex, 1);
        }

        // 新しい参加情報を追加
        const newParticipant: EventParticipant = {
          id: `participant-${Date.now()}-${Math.random()}`,
          eventId: sessionResponse.sessionId,
          applicantId: applicant.id,
          status: '参加',
          joinedAt: new Date(),
          updatedAt: new Date(),
          createdAt: new Date()
        };
        newParticipants.push(newParticipant);
      }
    });

    // 参加予定日を更新
    setEventParticipants([...eventParticipants, ...newParticipants]);
  };

  // 特定のセッションを確定する関数
  const confirmSpecificSession = (sessionId: string, stage: string) => {
    console.log('confirmSpecificSession called:', { sessionId, stage });
    
    const response = getApplicantResponse(stage);
    if (!response) {
      console.log('No response found for stage:', stage);
      return;
    }

    const sessionResponse = response.sessionResponses.find(sr => sr.sessionId === sessionId);
    if (!sessionResponse || sessionResponse.status !== 'participate') {
      console.log('Session response not found or not participate:', sessionResponse);
      return;
    }

    console.log('Creating participant for session:', sessionId);

    // 既存の参加情報を削除
    const existingIndex = eventParticipants.findIndex(
      p => p.applicantId === applicant.id && p.eventId === sessionId
    );
    
    if (existingIndex >= 0) {
      eventParticipants.splice(existingIndex, 1);
    }

    // 新しい参加情報を追加
    const newParticipant: EventParticipant = {
      id: `participant-${Date.now()}-${Math.random()}`,
      eventId: sessionId,
      applicantId: applicant.id,
      status: '参加',
      joinedAt: new Date(),
      updatedAt: new Date(),
      createdAt: new Date()
    };

    console.log('New participant created:', newParticipant);

    // 参加予定日を更新
    setEventParticipants([...eventParticipants, newParticipant]);
    console.log('Event participants updated');
  };

  // 参加予定日のステータスを変更する関数
  const updateScheduledStatus = (participantId: string, newStatus: string) => {
    setEventParticipants(prev => prev.map(participant => 
      participant.id === participantId 
        ? { ...participant, status: newStatus as ParticipationStatus, updatedAt: new Date() }
        : participant
    ));
  };

  // 参加予定日を削除する関数
  const removeScheduledSession = (participantId: string) => {
    setEventParticipants(prev => prev.filter(participant => participant.id !== participantId));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>選考履歴</span>
          </CardTitle>
          {getNextStage(applicant.currentStage) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={openNextStageDialog}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              次の段階に進める
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            選考履歴がありません
          </p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {history.map((item) => {
              const stageTasks = getApplicantTasksByStage(applicant, item.stage);
              const response = getApplicantResponse(item.stage);
              const scheduledSessions = getApplicantScheduledSessions(item.stage);
              
              return (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div className="text-left">
                          <h3 className="font-medium">{item.stage}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.startDate ? formatDateTime(item.startDate) : '未設定'} ~ {item.endDate ? formatDateTime(item.endDate) : '未設定'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTaskStatusColor(item.status as TaskStatus)}>
                          {item.status}
                        </Badge>
                        {response && (
                          <Badge className="bg-orange-100 text-orange-800">
                            フォーム回答済み
                          </Badge>
                        )}
                        {scheduledSessions.length > 0 && (
                          <Badge className="bg-blue-100 text-blue-800">
                            参加確定済み
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {/* 評定表作成ボタン */}
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <ClipboardList className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">評定表</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const url = `/applicants/${applicant.id}/evaluation?historyId=${item.id}`;
                            window.location.hash = url;
                          }}
                          className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                        >
                          <ClipboardList className="h-3 w-3 mr-1" />
                          評定表作成
                        </Button>
                      </div>

                      {/* 日程調整フォームの回答 */}
                      {response && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              日程調整フォーム回答
                            </h4>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => confirmScheduledSessions(item.stage)}
                                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                参加希望日を確定日にする
                              </Button>
                              <Link to={`/applicant-response/${applicant.id}/${response.eventId}`}>
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  詳細を表示
                                </Button>
                              </Link>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {response.sessionResponses.map((sessionResponse) => (
                              <div key={sessionResponse.sessionId} className="flex items-center justify-between p-2 border rounded bg-orange-50">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3 text-orange-600" />
                                  <span className="text-sm">セッション: {sessionResponse.sessionId}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getResponseStatusBadge(sessionResponse.status)}
                                  {sessionResponse.status === 'participate' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        console.log('Button clicked for session:', sessionResponse.sessionId);
                                        confirmSpecificSession(sessionResponse.sessionId, item.stage);
                                      }}
                                      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 text-xs"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      この日を確定
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            回答日時: {response.submittedAt ? formatDate(response.submittedAt) : '不明'}
                          </div>
                        </div>
                      )}

                      {/* 参加予定日（確定日） */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium flex items-center">
                            <CalendarCheck className="h-4 w-4 mr-2" />
                            参加予定日（確定日）
                          </h4>
                          {response && scheduledSessions.length === 0 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => confirmScheduledSessions(item.stage)}
                              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                            >
                              <CalendarCheck className="h-3 w-3 mr-1" />
                              参加希望日から確定日を作成
                            </Button>
                          )}
                        </div>
                        
                        {scheduledSessions.length > 0 ? (
                          <div className="space-y-2">
                            {scheduledSessions.map((participant) => (
                              <div key={participant.id} className="flex items-center justify-between p-2 border rounded bg-blue-50">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3 text-blue-600" />
                                  <span className="text-sm">セッション: {participant.eventId}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Select
                                    value={participant.status}
                                    onValueChange={(value: string) => updateScheduledStatus(participant.id, value)}
                                  >
                                    <SelectTrigger className="w-16 h-6 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="参加">参加</SelectItem>
                                      <SelectItem value="申込">申込</SelectItem>
                                      <SelectItem value="未定">未定</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {participant.joinedAt && (
                                    <span className="text-xs text-muted-foreground">
                                      確定日: {formatDate(participant.joinedAt)}
                                    </span>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeScheduledSession(participant.id)}
                                    className="text-red-500 hover:bg-red-100"
                                  >
                                    <XCircle className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-sm text-muted-foreground">
                            確定した参加予定日はありません
                          </div>
                        )}
                      </div>

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
                                  
                                    <div className="flex items-center space-x-2">
                                    <Select
                                      value={task.status}
                                      onValueChange={(value: TaskStatus) => handleStatusChange(task.id, value)}
                                    >
                                      <SelectTrigger className="w-20 h-6 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="未着手">未着手</SelectItem>
                                        <SelectItem value="進行中">進行中</SelectItem>
                                        <SelectItem value="完了">完了</SelectItem>
                                      </SelectContent>
                                    </Select>

                                    {isContactTask(task.type) && (
                                        <Select
                                          value={task.contactStatus || '未'}
                                          onValueChange={(value: ContactStatus) => handleContactStatusChange(task.id, value)}
                                        >
                                        <SelectTrigger className="w-16 h-6 text-xs">
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
                                    )}

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

                                    <div className="flex items-center space-x-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditTask(task)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      
                                      {/* メール送信ボタン - 連絡系タスクのみ */}
                                      {isContactTask(task.type) && (
                                        <Button 
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            // メール送信ページに遷移
                                            window.location.hash = `/applicants/${applicant.id}/mail?stage=${item.stage}`;
                                          }}
                                        >
                                          <Mail className="h-3 w-3 mr-1" />
                                          メール送信
                                        </Button>
                                      )}
                                      
                                      {/* 日程調整フォームボタン - 日程調整連絡タスクのみ */}
                                      {task.type === '日程調整連絡' && (
                                        <Button 
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            // 該当する段階のイベントを探す
                                            const matchingEvent = events.find(event => 
                                              event.stage === item.stage
                                            );
                                            
                                            if (matchingEvent) {
                                              const url = `/applicant-form/${applicant.id}/${matchingEvent.id}`;
                                              window.location.hash = url;
                                            } else {
                                              // イベントが見つからない場合はサンプルモードで開く
                                              const url = `/applicant-form/sample/${item.stage}`;
                                              window.location.hash = url;
                                            }
                                          }}
                                        >
                                          <ExternalLink className="h-3 w-3 mr-1" />
                                          日程調整フォーム
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

        {/* 次の段階選択ダイアログ */}
        <Dialog open={isNextStageDialogOpen} onOpenChange={setIsNextStageDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>次の選考段階を選択</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                現在の段階: <span className="font-medium">{applicant.currentStage}</span>
              </p>
              <div className="space-y-2">
                {stageOrder.map((stage, index) => {
                  const currentIndex = stageOrder.indexOf(applicant.currentStage);
                  const isAvailable = index > currentIndex;
                  
                  return (
                    <Button
                      key={stage}
                      variant={isAvailable ? "outline" : "ghost"}
                      className={`w-full justify-start ${
                        isAvailable 
                          ? "hover:bg-blue-50 hover:border-blue-200" 
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => isAvailable && advanceToSelectedStage(stage)}
                      disabled={!isAvailable}
                    >
                      <div className="flex items-center space-x-2">
                        {isAvailable ? (
                          <Plus className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span>{stage}</span>
                        {!isAvailable && <span className="text-xs">(完了済み)</span>}
                      </div>
                    </Button>
                  );
                })}
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsNextStageDialogOpen(false)}>
                  キャンセル
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}