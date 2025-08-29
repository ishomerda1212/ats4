import { useState, useCallback, useEffect } from 'react';
import { StageProgressDataAccess, StageProgress, StageProgressStatus } from '@/lib/dataAccess/stageProgressDataAccess';
import { Applicant } from '@/features/applicants/types/applicant';

export const useStageProgress = (applicant: Applicant) => {
  const [stageProgress, setStageProgress] = useState<StageProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<StageProgress | null>(null);

  // 段階進行状況を取得
  const fetchStageProgress = useCallback(async () => {
    setLoading(true);
    try {
      const progress = await StageProgressDataAccess.getApplicantStageProgress(applicant.id);
      setStageProgress(progress);
      
      // 現在の段階を特定
      const inProgress = progress.find(p => p.status === 'in_progress');
      const pending = progress.find(p => p.status === 'pending');
      setCurrentStage(inProgress || pending || null);
    } catch (error) {
      console.error('Failed to fetch stage progress:', error);
    } finally {
      setLoading(false);
    }
  }, [applicant.id]);

  useEffect(() => {
    fetchStageProgress();
  }, [fetchStageProgress]);

  // 段階を開始
  const startStage = useCallback(async (stageId: string) => {
    try {
      const progress = await StageProgressDataAccess.startStage(applicant.id, stageId);
      setStageProgress(prev => [...prev, progress]);
      setCurrentStage(progress);
      return progress;
    } catch (error) {
      console.error('Failed to start stage:', error);
      throw error;
    }
  }, [applicant.id]);

  // 段階を完了
  const completeStage = useCallback(async (
    stageId: string, 
    score?: number, 
    notes?: string
  ) => {
    try {
      const progress = await StageProgressDataAccess.completeStage(
        applicant.id, 
        stageId, 
        score, 
        notes
      );
      
      setStageProgress(prev => 
        prev.map(p => p.id === progress.id ? progress : p)
      );
      
      // 現在の段階を更新
      if (currentStage?.id === progress.id) {
        setCurrentStage(progress);
      }
      
      return progress;
    } catch (error) {
      console.error('Failed to complete stage:', error);
      throw error;
    }
  }, [applicant.id, currentStage?.id]);

  // 段階をスキップ
  const skipStage = useCallback(async (stageId: string, notes?: string) => {
    try {
      const progress = await StageProgressDataAccess.skipStage(applicant.id, stageId, notes);
      
      setStageProgress(prev => 
        prev.map(p => p.id === progress.id ? progress : p)
      );
      
      if (currentStage?.id === progress.id) {
        setCurrentStage(progress);
      }
      
      return progress;
    } catch (error) {
      console.error('Failed to skip stage:', error);
      throw error;
    }
  }, [applicant.id, currentStage?.id]);

  // 次の段階に進行
  const advanceToNextStage = useCallback(async (currentStageId: string) => {
    try {
      const nextProgress = await StageProgressDataAccess.advanceToNextStage(
        applicant.id, 
        currentStageId
      );
      
      if (nextProgress) {
        setStageProgress(prev => [...prev, nextProgress]);
        setCurrentStage(nextProgress);
      }
      
      return nextProgress;
    } catch (error) {
      console.error('Failed to advance to next stage:', error);
      throw error;
    }
  }, [applicant.id]);

  // 段階進行の条件をチェック
  const checkTransitionConditions = useCallback(async (
    fromStageId: string, 
    toStageId: string
  ) => {
    try {
      return await StageProgressDataAccess.checkStageTransitionConditions(
        applicant.id, 
        fromStageId, 
        toStageId
      );
    } catch (error) {
      console.error('Failed to check transition conditions:', error);
      throw error;
    }
  }, [applicant.id]);

  // 段階の状態を取得
  const getStageStatus = useCallback((stageId: string): StageProgressStatus | null => {
    const progress = stageProgress.find(p => p.stageId === stageId);
    return progress?.status || null;
  }, [stageProgress]);

  // 完了した段階を取得
  const getCompletedStages = useCallback(() => {
    return stageProgress.filter(p => p.status === 'completed');
  }, [stageProgress]);

  // 進行中の段階を取得
  const getInProgressStages = useCallback(() => {
    return stageProgress.filter(p => p.status === 'in_progress');
  }, [stageProgress]);

  // 待機中の段階を取得
  const getPendingStages = useCallback(() => {
    return stageProgress.filter(p => p.status === 'pending');
  }, [stageProgress]);

  // 段階の進行率を計算
  const getProgressPercentage = useCallback(() => {
    const totalStages = stageProgress.length;
    if (totalStages === 0) return 0;
    
    const completedStages = stageProgress.filter(p => 
      p.status === 'completed' || p.status === 'skipped'
    ).length;
    
    return Math.round((completedStages / totalStages) * 100);
  }, [stageProgress]);

  return {
    stageProgress,
    currentStage,
    loading,
    startStage,
    completeStage,
    skipStage,
    advanceToNextStage,
    checkTransitionConditions,
    getStageStatus,
    getCompletedStages,
    getInProgressStages,
    getPendingStages,
    getProgressPercentage,
    refresh: fetchStageProgress
  };
};
