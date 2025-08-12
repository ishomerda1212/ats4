import { useTaskManagement } from '@/features/tasks/hooks/useTaskManagement';
import { useEvents } from '@/features/events/hooks/useEvents';
import { Applicant } from '@/features/applicants/types/applicant';
import { getStageSessionInfo, getAvailableSessionsForStage } from '../utils/stageHelpers';

export const useStageOperations = () => {
  const { 
    getApplicantTasksByStage,
    setTaskDueDate
  } = useTaskManagement();

  const { events, eventSessions } = useEvents();

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

  return {
    events,
    eventSessions,
    getStageSessionInfoForStage,
    getAvailableSessionsForStageWithData,
    getApplicantTasksForStage,
    setTaskDueDate
  };
};
