import { useState, useCallback } from 'react';
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
type CreateSessionFunction = (sessionData: SessionCreationData) => Promise<EventSession>;

export interface SessionFormData {
  selectedSessionId: string;
  sessionFormat: string; // 実施形式: 対面/オンライン/ハイブリッド
  recruiter: string; // 担当者
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
    sessionFormat: '', // 実施形式: 対面/オンライン/ハイブリッド
    recruiter: '', // 担当者
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
  const handleOpenSessionDialog = async (stage: string) => {
    setEditingStage(stage);
    
    try {
      // 既存のセッション情報を取得
      const { data: existingHistory, error } = await supabase
        .from('selection_histories')
        .select(`
          id,
          applicant_id,
          stage,
          status,
          session_id,
          notes,
          created_at,
          updated_at
        `)
        .eq('applicant_id', applicant.id)
        .eq('stage', stage)
        .single();

      let result = '';
      let sessionFormat = '';
      const recruiter = '';

      if (existingHistory && !error && existingHistory.session_id) {
        // 既存の参加者情報から参加状況を取得（statusカラムを使用）
        const { data: existingParticipant } = await supabase
          .from('event_participants')
          .select('status')
          .eq('session_id', existingHistory.session_id)
          .eq('applicant_id', applicant.id)
          .single();

        if (existingParticipant) {
          result = existingParticipant.status || '';
          console.log('参加状況データ取得:', {
            sessionId: existingHistory.session_id,
            applicantId: applicant.id,
            status: existingParticipant.status,
            result: result
          });
        } else {
          console.log('参加者データが見つかりません:', {
            sessionId: existingHistory.session_id,
            applicantId: applicant.id
          });
        }

        // 既存のセッション情報から実施形式を取得
        const { data: existingSession } = await supabase
          .from('event_sessions')
          .select('format')
          .eq('id', existingHistory.session_id)
          .single();

        if (existingSession) {
          sessionFormat = existingSession.format || '';
        }
      }

      if (existingHistory && !error) {
        // 既存のセッション情報をフォームに設定
        setSessionFormData({
          selectedSessionId: existingHistory.session_id || '',
          sessionFormat: sessionFormat,
          recruiter: recruiter,
          result: result,
          newSessionName: '',
          newSessionStart: '',
          newSessionEnd: '',
          newSessionVenue: '',
          newSessionFormat: '',
          newSessionMaxParticipants: ''
        });
      } else {
        // 新規作成の場合、フォームをリセット
        setSessionFormData({
          selectedSessionId: '',
          sessionFormat: '',
          recruiter: '',
          result: '',
          newSessionName: '',
          newSessionStart: '',
          newSessionEnd: '',
          newSessionVenue: '',
          newSessionFormat: '',
          newSessionMaxParticipants: ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch existing session data:', error);
      // エラーが発生した場合も新規作成として扱う
      setSessionFormData({
        selectedSessionId: '',
        sessionFormat: '',
        recruiter: '',
        result: '',
        newSessionName: '',
        newSessionStart: '',
        newSessionEnd: '',
        newSessionVenue: '',
        newSessionFormat: '',
        newSessionMaxParticipants: ''
      });
    }
    
    setIsSessionDialogOpen(true);
  };

  // セッション情報を保存
  const handleSaveSession = async (createNewSession?: CreateSessionFunction, isCreatingNewSession: boolean = false) => {
    try {
      let sessionId = sessionFormData.selectedSessionId;

      // セッション作成タブで新しいセッションを作成する場合のみ
      if (isCreatingNewSession && 
          sessionFormData.newSessionStart && 
          sessionFormData.newSessionEnd && 
          sessionFormData.newSessionStart.trim() !== '' && 
          sessionFormData.newSessionEnd.trim() !== '' && 
          createNewSession) {
        // まず、該当するイベントをデータベースから取得
        const { data: existingEvent, error: eventError } = await supabase
          .from('events')
          .select('id')
          .eq('name', editingStage)
          .single();

        if (eventError) {
          console.error('Failed to find event:', eventError);
          return;
        }

        if (!existingEvent) {
          console.error(`Event "${editingStage}" not found in database`);
          return;
        }

        // セッション名を自動生成（イベント名 + 開始日時）
        const startDate = new Date(sessionFormData.newSessionStart);
        const formattedDate = startDate.toLocaleDateString('ja-JP', { 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        const autoGeneratedName = `${editingStage} ${formattedDate}`;

        const newSession = await createNewSession({
          eventId: existingEvent.id, // 既存のイベントIDを使用
          name: autoGeneratedName,
          start: new Date(sessionFormData.newSessionStart),
          end: new Date(sessionFormData.newSessionEnd),
          venue: sessionFormData.newSessionVenue,
          format: sessionFormData.newSessionFormat === 'ハイブリッド' ? 'ハイブリッド' : 
                  sessionFormData.newSessionFormat === 'オンライン' ? 'オンライン' : '対面',
          maxParticipants: sessionFormData.newSessionMaxParticipants ? parseInt(sessionFormData.newSessionMaxParticipants) : undefined,
          recruiter: sessionFormData.recruiter || undefined,
        });
        
        sessionId = newSession.id;
        console.log('新しいセッションを作成しました:', newSession);
      } else if (!isCreatingNewSession && sessionFormData.selectedSessionId) {
        // セッション選択の場合：既存のセッションIDを使用
        sessionId = sessionFormData.selectedSessionId;
        console.log('既存のセッションを選択しました:', sessionId);
      } else {
        console.error('セッションIDが指定されていません');
        return;
      }
      
      // 選考履歴にセッション情報を保存/更新
      const { data: existingHistory } = await supabase
        .from('selection_histories')
        .select('id')
        .eq('applicant_id', applicant.id)
        .eq('stage', editingStage)
        .single();

      if (existingHistory) {
        // 既存の履歴を更新
        const updateData: Record<string, unknown> = {
          session_id: sessionId,
          updated_at: new Date().toISOString()
        };

        // recruiterカラムが存在する場合のみ追加
        if (sessionFormData.recruiter) {
          updateData.recruiter = sessionFormData.recruiter;
        }

        const { error: updateError } = await supabase
          .from('selection_histories')
          .update(updateData)
          .eq('id', existingHistory.id);

        if (updateError) {
          console.error('Failed to update selection history:', updateError);
          return;
        }
      } else {
        // 既存の履歴がない場合は、セッション情報のみをevent_participantsに保存
        // 新しい選考履歴は作成しない
        console.log('既存の選考履歴が見つかりません。セッション情報のみを保存します。');
      }

      // event_participantsテーブルに参加者情報を保存/更新
      if (sessionId) {
        // 既存の参加者レコードを確認
        const { data: existingParticipant } = await supabase
          .from('event_participants')
          .select('id, status')
          .eq('session_id', sessionId)
          .eq('applicant_id', applicant.id)
          .single();

        const participantData: Record<string, unknown> = {
          session_id: sessionId,
          applicant_id: applicant.id,
          status: sessionFormData.result || '参加', // フォームの参加状況を使用（デフォルトは「参加」）
          updated_at: new Date().toISOString()
        };

        // 合否情報がある場合のみ追加
        if (sessionFormData.result) {
          participantData.result = sessionFormData.result;
        }

        if (existingParticipant) {
          // 既存の参加者レコードを更新
          const { error: updateParticipantError } = await supabase
            .from('event_participants')
            .update(participantData)
            .eq('id', existingParticipant.id);

          if (updateParticipantError) {
            console.error('Failed to update participant record:', updateParticipantError);
          }
        } else {
          // 新しい参加者レコードを作成
          participantData.created_at = new Date().toISOString();
          
          const { error: insertParticipantError } = await supabase
            .from('event_participants')
            .insert(participantData);

          if (insertParticipantError) {
            console.error('Failed to create participant record:', insertParticipantError);
          }
        }
      }
      
      console.log('セッション情報を保存しました:', {
        stage: editingStage,
        sessionId,
        recruiter: sessionFormData.recruiter,
        result: sessionFormData.result
      });
      
      // フォームをリセット
      setSessionFormData({
        selectedSessionId: '',
        sessionFormat: '',
        recruiter: '',
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
      
      // 親コンポーネントに更新を通知
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('セッション保存エラー:', error);
    }
  };

  // セッション情報フォームの更新
  const handleSessionFormChange = useCallback((field: string, value: string) => {
    setSessionFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // セッション選択時の処理
  const handleSessionSelection = useCallback((sessionId: string) => {
    setSessionFormData(prev => ({
      ...prev,
      selectedSessionId: sessionId
    }));
  }, []);

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
