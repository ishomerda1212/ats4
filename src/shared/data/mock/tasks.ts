import { Task } from '@/features/tasks/types/task';

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: '田中太郎への詳細連絡',
    description: '人事面接の詳細について連絡する',
    type: 'email',
    status: '完了',
    dueDate: new Date('2024-01-21T17:00:00Z'),
    applicantId: 'applicant-1',
    stage: '人事面接',
    createdAt: new Date('2024-01-20T14:30:00Z'),
    updatedAt: new Date('2024-01-20T16:00:00Z'),
    completedAt: new Date('2024-01-20T16:00:00Z')
  },
  {
    id: 'task-2',
    title: '佐藤花子への結果連絡',
    description: '人事面接の結果について連絡する',
    type: 'email',
    status: '返信待ち',
    dueDate: new Date('2024-01-26T17:00:00Z'),
    applicantId: 'applicant-2',
    stage: '人事面接',
    createdAt: new Date('2024-01-25T11:30:00Z'),
    updatedAt: new Date('2024-01-25T11:30:00Z')
  },
  {
    id: 'task-3',
    title: '鈴木次郎への詳細連絡',
    description: '最終選考の詳細について連絡する',
    type: 'email',
    status: '未着手',
    dueDate: new Date('2024-01-23T17:00:00Z'),
    applicantId: 'applicant-3',
    stage: '最終選考',
    createdAt: new Date('2024-01-22T11:20:00Z'),
    updatedAt: new Date('2024-01-22T11:20:00Z')
  },
  {
    id: 'task-4',
    title: '高橋美咲への詳細連絡',
    description: 'エントリーシート確認後の詳細連絡',
    type: 'email',
    status: '未着手',
    dueDate: new Date('2024-01-25T17:00:00Z'),
    applicantId: 'applicant-4',
    stage: 'エントリー',
    createdAt: new Date('2024-01-20T13:45:00Z'),
    updatedAt: new Date('2024-01-20T13:45:00Z')
  },
  {
    id: 'task-5',
    title: '山田健一への内定通知',
    description: '内定通知書の送付',
    type: 'email',
    status: '完了',
    dueDate: new Date('2024-01-31T17:00:00Z'),
    applicantId: 'applicant-5',
    stage: '内定面談',
    createdAt: new Date('2024-01-30T16:00:00Z'),
    updatedAt: new Date('2024-01-30T16:00:00Z'),
    completedAt: new Date('2024-01-30T16:00:00Z')
  },
  {
    id: 'task-6',
    title: '伊藤優子への詳細連絡',
    description: '最終選考の詳細について連絡する',
    type: 'email',
    status: '完了',
    dueDate: new Date('2024-01-29T17:00:00Z'),
    applicantId: 'applicant-6',
    stage: '最終選考',
    createdAt: new Date('2024-01-28T10:00:00Z'),
    updatedAt: new Date('2024-01-28T16:00:00Z'),
    completedAt: new Date('2024-01-28T16:00:00Z')
  }
];
