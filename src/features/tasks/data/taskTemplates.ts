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
      id: 'document-submit-documents',
      stage: '書類選考',
      title: '提出書類',
      description: '書類選考の提出書類確認',
      type: '提出書類',
      isRequired: true,
      estimatedDuration: 30,
      order: 2
    },
    {
      id: 'document-result-contact',
      stage: '書類選考',
      title: '結果連絡',
      description: '書類選考の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 3
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
  '適性検査体験': [
    {
      id: 'aptitude-detail-contact',
      stage: '適性検査体験',
      title: '詳細連絡',
      description: '適性検査体験の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'aptitude-schedule-contact',
      stage: '適性検査体験',
      title: '日程調整連絡',
      description: '適性検査体験の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'aptitude-remind-contact',
      stage: '適性検査体験',
      title: 'リマインド',
      description: '適性検査体験のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'aptitude-result-contact',
      stage: '適性検査体験',
      title: '結果連絡',
      description: '適性検査体験の結果連絡',
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
  '人事面接': [
    {
      id: 'task-individual-interview-contact',
      title: '詳細連絡',
      stage: '人事面接',
      type: '詳細連絡',
      description: '人事面接の詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'task-individual-interview-schedule',
      title: '日程調整連絡',
      stage: '人事面接',
      type: '日程調整連絡',
      description: '人事面接の日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'task-individual-interview-reminder',
      title: 'リマインド',
      stage: '人事面接',
      type: 'リマインド',
      description: '人事面接のリマインド連絡',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'task-individual-interview-result',
      title: '結果連絡',
      stage: '人事面接',
      type: '結果連絡',
      description: '人事面接の結果連絡',
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
      id: 'final-submit-documents',
      stage: '最終選考',
      title: '提出書類',
      description: '最終選考の提出書類確認',
      type: '提出書類',
      isRequired: true,
      estimatedDuration: 30,
      order: 3
    },
    {
      id: 'final-remind-contact',
      stage: '最終選考',
      title: 'リマインド',
      description: '最終選考のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 4
    },
    {
      id: 'final-result-contact',
      stage: '最終選考',
      title: '結果連絡',
      description: '最終選考の結果連絡',
      type: '結果連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 5
    }
  ],
  '内定面談': [
    {
      id: 'offer-detail-contact',
      stage: '内定面談',
      title: '詳細連絡',
      description: '内定面談の詳細連絡',
      type: '詳細連絡',
      isRequired: true,
      estimatedDuration: 15,
      order: 1
    },
    {
      id: 'offer-schedule-contact',
      stage: '内定面談',
      title: '日程調整連絡',
      description: '内定面談の日程調整連絡',
      type: '日程調整連絡',
      isRequired: true,
      estimatedDuration: 20,
      order: 2
    },
    {
      id: 'offer-remind-contact',
      stage: '内定面談',
      title: 'リマインド',
      description: '内定面談のリマインド連絡',
      type: 'リマインド',
      isRequired: true,
      estimatedDuration: 10,
      order: 3
    },
    {
      id: 'offer-result-contact',
      stage: '内定面談',
      title: '結果連絡',
      description: '内定面談の結果連絡',
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