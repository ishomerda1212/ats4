import { useState, useEffect } from 'react';
import { Applicant, SelectionHistory } from '../types/applicant';
import { Task } from '@/features/tasks/types/task';
import { mockApplicants, mockSelectionHistory, mockTasks } from '@/shared/data/mockData';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export function useApplicantDetail(applicantId: string) {
  // デバッグ用: ローカルストレージをリセット
  useEffect(() => {
    // 開発環境でのみ実行
    if (import.meta.env.DEV) {
      localStorage.removeItem('selectionHistory');
      localStorage.removeItem('applicants');
      localStorage.removeItem('tasks');
    }
  }, []);

  const [applicants] = useLocalStorage<Applicant[]>('applicants', mockApplicants);
  const [selectionHistory] = useLocalStorage<SelectionHistory[]>('selectionHistory', mockSelectionHistory);
  const [tasks] = useLocalStorage<Task[]>('tasks', mockTasks);
  
  const [loading] = useState(false);

  const applicant = applicants.find(a => a.id === applicantId);
  const history = selectionHistory
    .filter(h => h.applicantId === applicantId)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); // 新しい日付を上に
  const applicantTasks = tasks.filter(t => 
    t.selectionHistoryId && history.some(h => h.id === t.selectionHistoryId)
  );

  // 各選考段階の詳細データを取得（現在は空のオブジェクト）
  const stageDetails: Record<string, Record<string, unknown>> = {};

  return {
    applicant,
    history,
    tasks: applicantTasks,
    stageDetails,
    loading
  };
}