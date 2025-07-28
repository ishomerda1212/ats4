import { FixedTask } from '../types/task';
import { SelectionStage } from '@/features/applicants/types/applicant';

export const FIXED_TASK_TEMPLATES: Record<SelectionStage, FixedTask[]> = {
  'エントリー': [
    {
      id: 'entry-approach-1',
      stage: 'エントリー',
      title: 'アプローチ1',
      description: 'アプローチ1の実施',
      type: 'アプローチ1',
      isRequired: true,
      estimatedDuration: 30,
      order: 1
    },
    {
      id: 'entry-approach-2',
      stage: 'エントリー',
      title: 'アプローチ2',
      description: 'アプローチ2の実施',
      type: 'アプローチ2',
      isRequired: true,
      estimatedDuration: 30,
      order: 2
    },
    {
      id: 'entry-approach-3',
      stage: 'エントリー',
      title: 'アプローチ3',
      description: 'アプローチ3の実施',
      type: 'アプローチ3',
      isRequired: true,
      estimatedDuration: 30,
      order: 3
    },
    {
      id: 'entry-approach-4',
      stage: 'エントリー',
      title: 'アプローチ4',
      description: 'アプローチ4の実施',
      type: 'アプローチ4',
      isRequired: true,
      estimatedDuration: 30,
      order: 4
    },
    {
      id: 'entry-approach-5',
      stage: 'エントリー',
      title: 'アプローチ5',
      description: 'アプローチ5の実施',
      type: 'アプローチ5',
      isRequired: true,
      estimatedDuration: 30,
      order: 5
    },
    {
      id: 'entry-detail-contact',
      stage: 'エントリー',
      title: '詳細連絡',
      description: '詳細情報の連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 6
    },
    {
      id: 'entry-schedule-contact',
      stage: 'エントリー',
      title: '日程調整連絡',
      description: '日程調整の連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 7
    },
    {
      id: 'entry-remind-contact',
      stage: 'エントリー',
      title: 'リマインド',
      description: 'リマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 8
    },
    {
      id: 'entry-result-contact',
      stage: 'エントリー',
      title: '結果連絡',
      description: '結果の連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 9
    }
  ],
  '書類選考': [
    {
      id: 'document-detail-contact',
      stage: '書類選考',
      title: '詳細連絡',
      description: '書類選考の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'document-schedule-contact',
      stage: '書類選考',
      title: '日程調整連絡',
      description: '書類選考の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'document-remind-contact',
      stage: '書類選考',
      title: 'リマインド',
      description: '書類選考のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'document-result-contact',
      stage: '書類選考',
      title: '結果連絡',
      description: '書類選考の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  '会社説明会': [
    {
      id: 'company-detail-contact',
      stage: '会社説明会',
      title: '詳細連絡',
      description: '会社説明会の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'company-schedule-contact',
      stage: '会社説明会',
      title: '日程調整連絡',
      description: '会社説明会の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'company-remind-contact',
      stage: '会社説明会',
      title: 'リマインド',
      description: '会社説明会のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'company-result-contact',
      stage: '会社説明会',
      title: '結果連絡',
      description: '会社説明会の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  '適性検査': [
    {
      id: 'aptitude-detail-contact',
      stage: '適性検査',
      title: '詳細連絡',
      description: '適性検査の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'aptitude-schedule-contact',
      stage: '適性検査',
      title: '日程調整連絡',
      description: '適性検査の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'aptitude-remind-contact',
      stage: '適性検査',
      title: 'リマインド',
      description: '適性検査のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'aptitude-result-contact',
      stage: '適性検査',
      title: '結果連絡',
      description: '適性検査の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  '職場見学': [
    {
      id: 'workplace-detail-contact',
      stage: '職場見学',
      title: '詳細連絡',
      description: '職場見学の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'workplace-schedule-contact',
      stage: '職場見学',
      title: '日程調整連絡',
      description: '職場見学の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'workplace-remind-contact',
      stage: '職場見学',
      title: 'リマインド',
      description: '職場見学のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'workplace-result-contact',
      stage: '職場見学',
      title: '結果連絡',
      description: '職場見学の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  '仕事体験': [
    {
      id: 'job-detail-contact',
      stage: '仕事体験',
      title: '詳細連絡',
      description: '仕事体験の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'job-schedule-contact',
      stage: '仕事体験',
      title: '日程調整連絡',
      description: '仕事体験の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'job-remind-contact',
      stage: '仕事体験',
      title: 'リマインド',
      description: '仕事体験のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'job-result-contact',
      stage: '仕事体験',
      title: '結果連絡',
      description: '仕事体験の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  '個別面接': [
    {
      id: 'individual-detail-contact',
      stage: '個別面接',
      title: '詳細連絡',
      description: '個別面接の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'individual-schedule-contact',
      stage: '個別面接',
      title: '日程調整連絡',
      description: '個別面接の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'individual-remind-contact',
      stage: '個別面接',
      title: 'リマインド',
      description: '個別面接のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'individual-result-contact',
      stage: '個別面接',
      title: '結果連絡',
      description: '個別面接の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  '集団面接': [
    {
      id: 'group-detail-contact',
      stage: '集団面接',
      title: '詳細連絡',
      description: '集団面接の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'group-schedule-contact',
      stage: '集団面接',
      title: '日程調整連絡',
      description: '集団面接の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'group-remind-contact',
      stage: '集団面接',
      title: 'リマインド',
      description: '集団面接のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'group-result-contact',
      stage: '集団面接',
      title: '結果連絡',
      description: '集団面接の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  'CEOセミナー': [
    {
      id: 'ceo-detail-contact',
      stage: 'CEOセミナー',
      title: '詳細連絡',
      description: 'CEOセミナーの詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'ceo-schedule-contact',
      stage: 'CEOセミナー',
      title: '日程調整連絡',
      description: 'CEOセミナーの日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'ceo-remind-contact',
      stage: 'CEOセミナー',
      title: 'リマインド',
      description: 'CEOセミナーのリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'ceo-result-contact',
      stage: 'CEOセミナー',
      title: '結果連絡',
      description: 'CEOセミナーの結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  '人事面接': [
    {
      id: 'hr-detail-contact',
      stage: '人事面接',
      title: '詳細連絡',
      description: '人事面接の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'hr-schedule-contact',
      stage: '人事面接',
      title: '日程調整連絡',
      description: '人事面接の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'hr-remind-contact',
      stage: '人事面接',
      title: 'リマインド',
      description: '人事面接のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'hr-result-contact',
      stage: '人事面接',
      title: '結果連絡',
      description: '人事面接の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  '最終選考': [
    {
      id: 'final-detail-contact',
      stage: '最終選考',
      title: '詳細連絡',
      description: '最終選考の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'final-schedule-contact',
      stage: '最終選考',
      title: '日程調整連絡',
      description: '最終選考の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'final-remind-contact',
      stage: '最終選考',
      title: 'リマインド',
      description: '最終選考のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'final-result-contact',
      stage: '最終選考',
      title: '結果連絡',
      description: '最終選考の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  '内定': [
    {
      id: 'offer-detail-contact',
      stage: '内定',
      title: '詳細連絡',
      description: '内定の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'offer-schedule-contact',
      stage: '内定',
      title: '日程調整連絡',
      description: '内定の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'offer-remind-contact',
      stage: '内定',
      title: 'リマインド',
      description: '内定のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'offer-result-contact',
      stage: '内定',
      title: '結果連絡',
      description: '内定の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ],
  '不採用': [
    {
      id: 'reject-detail-contact',
      stage: '不採用',
      title: '詳細連絡',
      description: '不採用の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'reject-schedule-contact',
      stage: '不採用',
      title: '日程調整連絡',
      description: '不採用の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'reject-remind-contact',
      stage: '不採用',
      title: 'リマインド',
      description: '不採用のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'reject-result-contact',
      stage: '不採用',
      title: '結果連絡',
      description: '不採用の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 4
    }
  ]
};

// タスクテンプレートを取得する関数
export const getFixedTasksByStage = (stage: SelectionStage): FixedTask[] => {
  return FIXED_TASK_TEMPLATES[stage] || [];
};

// 全タスクテンプレートを取得する関数
export const getAllFixedTasks = (): FixedTask[] => {
  return Object.values(FIXED_TASK_TEMPLATES).flat();
}; 