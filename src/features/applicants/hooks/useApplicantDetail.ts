import { useState, useEffect } from 'react';
import { Applicant, SelectionHistory } from '../types/applicant';
import { Task } from '@/features/tasks/types/task';
import { supabase } from '@/lib/supabase';

export function useApplicantDetail(applicantId: string) {
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [history, setHistory] = useState<SelectionHistory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplicantDetail = async () => {
      setLoading(true);
      try {
        // 応募者詳細を取得
        const { data: applicantData, error: applicantError } = await supabase
          .from('applicants')
          .select('*')
          .eq('id', applicantId)
          .single();

        if (applicantError) {
          console.error('Failed to fetch applicant:', applicantError);
        } else if (applicantData) {
          // データベースのフィールド名をTypeScriptの型定義に合わせて変換
          const transformedApplicant: Applicant = {
            id: applicantData.id,
            source: applicantData.source,
            name: applicantData.name,
            nameKana: applicantData.name_kana, // スネークケースからキャメルケースに変換
            gender: applicantData.gender,
            schoolName: applicantData.school_name, // スネークケースからキャメルケースに変換
            faculty: applicantData.faculty,
            department: applicantData.department,
            graduationYear: applicantData.graduation_year, // スネークケースからキャメルケースに変換
            currentAddress: applicantData.current_address, // スネークケースからキャメルケースに変換
            birthplace: applicantData.birthplace,
            phone: applicantData.phone,
            email: applicantData.email,
            currentStage: applicantData.current_stage, // スネークケースからキャメルケースに変換
            experience: applicantData.experience,
            otherCompanyStatus: applicantData.other_company_status, // スネークケースからキャメルケースに変換
            appearance: applicantData.appearance,
            createdAt: applicantData.created_at, // スネークケースからキャメルケースに変換
            updatedAt: applicantData.updated_at, // スネークケースからキャメルケースに変換
          };
          
          console.log('📊 Transformed applicant detail:', transformedApplicant);
          setApplicant(transformedApplicant);
        }

        // 選考履歴を取得
        const { data: historyData, error: historyError } = await supabase
          .from('selection_histories')
          .select('*')
          .eq('applicant_id', applicantId)
          .order('created_at', { ascending: false });

        if (historyError) {
          console.error('Failed to fetch history:', historyError);
        } else if (historyData) {
          // 選考履歴のデータも変換
          const transformedHistory: SelectionHistory[] = historyData.map(item => ({
            id: item.id,
            applicantId: item.applicant_id, // スネークケースからキャメルケースに変換
            stage: item.stage,
            endDate: item.end_date ? new Date(item.end_date) : undefined, // スネークケースからキャメルケースに変換
            status: item.status,
            notes: item.notes,
            createdAt: item.created_at, // スネークケースからキャメルケースに変換
            updatedAt: item.updated_at, // スネークケースからキャメルケースに変換
          }));
          
          console.log('📊 Transformed history data:', transformedHistory);
          setHistory(transformedHistory);
        }

        // タスクを取得（後で実装）
        setTasks([]);

      } catch (error) {
        console.error('Failed to fetch applicant detail:', error);
      } finally {
        setLoading(false);
      }
    };

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
    stageDetails,
    loading
  };
}