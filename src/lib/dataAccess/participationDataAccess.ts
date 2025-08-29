import { supabase } from '@/lib/supabase';
import { performanceMonitor } from '@/shared/utils/performanceMonitor';

export interface ParticipationData {
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

interface RawParticipationData {
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

const transformParticipationData = (raw: RawParticipationData): ParticipationData => ({
  id: raw.id,
  applicantId: raw.applicant_id,
  sessionId: raw.session_id,
  eventId: raw.event_id,
  stageName: raw.stage_name,
  status: raw.status,
  result: raw.result || undefined,
  notes: raw.notes || undefined,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at)
});

export class ParticipationDataAccess {
  /**
   * 応募者の特定段階の参加状況を取得
   */
  static async getApplicantParticipationByStage(
    applicantId: string, 
    stageName: string
  ): Promise<ParticipationData | null> {
    return await performanceMonitor.measure('ParticipationDataAccess.getApplicantParticipationByStage', async () => {
      try {
        const { data, error } = await supabase
          .from('event_participants')
          .select('*')
          .eq('applicant_id', applicantId)
          .eq('stage_name', stageName)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // レコードが見つからない
          }
          console.error('Failed to fetch applicant participation by stage:', error);
          throw error;
        }

        return transformParticipationData(data as RawParticipationData);
      } catch (error) {
        console.error('Error in getApplicantParticipationByStage:', error);
        throw error;
      }
    });
  }

  /**
   * 応募者の全参加状況を取得
   */
  static async getApplicantParticipations(applicantId: string): Promise<ParticipationData[]> {
    return await performanceMonitor.measure('ParticipationDataAccess.getApplicantParticipations', async () => {
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

        return (data as RawParticipationData[]).map(transformParticipationData);
      } catch (error) {
        console.error('Error in getApplicantParticipations:', error);
        throw error;
      }
    });
  }

  /**
   * 参加状況を作成または更新
   */
  static async upsertParticipation(participationData: Partial<ParticipationData>): Promise<ParticipationData> {
    return await performanceMonitor.measure('ParticipationDataAccess.upsertParticipation', async () => {
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

        return transformParticipationData(data as RawParticipationData);
      } catch (error) {
        console.error('Error in upsertParticipation:', error);
        throw error;
      }
    });
  }

  /**
   * 参加状況を更新
   */
  static async updateParticipationStatus(
    applicantId: string,
    stageName: string,
    status: string
  ): Promise<void> {
    return await performanceMonitor.measure('ParticipationDataAccess.updateParticipationStatus', async () => {
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
}
