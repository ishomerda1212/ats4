import { useState, useCallback, useMemo } from 'react';
import { TaskInstance, FixedTask, TaskStatus, ContactStatus } from '../types/task';
import { getFixedTasksByStage } from '../data/taskTemplates';
import { generateId } from '@/shared/utils/date';
import { Applicant } from '@/features/applicants/types/applicant';

// モックデータ（実際の実装ではAPIやストレージを使用）
const mockTaskInstances: TaskInstance[] = [
  // 応募者1のエントリー段階タスク
  {
    id: '1',
    applicantId: '1',
    taskId: 'entry-approach-1',
    status: '完了',
    assignedTo: '人事部 田中',
    dueDate: new Date('2024-01-20'),
    startedAt: new Date('2024-01-18'),
    completedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    applicantId: '1',
    taskId: 'entry-approach-2',
    status: '進行中',
    assignedTo: '人事部 田中',
    dueDate: new Date('2024-01-25'),
    startedAt: new Date('2024-01-21'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: '3',
    applicantId: '1',
    taskId: 'entry-detail-contact',
    status: '完了',
    contactStatus: '済',
    assignedTo: '人事部 田中',
    dueDate: new Date('2024-01-22'),
    startedAt: new Date('2024-01-20'),
    completedAt: new Date('2024-01-22'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '4',
    applicantId: '1',
    taskId: 'entry-schedule-contact',
    status: '進行中',
    contactStatus: '返信待ち',
    assignedTo: '人事部 田中',
    dueDate: new Date('2024-01-28'),
    startedAt: new Date('2024-01-23'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-23')
  },
  // 応募者2の書類選考段階タスク
  {
    id: '5',
    applicantId: '2',
    taskId: 'document-detail-contact',
    status: '完了',
    contactStatus: '済',
    assignedTo: '人事部 佐藤',
    dueDate: new Date('2024-01-18'),
    startedAt: new Date('2024-01-16'),
    completedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '6',
    applicantId: '2',
    taskId: 'document-schedule-contact',
    status: '進行中',
    contactStatus: '○',
    assignedTo: '人事部 佐藤',
    dueDate: new Date('2024-01-30'),
    startedAt: new Date('2024-01-25'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25')
  },
  // 応募者3の面接段階タスク
  {
    id: '7',
    applicantId: '3',
    taskId: 'individual-detail-contact',
    status: '完了',
    contactStatus: '済',
    assignedTo: '人事部 山田',
    dueDate: new Date('2024-01-15'),
    startedAt: new Date('2024-01-13'),
    completedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '8',
    applicantId: '3',
    taskId: 'individual-schedule-contact',
    status: '完了',
    contactStatus: '済',
    assignedTo: '人事部 山田',
    dueDate: new Date('2024-01-20'),
    startedAt: new Date('2024-01-18'),
    completedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '9',
    applicantId: '3',
    taskId: 'individual-remind-contact',
    status: '進行中',
    contactStatus: '未',
    assignedTo: '人事部 山田',
    dueDate: new Date('2024-02-05'),
    startedAt: new Date('2024-01-30'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-30')
  }
];

export const useTaskManagement = () => {
  const [taskInstances, setTaskInstances] = useState<TaskInstance[]>(mockTaskInstances);

  // 応募者のタスクを取得
  const getApplicantTasks = useCallback((applicant: Applicant): (FixedTask & TaskInstance)[] => {
    const currentStage = applicant.currentStage;
    const fixedTasks = getFixedTasksByStage(currentStage);
    
    return fixedTasks.map(fixedTask => {
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
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // 連絡系タスクの場合は初期ステータスを設定
        if (['詳細連絡', '日程調整連絡', 'リマインド', '結果連絡'].includes(fixedTask.type)) {
          newInstance.contactStatus = '未';
        }
        
        setTaskInstances(prev => [...prev, newInstance]);
        return { ...fixedTask, ...newInstance };
      }
    }).sort((a, b) => a.order - b.order);
  }, [taskInstances]);

  // 応募者の特定段階のタスクを取得
  const getApplicantTasksByStage = useCallback((applicant: Applicant, stage: string): (FixedTask & TaskInstance)[] => {
    const fixedTasks = getFixedTasksByStage(stage as any);
    
    return fixedTasks.map(fixedTask => {
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
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // 連絡系タスクの場合は初期ステータスを設定
        if (['詳細連絡', '日程調整連絡', 'リマインド', '結果連絡'].includes(fixedTask.type)) {
          newInstance.contactStatus = '未';
        }
        
        setTaskInstances(prev => [...prev, newInstance]);
        return { ...fixedTask, ...newInstance };
      }
    }).sort((a, b) => a.order - b.order);
  }, [taskInstances]);

  // 次のタスクを取得（現在の段階のみ）
  const getNextTask = useCallback((applicant: Applicant): (FixedTask & TaskInstance) | null => {
    const tasks = getApplicantTasks(applicant);
    return tasks.find(task => task.status === '未着手') || 
           tasks.find(task => task.status === '進行中') || 
           null;
  }, [getApplicantTasks]);

  // 次のタスクを取得（全段階）
  const getNextTaskAllStages = useCallback((applicant: Applicant): (FixedTask & TaskInstance) | null => {
    const allStages = ['エントリー', '書類選考', '会社説明会', '適性検査', '職場見学', '仕事体験', '個別面接', '集団面接', 'CEOセミナー', '人事面接', '最終選考', '内定', '不採用'];
    
    for (const stage of allStages) {
      const tasks = getApplicantTasksByStage(applicant, stage);
      const nextTask = tasks.find(task => task.status === '未着手') || 
                      tasks.find(task => task.status === '進行中');
      if (nextTask) {
        return nextTask;
      }
    }
    
    return null;
  }, [getApplicantTasksByStage]);

  // タスクステータスを更新
  const updateTaskStatus = useCallback((
    taskInstanceId: string, 
    status: TaskStatus,
    contactStatus?: ContactStatus
  ) => {
    setTaskInstances(prev => prev.map(task => {
      if (task.id === taskInstanceId) {
        const updates: Partial<TaskInstance> = {
          status,
          updatedAt: new Date()
        };
        
        if (status === '進行中' && !task.startedAt) {
          updates.startedAt = new Date();
        }
        
        if (status === '完了' && !task.completedAt) {
          updates.completedAt = new Date();
        }
        
        if (contactStatus) {
          updates.contactStatus = contactStatus;
          
          // 連絡系タスクの場合、連絡状況に応じてステータスを自動更新
          // タスクテンプレートから情報を取得して判定
          const allStages = ['エントリー', '書類選考', '会社説明会', '適性検査', '職場見学', '仕事体験', '個別面接', '集団面接', 'CEOセミナー', '人事面接', '最終選考', '内定', '不採用'];
          let isContactTask = false;
          
          for (const stage of allStages) {
            const fixedTasks = getFixedTasksByStage(stage as any);
            const fixedTask = fixedTasks.find(ft => ft.id === task.taskId);
            if (fixedTask && ['詳細連絡', '日程調整連絡', 'リマインド', '結果連絡'].includes(fixedTask.type)) {
              isContactTask = true;
              break;
            }
          }
          
          if (isContactTask) {
            if (contactStatus === '済' || contactStatus === '○') {
              updates.status = '完了';
              if (!task.completedAt) {
                updates.completedAt = new Date();
              }
            } else if (contactStatus === '返信待ち') {
              updates.status = '進行中';
              if (!task.startedAt) {
                updates.startedAt = new Date();
              }
            } else {
              updates.status = '未着手';
            }
          }
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

  // タスクに担当者を割り当て
  const assignTask = useCallback((taskInstanceId: string, assignedTo: string) => {
    setTaskInstances(prev => prev.map(task => 
      task.id === taskInstanceId 
        ? { ...task, assignedTo, updatedAt: new Date() }
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
    assignTask,
    getUpcomingTasks,
    getOverdueTasks,
    getDaysUntilDue,
    getDueStatus
  };
}; 