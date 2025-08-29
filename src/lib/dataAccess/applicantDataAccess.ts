import { supabase } from '@/lib/supabase';
import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';
import { performanceMonitor } from '@/shared/utils/performanceMonitor';

// データベースから取得した生データの型
interface RawApplicant {
  id: string;
  source: string;
  name: string;
  name_kana: string;
  gender: string | null;
  school_name: string | null;
  faculty: string | null;
  department: string | null;
  graduation_year: string | null;
  current_address: string | null;
  birthplace: string | null;
  phone: string | null;
  email: string | null;
  current_stage: string;
  experience: string | null;
  other_company_status: string | null;
  appearance: string | null;
  created_at: string;
  updated_at: string;
}

interface RawSelectionHistory {
  id: string;
  applicant_id: string;
  stage: string;
  status: string;
  notes: string | null;
  session_type: string | null;
  result: string | null;
  created_at: string;
  updated_at: string;
}

// データ変換関数
const transformApplicant = (raw: RawApplicant): Applicant => ({
  id: raw.id,
  source: raw.source,
  name: raw.name,
  nameKana: raw.name_kana,
  gender: raw.gender,
  schoolName: raw.school_name,
  faculty: raw.faculty,
  department: raw.department,
  graduationYear: raw.graduation_year,
  currentAddress: raw.current_address,
  birthplace: raw.birthplace,
  phone: raw.phone,
  email: raw.email,
  currentStage: raw.current_stage,
  experience: raw.experience,
  otherCompanyStatus: raw.other_company_status,
  appearance: raw.appearance,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at),
});

const transformSelectionHistory = (raw: RawSelectionHistory): SelectionHistory => ({
  id: raw.id,
  applicantId: raw.applicant_id,
  stage: raw.stage,
  status: raw.status,
  notes: raw.notes || '',
  sessionType: raw.session_type,
  result: raw.result,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at),
});

export class ApplicantDataAccess {
  /**
   * 全ての応募者を取得
   */
  static async getAllApplicants(): Promise<Applicant[]> {
    return await performanceMonitor.measure('ApplicantDataAccess.getAllApplicants', async () => {
      try {
        const { data, error } = await supabase
          .from('applicants')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to fetch applicants:', error);
          throw error;
        }

        return (data as RawApplicant[]).map(transformApplicant);
      } catch (error) {
        console.error('Error in getAllApplicants:', error);
        throw error;
      }
    });
  }

  /**
   * 応募者詳細を取得
   */
  static async getApplicantById(applicantId: string): Promise<Applicant | null> {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('id', applicantId)
        .single();

      if (error) {
        console.error('Failed to fetch applicant:', error);
        throw error;
      }

      return data ? transformApplicant(data as RawApplicant) : null;
    } catch (error) {
      console.error('Error in getApplicantById:', error);
      throw error;
    }
  }

  /**
   * 応募者の選考履歴を取得
   */
  static async getSelectionHistory(applicantId: string): Promise<SelectionHistory[]> {
    try {
      const { data, error } = await supabase
        .from('selection_histories')
        .select('*')
        .eq('applicant_id', applicantId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to fetch selection history:', error);
        throw error;
      }

      return (data as RawSelectionHistory[]).map(transformSelectionHistory);
    } catch (error) {
      console.error('Error in getSelectionHistory:', error);
      throw error;
    }
  }

  /**
   * 応募者を作成
   */
  static async createApplicant(applicantData: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Applicant> {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .insert([{
          source: applicantData.source,
          name: applicantData.name,
          name_kana: applicantData.nameKana,
          gender: applicantData.gender,
          school_name: applicantData.schoolName,
          faculty: applicantData.faculty,
          department: applicantData.department,
          graduation_year: applicantData.graduationYear,
          current_address: applicantData.currentAddress,
          birthplace: applicantData.birthplace,
          phone: applicantData.phone,
          email: applicantData.email,
          current_stage: applicantData.currentStage,
          experience: applicantData.experience,
          other_company_status: applicantData.otherCompanyStatus,
          appearance: applicantData.appearance,
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to create applicant:', error);
        throw error;
      }

      return transformApplicant(data as RawApplicant);
    } catch (error) {
      console.error('Error in createApplicant:', error);
      throw error;
    }
  }

  /**
   * 応募者を更新
   */
  static async updateApplicant(applicantId: string, updates: Partial<Applicant>): Promise<Applicant> {
    try {
      const updateData: any = {};
      
      // キャメルケースからスネークケースに変換
      if (updates.nameKana !== undefined) updateData.name_kana = updates.nameKana;
      if (updates.schoolName !== undefined) updateData.school_name = updates.schoolName;
      if (updates.graduationYear !== undefined) updateData.graduation_year = updates.graduationYear;
      if (updates.currentAddress !== undefined) updateData.current_address = updates.currentAddress;
      if (updates.currentStage !== undefined) updateData.current_stage = updates.currentStage;
      if (updates.otherCompanyStatus !== undefined) updateData.other_company_status = updates.otherCompanyStatus;
      
      // その他のフィールド
      if (updates.source !== undefined) updateData.source = updates.source;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.gender !== undefined) updateData.gender = updates.gender;
      if (updates.faculty !== undefined) updateData.faculty = updates.faculty;
      if (updates.department !== undefined) updateData.department = updates.department;
      if (updates.birthplace !== undefined) updateData.birthplace = updates.birthplace;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.experience !== undefined) updateData.experience = updates.experience;
      if (updates.appearance !== undefined) updateData.appearance = updates.appearance;

      const { data, error } = await supabase
        .from('applicants')
        .update(updateData)
        .eq('id', applicantId)
        .select()
        .single();

      if (error) {
        console.error('Failed to update applicant:', error);
        throw error;
      }

      return transformApplicant(data as RawApplicant);
    } catch (error) {
      console.error('Error in updateApplicant:', error);
      throw error;
    }
  }

  /**
   * 選考履歴を作成
   */
  static async createSelectionHistory(historyData: Omit<SelectionHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<SelectionHistory> {
    try {
      const { data, error } = await supabase
        .from('selection_histories')
        .insert([{
          applicant_id: historyData.applicantId,
          stage: historyData.stage,
          status: historyData.status,
          notes: historyData.notes,
          session_type: historyData.sessionType,
          result: historyData.result,
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to create selection history:', error);
        throw error;
      }

      return transformSelectionHistory(data as RawSelectionHistory);
    } catch (error) {
      console.error('Error in createSelectionHistory:', error);
      throw error;
    }
  }

  /**
   * 応募者の現在の選考段階を取得
   */
  static async getCurrentStage(applicantId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .select('current_stage')
        .eq('id', applicantId)
        .single();

      if (error) {
        console.error('Failed to fetch current stage:', error);
        throw error;
      }

      return data?.current_stage || null;
    } catch (error) {
      console.error('Error in getCurrentStage:', error);
      throw error;
    }
  }

  /**
   * 応募者の現在の選考段階のステータスを取得
   */
  static async getCurrentStageStatus(applicantId: string, stage: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('selection_histories')
        .select('status')
        .eq('applicant_id', applicantId)
        .eq('stage', stage)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Failed to fetch current stage status:', error);
        throw error;
      }

      return data?.status || null;
    } catch (error) {
      console.error('Error in getCurrentStageStatus:', error);
      throw error;
    }
  }
}
