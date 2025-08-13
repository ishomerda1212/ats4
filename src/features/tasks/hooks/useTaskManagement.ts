import { useState, useCallback } from 'react';
import { TaskInstance, FixedTask, TaskStatus } from '../types/task';
import { getFixedTasksByStage } from '../data/taskTemplates';
import { generateId } from '@/shared/utils/date';
import { Applicant, SelectionStage } from '@/features/applicants/types/applicant';

// FixedTaskとTaskInstanceを組み合わせた型
type TaskWithFixedData = FixedTask & TaskInstance;

// モックデータ（実際の実装ではAPIやストレージを使用）
const mockTaskInstances: TaskInstance[] = [
  {
    id: 'task-1',
    applicantId: 'applicant-1',
    taskId: 'fixed-task-1',
    status: '完了',
    dueDate: new Date('2024-01-20'),
    completedAt: new Date('2024-01-18'),
    notes: '完了しました',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'task-2',
    applicantId: 'applicant-1',
    taskId: 'fixed-task-2',
    status: '未着手',
    dueDate: new Date('2024-01-25'),
    notes: '未着手です',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: 'task-3',
    applicantId: 'applicant-2',
    taskId: 'fixed-task-1',
    status: '完了',
    dueDate: new Date('2024-01-22'),
    completedAt: new Date('2024-01-20'),
    notes: '完了しました',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'task-4',
    applicantId: 'applicant-2',
    taskId: 'fixed-task-3',
    status: '完了',
    dueDate: new Date('2024-01-28'),
    completedAt: new Date('2024-01-25'),
    notes: '完了しました',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'task-5',
    applicantId: 'applicant-3',
    taskId: 'fixed-task-1',
    status: '完了',
    dueDate: new Date('2024-01-24'),
    completedAt: new Date('2024-01-22'),
    notes: '完了しました',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'task-6',
    applicantId: 'applicant-3',
    taskId: 'fixed-task-2',
    status: '完了',
    dueDate: new Date('2024-01-30'),
    completedAt: new Date('2024-01-28'),
    notes: '完了しました',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: 'task-7',
    applicantId: 'applicant-4',
    taskId: 'fixed-task-1',
    status: '完了',
    dueDate: new Date('2024-01-26'),
    completedAt: new Date('2024-01-24'),
    notes: '完了しました',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-24'),
  },
  {
    id: 'task-8',
    applicantId: 'applicant-4',
    taskId: 'fixed-task-3',
    status: '完了',
    dueDate: new Date('2024-01-30'),
    completedAt: new Date('2024-01-28'),
    notes: '完了しました',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: 'task-9',
    applicantId: 'applicant-5',
    taskId: 'fixed-task-1',
    status: '完了',
    dueDate: new Date('2024-01-28'),
    completedAt: new Date('2024-01-26'),
    notes: '完了しました',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-26'),
  },
  {
    id: 'task-10',
    applicantId: 'applicant-5',
    taskId: 'fixed-task-2',
    status: '未着手',
    dueDate: new Date('2024-02-02'),
    notes: '未着手です',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
];

export const useTaskManagement = () => {
  const [taskInstances, setTaskInstances] = useState<TaskInstance[]>(mockTaskInstances);

  // 応募者のタスクを取得
  const getApplicantTasks = useCallback((applicant: Applicant): TaskWithFixedData[] => {
    const currentStage = applicant.currentStage;
    const fixedTasks = getFixedTasksByStage(currentStage);
    
    return fixedTasks.map((fixedTask: FixedTask) => {
      const instance = taskInstances.find(
        ti => ti.applicantId === applicant.id && ti.taskId === fixedTask.id
      );
      
      if (instance) {
        return { ...fixedTask, ...instance };
      } else {
        // 新しいタスクインスタンスを作成
        const newInstance: TaskInstance = {
          id: generateId(),
          applicantId: applicant.id,
          taskId: fixedTask.id,
          status: '未着手',
          dueDate: new Date(),
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // 日程調整連絡とリマインドの場合は返信待ちステータスを設定
        if (['日程調整連絡', 'リマインド'].includes(fixedTask.type)) {
          newInstance.status = '返信待ち';
        }
        
        // 提出書類タスクの場合は初期ステータスを設定
        if (fixedTask.type === '提出書類') {
          newInstance.status = '提出待ち';
        }
        
        setTaskInstances(prev => [...prev, newInstance]);
        return { ...fixedTask, ...newInstance };
      }
    }).sort((a: TaskWithFixedData, b: TaskWithFixedData) => a.order - b.order);
  }, [taskInstances]);

  // 応募者の特定段階のタスクを取得
  const getApplicantTasksByStage = useCallback((applicant: Applicant, stage: string): TaskWithFixedData[] => {
    const fixedTasks = getFixedTasksByStage(stage as SelectionStage);
    
    return fixedTasks.map((fixedTask: FixedTask) => {
      const instance = taskInstances.find(
        ti => ti.applicantId === applicant.id && ti.taskId === fixedTask.id
      );
      
      if (instance) {
        return { ...fixedTask, ...instance };
      } else {
        // 新しいタスクインスタンスを作成
        const newInstance: TaskInstance = {
          id: generateId(),
          applicantId: applicant.id,
          taskId: fixedTask.id,
          status: '未着手',
          dueDate: new Date(),
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // 日程調整連絡とリマインドの場合は返信待ちステータスを設定
        if (['日程調整連絡', 'リマインド'].includes(fixedTask.type)) {
          newInstance.status = '返信待ち';
        }
        
        // 提出書類タスクの場合は初期ステータスを設定
        if (fixedTask.type === '提出書類') {
          newInstance.status = '提出待ち';
        }
        
        setTaskInstances(prev => [...prev, newInstance]);
        return { ...fixedTask, ...newInstance };
      }
    }).sort((a: TaskWithFixedData, b: TaskWithFixedData) => a.order - b.order);
  }, [taskInstances]);

  // 次のタスクを取得（現在の段階のみ）
  const getNextTask = useCallback((applicant: Applicant): TaskWithFixedData | null => {
    const tasks = getApplicantTasks(applicant);
    return tasks.find(task => task.status === '未着手') || 
           tasks.find(task => task.status === '返信待ち') || 
           tasks.find(task => task.status === '提出待ち') || 
           null;
  }, [getApplicantTasks]);

  // 次のタスクを取得（全段階）
  const getNextTaskAllStages = useCallback((applicant: Applicant): TaskWithFixedData | null => {
    const allStages = ['エントリー', '書類選考', '会社説明会', '適性検査体験', '職場見学', '仕事体験', '人事面接', '集団面接', 'CEOセミナー', '人事面接', '最終選考', '内定面談', '不採用'];
    
    for (const stage of allStages) {
      const tasks = getApplicantTasksByStage(applicant, stage);
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
  const updateTaskStatus = useCallback((
    taskInstanceId: string, 
    status: TaskStatus
  ) => {
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
  }, []);

  // タスクに期限を設定
  const setTaskDueDate = useCallback((taskInstanceId: string, dueDate: Date) => {
    setTaskInstances(prev => prev.map(task => 
      task.id === taskInstanceId 
        ? { ...task, dueDate, updatedAt: new Date() }
        : task
    ));
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