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
      const historyDate = new Date(history.startDate);
      return historyDate.getFullYear() === now.getFullYear() && 
             historyDate.getMonth() === now.getMonth() &&
             (history.stage.includes('面接') || history.stage === 'CEOセミナー' || history.stage === '最終選考');
    });
  }).length;
};
