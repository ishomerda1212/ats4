import { useState, useEffect } from 'react';
import { Applicant, SelectionHistory } from '../types/applicant';
import { Task, TaskInstance } from '@/features/tasks/types/task';
import { supabase } from '@/lib/supabase';

// 次のタスク用の拡張されたTaskInstance型
interface ExtendedTaskInstance extends TaskInstance {
  title: string;
  description: string;
  type: string;
}

export function useApplicantDetail(applicantId: string) {
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [history, setHistory] = useState<SelectionHistory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextTask, setNextTask] = useState<ExtendedTaskInstance | null>(null);

  // 次のタスクを取得する関数
  const fetchNextTask = async () => {
    try {
      console.log('🔍 Fetching next task for applicant:', applicantId);
      
      // 応募者の現在の選考段階を取得
      const { data: applicantData } = await supabase
        .from('applicants')
        .select('current_stage')
        .eq('id', applicantId)
        .single();

      console.log('📊 Current stage:', applicantData?.current_stage);

      if (!applicantData?.current_stage) {
        console.log('❌ No current stage found');
        setNextTask(null);
        return;
      }

      // 現在の選考段階のステータスを確認
      const { data: currentStageHistory } = await supabase
        .from('selection_histories')
        .select('status')
        .eq('applicant_id', applicantId)
        .eq('stage', applicantData.current_stage)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      console.log('📊 Current stage history status:', currentStageHistory?.status);

      // 現在の選考段階が「完了」の場合は次のタスクを表示しない
      if (currentStageHistory?.status === '完了') {
        console.log('❌ Current stage is completed, no next task');
        setNextTask(null);
        return;
      }

      // 現在の選考段階のfixed_tasksを取得
      const { data: fixedTasks } = await supabase
        .from('fixed_tasks')
        .select('id, title, stage')
        .eq('stage', applicantData.current_stage)
        .order('order_num', { ascending: true });

      console.log('📊 Fixed tasks for current stage:', fixedTasks?.length, fixedTasks);

      if (!fixedTasks || fixedTasks.length === 0) {
        console.log('❌ No fixed tasks found for current stage');
        setNextTask(null);
        return;
      }

      // 現在の選考段階のタスクインスタンスを取得（完了していないもの）
      const fixedTaskIds = fixedTasks.map(task => task.id);
      console.log('🔍 Looking for task instances with fixed_task_ids:', fixedTaskIds);
      
      // まず、全てのタスクインスタンス（ステータスに関係なく）を確認
      const { data: allTasks } = await supabase
        .from('task_instances')
        .select(`
          *,
          fixed_tasks (
            title,
            description,
            type
          )
        `)
        .eq('applicant_id', applicantId)
        .in('task_id', fixedTaskIds);

      console.log('📊 All tasks for current stage (including completed):', allTasks?.length, allTasks);
      
      const { data: tasks } = await supabase
        .from('task_instances')
        .select(`
          *,
          fixed_tasks (
            title,
            description,
            type
          )
        `)
        .eq('applicant_id', applicantId)
        .in('task_id', fixedTaskIds)
        .neq('status', '完了')
        .order('created_at', { ascending: true });

      console.log('📊 Found tasks for current stage:', tasks?.length, tasks);
      
      // 各タスクの詳細をログ出力
      if (tasks && tasks.length > 0) {
        tasks.forEach((task, index) => {
          console.log(`📋 Task ${index + 1}:`, {
            id: task.id,
            task_id: task.task_id,
            status: task.status,
            title: task.fixed_tasks?.title,
            description: task.fixed_tasks?.description
          });
        });
      }

      if (tasks && tasks.length > 0) {
        // 最初の未完了タスクを次のタスクとして設定
        const nextTaskData = tasks[0];
        const nextTaskObj = {
          id: nextTaskData.id,
          applicantId: nextTaskData.applicant_id,
          taskId: nextTaskData.task_id,
          status: nextTaskData.status,
          dueDate: nextTaskData.due_date ? new Date(nextTaskData.due_date) : undefined,
          completedAt: nextTaskData.completed_at ? new Date(nextTaskData.completed_at) : undefined,
          notes: nextTaskData.notes,
          createdAt: new Date(nextTaskData.created_at),
          updatedAt: new Date(nextTaskData.updated_at),
          title: nextTaskData.fixed_tasks?.title || '',
          description: nextTaskData.fixed_tasks?.description || '',
          type: nextTaskData.fixed_tasks?.type || 'general'
        };
        
        console.log('✅ Setting next task:', nextTaskObj);
        setNextTask(nextTaskObj);
      } else {
        console.log('❌ No incomplete tasks found for current stage');
        setNextTask(null);
      }
    } catch (error) {
      console.error('❌ Failed to fetch next task:', error);
      setNextTask(null);
    }
  };

  const fetchApplicantDetail = async () => {
    setLoading(true);
    try {
      // 応募者詳細を取得
      const { data: applicantData, error: applicantError } = await supabase
        .from('applicants')
        .select('*')
        .eq('id', applicantId)
        .single();

      if (applicantError) {
        console.error('Failed to fetch applicant:', applicantError);
      } else if (applicantData) {
        // データベースのフィールド名をTypeScriptの型定義に合わせて変換
        const transformedApplicant: Applicant = {
          id: applicantData.id,
          source: applicantData.source,
          name: applicantData.name,
          nameKana: applicantData.name_kana, // スネークケースからキャメルケースに変換
          gender: applicantData.gender,
          schoolName: applicantData.school_name, // スネークケースからキャメルケースに変換
          faculty: applicantData.faculty,
          department: applicantData.department,
          graduationYear: applicantData.graduation_year, // スネークケースからキャメルケースに変換
          currentAddress: applicantData.current_address, // スネークケースからキャメルケースに変換
          birthplace: applicantData.birthplace,
          phone: applicantData.phone,
          email: applicantData.email,
          currentStage: applicantData.current_stage, // スネークケースからキャメルケースに変換
          experience: applicantData.experience,
          otherCompanyStatus: applicantData.other_company_status, // スネークケースからキャメルケースに変換
          appearance: applicantData.appearance,
          createdAt: applicantData.created_at, // スネークケースからキャメルケースに変換
          updatedAt: applicantData.updated_at, // スネークケースからキャメルケースに変換
        };
        
        console.log('📊 Transformed applicant detail:', transformedApplicant);
        setApplicant(transformedApplicant);
      }

      // 選考履歴を取得
      const { data: historyData, error: historyError } = await supabase
        .from('selection_histories')
        .select('*')
        .eq('applicant_id', applicantId)
        .order('created_at', { ascending: false });

      if (historyError) {
        console.error('Failed to fetch history:', historyError);
      } else if (historyData) {
        // 選考履歴のデータも変換
        const transformedHistory: SelectionHistory[] = historyData.map(item => ({
          id: item.id,
          applicantId: item.applicant_id, // スネークケースからキャメルケースに変換
          stage: item.stage,
          endDate: item.end_date ? new Date(item.end_date) : undefined, // スネークケースからキャメルケースに変換
          status: item.status,
          notes: item.notes,
          createdAt: item.created_at, // スネークケースからキャメルケースに変換
          updatedAt: item.updated_at, // スネークケースからキャメルケースに変換
        }));
        
        console.log('📊 Transformed history data:', transformedHistory);
        setHistory(transformedHistory);
      }

      // タスクを取得（後で実装）
      setTasks([]);

      // 次のタスクを取得
      await fetchNextTask();

    } catch (error) {
      console.error('Failed to fetch applicant detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicantId) {
      fetchApplicantDetail();
    }
  }, [applicantId]);

  // 各選考段階の詳細データを取得（現在は空のオブジェクト）
  const stageDetails: Record<string, Record<string, unknown>> = {};

  return {
    applicant,
    history,
    tasks,
    loading,
    stageDetails,
    nextTask,
    refresh: fetchApplicantDetail
  };
}