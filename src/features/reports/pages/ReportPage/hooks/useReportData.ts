import { useMemo } from 'react';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import {
  calculateStageResults,
  calculateSourceResults,
  calculateGroupResults,
  calculateOverallStats,
  calculateThisMonthEntries,
  calculateThisMonthInterviews,
  calculateCurrentStageResults,
  calculatePipelineAnalysis,
  type StageResult,
  type SourceResult,
  type GroupResult,
  type OverallStats,
  type CurrentStageResult
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

  // 現在の選考段階別集計（リアルタイム）
  const currentStageResults = useMemo((): CurrentStageResult[] => {
    return calculateCurrentStageResults(applicants);
  }, [applicants]);

  // パイプライン分析
  const pipelineAnalysis = useMemo(() => {
    return calculatePipelineAnalysis(applicants);
  }, [applicants]);

  return {
    applicants,
    stageResults,
    sourceResults,
    groupResults,
    overallStats,
    thisMonthEntries,
    thisMonthInterviews,
    currentStageResults,
    pipelineAnalysis
  };
};
