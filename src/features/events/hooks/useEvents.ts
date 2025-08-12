import { useState } from 'react';
import { Event, EventSession, EventParticipant, ParticipationStatus } from '../types/event';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { mockEvents, mockEventSessions, mockEventParticipants } from '@/shared/data/mockEventData';

export function useEvents() {
  const [events, setEvents] = useLocalStorage<Event[]>('events', mockEvents);
  const [eventSessions, setEventSessions] = useLocalStorage<EventSession[]>('eventSessions', mockEventSessions);
  const [eventParticipants, setEventParticipants] = useLocalStorage<EventParticipant[]>('eventParticipants', mockEventParticipants);
  const [loading] = useState(false);

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
    const sessionIds = eventSessions.filter(session => session.eventId === id).map(s => s.id);
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