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
    name: '社長セミナー',
    description: '代表取締役による経営方針説明と質疑応答セッションです。',
    stage: '社長セミナー',
    createdAt: new Date('2024-01-15T11:00:00Z'),
    updatedAt: new Date('2024-01-15T11:00:00Z')
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
  }
];