import { useState, useEffect, useCallback } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Plus } from 'lucide-react';
import { formatDateTime } from '@/shared/utils/date';
import { useStageAccordion } from './hooks/useStageAccordion';
import { useStageOperations } from './hooks/useStageOperations';
import { TaskManagementSection } from './components/TaskManagementSection';
import { SessionBookingForm } from './components/SessionBookingForm';
import { NextStageDialog } from './components/NextStageDialog';
import { SessionDialog } from './components/SessionDialog';
import { ResultDialog } from './components/ResultDialog';
import { TaskEditDialog } from './components/TaskEditDialog';
import { StageCard } from './components/StageCard';
import { StageResultForm } from './components/StageResultForm';
import { getStageSessionInfo } from './utils/stageHelpers';
import { FixedTask, TaskInstance, TaskStatus } from '@/features/tasks/types/task';
import { Event, EventSession } from '@/features/events/types/event';
import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';
import { supabase } from '@/lib/supabase';
import { useEvents } from '@/features/events/hooks/useEvents';
import { requiresSessionFromEvent } from '@/shared/utils/constants';
import { UnifiedParticipationDataAccess } from '@/lib/dataAccess/unifiedParticipationDataAccess';

// FixedTaskとTaskInstanceを組み合わせた型
type TaskWithFixedData = FixedTask & TaskInstance;

interface SelectionStageAccordionProps {
  applicant: Applicant;
  history: SelectionHistory[];
  stageDetails?: Record<string, unknown>;
  onRefresh?: () => void;
}

export function SelectionStageAccordion({ 
  applicant, 
  history, 
  stageDetails = {},
  onRefresh
}: SelectionStageAccordionProps) {
  const [stageTasksMap, setStageTasksMap] = useState<Record<string, TaskWithFixedData[]>>({});
  const [loading, setLoading] = useState(false);
  const [openAccordionItem, setOpenAccordionItem] = useState<string | undefined>(undefined);
  const [participationStatuses, setParticipationStatuses] = useState<Record<string, string>>({});

  // イベントデータを取得
  const { events, loading: eventsLoading, getParticipantsBySession } = useEvents();

  const {
    // タスク編集関連
    editingTask,
    isEditDialogOpen,
    taskStatus,
    dueDate,
    notes,
    setTaskStatus,
    setDueDate,
    setNotes,
    setIsEditDialogOpen,
    handleEditTask,
    handleSaveTask,

    // 次の段階選択関連
    isNextStageDialogOpen,
    setIsNextStageDialogOpen,
    openNextStageDialog,
    advanceToSelectedStage,

    // セッション情報関連
    isSessionDialogOpen,
    editingStage,
    sessionFormData,
    setIsSessionDialogOpen,
    handleOpenSessionDialog,
    handleSaveSession,
    handleSessionFormChange,
    handleSessionSelection,

    // 合否変更関連
    isResultDialogOpen,
    selectedStageId,
    resultFormData,
    setIsResultDialogOpen,
    handleOpenResultDialog,
    handleSaveResult,
    handleResultFormChange
  } = useStageAccordion(applicant, onRefresh);

  const {
    getStageSessionInfoForStage,
    getAvailableSessionsForStageWithData,
    getApplicantTasksForStage,
    setTaskDueDate,
    updateTaskStatus,
    createNewSession
  } = useStageOperations();

  // 段階名からイベントを取得する関数
  const getEventByStageName = useCallback((stageName: string): Event | undefined => {
    return events.find(event => event.name === stageName);
  }, [events]);

  // 応募者の参加状況を取得する関数
  const getApplicantParticipationStatus = useCallback(async (applicantId: string, stageName: string): Promise<string> => {
    try {
      // console.log('🔍 getApplicantParticipationStatus called:', { applicantId, stageName });
      const participation = await UnifiedParticipationDataAccess.getApplicantParticipationByStage(applicantId, stageName);
      // console.log('✅ Participation result:', participation);
      return participation?.status || '未設定';
    } catch (error) {
      console.error('Failed to fetch participation status:', error);
      return '未設定';
    }
  }, []);

  // 段階がセッションを必要とするかチェックする関数
  const stageRequiresSession = useCallback((stageName: string): boolean => {
    const event = getEventByStageName(stageName);
    return event ? requiresSessionFromEvent(event) : false;
  }, [getEventByStageName]);

  // 参加状況を取得するuseEffect
  useEffect(() => {
    const fetchParticipationStatuses = async () => {
      const statuses: Record<string, string> = {};
      
      for (const item of history) {
        if (stageRequiresSession(item.stage)) {
          const status = await getApplicantParticipationStatus(applicant.id, item.stage);
          statuses[item.stage] = status;
          
          // デバッグ情報（開発環境でのみ出力）
          if (process.env.NODE_ENV === 'development') {
            console.log(`選考履歴 - ${item.stage}:`, {
              applicantId: applicant.id,
              stageName: item.stage,
              status,
              dataSource: 'UnifiedParticipationDataAccess.getApplicantParticipationByStage'
            });
          }
        }
      }
      
      setParticipationStatuses(statuses);
    };
    
    if (history.length > 0) {
      fetchParticipationStatuses();
    }
  }, [history, applicant.id, stageRequiresSession, getApplicantParticipationStatus]);

  // 各段階のタスクを非同期で取得
  const fetchStageTasks = async () => {
    setLoading(true);
    try {
      const tasksMap: Record<string, TaskWithFixedData[]> = {};
      
      for (const item of history) {
        const tasks = await getApplicantTasksForStage(applicant, item.stage);
        tasksMap[item.stage] = tasks;
      }
      
      setStageTasksMap(tasksMap);
    } catch (error) {
      console.error('Failed to fetch stage tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (history.length > 0) {
      fetchStageTasks();
    }
  }, [history, applicant]);

  // タスクステータス更新後の再取得
  const handleTaskStatusUpdate = async (taskInstanceId: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(taskInstanceId, status);
      // タスクステータス更新後に再取得
      await fetchStageTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  // タスクの全項目更新処理
  const handleTaskUpdate = async (taskInstanceId: string, status: TaskStatus, dueDate: string, notes: string) => {
    try {
      // 現在開いているアコーディオンアイテムを保存
      const currentOpenItem = openAccordionItem;
      
      // ステータスを更新
      await updateTaskStatus(taskInstanceId, status);
      
      // 期限を更新（setTaskDueDateを使用）
      if (dueDate) {
        await setTaskDueDate(taskInstanceId, new Date(dueDate));
      }
      
      // メモを更新（新しい関数が必要）
      const { error: notesError } = await supabase
        .from('task_instances')
        .update({
          notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskInstanceId);
        
      if (notesError) {
        console.error('Failed to update task notes:', notesError);
      }
      
      // 更新後に再取得
      await fetchStageTasks();
      
      // アコーディオンの状態を復元
      setTimeout(() => {
        setOpenAccordionItem(currentOpenItem);
      }, 0);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // イベントデータが読み込み中の場合はローディング表示
  if (eventsLoading) {
    return (
      <Card>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            イベント情報を読み込み中...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>選考履歴</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={openNextStageDialog}
            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            次の段階に進める
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            選考履歴がありません
          </p>
        ) : loading ? (
          <p className="text-muted-foreground text-center py-8">
            タスクを読み込み中...
          </p>
        ) : (
          <Accordion 
            type="single" 
            collapsible 
            className="w-full" 
            value={openAccordionItem}
            onValueChange={setOpenAccordionItem}
          >
            {history.map((item) => {
              const stageTasks = stageTasksMap[item.stage] || [];
              const event = getEventByStageName(item.stage);
              
              // イベントに対応するセッションを取得
              let sessionInfo = null;
              if (event) {
                const sessions = getAvailableSessionsForStageWithData(item.stage);
                const session = sessions.length > 0 ? sessions[0] : null; // 最初のセッションを使用
                sessionInfo = { event, session };
              }
              
              return (
                <AccordionItem key={item.id} value={item.id}>
                  <StageCard item={item} sessionInfo={sessionInfo} event={event} />
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {/* セッション情報 */}
                      {stageRequiresSession(item.stage) && (
                        <SessionBookingForm
                          stage={item.stage}
                          sessionInfo={sessionInfo}
                          onOpenSessionDialog={handleOpenSessionDialog}
                          applicantId={applicant.id}
                          participationStatus={participationStatuses[item.stage] || '未設定'}
                          event={event}
                        />
                      )}

                      {/* 書類選考の合否変更機能 */}
                      {item.stage === '書類選考' && (
                        <StageResultForm
                          stageId={item.id}
                          stageDetails={stageDetails}
                          onOpenResultDialog={handleOpenResultDialog}
                        />
                      )}

                      {/* タスク一覧 */}
                      <TaskManagementSection
                        stageTasks={stageTasks}
                        onEditTask={handleEditTask}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        {/* タスク編集ダイアログ */}
        <TaskEditDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          taskStatus={taskStatus}
          taskType={editingTask?.type}
          dueDate={dueDate}
          notes={notes}
          onTaskStatusChange={setTaskStatus}
          onDueDateChange={setDueDate}
          onNotesChange={setNotes}
          onSave={() => {
            if (editingTask) {
              handleTaskUpdate(editingTask.id, taskStatus, dueDate, notes);
            }
            setIsEditDialogOpen(false);
          }}
        />

        {/* セッション情報登録ダイアログ */}
        <SessionDialog
          isOpen={isSessionDialogOpen}
          onOpenChange={setIsSessionDialogOpen}
          editingStage={editingStage}
          sessionFormData={sessionFormData}
          availableSessions={getAvailableSessionsForStageWithData(editingStage)}
          onSessionSelection={handleSessionSelection}
          onSessionFormChange={handleSessionFormChange}
          onSave={(isCreatingNewSession) => handleSaveSession(createNewSession, isCreatingNewSession)}
        />

        {/* 書類選考合否変更ダイアログ */}
        <ResultDialog
          isOpen={isResultDialogOpen}
          onOpenChange={setIsResultDialogOpen}
          selectedStageId={selectedStageId}
          resultFormData={resultFormData}
          onResultFormChange={handleResultFormChange}
          onSave={handleSaveResult}
        />

        {/* 次の段階選択ダイアログ */}
        <NextStageDialog
          isOpen={isNextStageDialogOpen}
          onOpenChange={setIsNextStageDialogOpen}
          applicant={applicant}
          onAdvanceToStage={advanceToSelectedStage}
        />
      </CardContent>
    </Card>
  );
}
