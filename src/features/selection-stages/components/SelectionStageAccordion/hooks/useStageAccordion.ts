import { useState } from 'react';
import { TaskInstance, TaskStatus, FixedTask } from '@/features/tasks/types/task';

// FixedTaskとTaskInstanceを組み合わせた型
type TaskWithFixedData = FixedTask & TaskInstance;

export interface SessionFormData {
  selectedSessionId: string;
  sessionType: string;
  result: string;
}

export interface ResultFormData {
  result: string;
}

export const useStageAccordion = () => {
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
    result: ''
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
  const advanceToSelectedStage = (selectedStage: string) => {
    // ここで選考段階を進める処理を実装
    // console.log('Advancing to stage:', selectedStage);
    // 未使用変数エラー回避のための参照
    void selectedStage;
    setIsNextStageDialogOpen(false);
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
  const handleSaveTask = (setTaskDueDate: (taskId: string, date: Date) => void) => {
    if (!editingTask) return;

    // タスクステータスの更新処理（実装予定）
    // console.log('Task status updated:', taskStatus);
    
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
  const handleSaveSession = () => {
    // ここでセッション情報を保存する処理を実装
    // console.log('Saving session data for stage:', editingStage, sessionFormData);
    
    // フォームをリセット
    setSessionFormData({
      selectedSessionId: '',
      sessionType: '',
      result: ''
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
