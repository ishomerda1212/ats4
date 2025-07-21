import { useState } from 'react';
import { Evaluation } from '../types/evaluation';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { mockEvaluations } from '@/shared/data/mockData';

export function useEvaluations(applicantId?: string, selectionHistoryId?: string) {
  const [evaluations] = useLocalStorage<Evaluation[]>('evaluations', mockEvaluations);
  const [loading] = useState(false);

  const filteredEvaluations = evaluations.filter(evaluation => {
    if (applicantId && evaluation.applicantId !== applicantId) return false;
    if (selectionHistoryId && evaluation.selectionHistoryId !== selectionHistoryId) return false;
    return true;
  });

  return {
    evaluations: filteredEvaluations,
    loading,
  };
}