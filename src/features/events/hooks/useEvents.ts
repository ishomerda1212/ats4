import { useState, useCallback, useEffect } from 'react';
import { Event, EventSession } from '../types/event';
import { EventDataAccess } from '@/lib/dataAccess/eventDataAccess';
import { UnifiedParticipationDataAccess } from '@/lib/dataAccess/unifiedParticipationDataAccess';
import { 
  groupEventsByStageGroup, 
  getEventsRequiringSession, 
  getActiveEvents,
  getStageGroups,
  sortByStageGroup
} from '@/shared/utils/stageConfigUtils';
import { supabase } from '@/lib/supabase';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventSessions, setEventSessions] = useState<EventSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 全てのイベントを取得
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EventDataAccess.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('イベントの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 全てのイベントセッションを取得
  const fetchEventSessions = useCallback(async () => {
    try {
      const data = await EventDataAccess.getAllEventSessions();
      setEventSessions(data);
    } catch (err) {
      console.error('Failed to fetch event sessions:', err);
    }
  }, []);

  // アクティブなイベントを取得
  const fetchActiveEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EventDataAccess.getActiveEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch active events:', err);
      setError('アクティブなイベントの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 特定の段階グループのイベントを取得
  const fetchEventsByStageGroup = useCallback(async (stageGroup: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await EventDataAccess.getEventsByStageGroup(stageGroup);
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events by stage group:', err);
      setError('段階グループのイベント取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // セッションが必要なイベントを取得
  const fetchEventsRequiringSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EventDataAccess.getEventsRequiringSession();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events requiring session:', err);
      setError('セッションが必要なイベントの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 段階グループ一覧を取得
  const fetchStageGroups = useCallback(async (): Promise<string[]> => {
    try {
      return await EventDataAccess.getStageGroups();
    } catch (err) {
      console.error('Failed to fetch stage groups:', err);
      throw err;
    }
  }, []);

  // 特定のイベントを取得
  const fetchEventById = useCallback(async (id: string): Promise<Event | null> => {
    try {
      return await EventDataAccess.getEventById(id);
    } catch (err) {
      console.error('Failed to fetch event by id:', err);
      throw err;
    }
  }, []);

  // イベント名でイベントを取得
  const fetchEventByName = useCallback(async (name: string): Promise<Event | null> => {
    try {
      return await EventDataAccess.getEventByName(name);
    } catch (err) {
      console.error('Failed to fetch event by name:', err);
      throw err;
    }
  }, []);

  // イベントを作成
  const createEvent = useCallback(async (eventData: Partial<Event>): Promise<Event> => {
    try {
      const newEvent = await EventDataAccess.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      console.error('Failed to create event:', err);
      throw err;
    }
  }, []);

  // イベントセッションを作成
  const createEventSession = useCallback(async (sessionData: Partial<EventSession>): Promise<EventSession> => {
    try {
      const newSession = await EventDataAccess.createEventSession(sessionData);
      setEventSessions(prev => [...prev, newSession]);
      return newSession;
    } catch (err) {
      console.error('Failed to create event session:', err);
      throw err;
    }
  }, []);

  // 特定のイベントのセッションを取得
  const getEventSessions = useCallback((eventId: string): EventSession[] => {
    return eventSessions.filter(session => session.eventId === eventId);
  }, [eventSessions]);

  // 特定のセッションの参加者を取得
  const getParticipantsBySession = useCallback(async (sessionId: string) => {
    try {
      const participants = await UnifiedParticipationDataAccess.getSessionParticipants(sessionId);
      return participants;
    } catch (err) {
      console.error('Failed to fetch session participants:', err);
      return [];
    }
  }, []);

  // イベントの参加者数を取得
  const getEventParticipantCount = useCallback(async (eventId: string): Promise<number> => {
    const sessions = getEventSessions(eventId);
    let totalCount = 0;
    
    for (const session of sessions) {
      const participants = await UnifiedParticipationDataAccess.getSessionParticipants(session.id);
      totalCount += participants.length;
    }
    
    return totalCount;
  }, [getEventSessions]);

  // 参加者を登録
  const registerParticipant = useCallback(async (data: {
    sessionId: string;
    applicantId: string;
    status: string;
  }) => {
    try {
      await EventDataAccess.updateParticipantStatus(
        data.sessionId,
        data.applicantId,
        data.status
      );
    } catch (err) {
      console.error('Failed to register participant:', err);
      throw err;
    }
  }, []);

  // 参加者ステータスを更新
  const updateParticipantStatus = useCallback(async (participantId: string, status: string) => {
    try {
      // UnifiedParticipationDataAccessを使用して参加状況を更新
      // participantIdは実際にはsessionIdとapplicantIdの組み合わせである必要があります
      // 現在の実装では、sessionIdとapplicantIdを取得する必要があります
      
      // まず、参加者IDからセッションIDと応募者IDを取得
      const { data: participant, error: fetchError } = await supabase
        .from('event_participants')
        .select('session_id, applicant_id, stage_name')
        .eq('id', participantId)
        .single();

      if (fetchError) {
        console.error('Failed to fetch participant:', fetchError);
        throw fetchError;
      }

      // UnifiedParticipationDataAccessを使用して更新
      await UnifiedParticipationDataAccess.updateSessionParticipantStatus(
        participant.session_id,
        participant.applicant_id,
        status
      );
    } catch (err) {
      console.error('Failed to update participant status:', err);
      throw err;
    }
  }, []);

  // イベントセッションを削除
  const deleteEventSession = useCallback(async (sessionId: string) => {
    try {
      // 仮の実装 - 実際のデータベースから削除する必要があります
      console.log('Deleting event session:', sessionId);
      setEventSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (err) {
      console.error('Failed to delete event session:', err);
      throw err;
    }
  }, []);

  // イベントセッションを更新
  const updateEventSession = useCallback(async (sessionId: string, sessionData: Partial<EventSession>) => {
    try {
      // 仮の実装 - 実際のデータベースから更新する必要があります
      console.log('Updating event session:', sessionId, sessionData);
      setEventSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, ...sessionData } : session
      ));
    } catch (err) {
      console.error('Failed to update event session:', err);
      throw err;
    }
  }, []);

  // 段階グループ別にイベントを分類
  const eventsByStageGroup = groupEventsByStageGroup(events);
  
  // セッションが必要なイベント
  const eventsRequiringSession = getEventsRequiringSession(events);
  
  // アクティブなイベント
  const activeEvents = getActiveEvents(events);
  
  // 段階グループ一覧
  const stageGroups = getStageGroups(events);
  
  // ソートされたイベント
  const sortedEvents = sortByStageGroup(events);

  // 初回のみデータを取得するフラグ
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      fetchEvents();
      fetchEventSessions();
      setIsInitialized(true);
    }
  }, [isInitialized, fetchEvents, fetchEventSessions]);

  return {
    events,
    eventSessions,
    loading,
    error,
    fetchEvents,
    fetchEventSessions,
    fetchActiveEvents,
    fetchEventsByStageGroup,
    fetchEventsRequiringSession,
    fetchStageGroups,
    fetchEventById,
    fetchEventByName,
    createEvent,
    createEventSession,
    getEventSessions,
    getParticipantsBySession,
    getEventParticipantCount,
    registerParticipant,
    updateParticipantStatus,
    deleteEventSession,
    updateEventSession,
    eventsByStageGroup,
    eventsRequiringSession,
    activeEvents,
    stageGroups,
    sortedEvents
  };
};