import { FixedTask } from '../../types/task';

export const interviewTasks: FixedTask[] = [
  {
    id: 'interview-1',
    stage: '人事面接',
    title: '面接日程調整',
    description: '面接の日程を調整する',
    type: 'interview',
    order: 1,
  },
  {
    id: 'interview-2',
    stage: '人事面接',
    title: '面接実施',
    description: '面接を実施する',
    type: 'interview',
    order: 2,
  },
  {
    id: 'interview-3',
    stage: '人事面接',
    title: '面接結果通知',
    description: '面接の結果を通知する',
    type: 'email',
    order: 3,
  },
];
