import { useState, useMemo, useEffect, useCallback } from 'react';
import { Applicant, SelectionStage } from '../types/applicant';
import { ApplicantDataAccess } from '@/lib/dataAccess/applicantDataAccess';

export function useApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectionHistory] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<SelectionStage | 'all'>('all');

  // データベースから応募者データを取得
  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApplicantDataAccess.getAllApplicants();
      console.log('📊 Fetched applicants data:', data);
      setApplicants(data);
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  // 応募者データ（履歴は後で実装）
  const applicantsWithHistory = useMemo(() => {
    return applicants.map(applicant => ({
      ...applicant,
      history: [] // 履歴は後で実装
    }));
  }, [applicants]);

  const filteredApplicants = applicantsWithHistory.filter((applicant) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchLower) ||
      applicant.schoolName.toLowerCase().includes(searchLower) ||
      (applicant.phone && applicant.phone.toLowerCase().includes(searchLower)) ||
      (applicant.email && applicant.email.toLowerCase().includes(searchLower));
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
    selectionHistory,
    refresh: fetchApplicants
  };
}