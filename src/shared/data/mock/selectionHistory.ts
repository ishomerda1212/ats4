import { SelectionHistory } from '@/features/applicants/types/applicant';
import { mockApplicants } from './applicants';

export const mockSelectionHistory: SelectionHistory[] = [
  // 田中太郎の選考履歴
  {
    id: 'history-1',
    applicantId: mockApplicants[0].id,
    stage: 'エントリー',
    startDate: new Date('2024-01-15T09:00:00Z'),
    endDate: new Date('2024-01-16T17:00:00Z'),
    status: '完了',
    notes: 'エントリーシート確認完了',
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-16T17:00:00Z')
  },
  {
    id: 'history-2',
    applicantId: mockApplicants[0].id,
    stage: '会社説明会',
    startDate: new Date('2024-01-17T14:00:00Z'),
    endDate: new Date('2024-01-17T16:00:00Z'),
    status: '完了',
    notes: '参加確認済み',
    createdAt: new Date('2024-01-17T14:00:00Z'),
    updatedAt: new Date('2024-01-17T16:00:00Z')
  },
  {
    id: 'history-3',
    applicantId: mockApplicants[0].id,
    stage: '人事面接',
    startDate: new Date('2024-01-20T14:30:00Z'),
    status: '進行中',
    notes: '面接官：田中部長',
    createdAt: new Date('2024-01-20T14:30:00Z'),
    updatedAt: new Date('2024-01-20T14:30:00Z')
  },
  // 佐藤花子の選考履歴
  {
    id: 'history-4',
    applicantId: mockApplicants[1].id,
    stage: 'エントリー',
    startDate: new Date('2024-01-16T10:15:00Z'),
    endDate: new Date('2024-01-16T18:00:00Z'),
    status: '完了',
    notes: 'エントリーシート確認完了。商学部で経営学を専攻、優秀な成績。国際交流プログラムの経験が評価された',
    createdAt: new Date('2024-01-16T10:15:00Z'),
    updatedAt: new Date('2024-01-16T18:00:00Z')
  },
  {
    id: 'history-5',
    applicantId: mockApplicants[1].id,
    stage: '書類選考',
    startDate: new Date('2024-01-17T09:00:00Z'),
    endDate: new Date('2024-01-17T17:00:00Z'),
    status: '完了',
    notes: '書類選考実施。語学力と国際感覚が高く評価された。英語・中国語のスキルが優秀',
    createdAt: new Date('2024-01-17T09:00:00Z'),
    updatedAt: new Date('2024-01-17T17:00:00Z')
  },
  {
    id: 'history-5-1',
    applicantId: mockApplicants[1].id,
    stage: '会社説明会',
    startDate: new Date('2024-01-18T16:45:00Z'),
    status: '進行中',
    notes: '2024年2月15日の説明会に参加予定。積極的な質問が期待される。グローバル事業への関心が高い',
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z')
  },
  {
    id: 'history-5-2',
    applicantId: mockApplicants[1].id,
    stage: '適性検査',
    startDate: new Date('2024-01-20T10:00:00Z'),
    endDate: new Date('2024-01-20T12:00:00Z'),
    status: '完了',
    notes: '適性検査実施。論理的思考力とコミュニケーション能力が高く評価された',
    createdAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-01-20T12:00:00Z')
  },
  {
    id: 'history-5-3',
    applicantId: mockApplicants[1].id,
    stage: '人事面接',
    startDate: new Date('2024-01-25T10:00:00Z'),
    endDate: new Date('2024-01-25T11:30:00Z'),
    status: '完了',
    notes: '人事面接実施。田中部長が面接官。グローバル事業への理解と意欲が高く評価された',
    createdAt: new Date('2024-01-25T10:00:00Z'),
    updatedAt: new Date('2024-01-25T11:30:00Z')
  },
  {
    id: 'history-5-4',
    applicantId: mockApplicants[1].id,
    stage: '最終選考',
    startDate: new Date('2024-01-30T10:00:00Z'),
    endDate: new Date('2024-01-30T11:30:00Z'),
    status: '完了',
    notes: '最終選考実施。社長面接。最終的な採用判断',
    createdAt: new Date('2024-01-30T10:00:00Z'),
    updatedAt: new Date('2024-01-30T11:30:00Z')
  },
  {
    id: 'history-5-5',
    applicantId: mockApplicants[1].id,
    stage: '内定面談',
    startDate: new Date('2024-02-01T10:00:00Z'),
    status: '進行中',
    notes: '内定面談予定。入社条件の確認',
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-02-01T10:00:00Z')
  },
  // 鈴木次郎の選考履歴
  {
    id: 'history-6',
    applicantId: mockApplicants[2].id,
    stage: 'エントリー',
    startDate: new Date('2024-01-10T08:30:00Z'),
    endDate: new Date('2024-01-10T17:00:00Z'),
    status: '完了',
    notes: 'エントリーシート確認完了',
    createdAt: new Date('2024-01-10T08:30:00Z'),
    updatedAt: new Date('2024-01-10T17:00:00Z')
  },
  {
    id: 'history-7',
    applicantId: mockApplicants[2].id,
    stage: '書類選考',
    startDate: new Date('2024-01-12T09:00:00Z'),
    endDate: new Date('2024-01-12T17:00:00Z'),
    status: '完了',
    notes: '書類選考実施。技術的な知識が高く評価された',
    createdAt: new Date('2024-01-12T09:00:00Z'),
    updatedAt: new Date('2024-01-12T17:00:00Z')
  },
  {
    id: 'history-8',
    applicantId: mockApplicants[2].id,
    stage: '人事面接',
    startDate: new Date('2024-01-15T14:00:00Z'),
    endDate: new Date('2024-01-15T15:30:00Z'),
    status: '完了',
    notes: '人事面接実施。技術的な理解度が高く評価された',
    createdAt: new Date('2024-01-15T14:00:00Z'),
    updatedAt: new Date('2024-01-15T15:30:00Z')
  },
  {
    id: 'history-9',
    applicantId: mockApplicants[2].id,
    stage: '最終選考',
    startDate: new Date('2024-01-22T11:20:00Z'),
    status: '進行中',
    notes: '最終選考予定。技術部長面接',
    createdAt: new Date('2024-01-22T11:20:00Z'),
    updatedAt: new Date('2024-01-22T11:20:00Z')
  },
  // 高橋美咲の選考履歴
  {
    id: 'history-10',
    applicantId: mockApplicants[3].id,
    stage: 'エントリー',
    startDate: new Date('2024-01-20T13:45:00Z'),
    status: '進行中',
    notes: 'エントリーシート確認中',
    createdAt: new Date('2024-01-20T13:45:00Z'),
    updatedAt: new Date('2024-01-20T13:45:00Z')
  },
  // 山田健一の選考履歴
  {
    id: 'history-11',
    applicantId: mockApplicants[4].id,
    stage: 'エントリー',
    startDate: new Date('2024-01-05T07:20:00Z'),
    endDate: new Date('2024-01-05T17:00:00Z'),
    status: '完了',
    notes: 'エントリーシート確認完了',
    createdAt: new Date('2024-01-05T07:20:00Z'),
    updatedAt: new Date('2024-01-05T17:00:00Z')
  },
  {
    id: 'history-12',
    applicantId: mockApplicants[4].id,
    stage: '最終選考',
    startDate: new Date('2024-01-25T10:00:00Z'),
    endDate: new Date('2024-01-25T11:30:00Z'),
    status: '完了',
    notes: '最終選考実施。最終的な採用判断',
    createdAt: new Date('2024-01-25T10:00:00Z'),
    updatedAt: new Date('2024-01-25T11:30:00Z')
  },
  {
    id: 'history-13',
    applicantId: mockApplicants[4].id,
    stage: '内定面談',
    startDate: new Date('2024-01-30T10:00:00Z'),
    status: '完了',
    notes: '内定面談完了。入社予定日：2025年4月1日',
    createdAt: new Date('2024-01-30T10:00:00Z'),
    updatedAt: new Date('2024-01-30T16:00:00Z')
  }
];
