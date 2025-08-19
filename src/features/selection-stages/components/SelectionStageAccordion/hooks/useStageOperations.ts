import { useTaskManagement } from '@/features/tasks/hooks/useTaskManagement';
import { useEvents } from '@/features/events/hooks/useEvents';
import { Applicant } from '@/features/applicants/types/applicant';
import { EventSession } from '@/features/events/types/event';
import { getStageSessionInfo, getAvailableSessionsForStage } from '../utils/stageHelpers';

export const useStageOperations = () => {
  const { 
    getApplicantTasksByStage,
    setTaskDueDate,
    updateTaskStatus
  } = useTaskManagement();

  const { 
    events, 
    eventSessions, 
    addEventSession 
  } = useEvents();

  /**
   * 選考段階に対応するイベントとセッションを取得する
   */
  const getStageSessionInfoForStage = (stage: string) => {
    return getStageSessionInfo(stage, events, eventSessions);
  };

  /**
   * 選考段階に対応するイベントのセッション一覧を取得する
   */
  const getAvailableSessionsForStageWithData = (stage: string) => {
    return getAvailableSessionsForStage(stage, events, eventSessions);
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
    const newSession: Omit<EventSession, 'id' | 'createdAt' | 'updatedAt'> = {
      eventId: sessionData.eventId,
      name: sessionData.name,
      start: sessionData.start,
      end: sessionData.end,
      venue: sessionData.venue,
      format: sessionData.format,
      maxParticipants: sessionData.maxParticipants,
      recruiter: sessionData.recruiter,
      participants: [],
      notes: '',
    };

    return addEventSession(newSession);
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
