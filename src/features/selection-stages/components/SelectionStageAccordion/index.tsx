import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Clock, Plus } from 'lucide-react';
import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';
import { getNextStage } from './utils/stageHelpers';
import { useStageAccordion } from './hooks/useStageAccordion';
import { useStageOperations } from './hooks/useStageOperations';
import { StageCard } from './components/StageCard';
import { TaskManagementSection } from './components/TaskManagementSection';
import { SessionBookingForm } from './components/SessionBookingForm';
import { StageResultForm } from './components/StageResultForm';
import { TaskEditDialog } from './components/TaskEditDialog';
import { SessionDialog } from './components/SessionDialog';
import { ResultDialog } from './components/ResultDialog';
import { NextStageDialog } from './components/NextStageDialog';

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
  const {
    // タスク編集関連
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
  } = useStageAccordion();

  const {
    getStageSessionInfoForStage,
    getAvailableSessionsForStageWithData,
    getApplicantTasksForStage,
    setTaskDueDate,
    createNewSession
  } = useStageOperations();

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
              const stageTasks = getApplicantTasksForStage(applicant, item.stage);
              const sessionInfo = getStageSessionInfoForStage(item.stage);
              
              return (
                <AccordionItem key={item.id} value={item.id}>
                  <StageCard item={item} sessionInfo={sessionInfo} />
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {/* セッション情報 */}
                      <SessionBookingForm
                        stage={item.stage}
                        sessionInfo={sessionInfo}
                        onOpenSessionDialog={handleOpenSessionDialog}
                        applicantId={applicant.id}
                      />

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
          dueDate={dueDate}
          notes={notes}
          onTaskStatusChange={setTaskStatus}
          onDueDateChange={setDueDate}
          onNotesChange={setNotes}
          onSave={() => handleSaveTask(setTaskDueDate)}
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
