import { Applicant } from '@/features/applicants/types/applicant';
import { SelectionStage } from '@/features/applicants/types/applicant';
import { SELECTION_STAGES, STAGE_GROUPS } from '@/shared/utils/constants';

export interface StageResult {
  stage: string;
  total: number;
  passed: number;
  failed: number;
  pending: number;
  declined: number;
  cancelled: number;
}

export interface CurrentStageResult {
  stage: string;
  current: number;
  active: number;
  completed: number;
  conversionRate: number;
  avgDuration: number;
}

export interface SourceResult {
  source: string;
  total: number;
  passed: number;
  failed: number;
  pending: number;
  declined: number;
  cancelled: number;
}

export interface GroupResult {
  group: string;
  total: number;
  passed: number;
  failed: number;
  pending: number;
  declined: number;
  cancelled: number;
}

export interface OverallStats {
  total: number;
  passed: number;
  failed: number;
  pending: number;
  declined: number;
  cancelled: number;
  passRate: string;
}

// ステータスに基づいてカウントを分類する関数
const categorizeStatus = (status: string, stage: string) => {
  switch (status) {
    case '合格':
    case '参加':
    case '内定':
    case '承諾':
      return 'passed';
    case '不合格':
    case '不参加':
    case '無断欠席':
    case '未承諾':
    case '不内定':
    case '確定':
      return 'failed';
    case '保留':
    case '参加予定':
      return 'pending';
    case '辞退':
      return 'declined';
    case 'キャンセル':
      return 'cancelled';
    case '完了':
      // 完了の場合は段階に応じて判定
      if (stage === '最終選考' || stage === '内定面談') {
        return 'passed';
      } else {
        return 'pending';
      }
    case '不採用':
      return 'failed';
    default:
      return 'pending';
  }
};

// 選考段階ごとの集計
export const calculateStageResults = (applicants: Applicant[]): StageResult[] => {
  const results: StageResult[] = SELECTION_STAGES.map(stage => ({
    stage,
    total: 0,
    passed: 0,
    failed: 0,
    pending: 0,
    declined: 0,
    cancelled: 0
  }));

  applicants.forEach(applicant => {
    // 各選考段階の履歴を確認
    applicant.history?.forEach(historyItem => {
      const stageIndex = results.findIndex(r => r.stage === historyItem.stage);
      if (stageIndex !== -1) {
        results[stageIndex].total++;
        
        const category = categorizeStatus(historyItem.status, historyItem.stage);
        results[stageIndex][category]++;
      }
    });
  });

  return results.filter(result => result.total > 0);
};

// 反響元ごとの集計
export const calculateSourceResults = (applicants: Applicant[]): SourceResult[] => {
  const sourceMap = new Map<string, SourceResult>();

  applicants.forEach(applicant => {
    const source = applicant.source || 'その他';
    
    if (!sourceMap.has(source)) {
      sourceMap.set(source, {
        source,
        total: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        declined: 0,
        cancelled: 0
      });
    }

    const sourceResult = sourceMap.get(source)!;
    sourceResult.total++;

    // 最終的な結果を判定
    const finalStage = applicant.history?.[applicant.history.length - 1];
    if (finalStage) {
      const category = categorizeStatus(finalStage.status, finalStage.stage);
      sourceResult[category]++;
    } else {
      sourceResult.pending++;
    }
  });

  return Array.from(sourceMap.values()).sort((a, b) => b.total - a.total);
};

// グループ別集計
export const calculateGroupResults = (applicants: Applicant[]): GroupResult[] => {
  const groupMap = new Map<string, GroupResult>();

  // 各グループを初期化
  Object.keys(STAGE_GROUPS).forEach(groupName => {
    groupMap.set(groupName, {
      group: groupName,
      total: 0,
      passed: 0,
      failed: 0,
      pending: 0,
      declined: 0,
      cancelled: 0
    });
  });

  applicants.forEach(applicant => {
    // 各選考段階の履歴を確認
    applicant.history?.forEach(historyItem => {
      // どのグループに属するかを判定
      let targetGroup = 'その他';
      for (const [groupName, stages] of Object.entries(STAGE_GROUPS)) {
        if (stages.includes(historyItem.stage as SelectionStage)) {
          targetGroup = groupName;
          break;
        }
      }

      const groupResult = groupMap.get(targetGroup);
      if (groupResult) {
        groupResult.total++;
        
        const category = categorizeStatus(historyItem.status, historyItem.stage);
        groupResult[category]++;
      }
    });
  });

  return Array.from(groupMap.values()).filter(result => result.total > 0);
};

// 全体の統計
export const calculateOverallStats = (applicants: Applicant[]): OverallStats => {
  const total = applicants.length;
  const passed = applicants.filter(a => {
    const finalStage = a.history?.[a.history.length - 1];
    return finalStage?.status === '合格' || 
           finalStage?.status === '参加' ||
           finalStage?.status === '内定' ||
           finalStage?.status === '承諾' ||
           (finalStage?.status === '完了' && 
            (finalStage.stage === '最終選考' || finalStage.stage === '内定面談'));
  }).length;
  const failed = applicants.filter(a => {
    const finalStage = a.history?.[a.history.length - 1];
    return finalStage?.status === '不合格' || 
           finalStage?.status === '不採用' ||
           finalStage?.status === '不参加' ||
           finalStage?.status === '無断欠席' ||
           finalStage?.status === '未承諾';
  }).length;
  const pending = applicants.filter(a => {
    const finalStage = a.history?.[a.history.length - 1];
    return finalStage?.status === '保留' || 
           finalStage?.status === '参加予定' ||
           finalStage?.status === '進行中' ||
           !finalStage;
  }).length;
  const declined = applicants.filter(a => 
    a.history?.[a.history.length - 1]?.status === '辞退'
  ).length;
  const cancelled = applicants.filter(a => 
    a.history?.[a.history.length - 1]?.status === 'キャンセル'
  ).length;

  return {
    total,
    passed,
    failed,
    pending,
    declined,
    cancelled,
    passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0'
  };
};

// 今月のエントリー数を計算
export const calculateThisMonthEntries = (applicants: Applicant[]): number => {
  const now = new Date();
  return applicants.filter(applicant => {
    const entryDate = new Date(applicant.createdAt);
    return entryDate.getFullYear() === now.getFullYear() && 
           entryDate.getMonth() === now.getMonth();
  }).length;
};

// 今月の面接数を計算
export const calculateThisMonthInterviews = (applicants: Applicant[]): number => {
  const now = new Date();
  return applicants.filter(applicant => {
    return applicant.history?.some(history => {
      const historyDate = new Date(history.createdAt);
      return historyDate.getFullYear() === now.getFullYear() && 
             historyDate.getMonth() === now.getMonth() &&
             (history.stage.includes('面接') || history.stage === 'CEOセミナー' || history.stage === '最終選考');
    });
  }).length;
};

// 現在の選考段階別集計（リアルタイム）
export const calculateCurrentStageResults = (applicants: Applicant[]): CurrentStageResult[] => {
  const results: CurrentStageResult[] = SELECTION_STAGES.map(stage => ({
    stage,
    current: 0,
    active: 0,
    completed: 0,
    conversionRate: 0,
    avgDuration: 0
  }));

  // 各選考段階の統計を計算
  SELECTION_STAGES.forEach((stage, stageIndex) => {
    const stageApplicants = applicants.filter(applicant => applicant.currentStage === stage);
    
    results[stageIndex].current = stageApplicants.length;
    
    // アクティブな応募者（進行中のステータス）
    results[stageIndex].active = stageApplicants.filter(applicant => 
      applicant.currentStage !== '不採用'
    ).length;
    
    // 完了した応募者（不採用など）
    results[stageIndex].completed = stageApplicants.filter(applicant => 
      applicant.currentStage === '不採用'
    ).length;
    
    // 変換率（完了数 / 総数）
    const totalInStage = results[stageIndex].current;
    results[stageIndex].conversionRate = totalInStage > 0 ? 
      (results[stageIndex].completed / totalInStage) * 100 : 0;
    
    // 平均滞留期間（日数）
    const durations: number[] = [];
    stageApplicants.forEach(applicant => {
      const stageHistory = applicant.history?.find(h => h.stage === stage);
      if (stageHistory?.createdAt && stageHistory?.endDate) {
        const start = new Date(stageHistory.createdAt);
        const end = new Date(stageHistory.endDate);
        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        durations.push(duration);
      }
    });
    
    results[stageIndex].avgDuration = durations.length > 0 ? 
      durations.reduce((sum, duration) => sum + duration, 0) / durations.length : 0;
  });

  return results.filter(result => result.current > 0);
};

// パイプライン分析（柔軟な選考フロー対応）
export const calculatePipelineAnalysis = (applicants: Applicant[]): {
  totalInPipeline: number;
  stageDistribution: { stage: string; count: number; percentage: number }[];
  conversionRates: { fromStage: string; toStage: string; rate: number }[];
  flowPaths: { path: string[]; count: number; percentage: number }[];
} => {
  const totalInPipeline = applicants.filter(a => 
    a.currentStage !== '不採用'
  ).length;

  // 段階別分布
  const stageDistribution = SELECTION_STAGES.map(stage => {
    const count = applicants.filter(a => a.currentStage === stage).length;
    return {
      stage,
      count,
      percentage: totalInPipeline > 0 ? (count / totalInPipeline) * 100 : 0
    };
  }).filter(item => item.count > 0);

  // 実際の履歴から段階間の遷移を分析
  const transitionMap = new Map<string, Map<string, number>>();
  const stageEntryCounts = new Map<string, number>();

  applicants.forEach(applicant => {
    if (!applicant.history || applicant.history.length === 0) return;

    // 履歴を時系列順にソート
    const sortedHistory = [...applicant.history].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // 各段階のエントリー数をカウント
    sortedHistory.forEach(historyItem => {
      const currentCount = stageEntryCounts.get(historyItem.stage) || 0;
      stageEntryCounts.set(historyItem.stage, currentCount + 1);
    });

    // 段階間の遷移を分析
    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const fromStage = sortedHistory[i].stage;
      const toStage = sortedHistory[i + 1].stage;

      if (!transitionMap.has(fromStage)) {
        transitionMap.set(fromStage, new Map());
      }

      const toStageMap = transitionMap.get(fromStage)!;
      const currentCount = toStageMap.get(toStage) || 0;
      toStageMap.set(toStage, currentCount + 1);
    }
  });

  // 変換率を計算
  const conversionRates: { fromStage: string; toStage: string; rate: number }[] = [];
  
  transitionMap.forEach((toStages, fromStage) => {
    const fromStageTotal = stageEntryCounts.get(fromStage) || 0;
    
    toStages.forEach((count, toStage) => {
      const rate = fromStageTotal > 0 ? (count / fromStageTotal) * 100 : 0;
      conversionRates.push({ fromStage, toStage, rate });
    });
  });

  // 前段階でグループ化してソート
  conversionRates.sort((a, b) => {
    // まず前段階でソート
    if (a.fromStage !== b.fromStage) {
      return a.fromStage.localeCompare(b.fromStage);
    }
    // 同じ前段階内では変換率の降順でソート
    return b.rate - a.rate;
  });

  // 主要な選考パスを分析
  const flowPaths = analyzeFlowPaths(applicants);

  return {
    totalInPipeline,
    stageDistribution,
    conversionRates,
    flowPaths
  };
};

// 選考パスを分析する関数
const analyzeFlowPaths = (applicants: Applicant[]): { path: string[]; count: number; percentage: number }[] => {
  const pathCounts = new Map<string, number>();
  const totalApplicants = applicants.length;

  applicants.forEach(applicant => {
    if (!applicant.history || applicant.history.length === 0) return;

    // 履歴を時系列順にソート
    const sortedHistory = [...applicant.history].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // パスを生成（最大5段階まで）
    const path = sortedHistory.slice(0, 5).map(h => h.stage);
    const pathKey = path.join(' → ');

    const currentCount = pathCounts.get(pathKey) || 0;
    pathCounts.set(pathKey, currentCount + 1);
  });

  // パスをカウント順にソートし、上位10個を返す
  return Array.from(pathCounts.entries())
    .map(([path, count]) => ({
      path: path.split(' → '),
      count,
      percentage: totalApplicants > 0 ? (count / totalApplicants) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};
