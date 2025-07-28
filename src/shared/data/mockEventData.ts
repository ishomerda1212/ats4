import { Event, EventSession, EventParticipant } from '@/features/events/types/event';
import { generateId } from '@/shared/utils/date';
import { mockApplicants } from './mockData';

export const mockEvents: Event[] = [
  {
    id: generateId(),
    name: '会社説明会',
    description: '弊社の事業内容、働く環境、キャリアパスについて詳しくご説明します。',
    stage: '会社説明会',
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-10T09:00:00Z')
  },
  {
    id: generateId(),
    name: '職場見学会',
    description: '実際の職場を見学し、社員との交流を通じて職場の雰囲気を体感していただけます。',
    stage: '職場見学',
    createdAt: new Date('2024-01-12T10:00:00Z'),
    updatedAt: new Date('2024-01-12T10:00:00Z')
  },
  {
    id: generateId(),
    name: 'CEOセミナー',
    description: '代表取締役による経営方針説明と質疑応答セッションです。',
    stage: 'CEOセミナー',
    createdAt: new Date('2024-01-15T11:00:00Z'),
    updatedAt: new Date('2024-01-15T11:00:00Z')
  },
  {
    id: generateId(),
    name: '個別面接',
    description: '採用担当者との1対1の面接です。',
    stage: '個別面接',
    createdAt: new Date('2024-01-18T09:00:00Z'),
    updatedAt: new Date('2024-01-18T09:00:00Z')
  },
  {
    id: generateId(),
    name: '集団面接',
    description: '複数の応募者による集団面接です。',
    stage: '集団面接',
    createdAt: new Date('2024-01-20T09:00:00Z'),
    updatedAt: new Date('2024-01-20T09:00:00Z')
  }
];

export const mockEventSessions: EventSession[] = [
  // 会社説明会のセッション
  {
    id: generateId(),
    eventId: mockEvents[0].id,
    name: '会社説明会 第1回',
    start: new Date('2024-02-15T14:00:00Z'),
    end: new Date('2024-02-15T16:00:00Z'),
    venue: '本社オフィスA',
    participants: [],
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-10T09:00:00Z')
  },
  {
    id: generateId(),
    eventId: mockEvents[0].id,
    name: '会社説明会 第2回',
    start: new Date('2024-02-20T10:00:00Z'),
    end: new Date('2024-02-20T12:00:00Z'),
    venue: '本社オフィスB',
    participants: [],
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-10T09:00:00Z')
  },
  // 職場見学会のセッション
  {
    id: generateId(),
    eventId: mockEvents[1].id,
    name: '職場見学会 第1回',
    start: new Date('2024-02-25T13:00:00Z'),
    end: new Date('2024-02-25T15:00:00Z'),
    venue: '開発フロア',
    participants: [],
    createdAt: new Date('2024-01-12T10:00:00Z'),
    updatedAt: new Date('2024-01-12T10:00:00Z')
  },
  // 社長セミナーのセッション
  {
    id: generateId(),
    eventId: mockEvents[2].id,
    name: '社長セミナー 第1回',
    start: new Date('2024-03-05T15:00:00Z'),
    end: new Date('2024-03-05T17:00:00Z'),
    venue: '大会議室',
    participants: [],
    createdAt: new Date('2024-01-15T11:00:00Z'),
    updatedAt: new Date('2024-01-15T11:00:00Z')
  },
  // 個別面接のセッション（上限1名）
  {
    id: generateId(),
    eventId: mockEvents[3].id,
    name: '個別面接 A日程',
    start: new Date('2024-03-10T10:00:00Z'),
    end: new Date('2024-03-10T11:00:00Z'),
    venue: '面接室A',
    maxParticipants: 1, // 個別面接なので1名まで
    participants: [],
    recruiter: '田中部長',
    createdAt: new Date('2024-01-18T09:00:00Z'),
    updatedAt: new Date('2024-01-18T09:00:00Z')
  },
  {
    id: generateId(),
    eventId: mockEvents[3].id,
    name: '個別面接 B日程',
    start: new Date('2024-03-10T14:00:00Z'),
    end: new Date('2024-03-10T15:00:00Z'),
    venue: '面接室B',
    maxParticipants: 1, // 個別面接なので1名まで
    participants: [],
    recruiter: '佐藤課長',
    createdAt: new Date('2024-01-18T09:00:00Z'),
    updatedAt: new Date('2024-01-18T09:00:00Z')
  },
  {
    id: generateId(),
    eventId: mockEvents[3].id,
    name: '個別面接 C日程',
    start: new Date('2024-03-12T13:00:00Z'),
    end: new Date('2024-03-12T14:00:00Z'),
    venue: '面接室A',
    maxParticipants: 1, // 個別面接なので1名まで
    participants: [],
    recruiter: '鈴木マネージャー',
    createdAt: new Date('2024-01-18T09:00:00Z'),
    updatedAt: new Date('2024-01-18T09:00:00Z')
  },
  // 集団面接のセッション（上限8名）
  {
    id: generateId(),
    eventId: mockEvents[4].id,
    name: '集団面接 第1回',
    start: new Date('2024-03-15T10:00:00Z'),
    end: new Date('2024-03-15T12:00:00Z'),
    venue: '大会議室',
    maxParticipants: 8, // 集団面接なので8名まで
    participants: [],
    recruiter: '人事部一同',
    createdAt: new Date('2024-01-20T09:00:00Z'),
    updatedAt: new Date('2024-01-20T09:00:00Z')
  },
  {
    id: generateId(),
    eventId: mockEvents[4].id,
    name: '集団面接 第2回',
    start: new Date('2024-03-18T14:00:00Z'),
    end: new Date('2024-03-18T16:00:00Z'),
    venue: '会議室C',
    maxParticipants: 8, // 集団面接なので8名まで
    participants: [],
    recruiter: '人事部一同',
    createdAt: new Date('2024-01-20T09:00:00Z'),
    updatedAt: new Date('2024-01-20T09:00:00Z')
  }
];

export const mockEventParticipants: EventParticipant[] = [
  {
    id: generateId(),
    eventId: mockEventSessions[0].id,
    applicantId: mockApplicants[0].id, // 田中太郎
    status: '未定',
    joinedAt: new Date('2024-01-20T10:00:00Z'),
    createdAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-01-20T10:00:00Z')
  },
  {
    id: generateId(),
    eventId: mockEventSessions[0].id,
    applicantId: mockApplicants[1].id, // 佐藤花子
    status: '参加',
    joinedAt: new Date('2024-01-18T14:30:00Z'),
    createdAt: new Date('2024-01-18T14:30:00Z'),
    updatedAt: new Date('2024-02-15T16:00:00Z')
  },
  {
    id: generateId(),
    eventId: mockEventSessions[1].id,
    applicantId: mockApplicants[2].id, // 鈴木次郎
    status: '未定',
    joinedAt: new Date('2024-01-22T09:15:00Z'),
    createdAt: new Date('2024-01-22T09:15:00Z'),
    updatedAt: new Date('2024-01-22T09:15:00Z')
  },
  {
    id: generateId(),
    eventId: mockEventSessions[0].id,
    applicantId: mockApplicants[3].id, // 高橋美咲
    status: '未定',
    joinedAt: new Date('2024-01-21T15:20:00Z'),
    createdAt: new Date('2024-01-21T15:20:00Z'),
    updatedAt: new Date('2024-01-21T15:20:00Z')
  },
  // 個別面接（上限1名）の参加者サンプル
  {
    id: generateId(),
    eventId: mockEventSessions[4].id, // 個別面接A日程
    applicantId: mockApplicants[0].id, // 田中太郎
    status: '申込',
    joinedAt: new Date('2024-02-01T10:00:00Z'),
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-02-01T10:00:00Z')
  },
  // 集団面接（上限8名）の参加者サンプル
  {
    id: generateId(),
    eventId: mockEventSessions[8].id, // 集団面接第1回
    applicantId: mockApplicants[1].id, // 佐藤花子
    status: '申込',
    joinedAt: new Date('2024-02-05T14:00:00Z'),
    createdAt: new Date('2024-02-05T14:00:00Z'),
    updatedAt: new Date('2024-02-05T14:00:00Z')
  },
  {
    id: generateId(),
    eventId: mockEventSessions[8].id, // 集団面接第1回
    applicantId: mockApplicants[2].id, // 鈴木次郎
    status: '参加',
    joinedAt: new Date('2024-02-06T09:00:00Z'),
    createdAt: new Date('2024-02-06T09:00:00Z'),
    updatedAt: new Date('2024-02-06T09:00:00Z')
  }
];