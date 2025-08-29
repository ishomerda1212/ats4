import { useTaskManagement } from '@/features/tasks/hooks/useTaskManagement';
import { useEvents } from '@/features/events/hooks/useEvents';
import { Applicant } from '@/features/applicants/types/applicant';
import { EventSession } from '@/features/events/types/event';
import { getStageSessionInfo } from '../utils/stageHelpers';

export const useStageOperations = () => {
  const { 
    getApplicantTasksByStage,
    setTaskDueDate,
    updateTaskStatus
  } = useTaskManagement();

  const { 
    events,
    eventSessions,
    createEventSession
  } = useEvents();

  /**
   * 選考段階に対応するイベントとセッションを取得する
   */
  const getStageSessionInfoForStage = (stage: string) => {
    const event = events.find(e => e.name === stage);
    if (!event) {
      return null;
    }
    return getStageSessionInfo(event);
  };

  /**
   * 選考段階に対応するイベントのセッション一覧を取得する
   */
  const getAvailableSessionsForStageWithData = (stage: string) => {
    const event = events.find(e => e.name === stage);
    if (!event) {
      return [];
    }
    return eventSessions.filter(session => session.eventId === event.id);
  };

  /**
   * 応募者の特定段階のタスクを取得する
   */
  const getApplicantTasksForStage = (applicant: Applicant, stage: string) => {
    return getApplicantTasksByStage(applicant, stage);
  };

  /**
   * 新しいセッションを作成する
   */
  const createNewSession = (sessionData: {
    eventId: string;
    name: string;
    start: Date;
    end: Date;
    venue: string;
    format: '対面' | 'オンライン' | 'ハイブリッド';
    maxParticipants?: number;
    recruiter?: string;
  }) => {
    const newSession: Partial<EventSession> = {
      eventId: sessionData.eventId,
      name: sessionData.name,
      sessionDate: sessionData.start,
      startTime: sessionData.start.toTimeString().slice(0, 5),
      endTime: sessionData.end.toTimeString().slice(0, 5),
      venue: sessionData.venue,
      format: sessionData.format,
      maxParticipants: sessionData.maxParticipants || 0,
      recruiter: sessionData.recruiter,
      status: '予定'
    };

    return createEventSession(newSession);
  };

  return {
    events,
    eventSessions,
    getStageSessionInfoForStage,
    getAvailableSessionsForStageWithData,
    getApplicantTasksForStage,
    setTaskDueDate,
    updateTaskStatus,
    createNewSession
  };
};
