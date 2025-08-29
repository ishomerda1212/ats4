import { useState, useEffect } from 'react';
import { Applicant, SelectionHistory } from '../types/applicant';
import { Task, TaskInstance } from '@/features/tasks/types/task';
import { ApplicantDataAccess } from '@/lib/dataAccess/applicantDataAccess';
import { TaskDataAccess } from '@/lib/dataAccess/taskDataAccess';

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
      const currentStage = await ApplicantDataAccess.getCurrentStage(applicantId);
      console.log('📊 Current stage:', currentStage);

      if (!currentStage) {
        console.log('❌ No current stage found');
        setNextTask(null);
        return;
      }

      // 現在の選考段階のステータスを確認
      const currentStageStatus = await ApplicantDataAccess.getCurrentStageStatus(applicantId, currentStage);
      console.log('📊 Current stage history status:', currentStageStatus);

      // 現在の選考段階が「完了」の場合は次のタスクを表示しない
      if (currentStageStatus === '完了') {
        console.log('❌ Current stage is completed, no next task');
        setNextTask(null);
        return;
      }

      // 応募者オブジェクトを作成（最小限の情報）
      const applicantObj = { id: applicantId, currentStage } as Applicant;
      
      // 現在の段階のタスクを取得
      const tasks = await TaskDataAccess.getApplicantTasksByStage(applicantObj, currentStage);
      console.log('📊 Found tasks for current stage:', tasks?.length, tasks);

      if (tasks && tasks.length > 0) {
        // 未完了のタスクを探す
        const nextTask = tasks.find(task => 
          task.status === '未着手' || 
          task.status === '返信待ち' || 
          task.status === '提出待ち'
        );

        if (nextTask) {
          const nextTaskObj = {
            id: nextTask.id,
            applicantId: nextTask.applicantId,
            taskId: nextTask.taskId,
            status: nextTask.status,
            dueDate: nextTask.dueDate,
            completedAt: nextTask.completedAt,
            notes: nextTask.notes,
            createdAt: nextTask.createdAt,
            updatedAt: nextTask.updatedAt,
            title: nextTask.title,
            description: nextTask.description,
            type: nextTask.type
          };
          
          console.log('✅ Next task set:', nextTaskObj);
          setNextTask(nextTaskObj);
        } else {
          console.log('❌ No next task found');
          setNextTask(null);
        }
      } else {
        console.log('❌ No tasks found for current stage');
        setNextTask(null);
      }
    } catch (error) {
      console.error('❌ Error fetching next task:', error);
      setNextTask(null);
    }
  };

  const fetchApplicantDetail = async () => {
    setLoading(true);
    try {
      // 応募者詳細を取得
      const applicantData = await ApplicantDataAccess.getApplicantById(applicantId);
      
      if (applicantData) {
        console.log('📊 Fetched applicant detail:', applicantData);
        setApplicant(applicantData);
      }

      // 選考履歴を取得
      const historyData = await ApplicantDataAccess.getSelectionHistory(applicantId);
      console.log('📊 Fetched history data:', historyData);
      setHistory(historyData);

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