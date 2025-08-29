import { supabase } from '@/lib/supabase';
import { Event, EventSession, EventParticipant } from '@/features/events/types/event';
import { SelectionStage } from '@/features/applicants/types/applicant';
import { performanceMonitor } from '@/shared/utils/performanceMonitor';

// データベースから取得した生データの型
interface RawEvent {
  id: string;
  name: string;
  description: string | null;
  stage: string;
  venue: string | null;
  max_participants: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  sort_order: number | null;
  stage_config: any; // JSONB
}

interface RawEventSession {
  id: string;
  event_id: string;
  name: string;
  start_time: string;
  end_time: string;
  venue: string | null;
  format: string;
  max_participants: number | null;
  zoom_url: string | null;
  notes: string | null;
  recruiter: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface RawEventParticipant {
  id: string;
  session_id: string;
  applicant_id: string;
  status: string;
  result: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// データ変換関数
const transformEvent = (raw: RawEvent): Event => ({
  id: raw.id,
  name: raw.name,
  description: raw.description || '',
  stage: raw.stage as SelectionStage,
  venue: raw.venue || '',
  maxParticipants: raw.max_participants || 0,
  status: raw.status,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at),
  sortOrder: raw.sort_order || 0,
  stageConfig: raw.stage_config || {}
});

const transformEventSession = (raw: RawEventSession): EventSession => {
  // start_timeから日付部分と時刻部分を分離
  const startDateTime = new Date(raw.start_time);
  const startTimeString = startDateTime.toTimeString().slice(0, 5); // HH:MM形式
  
  // end_timeから時刻部分を分離
  const endDateTime = new Date(raw.end_time);
  const endTimeString = endDateTime.toTimeString().slice(0, 5); // HH:MM形式
  
  return {
    id: raw.id,
    eventId: raw.event_id,
    name: raw.name,
    sessionDate: startDateTime,
    startTime: startTimeString,
    endTime: endTimeString,
    venue: raw.venue || '',
    format: raw.format as '対面' | 'オンライン' | 'ハイブリッド',
    maxParticipants: raw.max_participants || 0,
    zoomUrl: raw.zoom_url || undefined,
    notes: raw.notes || undefined,
    recruiter: raw.recruiter || undefined,
    status: raw.status,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at)
  };
};

const transformEventParticipant = (raw: RawEventParticipant): EventParticipant => ({
  id: raw.id,
  sessionId: raw.session_id,
  applicantId: raw.applicant_id,
  status: raw.status as any,
  result: raw.result || undefined,
  notes: raw.notes || '',
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at)
});

export class EventDataAccess {
  /**
   * 全てのイベントを取得
   */
  static async getAllEvents(): Promise<Event[]> {
    return await performanceMonitor.measure('EventDataAccess.getAllEvents', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Failed to fetch events:', error);
          throw error;
        }

        return (data as RawEvent[]).map(transformEvent);
      } catch (error) {
        console.error('Error in getAllEvents:', error);
        throw error;
      }
    });
  }

  /**
   * アクティブなイベントのみを取得
   */
  static async getActiveEvents(): Promise<Event[]> {
    return await performanceMonitor.measure('EventDataAccess.getActiveEvents', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .filter('stage_config->is_active', 'eq', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Failed to fetch active events:', error);
          throw error;
        }

        return (data as RawEvent[]).map(transformEvent);
      } catch (error) {
        console.error('Error in getActiveEvents:', error);
        throw error;
      }
    });
  }

  /**
   * 特定の段階グループのイベントを取得
   */
  static async getEventsByStageGroup(stageGroup: string): Promise<Event[]> {
    return await performanceMonitor.measure('EventDataAccess.getEventsByStageGroup', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .filter('stage_config->stage_group', 'eq', stageGroup)
          .filter('stage_config->is_active', 'eq', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Failed to fetch events by stage group:', error);
          throw error;
        }

        return (data as RawEvent[]).map(transformEvent);
      } catch (error) {
        console.error('Error in getEventsByStageGroup:', error);
        throw error;
      }
    });
  }

  /**
   * セッションが必要なイベントを取得
   */
  static async getEventsRequiringSession(): Promise<Event[]> {
    return await performanceMonitor.measure('EventDataAccess.getEventsRequiringSession', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .filter('stage_config->requires_session', 'eq', true)
          .filter('stage_config->is_active', 'eq', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Failed to fetch events requiring session:', error);
          throw error;
        }

        return (data as RawEvent[]).map(transformEvent);
      } catch (error) {
        console.error('Error in getEventsRequiringSession:', error);
        throw error;
      }
    });
  }

  /**
   * 段階グループ一覧を取得
   */
  static async getStageGroups(): Promise<string[]> {
    return await performanceMonitor.measure('EventDataAccess.getStageGroups', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('stage_config->stage_group')
          .filter('stage_config->is_active', 'eq', true);

        if (error) {
          console.error('Failed to fetch stage groups:', error);
          throw error;
        }

        // 重複を除去して返す
        const stageGroups = data
          .map(item => item.stage_group)
          .filter((group): group is string => group !== null && group !== undefined)
          .filter((group, index, array) => array.indexOf(group) === index);

        return stageGroups;
      } catch (error) {
        console.error('Error in getStageGroups:', error);
        throw error;
      }
    });
  }

  /**
   * 特定のイベントを取得
   */
  static async getEventById(id: string): Promise<Event | null> {
    return await performanceMonitor.measure('EventDataAccess.getEventById', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // レコードが見つからない
          }
          console.error('Failed to fetch event by id:', error);
          throw error;
        }

        return transformEvent(data as RawEvent);
      } catch (error) {
        console.error('Error in getEventById:', error);
        throw error;
      }
    });
  }

  /**
   * イベント名でイベントを取得
   */
  static async getEventByName(name: string): Promise<Event | null> {
    return await performanceMonitor.measure('EventDataAccess.getEventByName', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('name', name)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // レコードが見つからない
          }
          console.error('Failed to fetch event by name:', error);
          throw error;
        }

        return transformEvent(data as RawEvent);
      } catch (error) {
        console.error('Error in getEventByName:', error);
        throw error;
      }
    });
  }

  /**
   * 全てのイベントセッションを取得
   */
  static async getAllEventSessions(): Promise<EventSession[]> {
    return await performanceMonitor.measure('EventDataAccess.getAllEventSessions', async () => {
      try {
        const { data, error } = await supabase
          .from('event_sessions')
          .select('*')
          .order('start_time', { ascending: true });

        if (error) {
          console.error('Failed to fetch event sessions:', error);
          throw error;
        }

        return (data as RawEventSession[]).map(transformEventSession);
      } catch (error) {
        console.error('Error in getAllEventSessions:', error);
        throw error;
      }
    });
  }

  /**
   * 特定のイベントのセッションを取得
   */
  static async getEventSessions(eventId: string): Promise<EventSession[]> {
    return await performanceMonitor.measure('EventDataAccess.getEventSessions', async () => {
      try {
        const { data, error } = await supabase
          .from('event_sessions')
          .select('*')
          .eq('event_id', eventId)
          .order('start_time', { ascending: true });

        if (error) {
          console.error('Failed to fetch event sessions:', error);
          throw error;
        }

        return (data as RawEventSession[]).map(transformEventSession);
      } catch (error) {
        console.error('Error in getEventSessions:', error);
        throw error;
      }
    });
  }

  /**
   * セッション参加者を取得
   */
  static async getSessionParticipants(sessionId: string): Promise<EventParticipant[]> {
    return await performanceMonitor.measure('EventDataAccess.getSessionParticipants', async () => {
      try {
        const { data, error } = await supabase
          .from('event_participants')
          .select('*')
          .eq('session_id', sessionId);

        if (error) {
          console.error('Failed to fetch session participants:', error);
          throw error;
        }

        return (data as RawEventParticipant[]).map(transformEventParticipant);
      } catch (error) {
        console.error('Error in getSessionParticipants:', error);
        throw error;
      }
    });
  }

  /**
   * イベントを作成
   */
  static async createEvent(eventData: Partial<Event>): Promise<Event> {
    return await performanceMonitor.measure('EventDataAccess.createEvent', async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .insert({
            name: eventData.name,
            description: eventData.description,
            stage: eventData.stage,
            venue: eventData.venue,
            max_participants: eventData.maxParticipants,
            status: eventData.status || '予定',
            sort_order: eventData.sortOrder,
            stage_config: eventData.stageConfig || {}
          })
          .select()
          .single();

        if (error) {
          console.error('Failed to create event:', error);
          throw error;
        }

        return transformEvent(data as RawEvent);
      } catch (error) {
        console.error('Error in createEvent:', error);
        throw error;
      }
    });
  }

  /**
   * イベントセッションを作成
   */
  static async createEventSession(sessionData: Partial<EventSession>): Promise<EventSession> {
    return await performanceMonitor.measure('EventDataAccess.createEventSession', async () => {
      try {
        const { data, error } = await supabase
          .from('event_sessions')
          .insert({
            event_id: sessionData.eventId,
            name: sessionData.name,
            start_time: sessionData.startTime,
            end_time: sessionData.endTime,
            venue: sessionData.venue,
            format: sessionData.format,
            max_participants: sessionData.maxParticipants,
            zoom_url: sessionData.zoomUrl,
            notes: sessionData.notes,
            recruiter: sessionData.recruiter,
            status: sessionData.status || '予定'
          })
          .select()
          .single();

        if (error) {
          console.error('Failed to create event session:', error);
          throw error;
        }

        return transformEventSession(data as RawEventSession);
      } catch (error) {
        console.error('Error in createEventSession:', error);
        throw error;
      }
    });
  }

  /**
   * 参加者ステータスを更新
   */
  static async updateParticipantStatus(
    sessionId: string, 
    applicantId: string, 
    status: string
  ): Promise<void> {
    return await performanceMonitor.measure('EventDataAccess.updateParticipantStatus', async () => {
      try {
        const { error } = await supabase
          .from('event_participants')
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', sessionId)
          .eq('applicant_id', applicantId);

        if (error) {
          console.error('Failed to update participant status:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error in updateParticipantStatus:', error);
        throw error;
      }
    });
  }
}
