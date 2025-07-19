import { useState } from 'react';
import { Applicant, SelectionHistory, Evaluation, Task } from '../types/applicant';
import { mockApplicants, mockSelectionHistory, mockEvaluations, mockTasks } from '@/shared/data/mockData';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export function useApplicantDetail(applicantId: string) {
  const [applicants] = useLocalStorage<Applicant[]>('applicants', mockApplicants);
  const [selectionHistory] = useLocalStorage<SelectionHistory[]>('selectionHistory', mockSelectionHistory);
  const [evaluations] = useLocalStorage<Evaluation[]>('evaluations', mockEvaluations);
  const [tasks] = useLocalStorage<Task[]>('tasks', mockTasks);
  
  const [loading, setLoading] = useState(false);

  const applicant = applicants.find(a => a.id === applicantId);
  const history = selectionHistory.filter(h => h.applicantId === applicantId);
  const applicantEvaluations = evaluations.filter(e => e.applicantId === applicantId);
  const applicantTasks = tasks.filter(t => 
    history.some(h => h.id === t.selectionHistoryId)
  );

  return {
    applicant,
    history,
    evaluations: applicantEvaluations,
    tasks: applicantTasks,
    loading
  };
}