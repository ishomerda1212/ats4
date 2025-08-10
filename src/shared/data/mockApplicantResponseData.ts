import { ApplicantEventResponse } from '@/features/applicant-form/types/applicantForm';

export const mockApplicantResponses: ApplicantEventResponse[] = [
  // 田中太郎さんの会社説明会回答
  {
    applicantId: 'applicant-1',
    eventId: 'event-company-info',
    sessionResponses: [
      {
        sessionId: 'session-company-info-1',
        status: 'participate'
      },
      {
        sessionId: 'session-company-info-2',
        status: 'not_participate'
      }
    ],
    submittedAt: new Date('2024-02-10T15:30:00Z')
  },
  
  // 佐藤花子さんの会社説明会回答
  {
    applicantId: 'applicant-2',
    eventId: 'event-company-info',
    sessionResponses: [
      {
        sessionId: 'session-company-info-1',
        status: 'not_participate'
      },
      {
        sessionId: 'session-company-info-2',
        status: 'participate'
      }
    ],
    submittedAt: new Date('2024-02-11T10:15:00Z')
  },
  
  // 鈴木次郎さんの職場見学会回答
  {
    applicantId: 'applicant-3',
    eventId: 'event-workplace-tour',
    sessionResponses: [
      {
        sessionId: 'session-workplace-tour-1',
        status: 'participate'
      }
    ],
    submittedAt: new Date('2024-02-12T14:20:00Z')
  },
  
  // 高橋美咲さんのCEOセミナー回答
  {
    applicantId: 'applicant-4',
    eventId: 'event-ceo-seminar',
    sessionResponses: [
      {
        sessionId: 'session-ceo-seminar-1',
        status: 'participate'
      },
      {
        sessionId: 'session-ceo-seminar-2',
        status: 'not_participate'
      }
    ],
    submittedAt: new Date('2024-02-13T09:45:00Z')
  },
  
  // 山田健一さんの個別面接回答
  {
    applicantId: 'applicant-5',
    eventId: 'event-individual-interview',
    sessionResponses: [
      {
        sessionId: 'session-individual-interview-1',
        status: 'participate'
      },
      {
        sessionId: 'session-individual-interview-2',
        status: 'participate'
      },
      {
        sessionId: 'session-individual-interview-3',
        status: 'not_participate'
      }
    ],
    submittedAt: new Date('2024-02-14T16:30:00Z')
  },
  
  // 伊藤優子さんの集団面接回答
  {
    applicantId: 'applicant-6',
    eventId: 'event-group-interview',
    sessionResponses: [
      {
        sessionId: 'session-group-interview-1',
        status: 'participate'
      }
    ],
    submittedAt: new Date('2024-02-15T11:00:00Z')
  },
  
  // サンプル応募者の会社説明会回答
  {
    applicantId: 'sample',
    eventId: 'event-company-info',
    sessionResponses: [
      {
        sessionId: 'session-company-info-1',
        status: 'participate'
      },
      {
        sessionId: 'session-company-info-2',
        status: 'not_participate'
      }
    ],
    submittedAt: new Date('2024-02-16T13:00:00Z')
  }
];