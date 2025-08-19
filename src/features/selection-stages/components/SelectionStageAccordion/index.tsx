import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Clock, Plus } from 'lucide-react';
import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';
import { getNextStage } from './utils/stageHelpers';
import { useStageAccordion } from './hooks/useStageAccordion';
import { useStageOperations } from './hooks/useStageOperations';
import { useTaskManagement } from '@/features/tasks/hooks/useTaskManagement';
import { StageCard } from './components/StageCard';
import { TaskManagementSection } from './components/TaskManagementSection';
import { SessionBookingForm } from './components/SessionBookingForm';
import { StageResultForm } from './components/StageResultForm';
import { TaskEditDialog } from './components/TaskEditDialog';
import { SessionDialog } from './components/SessionDialog';
import { ResultDialog } from './components/ResultDialog';
import { NextStageDialog } from './components/NextStageDialog';
import { useState, useEffect } from 'react';
import { FixedTask, TaskInstance, TaskStatus } from '@/features/tasks/types/task';
import { supabase } from '@/lib/supabase';
import { STAGES_WITH_SESSION } from '@/shared/utils/constants';

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
    createNewSession
  } = useStageOperations();

  const { updateTaskStatus } = useTaskManagement();

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
  }, [history, applicant]); // getApplicantTasksForStageを依存配列から削除

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
              const sessionInfo = getStageSessionInfoForStage(item.stage);
              
              return (
                <AccordionItem key={item.id} value={item.id}>
                  <StageCard item={item} sessionInfo={sessionInfo} />
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {/* セッション情報 */}
                      {STAGES_WITH_SESSION.includes(item.stage as any) && (
                        <SessionBookingForm
                          stage={item.stage}
                          sessionInfo={sessionInfo}
                          onOpenSessionDialog={handleOpenSessionDialog}
                          applicantId={applicant.id}
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
          onSave={() => handleSaveSession(createNewSession)}
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
