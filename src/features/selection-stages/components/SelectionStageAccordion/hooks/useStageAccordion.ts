import { useState } from 'react';
import { TaskInstance, TaskStatus, FixedTask } from '@/features/tasks/types/task';
import { EventSession } from '@/features/events/types/event';
import { Applicant } from '@/features/applicants/types/applicant';
import { supabase } from '@/lib/supabase';

// FixedTaskとTaskInstanceを組み合わせた型
type TaskWithFixedData = FixedTask & TaskInstance;

// セッション作成用のデータ型
interface SessionCreationData {
  eventId: string;
  name: string;
  start: Date;
  end: Date;
  venue: string;
  format: '対面' | 'オンライン' | 'ハイブリッド';
  maxParticipants?: number;
  recruiter?: string;
}

// セッション作成関数の型
type CreateSessionFunction = (sessionData: SessionCreationData) => EventSession;

export interface SessionFormData {
  selectedSessionId: string;
  sessionType: string;
  result: string;
  // 新しいセッション作成用のフィールド
  newSessionName: string;
  newSessionStart: string;
  newSessionEnd: string;
  newSessionVenue: string;
  newSessionFormat: string;
  newSessionMaxParticipants: string;
}

export interface ResultFormData {
  result: string;
}

export const useStageAccordion = (applicant: Applicant, onRefresh?: () => void) => {
  // タスク編集関連の状態
  const [editingTask, setEditingTask] = useState<TaskWithFixedData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('未着手');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  // 次の段階選択関連の状態
  const [isNextStageDialogOpen, setIsNextStageDialogOpen] = useState(false);

  // セッション情報登録用の状態
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<string>('');
  const [sessionFormData, setSessionFormData] = useState<SessionFormData>({
    selectedSessionId: '',
    sessionType: '',
    result: '',
    newSessionName: '',
    newSessionStart: '',
    newSessionEnd: '',
    newSessionVenue: '',
    newSessionFormat: '',
    newSessionMaxParticipants: ''
  });

  // 書類選考の合否変更用の状態
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [resultFormData, setResultFormData] = useState<ResultFormData>({
    result: ''
  });

  // 次の段階選択ダイアログを開く
  const openNextStageDialog = () => {
    setIsNextStageDialogOpen(true);
  };

  // 選択した段階に進める
  const advanceToSelectedStage = async (selectedStage: string) => {
    try {
      // 1. 前の段階（現在進行中の段階）を完了にする
      const { error: updatePreviousError } = await supabase
        .from('selection_histories')
        .update({
          status: '完了',
          updated_at: new Date().toISOString()
        })
        .eq('applicant_id', applicant.id)
        .eq('status', '進行中');
        
      if (updatePreviousError) {
        console.error('Failed to update previous stage status:', updatePreviousError);
        return;
      }
      
      // 2. 選考履歴に新しい段階を追加
      const { error } = await supabase
        .from('selection_histories')
        .insert([{
          applicant_id: applicant.id,
          stage: selectedStage,
          status: '進行中',
          notes: '次の段階に進めました',
        }]);
        
      if (error) {
        console.error('Failed to create selection history:', error);
        return;
      }
      
      // 3. 応募者の現在の段階を更新
      const { error: updateError } = await supabase
        .from('applicants')
        .update({
          current_stage: selectedStage,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicant.id);
        
      if (updateError) {
        console.error('Failed to update applicant current stage:', updateError);
        return;
      }

      // 4. 新しい段階のタスクを自動生成
      const { data: fixedTasks, error: fixedTasksError } = await supabase
        .from('fixed_tasks')
        .select('id')
        .eq('stage', selectedStage)
        .order('order_num', { ascending: true });

      if (fixedTasksError) {
        console.error('Failed to fetch fixed tasks:', fixedTasksError);
        return;
      }

      if (fixedTasks && fixedTasks.length > 0) {
        // タスクインスタンスを作成
        const taskInstances = fixedTasks.map(task => ({
          applicant_id: applicant.id,
          task_id: task.id,
          status: '未着手',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { error: taskInstancesError } = await supabase
          .from('task_instances')
          .insert(taskInstances);

        if (taskInstancesError) {
          console.error('Failed to create task instances:', taskInstancesError);
          return;
        }

        console.log(`Created ${taskInstances.length} task instances for stage: ${selectedStage}`);
      }
      
      console.log('Successfully advanced to stage:', selectedStage);
      setIsNextStageDialogOpen(false);
      
      // 親コンポーネントに更新を通知
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error advancing to stage:', error);
    }
  };

  // タスク編集を開始
  const handleEditTask = (task: TaskWithFixedData) => {
    setEditingTask(task);
    setTaskStatus(task.status);
    setDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    setNotes(task.notes || '');
    setIsEditDialogOpen(true);
  };

  // タスクを保存
  const handleSaveTask = (
    setTaskDueDate: (taskId: string, date: Date) => void,
    updateTaskStatus?: (taskId: string, status: TaskStatus) => void
  ) => {
    if (!editingTask) return;

    // タスクステータスの更新処理
    if (updateTaskStatus && editingTask.status !== taskStatus) {
      updateTaskStatus(editingTask.id, taskStatus);
    }
    
    if (dueDate) {
      setTaskDueDate(editingTask.id, new Date(dueDate));
    }
    if (notes) {
      // メモの更新処理（実装予定）
      // console.log('Notes updated:', notes);
    }

    setIsEditDialogOpen(false);
    setEditingTask(null);
    setTaskStatus('未着手');
    setDueDate('');
    setNotes('');
  };

  // セッション情報登録ダイアログを開く
  const handleOpenSessionDialog = (stage: string) => {
    setEditingStage(stage);
    setIsSessionDialogOpen(true);
  };

  // セッション情報を保存
  const handleSaveSession = (createNewSession?: CreateSessionFunction) => {
    // 新しいセッションを作成する場合
    if (sessionFormData.newSessionName && createNewSession) {
      try {
        const newSession = createNewSession({
          eventId: `event-${editingStage}`, // 仮のイベントID
          name: sessionFormData.newSessionName,
          start: new Date(sessionFormData.newSessionStart),
          end: new Date(sessionFormData.newSessionEnd),
          venue: sessionFormData.newSessionVenue,
          format: sessionFormData.newSessionFormat as '対面' | 'オンライン' | 'ハイブリッド',
          maxParticipants: sessionFormData.newSessionMaxParticipants ? parseInt(sessionFormData.newSessionMaxParticipants) : undefined,
          recruiter: sessionFormData.sessionType || undefined,
        });
        
        // 新しく作成されたセッションを選択状態にする
        setSessionFormData(prev => ({
          ...prev,
          selectedSessionId: newSession.id
        }));
        
        console.log('新しいセッションを作成しました:', newSession);
      } catch (error) {
        console.error('セッション作成エラー:', error);
      }
    }
    
    // ここでセッション情報を保存する処理を実装
    console.log('Saving session data for stage:', editingStage, sessionFormData);
    
    // フォームをリセット
    setSessionFormData({
      selectedSessionId: '',
      sessionType: '',
      result: '',
      newSessionName: '',
      newSessionStart: '',
      newSessionEnd: '',
      newSessionVenue: '',
      newSessionFormat: '',
      newSessionMaxParticipants: ''
    });
    setIsSessionDialogOpen(false);
    setEditingStage('');
  };

  // セッション情報フォームの更新
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

  // 書類選考の合否変更ダイアログを開く
  const handleOpenResultDialog = (stageId: string, stageData?: { result?: string }) => {
    setSelectedStageId(stageId);
    if (stageData) {
      setResultFormData({
        result: stageData.result || ''
      });
    } else {
      setResultFormData({
        result: ''
      });
    }
    setIsResultDialogOpen(true);
  };

  // 合否結果を保存
  const handleSaveResult = () => {
    // 合否結果の保存処理（実装予定）
    // console.log('Result saved:', resultFormData);
    setIsResultDialogOpen(false);
    setSelectedStageId('');
  };

  // 合否フォームの更新
  const handleResultFormChange = (field: string, value: string) => {
    setResultFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
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
  };
};
