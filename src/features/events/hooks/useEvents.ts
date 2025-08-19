import { useState, useEffect } from 'react';
import { Event, EventSession, EventParticipant, ParticipationStatus } from '../types/event';
import { supabase } from '@/lib/supabase';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventSessions, setEventSessions] = useState<EventSession[]>([]);
  const [eventParticipants, setEventParticipants] = useState<EventParticipant[]>([]);
  const [loading, setLoading] = useState(false);

  // データベースからイベントデータを取得
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to fetch events:', error);
        } else if (data) {
          setEvents(data as Event[]);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // データベースからイベントセッションデータを取得
  useEffect(() => {
    const fetchEventSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('event_sessions')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Failed to fetch event sessions:', error);
        } else if (data) {
          // データベースのデータをフロントエンドの型に変換
          const sessions: EventSession[] = data.map((row: any) => ({
            id: row.id,
            eventId: row.event_id,
            name: row.name,
            start: new Date(row.start_time),
            end: new Date(row.end_time),
            venue: row.venue,
            format: row.format,
            zoomUrl: row.zoom_url,
            notes: row.notes,
            participants: [], // 参加者は別途取得
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
          }));
          setEventSessions(sessions);
        }
      } catch (error) {
        console.error('Failed to fetch event sessions:', error);
      }
    };

    fetchEventSessions();
  }, []);

  // データベースからイベント参加者データを取得
  useEffect(() => {
    const fetchEventParticipants = async () => {
      try {
        const { data, error } = await supabase
          .from('event_participants')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to fetch event participants:', error);
        } else if (data) {
          // データベースのデータをフロントエンドの型に変換
          const participants: EventParticipant[] = data.map((row: any) => ({
            id: row.id,
            sessionId: row.session_id,
            applicantId: row.applicant_id,
            status: row.status,
            joinedAt: row.joined_at ? new Date(row.joined_at) : undefined,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
          }));
          setEventParticipants(participants);
        }
      } catch (error) {
        console.error('Failed to fetch event participants:', error);
      }
    };

    fetchEventParticipants();
  }, []);

  const getEventSessions = (eventId: string) => {
    return eventSessions.filter(session => session.eventId === eventId);
  };

  const getParticipantsBySession = (sessionId: string) => {
    return eventParticipants.filter(participant => participant.sessionId === sessionId);
  };

  const getEventParticipantCount = (eventId: string) => {
    const sessions = getEventSessions(eventId);
    return sessions.reduce((total, session) => {
      return total + getParticipantsBySession(session.id).length;
    }, 0);
  };

  const addEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          id: crypto.randomUUID(),
          title: event.name,
          description: event.description,
          type: event.stage,
          start_date: new Date().toISOString(), // Event型にはstartDateがないため、現在時刻を使用
          end_date: new Date().toISOString(), // Event型にはendDateがないため、現在時刻を使用
          venue: event.venue,
          max_participants: event.maxParticipants,
          status: event.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to add event:', error);
        throw error;
      }

      const newEvent: Event = {
        ...event,
        id: data.id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      setEvents(current => [...current, newEvent]);
      return newEvent;
    } catch (error) {
      console.error('Failed to add event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name) updateData.title = updates.name;
      if (updates.description) updateData.description = updates.description;
      if (updates.stage) updateData.type = updates.stage;
      if (updates.venue) updateData.venue = updates.venue;
      if (updates.maxParticipants) updateData.max_participants = updates.maxParticipants;
      if (updates.status) updateData.status = updates.status;

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Failed to update event:', error);
        throw error;
      }

      setEvents(current =>
        current.map(event =>
          event.id === id
            ? { ...event, ...updates, updatedAt: new Date() }
            : event
        )
      );
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete event:', error);
        throw error;
      }

      setEvents(current => current.filter(event => event.id !== id));
      // 関連するセッションと参加者も削除
      const sessionIds = eventSessions.filter(session => session.eventId === id).map(s => s.id);
      setEventSessions(current => current.filter(session => session.eventId !== id));
      setEventParticipants(current => 
        current.filter(participant => !sessionIds.includes(participant.sessionId))
      );
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  };

  const addEventSession = async (session: Omit<EventSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('event_sessions')
        .insert({
          id: crypto.randomUUID(),
          event_id: session.eventId,
          name: session.name,
          start_time: session.start.toISOString(),
          end_time: session.end.toISOString(),
          venue: session.venue,
          format: session.format,
          zoom_url: session.zoomUrl || null,
          notes: session.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to add event session:', error);
        throw error;
      }

      const newSession: EventSession = {
        ...session,
        id: data.id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      setEventSessions(current => [...current, newSession]);
      return newSession;
    } catch (error) {
      console.error('Failed to add event session:', error);
      throw error;
    }
  };

  const updateEventSession = async (id: string, updates: Partial<EventSession>) => {
    try {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name) updateData.name = updates.name;
      if (updates.start) updateData.start_time = updates.start.toISOString();
      if (updates.end) updateData.end_time = updates.end.toISOString();
      if (updates.venue) updateData.venue = updates.venue;
      if (updates.format) updateData.format = updates.format;
      if (updates.zoomUrl !== undefined) updateData.zoom_url = updates.zoomUrl;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { error } = await supabase
        .from('event_sessions')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Failed to update event session:', error);
        throw error;
      }

      setEventSessions(current =>
        current.map(session =>
          session.id === id
            ? { ...session, ...updates, updatedAt: new Date() }
            : session
        )
      );
    } catch (error) {
      console.error('Failed to update event session:', error);
      throw error;
    }
  };

  const deleteEventSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_sessions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete event session:', error);
        throw error;
      }

      setEventSessions(current => current.filter(session => session.id !== id));
      setEventParticipants(current => 
        current.filter(participant => participant.sessionId !== id)
      );
    } catch (error) {
      console.error('Failed to delete event session:', error);
      throw error;
    }
  };

  const registerParticipant = async (participant: Omit<EventParticipant, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .insert({
          id: crypto.randomUUID(),
          session_id: participant.sessionId,
          applicant_id: participant.applicantId,
          status: participant.status,
          joined_at: participant.joinedAt?.toISOString() || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to register participant:', error);
        throw error;
      }

      const newParticipant: EventParticipant = {
        ...participant,
        id: data.id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
      setEventParticipants(current => [...current, newParticipant]);
      return newParticipant;
    } catch (error) {
      console.error('Failed to register participant:', error);
      throw error;
    }
  };

  const updateParticipantStatus = async (id: string, status: ParticipationStatus) => {
    try {
      const { error } = await supabase
        .from('event_participants')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Failed to update participant status:', error);
        throw error;
      }

      setEventParticipants(current =>
        current.map(participant =>
          participant.id === id
            ? { ...participant, status, updatedAt: new Date() }
            : participant
        )
      );
    } catch (error) {
      console.error('Failed to update participant status:', error);
      throw error;
    }
  };

  return {
    events,
    eventSessions,
    eventParticipants,
    loading,
    getEventSessions,
    getParticipantsBySession,
    getEventParticipantCount,
    addEvent,
    updateEvent,
    deleteEvent,
    addEventSession,
    updateEventSession,
    deleteEventSession,
    registerParticipant,
    updateParticipantStatus,
  };
}