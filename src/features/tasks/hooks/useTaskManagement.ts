import { useState, useCallback, useEffect } from 'react';
import { TaskInstance, FixedTask, TaskStatus } from '../types/task';
import { getFixedTasksByStage } from '../data/taskTemplates';
import { generateId } from '@/shared/utils/date';
import { Applicant, SelectionStage } from '@/features/applicants/types/applicant';
import { supabase } from '@/lib/supabase';

// FixedTaskとTaskInstanceを組み合わせた型
type TaskWithFixedData = FixedTask & TaskInstance;

export const useTaskManagement = () => {
  const [taskInstances, setTaskInstances] = useState<TaskInstance[]>([]);
  const [loading, setLoading] = useState(false);

  // データベースからタスクインスタンスを取得
  useEffect(() => {
    const fetchTaskInstances = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('task_instances')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to fetch task instances:', error);
        } else if (data) {
          // データベースのフィールド名をTypeScriptの型定義に合わせて変換
          const transformedData = data.map(item => ({
            id: item.id,
            applicantId: item.applicant_id,
            taskId: item.task_id,
            status: item.status,
            dueDate: item.due_date ? new Date(item.due_date) : undefined,
            completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
            notes: item.notes,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
          }));
          
          console.log('📊 Transformed task instances:', transformedData);
          setTaskInstances(transformedData);
        }
      } catch (error) {
        console.error('Failed to fetch task instances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskInstances();
  }, []);

  // 応募者の特定段階のタスクを取得
  const getApplicantTasksByStage = useCallback(async (applicant: Applicant, stage: string): Promise<TaskWithFixedData[]> => {
    // データベースからタスクインスタンスを取得
    const { data: dbTaskInstances, error } = await supabase
      .from('task_instances')
      .select('*')
      .eq('applicant_id', applicant.id);
      
    if (error) {
      console.error('Failed to fetch task instances:', error);
      return [];
    }
    
    // データベースのフィールド名をTypeScriptの型定義に合わせて変換
    const transformedInstances = dbTaskInstances?.map(item => ({
      id: item.id,
      applicantId: item.applicant_id,
      taskId: item.task_id,
      status: item.status,
      dueDate: item.due_date ? new Date(item.due_date) : undefined,
      completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
      notes: item.notes,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    })) || [];
    
    // データベースからfixed_tasksも取得して、正しいマッチングを行う
    const { data: dbFixedTasks, error: fixedTasksError } = await supabase
      .from('fixed_tasks')
      .select('*')
      .eq('stage', stage)
      .order('order_num', { ascending: true });
      
    if (fixedTasksError) {
      console.error('Failed to fetch fixed tasks from database:', fixedTasksError);
      return [];
    }
    
    return dbFixedTasks.map((dbFixedTask) => {
      const instance = transformedInstances.find(
        ti => ti.taskId === dbFixedTask.id
      );
      
      if (instance) {
        return { 
          stage: dbFixedTask.stage,
          title: dbFixedTask.title,
          description: dbFixedTask.description,
          type: dbFixedTask.type,
          order: dbFixedTask.order_num,
          ...instance 
        };
      } else {
        // 新しいタスクインスタンスを作成（データベースには保存しない）
        const newInstance: TaskInstance = {
          id: generateId(),
          applicantId: applicant.id,
          taskId: dbFixedTask.id,
          status: '未着手',
          dueDate: undefined, // 期限なし
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // 日程調整連絡とリマインドの場合は返信待ちステータスを設定
        if (['日程調整連絡', 'リマインド'].includes(dbFixedTask.type)) {
          newInstance.status = '返信待ち';
        }
        
        // 提出書類タスクの場合は初期ステータスを設定
        if (dbFixedTask.type === '提出書類') {
          newInstance.status = '提出待ち';
        }
        
        return { 
          stage: dbFixedTask.stage,
          title: dbFixedTask.title,
          description: dbFixedTask.description,
          type: dbFixedTask.type,
          order: dbFixedTask.order_num,
          ...newInstance 
        };
      }
    }).sort((a: TaskWithFixedData, b: TaskWithFixedData) => a.order - b.order);
  }, []);

  // 応募者のタスクを取得
  const getApplicantTasks = useCallback(async (applicant: Applicant): Promise<TaskWithFixedData[]> => {
    const currentStage = applicant.currentStage;
    return await getApplicantTasksByStage(applicant, currentStage);
  }, [getApplicantTasksByStage]);

  // 次のタスクを取得（現在の段階のみ）
  const getNextTask = useCallback(async (applicant: Applicant): Promise<TaskWithFixedData | null> => {
    const tasks = await getApplicantTasks(applicant);
    return tasks.find(task => task.status === '未着手') || 
           tasks.find(task => task.status === '返信待ち') || 
           tasks.find(task => task.status === '提出待ち') || 
           null;
  }, [getApplicantTasks]);

  // 次のタスクを取得（全段階）
  const getNextTaskAllStages = useCallback(async (applicant: Applicant): Promise<TaskWithFixedData | null> => {
    const allStages = ['エントリー', '書類選考', '会社説明会', '適性検査体験', '職場見学', '仕事体験', '人事面接', '集団面接', 'CEOセミナー', '人事面接', '最終選考', '内定面談', '不採用'];
    
    for (const stage of allStages) {
      const tasks = await getApplicantTasksByStage(applicant, stage);
      const nextTask = tasks.find(task => task.status === '未着手') || 
                      tasks.find(task => task.status === '返信待ち') ||
                      tasks.find(task => task.status === '提出待ち');
      if (nextTask) {
        return nextTask;
      }
    }
    
    return null;
  }, [getApplicantTasksByStage]);

  // タスクステータスを更新
  const updateTaskStatus = useCallback(async (
    taskInstanceId: string, 
    status: TaskStatus
  ) => {
    try {
      console.log('🔄 Updating task status:', { taskInstanceId, status });
      
      // データベースにタスクステータスを更新
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === '完了') {
        updateData.completed_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('task_instances')
        .update(updateData)
        .eq('id', taskInstanceId);
        
      if (error) {
        console.error('❌ Failed to update task status:', error);
        throw error;
      }
      
      console.log('✅ Task status updated successfully');
      
      // ローカル状態も更新
      setTaskInstances(prev => prev.map(task => {
        if (task.id === taskInstanceId) {
          const updates: Partial<TaskInstance> = {
            status,
            updatedAt: new Date()
          };
          
          if (status === '完了' && !task.completedAt) {
            updates.completedAt = new Date();
          }
          
          return { ...task, ...updates };
        }
        return task;
      }));
      
    } catch (error) {
      console.error('❌ Error updating task status:', error);
      throw error;
    }
  }, []);

  // タスクに期限を設定
  const setTaskDueDate = useCallback(async (taskInstanceId: string, dueDate: Date) => {
    try {
      console.log('🔄 Setting task due date:', { taskInstanceId, dueDate });
      
      // データベースにタスク期限を更新
      const { error } = await supabase
        .from('task_instances')
        .update({
          due_date: dueDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', taskInstanceId);
        
      if (error) {
        console.error('❌ Failed to update task due date:', error);
        throw error;
      }
      
      console.log('✅ Task due date updated successfully');
      
      // ローカル状態も更新
      setTaskInstances(prev => prev.map(task => 
        task.id === taskInstanceId 
          ? { ...task, dueDate, updatedAt: new Date() }
          : task
      ));
      
    } catch (error) {
      console.error('❌ Error updating task due date:', error);
      throw error;
    }
  }, []);



  // 期限が近いタスクを取得
  const getUpcomingTasks = useCallback((days: number = 7) => {
    const now = new Date();
    const deadline = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return taskInstances.filter(task => 
      task.dueDate && 
      task.dueDate <= deadline && 
      task.status !== '完了'
    );
  }, [taskInstances]);

  // 期限切れのタスクを取得
  const getOverdueTasks = useCallback(() => {
    const now = new Date();
    
    return taskInstances.filter(task => 
      task.dueDate && 
      task.dueDate < now && 
      task.status !== '完了'
    );
  }, [taskInstances]);

  // 期限関連のユーティリティ
  const getDaysUntilDue = useCallback((dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const getDueStatus = useCallback((dueDate: Date, status: TaskStatus) => {
    if (status === '完了') return 'completed';
    
    const daysUntilDue = getDaysUntilDue(dueDate);
    
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'urgent';
    if (daysUntilDue <= 7) return 'upcoming';
    return 'normal';
  }, [getDaysUntilDue]);

  return {
    taskInstances,
    loading,
    getApplicantTasks,
    getApplicantTasksByStage,
    getNextTask,
    getNextTaskAllStages,
    updateTaskStatus,
    setTaskDueDate,

    getUpcomingTasks,
    getOverdueTasks,
    getDaysUntilDue,
    getDueStatus
  };
}; 