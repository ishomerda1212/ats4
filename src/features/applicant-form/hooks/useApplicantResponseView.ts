import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Event, EventSession } from '@/features/events/types/event';
import { Applicant } from '@/features/applicants/types/applicant';
import { ApplicantEventResponse, EventFormData, SessionFormData } from '../types/applicantForm';
import { mockEvents, mockEventSessions } from '@/shared/data/mockEventData';
import { mockApplicants } from '@/shared/data/mockData';
import { mockApplicantResponses } from '@/shared/data/mockApplicantResponseData';

export const useApplicantResponseView = (applicantId: string, eventId: string) => {
  const [events] = useLocalStorage<Event[]>('events', mockEvents);
  const [eventSessions] = useLocalStorage<EventSession[]>('eventSessions', mockEventSessions);
  const [applicants] = useLocalStorage<Applicant[]>('applicants', mockApplicants);
  const [applicantResponses] = useLocalStorage<ApplicantEventResponse[]>('applicantResponses', mockApplicantResponses);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventData, setEventData] = useState<EventFormData | null>(null);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [response, setResponse] = useState<ApplicantEventResponse | null>(null);

  const loadData = useCallback(() => {
    try {
      setLoading(true);
      
      // 応募者データを取得
      const foundApplicant = applicants.find(a => a.id === applicantId);
      if (!foundApplicant) {
        setError('応募者が見つかりません');
        return;
      }
      setApplicant(foundApplicant);

      // イベントデータを取得
      const event = events.find(e => e.id === eventId);
      if (!event) {
        setError('イベントが見つかりません');
        return;
      }

      // イベントのセッションを取得
      const sessions = eventSessions.filter(s => s.eventId === eventId);
      if (sessions.length === 0) {
        setError('イベントのセッションが見つかりません');
        return;
      }

      // セッションデータを変換
      const sessionFormData: SessionFormData[] = sessions.map(session => ({
        sessionId: session.id,
        sessionName: session.name,
        startDate: new Date(session.start),
        endDate: new Date(session.end),
        venue: session.venue,
        format: session.format,
        maxParticipants: session.maxParticipants,
        currentParticipants: session.currentParticipants || 0,
        recruiter: session.recruiter
      }));

      setEventData({
        eventName: event.name,
        eventDescription: event.description,
        stage: event.stage,
        sessions: sessionFormData
      });

      // 応募者の回答を取得
      const foundResponse = applicantResponses.find(
        r => r.applicantId === applicantId && r.eventId === eventId
      );
      
      if (!foundResponse) {
        setError('回答が見つかりません');
        return;
      }
      
      setResponse(foundResponse);

    } catch {
      setError('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [applicantId, eventId, events, eventSessions, applicants, applicantResponses]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    loading,
    error,
    applicant,
    eventData,
    response,
    reload: loadData
  };
};