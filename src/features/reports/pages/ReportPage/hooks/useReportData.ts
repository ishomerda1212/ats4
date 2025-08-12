import { useMemo } from 'react';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import {
  calculateStageResults,
  calculateSourceResults,
  calculateGroupResults,
  calculateOverallStats,
  calculateThisMonthEntries,
  calculateThisMonthInterviews,
  type StageResult,
  type SourceResult,
  type GroupResult,
  type OverallStats
} from '../utils/reportCalculations';

export const useReportData = () => {
  const { applicants } = useApplicants();

  // 選考段階ごとの集計
  const stageResults = useMemo((): StageResult[] => {
    return calculateStageResults(applicants);
  }, [applicants]);

  // 反響元ごとの集計
  const sourceResults = useMemo((): SourceResult[] => {
    return calculateSourceResults(applicants);
  }, [applicants]);

  // グループ別集計
  const groupResults = useMemo((): GroupResult[] => {
    return calculateGroupResults(applicants);
  }, [applicants]);

  // 全体の統計
  const overallStats = useMemo((): OverallStats => {
    return calculateOverallStats(applicants);
  }, [applicants]);

  // 今月のエントリー数
  const thisMonthEntries = useMemo((): number => {
    return calculateThisMonthEntries(applicants);
  }, [applicants]);

  // 今月の面接数
  const thisMonthInterviews = useMemo((): number => {
    return calculateThisMonthInterviews(applicants);
  }, [applicants]);

  return {
    applicants,
    stageResults,
    sourceResults,
    groupResults,
    overallStats,
    thisMonthEntries,
    thisMonthInterviews
  };
};
