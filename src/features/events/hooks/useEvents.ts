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

  // LocalStorageから読み込んだデータのDateオブジェクトを復元
  const normalizeSessions = (sessions: EventSession[]): EventSession[] => {
    return sessions.map(session => ({
      ...session,
      start: session.start instanceof Date ? session.start : new Date(session.start),
      end: session.end instanceof Date ? session.end : new Date(session.end),
      createdAt: session.createdAt instanceof Date ? session.createdAt : new Date(session.createdAt),
      updatedAt: session.updatedAt instanceof Date ? session.updatedAt : new Date(session.updatedAt),
    }));
  };

  const normalizeParticipants = (participants: EventParticipant[]): EventParticipant[] => {
    return participants.map(participant => ({
      ...participant,
      joinedAt: participant.joinedAt ? (participant.joinedAt instanceof Date ? participant.joinedAt : new Date(participant.joinedAt)) : undefined,
      createdAt: participant.createdAt instanceof Date ? participant.createdAt : new Date(participant.createdAt),
      updatedAt: participant.updatedAt instanceof Date ? participant.updatedAt : new Date(participant.updatedAt),
    }));
  };

  // 正規化されたセッションと参加者データ
  const normalizedSessions = normalizeSessions(eventSessions);
  const normalizedParticipants = normalizeParticipants(eventParticipants);

  const getEventSessions = (eventId: string) => {
    return normalizedSessions.filter(session => session.eventId === eventId);
  };

  const getParticipantsBySession = (sessionId: string) => {
    return normalizedParticipants.filter(participant => participant.sessionId === sessionId);
  };

  const getEventParticipantCount = (eventId: string) => {
    const sessions = getEventSessions(eventId);
    return sessions.reduce((total, session) => {
      return total + getParticipantsBySession(session.id).length;
    }, 0);
  };

  const addEvent = (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEvents(current => [...current, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(current =>
      current.map(event =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date() }
          : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(current => current.filter(event => event.id !== id));
    // 関連するセッションと参加者も削除
    const sessionIds = normalizedSessions.filter(session => session.eventId === id).map(s => s.id);
    setEventSessions(current => current.filter(session => session.eventId !== id));
    setEventParticipants(current => 
      current.filter(participant => !sessionIds.includes(participant.sessionId))
    );
  };

  const addEventSession = (session: Omit<EventSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: EventSession = {
      ...session,
      id: `session-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEventSessions(current => [...current, newSession]);
    return newSession;
  };

  const updateEventSession = (id: string, updates: Partial<EventSession>) => {
    setEventSessions(current =>
      current.map(session =>
        session.id === id
          ? { ...session, ...updates, updatedAt: new Date() }
          : session
      )
    );
  };

  const deleteEventSession = (id: string) => {
    setEventSessions(current => current.filter(session => session.id !== id));
    setEventParticipants(current => 
      current.filter(participant => participant.sessionId !== id)
    );
  };

  const registerParticipant = (participant: Omit<EventParticipant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newParticipant: EventParticipant = {
      ...participant,
      id: `participant-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEventParticipants(current => [...current, newParticipant]);
    return newParticipant;
  };

  const updateParticipantStatus = (id: string, status: ParticipationStatus) => {
    setEventParticipants(current =>
      current.map(participant =>
        participant.id === id
          ? { ...participant, status, updatedAt: new Date() }
          : participant
      )
    );
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