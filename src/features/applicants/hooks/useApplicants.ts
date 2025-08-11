import { useState, useMemo } from 'react';
import { Applicant, SelectionStage } from '../types/applicant';
import { mockApplicants, mockSelectionHistory } from '@/shared/data/mockData';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export function useApplicants() {
  const [applicants, setApplicants] = useLocalStorage<Applicant[]>('applicants', mockApplicants);
  const [selectionHistory] = useLocalStorage('selectionHistory', mockSelectionHistory);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<SelectionStage | 'all'>('all');

  // 応募者データに履歴を結合
  const applicantsWithHistory = useMemo(() => {
    return applicants.map(applicant => ({
      ...applicant,
      history: selectionHistory.filter(history => history.applicantId === applicant.id)
    }));
  }, [applicants, selectionHistory]);

  const filteredApplicants = applicantsWithHistory.filter((applicant) => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || applicant.currentStage === selectedStage;
    
    return matchesSearch && matchesStage;
  });

  const getStageCount = (stage: SelectionStage) => {
    return applicantsWithHistory.filter(applicant => applicant.currentStage === stage).length;
  };

  const updateApplicant = (id: string, updates: Partial<Applicant>) => {
    setApplicants(current => 
      current.map(applicant => 
        applicant.id === id 
          ? { ...applicant, ...updates, updatedAt: new Date() }
          : applicant
      )
    );
  };

  const addApplicant = (applicant: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newApplicant: Applicant = {
      ...applicant,
      id: `applicant-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setApplicants(current => [...current, newApplicant]);
    return newApplicant;
  };

  return {
    applicants: filteredApplicants,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStage,
    setSelectedStage,
    getStageCount,
    updateApplicant,
    addApplicant,
    selectionHistory
  };
}