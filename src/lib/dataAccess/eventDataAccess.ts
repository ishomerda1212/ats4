import { supabase } from '@/lib/supabase';
import { Event, EventSession, EventParticipant, ParticipationStatus } from '@/features/events/types/event';

// データベースから取得した生データの型
interface RawEvent {
  id: string;
  name: string;
  description: string;
  stage: string;
  venue: string;
  max_participants: number;
  status: string;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

interface RawEventSession {
  id: string;
  event_id: string;
  name: string;
  start_time: string;
  end_time: string;
  venue: string;
  format: string;
  zoom_url: string | null;
  notes: string | null;
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
  description: raw.description,
  stage: raw.stage,
  venue: raw.venue,
  maxParticipants: raw.max_participants,
  status: raw.status as Event['status'],
  sortOrder: raw.sort_order || 0,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at),
});

const transformEventSession = (raw: RawEventSession): EventSession => ({
  id: raw.id,
  eventId: raw.event_id,
  name: raw.name,
  start: new Date(raw.start_time),
  end: new Date(raw.end_time),
  venue: raw.venue,
  format: raw.format as '対面' | 'オンライン' | 'ハイブリッド',
  zoomUrl: raw.zoom_url,
  notes: raw.notes,
  participants: [], // 参加者は別途取得
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at),
});

const transformEventParticipant = (raw: RawEventParticipant): EventParticipant => ({
  id: raw.id,
  sessionId: raw.session_id,
  applicantId: raw.applicant_id,
  status: raw.status as ParticipationStatus,
  result: raw.result,
  notes: raw.notes || '',
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at),
});

export class EventDataAccess {
  /**
   * 全てのイベントを取得
   */
  static async getAllEvents(): Promise<Event[]> {
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
  }

  /**
   * イベント詳細を取得
   */
  static async getEventById(eventId: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Failed to fetch event:', error);
        throw error;
      }

      return data ? transformEvent(data as RawEvent) : null;
    } catch (error) {
      console.error('Error in getEventById:', error);
      throw error;
    }
  }

  /**
   * イベントのセッション一覧を取得
   */
  static async getEventSessions(eventId: string): Promise<EventSession[]> {
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
  }

  /**
   * 全てのイベントセッションを取得
   */
  static async getAllEventSessions(): Promise<EventSession[]> {
    try {
      const { data, error } = await supabase
        .from('event_sessions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to fetch event sessions:', error);
        throw error;
      }

      return (data as RawEventSession[]).map(transformEventSession);
    } catch (error) {
      console.error('Error in getAllEventSessions:', error);
      throw error;
    }
  }

  /**
   * セッションの参加者一覧を取得
   */
  static async getSessionParticipants(sessionId: string): Promise<EventParticipant[]> {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to fetch session participants:', error);
        throw error;
      }

      return (data as RawEventParticipant[]).map(transformEventParticipant);
    } catch (error) {
      console.error('Error in getSessionParticipants:', error);
      throw error;
    }
  }

  /**
   * イベントを作成
   */
  static async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          name: eventData.name,
          description: eventData.description,
          stage: eventData.stage,
          venue: eventData.venue,
          max_participants: eventData.maxParticipants,
          status: eventData.status,
          sort_order: eventData.sortOrder,
        }])
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
  }

  /**
   * イベントセッションを作成
   */
  static async createEventSession(sessionData: Omit<EventSession, 'id' | 'createdAt' | 'updatedAt' | 'participants'>): Promise<EventSession> {
    try {
      const { data, error } = await supabase
        .from('event_sessions')
        .insert([{
          event_id: sessionData.eventId,
          name: sessionData.name,
          start_time: sessionData.start.toISOString(),
          end_time: sessionData.end.toISOString(),
          venue: sessionData.venue,
          format: sessionData.format,
          zoom_url: sessionData.zoomUrl,
          notes: sessionData.notes,
        }])
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
  }

  /**
   * イベント参加者を登録
   */
  static async registerParticipant(participantData: Omit<EventParticipant, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventParticipant> {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .insert([{
          session_id: participantData.sessionId,
          applicant_id: participantData.applicantId,
          status: participantData.status,
          result: participantData.result,
          notes: participantData.notes,
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to register participant:', error);
        throw error;
      }

      return transformEventParticipant(data as RawEventParticipant);
    } catch (error) {
      console.error('Error in registerParticipant:', error);
      throw error;
    }
  }

  /**
   * 参加者ステータスを更新
   */
  static async updateParticipantStatus(participantId: string, status: ParticipationStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('event_participants')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', participantId);

      if (error) {
        console.error('Failed to update participant status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateParticipantStatus:', error);
      throw error;
    }
  }

  /**
   * 参加者結果を更新
   */
  static async updateParticipantResult(participantId: string, result: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('event_participants')
        .update({
          result,
          updated_at: new Date().toISOString()
        })
        .eq('id', participantId);

      if (error) {
        console.error('Failed to update participant result:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateParticipantResult:', error);
      throw error;
    }
  }

  /**
   * イベントセッションを更新
   */
  static async updateEventSession(sessionId: string, updates: Partial<EventSession>): Promise<EventSession> {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.start !== undefined) updateData.start_time = updates.start.toISOString();
      if (updates.end !== undefined) updateData.end_time = updates.end.toISOString();
      if (updates.venue !== undefined) updateData.venue = updates.venue;
      if (updates.format !== undefined) updateData.format = updates.format;
      if (updates.zoomUrl !== undefined) updateData.zoom_url = updates.zoomUrl;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { data, error } = await supabase
        .from('event_sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        console.error('Failed to update event session:', error);
        throw error;
      }

      return transformEventSession(data as RawEventSession);
    } catch (error) {
      console.error('Error in updateEventSession:', error);
      throw error;
    }
  }

  /**
   * イベントセッションを削除
   */
  static async deleteEventSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('event_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Failed to delete event session:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteEventSession:', error);
      throw error;
    }
  }
}
