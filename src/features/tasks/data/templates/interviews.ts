import { FixedTask } from '../../types/task';

export const interviewTemplates: FixedTask[] = [
  {
    id: 'interview-detail-contact',
    stage: '人事面接',
    title: '詳細連絡',
    description: '人事面接の詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  },
  {
    id: 'interview-schedule-contact',
    stage: '人事面接',
    title: '日程調整連絡',
    description: '人事面接の日程調整連絡',
    type: '日程調整連絡',
    isRequired: true,
    estimatedDuration: 30,
    order: 2
  },
  {
    id: 'interview-reminder',
    stage: '人事面接',
    title: 'リマインド',
    description: '人事面接のリマインド',
    type: 'リマインド',
    isRequired: true,
    estimatedDuration: 10,
    order: 3
  },
  {
    id: 'interview-result-contact',
    stage: '人事面接',
    title: '結果連絡',
    description: '人事面接の結果連絡',
    type: '結果連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 4
  },
  {
    id: 'group-interview-detail-contact',
    stage: '集団面接',
    title: '詳細連絡',
    description: '集団面接の詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  },
  {
    id: 'group-interview-schedule-contact',
    stage: '集団面接',
    title: '日程調整連絡',
    description: '集団面接の日程調整連絡',
    type: '日程調整連絡',
    isRequired: true,
    estimatedDuration: 30,
    order: 2
  },
  {
    id: 'group-interview-reminder',
    stage: '集団面接',
    title: 'リマインド',
    description: '集団面接のリマインド',
    type: 'リマインド',
    isRequired: true,
    estimatedDuration: 10,
    order: 3
  },
  {
    id: 'group-interview-result-contact',
    stage: '集団面接',
    title: '結果連絡',
    description: '集団面接の結果連絡',
    type: '結果連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 4
  },
  {
    id: 'final-interview-detail-contact',
    stage: '最終選考',
    title: '詳細連絡',
    description: '最終選考の詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  },
  {
    id: 'final-interview-schedule-contact',
    stage: '最終選考',
    title: '日程調整連絡',
    description: '最終選考の日程調整連絡',
    type: '日程調整連絡',
    isRequired: true,
    estimatedDuration: 30,
    order: 2
  },
  {
    id: 'final-interview-reminder',
    stage: '最終選考',
    title: 'リマインド',
    description: '最終選考のリマインド',
    type: 'リマインド',
    isRequired: true,
    estimatedDuration: 10,
    order: 3
  },
  {
    id: 'final-interview-result-contact',
    stage: '最終選考',
    title: '結果連絡',
    description: '最終選考の結果連絡',
    type: '結果連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 4
  }
];
