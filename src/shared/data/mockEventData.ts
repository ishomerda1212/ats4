import { Event, EventSession, EventParticipant } from '@/features/events/types/event';

export const mockEvents: Event[] = [
  {
    id: 'event-company-info',
    name: '会社説明会',
    description: '弊社の事業内容、働く環境、キャリアパスについて詳しくご説明します。',
    stage: '会社説明会',
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-10T09:00:00Z')
  },
  {
    id: 'event-workplace-tour',
    name: '職場見学会',
    description: '実際の職場を見学し、社員との交流を通じて職場の雰囲気を体感していただけます。',
    stage: '職場見学',
    createdAt: new Date('2024-01-12T10:00:00Z'),
    updatedAt: new Date('2024-01-12T10:00:00Z')
  },
  {
    id: 'event-ceo-seminar',
    name: 'CEOセミナー',
    description: '代表取締役による経営方針説明と質疑応答セッションです。',
    stage: 'CEOセミナー',
    createdAt: new Date('2024-01-15T11:00:00Z'),
    updatedAt: new Date('2024-01-15T11:00:00Z')
  },
  {
    id: 'event-individual-interview',
    name: '人事面接',
    description: '人事面接を実施します。志望動機やキャリアプランについて詳しく話し合います。',
    stage: '人事面接',
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T09:00:00Z')
  },
  {
    id: 'event-group-interview',
    name: '集団面接',
    description: '複数の応募者による集団面接です。',
    stage: '集団面接',
    createdAt: new Date('2024-01-20T09:00:00Z'),
    updatedAt: new Date('2024-01-20T09:00:00Z')
  },
  {
    id: 'event-document-screening',
    name: '書類選考',
    description: '書類選考の詳細説明と提出書類の確認を行います。',
    stage: '書類選考',
    createdAt: new Date('2024-01-08T09:00:00Z'),
    updatedAt: new Date('2024-01-08T09:00:00Z')
  },
  {
    id: 'event-aptitude-test',
    name: '適性検査',
    description: '適性検査の実施と結果確認を行います。',
    stage: '適性検査',
    createdAt: new Date('2024-01-09T09:00:00Z'),
    updatedAt: new Date('2024-01-09T09:00:00Z')
  },
  {
    id: 'event-job-experience',
    name: '仕事体験',
    description: '実際の業務を体験していただき、職場の雰囲気を体感していただけます。',
    stage: '仕事体験',
    createdAt: new Date('2024-01-14T09:00:00Z'),
    updatedAt: new Date('2024-01-14T09:00:00Z')
  },
  {
    id: 'event-final-selection',
    name: '最終選考',
    description: '最終選考の面接と総合評価を行います。',
    stage: '最終選考',
    createdAt: new Date('2024-01-22T09:00:00Z'),
    updatedAt: new Date('2024-01-22T09:00:00Z')
  },
  {
    id: 'event-offer',
    name: '内定面談',
    description: '内定通知と入社手続きの案内を行います。',
    stage: '内定面談',
    createdAt: new Date('2024-01-25T09:00:00Z'),
    updatedAt: new Date('2024-01-25T09:00:00Z')
  }
];

export const mockEventSessions: EventSession[] = [
  // 会社説明会のセッション
  {
    id: 'session-company-info-1',
    eventId: 'event-company-info',
    name: '会社説明会 第1回',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(16, 0, 0, 0)),
    venue: '本社オフィスA',
    format: '対面',
    participants: [],
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-10T09:00:00Z')
  },
  {
    id: 'session-company-info-2',
    eventId: 'event-company-info',
    name: '会社説明会 第2回',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0, 0)),
    venue: '本社オフィスB',
    format: 'オンライン',
    participants: [],
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-10T09:00:00Z')
  },
  // 職場見学会のセッション
  {
    id: 'session-workplace-tour-1',
    eventId: 'event-workplace-tour',
    name: '職場見学会 第1回',
    start: new Date('2024-02-25T13:00:00Z'),
    end: new Date('2024-02-25T15:00:00Z'),
    venue: '開発フロア',
    format: '対面',
    participants: [],
    createdAt: new Date('2024-01-12T10:00:00Z'),
    updatedAt: new Date('2024-01-12T10:00:00Z')
  },
  // 社長セミナーのセッション
  {
    id: 'session-ceo-seminar-1',
    eventId: 'event-ceo-seminar',
    name: '社長セミナー 第1回',
    start: new Date('2024-03-05T15:00:00Z'),
    end: new Date('2024-03-05T17:00:00Z'),
    venue: '大会議室',
    format: '対面',
    participants: [],
    createdAt: new Date('2024-01-15T11:00:00Z'),
    updatedAt: new Date('2024-01-15T11:00:00Z')
  },
  // 人事面接のセッション（上限1名）
  {
    id: 'session-individual-interview-a',
    eventId: 'event-individual-interview',
    name: '人事面接 A日程',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    venue: '面接室A',
    format: '対面',
    maxParticipants: 1, // 人事面接なので1名まで
    participants: [],
    recruiter: '田中部長',
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T09:00:00Z')
  },
  {
    id: 'session-individual-interview-b',
    eventId: 'event-individual-interview',
    name: '人事面接 B日程',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    venue: '面接室B',
    format: 'オンライン',
    maxParticipants: 1, // 人事面接なので1名まで
    participants: [],
    recruiter: '佐藤課長',
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T09:00:00Z')
  },
  {
    id: 'session-individual-interview-c',
    eventId: 'event-individual-interview',
    name: '人事面接 C日程',
    start: new Date(new Date().setHours(13, 0, 0, 0)),
    end: new Date(new Date().setHours(14, 0, 0, 0)),
    venue: '面接室A',
    format: '対面',
    maxParticipants: 1, // 人事面接なので1名まで
    participants: [],
    recruiter: '鈴木マネージャー',
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T09:00:00Z')
  },
  // 集団面接のセッション（上限8名）
  {
    id: 'session-group-interview-1',
    eventId: 'event-group-interview',
    name: '集団面接 第1回',
    start: new Date('2024-03-15T10:00:00Z'),
    end: new Date('2024-03-15T12:00:00Z'),
    venue: '大会議室',
    format: '対面',
    maxParticipants: 8, // 集団面接なので8名まで
    participants: [],
    recruiter: '人事部一同',
    createdAt: new Date('2024-01-20T09:00:00Z'),
    updatedAt: new Date('2024-01-20T09:00:00Z')
  },
  {
    id: 'session-group-interview-2',
    eventId: 'event-group-interview',
    name: '集団面接 第2回',
    start: new Date('2024-03-18T14:00:00Z'),
    end: new Date('2024-03-18T16:00:00Z'),
    venue: '会議室C',
    format: 'オンライン',
    maxParticipants: 8, // 集団面接なので8名まで
    participants: [],
    recruiter: '人事部一同',
    createdAt: new Date('2024-01-20T09:00:00Z'),
    updatedAt: new Date('2024-01-20T09:00:00Z')
  },
  // 書類選考のセッション
  {
    id: 'session-document-screening-1',
    eventId: 'event-document-screening',
    name: '書類選考 第1回',
    start: new Date('2024-02-01T09:00:00Z'),
    end: new Date('2024-02-01T17:00:00Z'),
    venue: '人事部',
    format: '対面',
    maxParticipants: 20,
    participants: [],
    recruiter: '人事部',
    createdAt: new Date('2024-01-08T09:00:00Z'),
    updatedAt: new Date('2024-01-08T09:00:00Z')
  },
  // 適性検査のセッション
  {
    id: 'session-aptitude-test-1',
    eventId: 'event-aptitude-test',
    name: '適性検査 第1回',
    start: new Date('2024-02-05T10:00:00Z'),
    end: new Date('2024-02-05T12:00:00Z'),
    venue: '会議室A',
    format: '対面',
    maxParticipants: 15,
    participants: [],
    recruiter: '人事部',
    createdAt: new Date('2024-01-09T09:00:00Z'),
    updatedAt: new Date('2024-01-09T09:00:00Z')
  },
  {
    id: 'session-aptitude-test-2',
    eventId: 'event-aptitude-test',
    name: '適性検査 第2回',
    start: new Date('2024-02-07T14:00:00Z'),
    end: new Date('2024-02-07T16:00:00Z'),
    venue: 'オンライン',
    format: 'オンライン',
    maxParticipants: 15,
    participants: [],
    recruiter: '人事部',
    createdAt: new Date('2024-01-09T09:00:00Z'),
    updatedAt: new Date('2024-01-09T09:00:00Z')
  },
  // 仕事体験のセッション
  {
    id: 'session-job-experience-1',
    eventId: 'event-job-experience',
    name: '仕事体験 第1回',
    start: new Date('2024-02-28T09:00:00Z'),
    end: new Date('2024-02-28T17:00:00Z'),
    venue: '開発フロア',
    format: '対面',
    maxParticipants: 5,
    participants: [],
    recruiter: '開発部',
    createdAt: new Date('2024-01-14T09:00:00Z'),
    updatedAt: new Date('2024-01-14T09:00:00Z')
  },
  // 最終選考のセッション
  {
    id: 'session-final-selection-1',
    eventId: 'event-final-selection',
    name: '最終選考 第1回',
    start: new Date('2024-03-25T10:00:00Z'),
    end: new Date('2024-03-25T12:00:00Z'),
    venue: '大会議室',
    format: '対面',
    maxParticipants: 3,
    participants: [],
    recruiter: '代表取締役',
    createdAt: new Date('2024-01-22T09:00:00Z'),
    updatedAt: new Date('2024-01-22T09:00:00Z')
  },
  // 内定面談のセッション
  {
    id: 'session-offer-1',
    eventId: 'event-offer',
    name: '内定面談 第1回',
    start: new Date('2024-04-01T14:00:00Z'),
    end: new Date('2024-04-01T15:00:00Z'),
    venue: '人事部',
    format: '対面',
    maxParticipants: 1,
    participants: [],
    recruiter: '人事部長',
    createdAt: new Date('2024-01-25T09:00:00Z'),
    updatedAt: new Date('2024-01-25T09:00:00Z')
  }
];

export const mockEventParticipants: EventParticipant[] = [
  {
    id: 'participant-1',
    sessionId: 'session-company-info-1',
    applicantId: 'applicant-1', // 田中太郎
    status: '未定',
    joinedAt: new Date('2024-01-20T10:00:00Z'),
    createdAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-01-20T10:00:00Z')
  },
  {
    id: 'participant-2',
    sessionId: 'session-company-info-1',
    applicantId: 'applicant-2', // 佐藤花子
    status: '参加',
    joinedAt: new Date('2024-01-18T14:30:00Z'),
    createdAt: new Date('2024-01-18T14:30:00Z'),
    updatedAt: new Date('2024-02-15T16:00:00Z')
  },
  {
    id: 'participant-3',
    sessionId: 'session-workplace-tour-1',
    applicantId: 'applicant-3', // 鈴木次郎
    status: '未定',
    joinedAt: new Date('2024-01-22T09:15:00Z'),
    createdAt: new Date('2024-01-22T09:15:00Z'),
    updatedAt: new Date('2024-01-22T09:15:00Z')
  },
  {
    id: 'participant-4',
    sessionId: 'session-company-info-1',
    applicantId: 'applicant-4', // 高橋美咲
    status: '未定',
    joinedAt: new Date('2024-01-21T15:20:00Z'),
    createdAt: new Date('2024-01-21T15:20:00Z'),
    updatedAt: new Date('2024-01-21T15:20:00Z')
  },
  // 人事面接（上限1名）の参加者サンプル
  {
    id: 'participant-5',
    sessionId: 'session-individual-interview-a', // 人事面接A日程
    applicantId: 'applicant-1', // 田中太郎
    status: '申込',
    joinedAt: new Date('2024-02-01T10:00:00Z'),
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-02-01T10:00:00Z')
  },
  // 集団面接（上限8名）の参加者サンプル
  {
    id: 'participant-6',
    sessionId: 'session-group-interview-1', // 集団面接第1回
    applicantId: 'applicant-2', // 佐藤花子
    status: '申込',
    joinedAt: new Date('2024-02-05T14:00:00Z'),
    createdAt: new Date('2024-02-05T14:00:00Z'),
    updatedAt: new Date('2024-02-05T14:00:00Z')
  },
  {
    id: 'participant-7',
    sessionId: 'session-group-interview-1', // 集団面接第1回
    applicantId: 'applicant-3', // 鈴木次郎
    status: '参加',
    joinedAt: new Date('2024-02-06T09:00:00Z'),
    createdAt: new Date('2024-02-06T09:00:00Z'),
    updatedAt: new Date('2024-02-06T09:00:00Z')
  },
  // 追加の参加者データ
  {
    id: 'participant-8',
    sessionId: 'session-company-info-2',
    applicantId: 'applicant-5', // 山田健一
    status: '申込',
    joinedAt: new Date('2024-02-08T16:45:00Z'),
    createdAt: new Date('2024-02-08T16:45:00Z'),
    updatedAt: new Date('2024-02-08T16:45:00Z')
  },
  {
    id: 'participant-9',
    sessionId: 'session-aptitude-test-1',
    applicantId: 'applicant-1', // 田中太郎
    status: '申込',
    joinedAt: new Date('2024-02-03T09:15:00Z'),
    createdAt: new Date('2024-02-03T09:15:00Z'),
    updatedAt: new Date('2024-02-03T09:15:00Z')
  },
  {
    id: 'participant-10',
    sessionId: 'session-aptitude-test-1',
    applicantId: 'applicant-2', // 佐藤花子
    status: '申込',
    joinedAt: new Date('2024-02-03T10:30:00Z'),
    createdAt: new Date('2024-02-03T10:30:00Z'),
    updatedAt: new Date('2024-02-03T10:30:00Z')
  },
  {
    id: 'participant-11',
    sessionId: 'session-job-experience-1',
    applicantId: 'applicant-1', // 田中太郎
    status: '申込',
    joinedAt: new Date('2024-02-25T14:20:00Z'),
    createdAt: new Date('2024-02-25T14:20:00Z'),
    updatedAt: new Date('2024-02-25T14:20:00Z')
  },
  {
    id: 'participant-12',
    sessionId: 'session-final-selection-1',
    applicantId: 'applicant-1', // 田中太郎
    status: '申込',
    joinedAt: new Date('2024-03-20T11:00:00Z'),
    createdAt: new Date('2024-03-20T11:00:00Z'),
    updatedAt: new Date('2024-03-20T11:00:00Z')
  },
  {
    id: 'participant-13',
    sessionId: 'session-final-selection-1',
    applicantId: 'applicant-2', // 佐藤花子
    status: '申込',
    joinedAt: new Date('2024-03-20T13:45:00Z'),
    createdAt: new Date('2024-03-20T13:45:00Z'),
    updatedAt: new Date('2024-03-20T13:45:00Z')
  },
  {
    id: 'participant-14',
    sessionId: 'session-offer-1',
    applicantId: 'applicant-1', // 田中太郎
    status: '申込',
    joinedAt: new Date('2024-03-28T15:30:00Z'),
    createdAt: new Date('2024-03-28T15:30:00Z'),
    updatedAt: new Date('2024-03-28T15:30:00Z')
  }
];