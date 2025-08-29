import { useState, useCallback, useEffect } from 'react';
import { TaskInstance, FixedTask, TaskStatus } from '../types/task';
import { Applicant } from '@/features/applicants/types/applicant';
import { TaskDataAccess } from '@/lib/dataAccess/taskDataAccess';

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
        const data = await TaskDataAccess.getAllTaskInstances();
        console.log('📊 Fetched task instances:', data);
        setTaskInstances(data);
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
    try {
      return await TaskDataAccess.getApplicantTasksByStage(applicant, stage);
    } catch (error) {
      console.error('Failed to get applicant tasks by stage:', error);
      return [];
    }
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

  // 次のタスクを取得（全段階）- N+1クエリ問題を解決
  const getNextTaskAllStages = useCallback(async (applicant: Applicant): Promise<TaskWithFixedData | null> => {
    const allStages = ['エントリー', '書類選考', '会社説明会', '適性検査体験', '職場見学', '仕事体験', '人事面接', '集団面接', 'CEOセミナー', '最終選考', '内定面談', '不採用'];
    
    try {
      console.log('🚀 Fetching tasks for all stages using batch query...');
      
      // バッチ取得を使用して全段階のタスクを一度に取得
      const tasksByStage = await TaskDataAccess.getApplicantTasksForAllStages(applicant, allStages);
      
      // 各段階で次のタスクを探す
      for (const stage of allStages) {
        const stageTasks = tasksByStage.get(stage) || [];
        const nextTask = stageTasks.find(task => task.status === '未着手') || 
                        stageTasks.find(task => task.status === '返信待ち') ||
                        stageTasks.find(task => task.status === '提出待ち');
        
        if (nextTask) {
          console.log(`✅ Found next task in stage: ${stage}`, nextTask);
          return nextTask;
        }
      }
      
      console.log('ℹ️ No next task found in any stage');
      return null;
    } catch (error) {
      console.error('❌ Error fetching tasks for all stages:', error);
      return null;
    }
  }, []);

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
      
      await TaskDataAccess.updateTaskStatus(taskInstanceId, status);
      
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
      await TaskDataAccess.setTaskDueDate(taskInstanceId, dueDate);
      
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