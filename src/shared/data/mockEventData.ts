import { Event, EventSession, EventParticipant } from '@/features/events/types/event';
import { generateId } from '@/shared/utils/date';
import { mockApplicants } from './mockData';

export const mockEvents: Event[] = [
  {
    id: generateId(),
    name: '会社説明会',
    description: '弊社の事業内容、働く環境、キャリアパスについて詳しくご説明します。',
    stage: '会社説明会',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: generateId(),
    name: '職場見学会',
    description: '実際の職場を見学し、社員との交流を通じて職場の雰囲気を体感していただけます。',
    stage: '職場見学',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: generateId(),
    name: '社長セミナー',
    description: '代表取締役による経営方針説明と質疑応答セッションです。',
    stage: '社長セミナー',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  }
];

export const mockEventSessions: EventSession[] = [
  // 会社説明会のセッション
  {
    id: generateId(),
    eventId: mockEvents[0].id,
    startDateTime: '2024-02-15T14:00:00Z',
    endDateTime: '2024-02-15T16:00:00Z',
    venue: '本社会議室A',
    notes: '資料配布あり',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: generateId(),
    eventId: mockEvents[0].id,
    startDateTime: '2024-02-20T10:00:00Z',
    endDateTime: '2024-02-20T12:00:00Z',
    venue: '本社会議室B',
    notes: 'オンライン同時配信',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  // 職場見学会のセッション
  {
    id: generateId(),
    eventId: mockEvents[1].id,
    startDateTime: '2024-02-25T13:00:00Z',
    endDateTime: '2024-02-25T15:00:00Z',
    venue: '開発フロア',
    notes: '動きやすい服装でお越しください',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  // 社長セミナーのセッション
  {
    id: generateId(),
    eventId: mockEvents[2].id,
    startDateTime: '2024-03-05T15:00:00Z',
    endDateTime: '2024-03-05T17:00:00Z',
    venue: '大会議室',
    notes: '質疑応答時間を多めに設けています',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  }
];

export const mockEventParticipants: EventParticipant[] = [
  {
    id: generateId(),
    eventSessionId: mockEventSessions[0].id,
    applicantId: mockApplicants[0].id, // 田中太郎
    status: '申込',
    registrationDate: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: generateId(),
    eventSessionId: mockEventSessions[0].id,
    applicantId: mockApplicants[1].id, // 佐藤花子
    status: '参加',
    registrationDate: '2024-01-18T14:30:00Z',
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-02-15T16:00:00Z'
  },
  {
    id: generateId(),
    eventSessionId: mockEventSessions[1].id,
    applicantId: mockApplicants[2].id, // 鈴木次郎
    status: '申込',
    registrationDate: '2024-01-22T09:15:00Z',
    createdAt: '2024-01-22T09:15:00Z',
    updatedAt: '2024-01-22T09:15:00Z'
  },
  {
    id: generateId(),
    eventSessionId: mockEventSessions[0].id,
    applicantId: mockApplicants[3].id, // 高橋美咲
    status: '申込',
    registrationDate: '2024-01-21T15:20:00Z',
    createdAt: '2024-01-21T15:20:00Z',
    updatedAt: '2024-01-21T15:20:00Z'
  }
];