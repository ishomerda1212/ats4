import { useState, useEffect } from 'react';
import { Applicant, SelectionHistory, Evaluation, Task } from '../types/applicant';
import { mockApplicants, mockSelectionHistory, mockEvaluations, mockTasks, mockStageDetails } from '@/shared/data/mockData';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export function useApplicantDetail(applicantId: string) {
  // デバッグ用: ローカルストレージをリセット
  useEffect(() => {
    // 開発環境でのみ実行
    if (import.meta.env.DEV) {
      localStorage.removeItem('selectionHistory');
      localStorage.removeItem('applicants');
      localStorage.removeItem('evaluations');
      localStorage.removeItem('tasks');
    }
  }, []);

  const [applicants] = useLocalStorage<Applicant[]>('applicants', mockApplicants);
  const [selectionHistory] = useLocalStorage<SelectionHistory[]>('selectionHistory', mockSelectionHistory);
  const [evaluations] = useLocalStorage<Evaluation[]>('evaluations', mockEvaluations);
  const [tasks] = useLocalStorage<Task[]>('tasks', mockTasks);
  
  const [loading] = useState(false);

  const applicant = applicants.find(a => a.id === applicantId);
  const history = selectionHistory.filter(h => h.applicantId === applicantId);
  const applicantEvaluations = evaluations.filter(e => e.applicantId === applicantId);
  const applicantTasks = tasks.filter(t => 
    history.some(h => h.id === t.selectionHistoryId)
  );

  // 各選考段階の詳細データを取得
  const stageDetails: Record<string, Record<string, unknown>> = history.reduce((acc, stage) => {
    const details = mockStageDetails[stage.id as keyof typeof mockStageDetails];
    if (details) {
      acc[stage.id] = details as Record<string, unknown>;
    }
    return acc;
  }, {} as Record<string, Record<string, unknown>>);

  return {
    applicant,
    history,
    evaluations: applicantEvaluations,
    tasks: applicantTasks,
    stageDetails,
    loading
  };
}