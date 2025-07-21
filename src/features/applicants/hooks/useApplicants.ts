import { useState } from 'react';
import { Applicant, SelectionStage } from '../types/applicant';
import { mockApplicants } from '@/shared/data/mockData';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export function useApplicants() {
  const [applicants, setApplicants] = useLocalStorage<Applicant[]>('applicants', mockApplicants);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<SelectionStage | 'all'>('all');

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || applicant.currentStage === selectedStage;
    
    return matchesSearch && matchesStage;
  });

  const getStageCount = (stage: SelectionStage) => {
    return applicants.filter(applicant => applicant.currentStage === stage).length;
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

  return {
    applicants: filteredApplicants,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStage,
    setSelectedStage,
    getStageCount,
    updateApplicant
  };
}