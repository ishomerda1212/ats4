import { supabase } from '@/lib/supabase';
import { performanceMonitor } from '@/shared/utils/performanceMonitor';

export interface UnifiedParticipationData {
  id: string;
  applicantId: string;
  sessionId: string;
  eventId: string;
  stageName: string;
  status: string;
  result?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RawUnifiedParticipationData {
  id: string;
  applicant_id: string;
  session_id: string;
  event_id: string;
  stage_name: string;
  status: string;
  result: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const transformUnifiedParticipationData = (raw: RawUnifiedParticipationData): UnifiedParticipationData => ({
  id: raw.id,
  applicantId: raw.applicant_id,
  sessionId: raw.session_id,
  eventId: raw.event_id,
  stageName: raw.stage_name,
  status: raw.status === '参加済み' ? '参加' : 
          raw.status === '参加予定' ? '参加' : raw.status, // 「参加済み」と「参加予定」を「参加」に統一
  result: raw.result || undefined,
  notes: raw.notes || undefined,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at)
});

export class UnifiedParticipationDataAccess {
  /**
   * 応募者の特定段階の参加状況を取得（統一版）
   */
  static async getApplicantParticipationByStage(
    applicantId: string, 
    stageName: string
  ): Promise<UnifiedParticipationData | null> {
    return await performanceMonitor.measure('UnifiedParticipationDataAccess.getApplicantParticipationByStage', async () => {
      try {
        // console.log('🔍 getApplicantParticipationByStage:', { applicantId, stageName });
        
        const { data, error } = await supabase
          .from('event_participants')
          .select('*')
          .eq('applicant_id', applicantId)
          .eq('stage_name', stageName)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // console.log('❌ No participation found for:', { applicantId, stageName });
            return null; // レコードが見つからない
          }
          console.error('Failed to fetch applicant participation by stage:', error);
          throw error;
        }

        // console.log('✅ Found participation:', data);
        return transformUnifiedParticipationData(data as RawUnifiedParticipationData);
      } catch (error) {
        console.error('Error in getApplicantParticipationByStage:', error);
        throw error;
      }
    });
  }

  /**
   * セッションの参加者一覧を取得（統一版）
   */
  static async getSessionParticipants(sessionId: string): Promise<UnifiedParticipationData[]> {
    return await performanceMonitor.measure('UnifiedParticipationDataAccess.getSessionParticipants', async () => {
      try {
        // console.log('🔍 getSessionParticipants:', { sessionId });
        
        const { data, error } = await supabase
          .from('event_participants')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Failed to fetch session participants:', error);
          throw error;
        }

        // console.log('✅ Found participants:', data);
        return (data as RawUnifiedParticipationData[]).map(transformUnifiedParticipationData);
      } catch (error) {
        console.error('Error in getSessionParticipants:', error);
        throw error;
      }
    });
  }

  /**
   * 応募者の全参加状況を取得
   */
  static async getApplicantParticipations(applicantId: string): Promise<UnifiedParticipationData[]> {
    return await performanceMonitor.measure('UnifiedParticipationDataAccess.getApplicantParticipations', async () => {
      try {
        const { data, error } = await supabase
          .from('event_participants')
          .select('*')
          .eq('applicant_id', applicantId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Failed to fetch applicant participations:', error);
          throw error;
        }

        return (data as RawUnifiedParticipationData[]).map(transformUnifiedParticipationData);
      } catch (error) {
        console.error('Error in getApplicantParticipations:', error);
        throw error;
      }
    });
  }

  /**
   * 参加状況を作成または更新（統一版）
   */
  static async upsertParticipation(participationData: Partial<UnifiedParticipationData>): Promise<UnifiedParticipationData> {
    return await performanceMonitor.measure('UnifiedParticipationDataAccess.upsertParticipation', async () => {
      try {
        const { data, error } = await supabase
          .from('event_participants')
          .upsert({
            applicant_id: participationData.applicantId,
            session_id: participationData.sessionId,
            event_id: participationData.eventId,
            stage_name: participationData.stageName,
            status: participationData.status,
            result: participationData.result,
            notes: participationData.notes,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'applicant_id,stage_name'
          })
          .select()
          .single();

        if (error) {
          console.error('Failed to upsert participation:', error);
          throw error;
        }

        return transformUnifiedParticipationData(data as RawUnifiedParticipationData);
      } catch (error) {
        console.error('Error in upsertParticipation:', error);
        throw error;
      }
    });
  }

  /**
   * 参加状況を更新（統一版）
   */
  static async updateParticipationStatus(
    applicantId: string,
    stageName: string,
    status: string
  ): Promise<void> {
    return await performanceMonitor.measure('UnifiedParticipationDataAccess.updateParticipationStatus', async () => {
      try {
        const { error } = await supabase
          .from('event_participants')
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq('applicant_id', applicantId)
          .eq('stage_name', stageName);

        if (error) {
          console.error('Failed to update participation status:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error in updateParticipationStatus:', error);
        throw error;
      }
    });
  }

  /**
   * セッション参加者の参加状況を更新（統一版）
   * このメソッドはupdateParticipationStatusと同じデータを更新します
   */
  static async updateSessionParticipantStatus(
    sessionId: string,
    applicantId: string,
    status: string
  ): Promise<void> {
    return await performanceMonitor.measure('UnifiedParticipationDataAccess.updateSessionParticipantStatus', async () => {
      try {
        // まず、セッションIDと応募者IDから段階名を取得
        const { data: participant, error: fetchError } = await supabase
          .from('event_participants')
          .select('stage_name')
          .eq('session_id', sessionId)
          .eq('applicant_id', applicantId)
          .single();

        if (fetchError) {
          console.error('Failed to fetch participant for stage name:', fetchError);
          throw fetchError;
        }

        // 段階名を使用してupdateParticipationStatusと同じ方法で更新
        const { error } = await supabase
          .from('event_participants')
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq('applicant_id', applicantId)
          .eq('stage_name', participant.stage_name);

        if (error) {
          console.error('Failed to update session participant status:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error in updateSessionParticipantStatus:', error);
        throw error;
      }
    });
  }
}
