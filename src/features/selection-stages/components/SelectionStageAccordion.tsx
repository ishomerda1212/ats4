import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Clock, 
  Plus, 
  Edit, 
  ClipboardList,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Save,
  Monitor,
  Users as UsersIcon
} from 'lucide-react';
import { useTaskManagement } from '@/features/tasks/hooks/useTaskManagement';
import { useEvents } from '@/features/events/hooks/useEvents';
import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';
import { TaskInstance, TaskStatus } from '@/features/tasks/types/task';
import { formatDateTime, formatDate } from '@/shared/utils/date';
import { STAGE_RESULT_OPTIONS, SESSION_TYPE_OPTIONS, STAGES_WITH_SESSION } from '@/shared/utils/constants';

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
    setTaskDueDate, 
    assignTask 
  } = useTaskManagement();

  const { events, eventSessions } = useEvents();
  
  // デバッグ情報をコンソールに出力
  console.log('SelectionStageAccordion - Available events:', events);

  // 選考段階とイベントの対応関係
  const stageEventMapping: Record<string, string> = {
    'エントリー': 'event-entry',
    '書類選考': 'event-document-screening',
    '会社説明会': 'event-company-info',
    '適性検査体験': 'event-aptitude-test',
    '職場見学': 'event-workplace-tour',
    '仕事体験': 'event-job-experience',
    '人事面接': 'event-individual-interview',
    '集団面接': 'event-group-interview',
    'CEOセミナー': 'event-ceo-seminar',
    '最終選考': 'event-final-selection',
    '内定面談': 'event-offer'
  };

  // 選考段階に対応するイベントとセッションを取得する関数
  const getStageSessionInfo = (stage: string) => {
    const eventId = stageEventMapping[stage];
    if (!eventId) return null;

    const event = events.find(e => e.id === eventId);
    if (!event) return null;

    // 該当するセッションを取得
    const sessions = eventSessions.filter(session => session.eventId === eventId);
    if (sessions.length === 0) return null;

    // 最新のセッションを返す（実際の実装では、応募者の参加予定セッションを特定する必要がある）
    return {
      event,
      session: sessions[0]
    };
  };

  // 選考段階に対応するイベントのセッション一覧を取得する関数
  const getAvailableSessionsForStage = (stage: string) => {
    const eventId = stageEventMapping[stage];
    if (!eventId) return [];

    const event = events.find(e => e.id === eventId);
    if (!event) return [];

    // 該当するセッションを取得
    return eventSessions.filter(session => session.eventId === eventId);
  };

  const [editingTask, setEditingTask] = useState<TaskInstance | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('未着手');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isNextStageDialogOpen, setIsNextStageDialogOpen] = useState(false);

  // セッション情報登録用の状態
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<string>('');
  const [sessionFormData, setSessionFormData] = useState({
    selectedSessionId: '',
    sessionType: '',
    result: ''
  });

  // 書類選考の合否変更用の状態
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [resultFormData, setResultFormData] = useState({
    result: '',
    resultDate: '',
    evaluator: '',
    comments: '',
    notes: ''
  });

  // 選考段階の順序を定義
  const stageOrder = [
    'エントリー',
    '書類選考', 
    '会社説明会',
    '適性検査体験',
    '職場見学',
    '仕事体験',
    '人事面接',
    '集団面接',
    'CEOセミナー',
    '最終選考',
    '内定面談'
  ];

  const getNextStage = (currentStage: string) => {
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
      return null;
    }
    return stageOrder[currentIndex + 1];
  };

  const openNextStageDialog = () => {
    setIsNextStageDialogOpen(true);
  };

  const advanceToSelectedStage = (selectedStage: string) => {
    // ここで選考段階を進める処理を実装
    console.log('Advancing to stage:', selectedStage);
    setIsNextStageDialogOpen(false);
  };

  const getTaskStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case '返信待ち':
        return <Clock className="h-3 w-3 text-yellow-600" />;
      case '提出待ち':
        return <Clock className="h-3 w-3 text-orange-600" />;
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
      case '返信待ち':
        return 'bg-yellow-100 text-yellow-800';
      case '提出待ち':
        return 'bg-orange-100 text-orange-800';
      case '未着手':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditTask = (task: TaskInstance) => {
    setEditingTask(task);
    setTaskStatus(task.status);
    setDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    setNotes(task.notes || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!editingTask) return;

    // タスクステータスの更新処理（実装予定）
    console.log('Task status updated:', taskStatus);
    
    if (dueDate) {
      setTaskDueDate(editingTask.id, new Date(dueDate));
    }
    if (notes) {
      // メモの更新処理（実装予定）
      console.log('Notes updated:', notes);
    }

    setIsEditDialogOpen(false);
    setEditingTask(null);
    setTaskStatus('未着手');
    setDueDate('');
    setNotes('');
  };

  // セッション情報登録ボタンのクリックハンドラー
  const handleOpenSessionDialog = (stage: string) => {
    setEditingStage(stage);
    setIsSessionDialogOpen(true);
  };

  // セッション情報保存ハンドラー
  const handleSaveSession = () => {
    // ここでセッション情報を保存する処理を実装
    console.log('Saving session data for stage:', editingStage, sessionFormData);
    
    // フォームをリセット
    setSessionFormData({
      selectedSessionId: '',
      sessionType: '',
      result: ''
    });
    setIsSessionDialogOpen(false);
    setEditingStage('');
  };

  // セッション情報フォームの更新ハンドラー
  const handleSessionFormChange = (field: string, value: string) => {
    setSessionFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // セッション選択時の処理
  const handleSessionSelection = (sessionId: string) => {
    setSessionFormData(prev => ({
      ...prev,
      selectedSessionId: sessionId
    }));
  };

  // 書類選考の合否変更ハンドラー
  const handleOpenResultDialog = (stageId: string, stageData?: any) => {
    setSelectedStageId(stageId);
    if (stageData) {
      setResultFormData({
        result: stageData.result || '',
        resultDate: stageData.resultDate || '',
        evaluator: stageData.evaluator || '',
        comments: stageData.comments || '',
        notes: stageData.notes || ''
      });
    } else {
      setResultFormData({
        result: '',
        resultDate: '',
        evaluator: '',
        comments: '',
        notes: ''
      });
    }
    setIsResultDialogOpen(true);
  };

  const handleSaveResult = () => {
    // 合否結果の保存処理（実装予定）
    console.log('Result saved:', resultFormData);
    setIsResultDialogOpen(false);
    setSelectedStageId('');
  };

  const handleResultFormChange = (field: string, value: string) => {
    setResultFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
              const sessionInfo = getStageSessionInfo(item.stage);
              
              return (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="text-left">
                        <h3 className="font-medium">{item.stage}</h3>
                        <p className="text-sm text-muted-foreground">
                          {(() => {
                            if (sessionInfo) {
                              return formatDateTime(sessionInfo.session.start);
                            }
                            return item.startDate ? formatDateTime(item.startDate) : '未設定';
                          })()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTaskStatusColor(item.status as TaskStatus)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {/* セッション情報 */}
                      {sessionInfo ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              セッション情報
                            </h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenSessionDialog(item.stage)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              編集
                            </Button>
                          </div>
                          <div className="p-3 border rounded-lg bg-gray-50">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-sm">{sessionInfo.session.name}</h5>
                                <Badge className="text-xs">
                                  {sessionInfo.session.format}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {formatDateTime(sessionInfo.session.start)} ~ {formatDateTime(sessionInfo.session.end)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{sessionInfo.session.venue}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <UsersIcon className="h-3 w-3" />
                                  <span>対面</span>
                                </div>
                                {sessionInfo.session.maxParticipants && (
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>
                                      {sessionInfo.session.currentParticipants || 0}/{sessionInfo.session.maxParticipants}名
                                    </span>
                                  </div>
                                )}
                              </div>
                              {sessionInfo.session.recruiter && (
                                <div className="text-xs text-muted-foreground">
                                  担当者: {sessionInfo.session.recruiter}
                                </div>
                              )}
                              {sessionInfo.session.notes && (
                                <div className="text-xs text-muted-foreground">
                                  備考: {sessionInfo.session.notes}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* 合否表示 */}
                          <div className="mt-3 p-3 border rounded-lg bg-blue-50">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-sm text-blue-800">合否結果</h5>
                              <Badge className="text-xs bg-blue-100 text-blue-800">
                                未設定
                              </Badge>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                              合否結果が設定されていません
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              セッション情報
                            </h4>
                            {STAGES_WITH_SESSION.includes(item.stage as any) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenSessionDialog(item.stage)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                セッション情報登録
                              </Button>
                            )}
                          </div>
                          {STAGES_WITH_SESSION.includes(item.stage as any) && (
                            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">セッション情報が登録されていません</p>
                              <p className="text-xs text-gray-400 mt-1">
                                セッション情報を登録して詳細を管理できます
                              </p>
                            </div>
                          )}



                          {/* 書類選考の合否変更機能 */}
                          {item.stage === '書類選考' && (
                            <div className="mt-4 p-4 border rounded-lg bg-purple-50">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-purple-900 flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  書類選考結果
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenResultDialog(item.id, stageDetails[item.id])}
                                  className="border-purple-200 text-purple-700 hover:bg-purple-100"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  合否変更
                                </Button>
                              </div>
                              <div className="text-sm text-purple-800">
                                {stageDetails[item.id] && (stageDetails[item.id] as any).result ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">結果:</span>
                                      <Badge className={
                                        (stageDetails[item.id] as any).result === '合格' ? 'bg-green-100 text-green-800' :
                                        (stageDetails[item.id] as any).result === '不合格' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                      }>
                                        {(stageDetails[item.id] as any).result}
                                      </Badge>
                                    </div>
                                    {(stageDetails[item.id] as any).resultDate && (
                                      <div>
                                        <span className="font-medium">確定日:</span>
                                        <span className="ml-2">{(stageDetails[item.id] as any).resultDate}</span>
                                      </div>
                                    )}
                                    {(stageDetails[item.id] as any).evaluator && (
                                      <div>
                                        <span className="font-medium">評価者:</span>
                                        <span className="ml-2">{(stageDetails[item.id] as any).evaluator}</span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-purple-600">合否結果が設定されていません</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* タスク一覧 */}
                      {stageTasks.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium flex items-center">
                            <ClipboardList className="h-4 w-4 mr-2" />
                            タスク
                          </h4>
                          {stageTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                {getTaskStatusIcon(task.status)}
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm">{task.title}</h5>
                                  <p className="text-xs text-muted-foreground">{task.description}</p>
                                  {task.dueDate && (
                                    <p className="text-xs text-muted-foreground">
                                      期限: {formatDate(task.dueDate)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getTaskStatusColor(task.status)}>
                                  {task.status}
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditTask(task)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 段階詳細表示 */}
                      {/* 一時的に無効化 - 型エラーのため */}
                      {/* {stageDetails[item.id] && (
                        <div>
                          {React.createElement(StageDisplayFactory, {
                            stageType: item.stage as StageType,
                            data: stageDetails[item.id] as Record<string, unknown>,
                            applicantId: applicant.id,
                            applicantName: applicant.name,
                            applicantEmail: applicant.email
                          })}
                        </div>
                      )} */}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        {/* タスク編集ダイアログ */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent aria-describedby="task-dialog-description">
            <DialogHeader>
              <DialogTitle>タスク編集</DialogTitle>
            </DialogHeader>
            <div id="task-dialog-description" className="sr-only">
              タスクの詳細情報を編集するダイアログです。ステータス、期限、メモを設定できます。
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="taskStatus">タスクステータス</Label>
                <Select 
                  value={taskStatus} 
                  onValueChange={(value: TaskStatus) => setTaskStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="未着手">
                      <div className="flex items-center space-x-2">
                        {getTaskStatusIcon('未着手')}
                        <span>未着手</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="返信待ち">
                      <div className="flex items-center space-x-2">
                        {getTaskStatusIcon('返信待ち')}
                        <span>返信待ち</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="提出待ち">
                      <div className="flex items-center space-x-2">
                        {getTaskStatusIcon('提出待ち')}
                        <span>提出待ち</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="完了">
                      <div className="flex items-center space-x-2">
                        {getTaskStatusIcon('完了')}
                        <span>完了</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* セッション情報登録・編集ダイアログ */}
        <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
          <DialogContent className="max-w-md" aria-describedby="session-dialog-description">
            <DialogHeader>
              <DialogTitle>
                {editingStage} - セッション情報登録
              </DialogTitle>
            </DialogHeader>
            <div id="session-dialog-description" className="sr-only">
              {editingStage}のセッション情報を登録するダイアログです。セッションを選択し、合否を設定してください。
            </div>
            <div className="space-y-4">
              {/* セッション選択 */}
              <div>
                <Label htmlFor="sessionSelect">セッション選択</Label>
                <Select 
                  value={sessionFormData.selectedSessionId} 
                  onValueChange={handleSessionSelection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="セッションを選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const availableSessions = getAvailableSessionsForStage(editingStage);
                      if (availableSessions.length === 0) {
                        return (
                          <SelectItem value="no-sessions" disabled>
                            利用可能なセッションがありません
                          </SelectItem>
                        );
                      }
                      return availableSessions.map(session => (
                        <SelectItem key={session.id} value={session.id}>
                          {session.name} - {formatDateTime(session.start)}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  イベント管理で登録されているセッションから選択してください
                </p>
              </div>

              {/* 対面/オンライン選択 */}
              <div>
                <Label htmlFor="sessionTypeSelect">実施形式</Label>
                <Select 
                  value={sessionFormData.sessionType} 
                  onValueChange={(value) => handleSessionFormChange('sessionType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="実施形式を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_TYPE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        <div className="flex items-center space-x-2">
                          {option === '対面' && <UsersIcon className="h-4 w-4" />}
                          {option === 'オンライン' && <Monitor className="h-4 w-4" />}
                          <span>{option}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  セッションの実施形式を選択してください
                </p>
              </div>

              {/* 合否選択 */}
              <div>
                <Label htmlFor="resultSelect">合否</Label>
                <Select 
                  value={sessionFormData.result} 
                  onValueChange={(value) => handleSessionFormChange('result', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="合否を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const resultOptions = STAGE_RESULT_OPTIONS[editingStage as keyof typeof STAGE_RESULT_OPTIONS] || [];
                      return resultOptions.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {editingStage}の結果を選択してください
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleSaveSession}>
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 書類選考合否変更ダイアログ */}
        <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
          <DialogContent aria-describedby="result-dialog-description">
            <DialogHeader>
              <DialogTitle>書類選考結果変更</DialogTitle>
            </DialogHeader>
            <div id="result-dialog-description" className="sr-only">
              書類選考の合否結果を変更するダイアログです。結果、確定日、評価者、コメントを設定できます。
            </div>
            <div className="space-y-4">
              {/* 合否選択 */}
              <div>
                <Label htmlFor="resultSelect">合否結果</Label>
                <Select 
                  value={resultFormData.result} 
                  onValueChange={(value) => handleResultFormChange('result', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="合否を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGE_RESULT_OPTIONS['書類選考'].map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 結果確定日 */}
              <div>
                <Label htmlFor="resultDate">結果確定日</Label>
                <Input
                  id="resultDate"
                  type="date"
                  value={resultFormData.resultDate}
                  onChange={(e) => handleResultFormChange('resultDate', e.target.value)}
                />
              </div>

              {/* 評価者 */}
              <div>
                <Label htmlFor="evaluator">評価者</Label>
                <Input
                  id="evaluator"
                  placeholder="評価者名を入力してください"
                  value={resultFormData.evaluator}
                  onChange={(e) => handleResultFormChange('evaluator', e.target.value)}
                />
              </div>

              {/* 評価コメント */}
              <div>
                <Label htmlFor="comments">評価コメント</Label>
                <Textarea
                  id="comments"
                  placeholder="評価コメントを入力してください"
                  value={resultFormData.comments}
                  onChange={(e) => handleResultFormChange('comments', e.target.value)}
                  rows={3}
                />
              </div>

              {/* 備考 */}
              <div>
                <Label htmlFor="notes">備考</Label>
                <Textarea
                  id="notes"
                  placeholder="備考を入力してください"
                  value={resultFormData.notes}
                  onChange={(e) => handleResultFormChange('notes', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsResultDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleSaveResult}>
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 次の段階選択ダイアログ */}
        <Dialog open={isNextStageDialogOpen} onOpenChange={setIsNextStageDialogOpen}>
          <DialogContent aria-describedby="next-stage-dialog-description">
            <DialogHeader>
              <DialogTitle>次の段階を選択</DialogTitle>
            </DialogHeader>
            <div id="next-stage-dialog-description" className="sr-only">
              応募者を次の選考段階に進めるためのダイアログです。進める段階を選択してください。
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                応募者を次の段階に進めます。どの段階に進めますか？
              </p>
              <div className="space-y-2">
                {(() => {
                  const nextStage = getNextStage(applicant.currentStage);
                  if (!nextStage) return null;
                  
                  return (
                    <Button
                      key={nextStage}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => advanceToSelectedStage(nextStage)}
                    >
                      {nextStage}
                    </Button>
                  );
                })()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}