import { useState, useMemo, useEffect, useCallback } from 'react';
import { Applicant, SelectionStage } from '../types/applicant';
import { supabase } from '@/lib/supabase';

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
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch applicants:', error);
      } else if (data) {
        // データベースのフィールド名をTypeScriptの型定義に合わせて変換
        const transformedData = data.map(item => ({
          id: item.id,
          source: item.source,
          name: item.name,
          nameKana: item.name_kana, // スネークケースからキャメルケースに変換
          gender: item.gender,
          schoolName: item.school_name, // スネークケースからキャメルケースに変換
          faculty: item.faculty,
          department: item.department,
          graduationYear: item.graduation_year, // スネークケースからキャメルケースに変換
          currentAddress: item.current_address, // スネークケースからキャメルケースに変換
          birthplace: item.birthplace,
          phone: item.phone,
          email: item.email,
          currentStage: item.current_stage, // スネークケースからキャメルケースに変換
          experience: item.experience,
          otherCompanyStatus: item.other_company_status, // スネークケースからキャメルケースに変換
          appearance: item.appearance,
          createdAt: item.created_at, // スネークケースからキャメルケースに変換
          updatedAt: item.updated_at, // スネークケースからキャメルケースに変換
        }));
        
        console.log('📊 Transformed applicants data:', transformedData);
        setApplicants(transformedData);
      }
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