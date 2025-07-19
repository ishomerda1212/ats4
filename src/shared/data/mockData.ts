import { Applicant, SelectionHistory, Evaluation } from '@/features/applicants/types/applicant';
import { Task } from '@/features/applicants/types/applicant';
import { generateId } from '@/shared/utils/date';
import { STAGE_TASKS } from '@/shared/utils/constants';

export const mockApplicants: Applicant[] = [
  {
    id: generateId(),
    source: 'マイナビ',
    name: '田中 太郎',
    nameKana: 'タナカ タロウ',
    gender: '男性',
    schoolName: '東京大学',
    faculty: '工学部',
    department: '情報工学科',
    graduationYear: 2025,
    address: '東京都渋谷区',
    phone: '090-1234-5678',
    email: 'tanaka@example.com',
    currentStage: '人事面接',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: generateId(),
    source: '学情',
    name: '佐藤 花子',
    nameKana: 'サトウ ハナコ',
    gender: '女性',
    schoolName: '早稲田大学',
    faculty: '商学部',
    department: '経営学科',
    graduationYear: 2025,
    address: '東京都新宿区',
    phone: '090-2345-6789',
    email: 'sato@example.com',
    currentStage: '会社説明会',
    createdAt: '2024-01-16T10:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: generateId(),
    source: 'オファーボックス',
    name: '鈴木 次郎',
    nameKana: 'スズキ ジロウ',
    gender: '男性',
    schoolName: '慶應義塾大学',
    faculty: '理工学部',
    department: 'システムデザイン工学科',
    graduationYear: 2025,
    address: '神奈川県横浜市',
    phone: '090-3456-7890',
    email: 'suzuki@example.com',
    currentStage: '最終選考',
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-22T11:20:00Z'
  },
  {
    id: generateId(),
    source: 'マイナビ',
    name: '高橋 美咲',
    nameKana: 'タカハシ ミサキ',
    gender: '女性',
    schoolName: '明治大学',
    faculty: '文学部',
    department: '心理社会学科',
    graduationYear: 2025,
    address: '東京都世田谷区',
    phone: '090-4567-8901',
    email: 'takahashi@example.com',
    currentStage: 'エントリー',
    createdAt: '2024-01-20T13:45:00Z',
    updatedAt: '2024-01-20T13:45:00Z'
  },
  {
    id: generateId(),
    source: '学情',
    name: '山田 健一',
    nameKana: 'ヤマダ ケンイチ',
    gender: '男性',
    schoolName: '日本大学',
    faculty: '経済学部',
    department: '経済学科',
    graduationYear: 2025,
    address: '埼玉県さいたま市',
    phone: '090-5678-9012',
    email: 'yamada@example.com',
    currentStage: '内定',
    createdAt: '2024-01-05T07:20:00Z',
    updatedAt: '2024-01-25T15:10:00Z'
  }
];

export const mockSelectionHistory: SelectionHistory[] = [
  // 田中太郎の選考履歴
  {
    id: generateId(),
    applicantId: mockApplicants[0].id,
    stage: 'エントリー',
    startDate: '2024-01-15T09:00:00Z',
    endDate: '2024-01-16T17:00:00Z',
    status: '完了',
    notes: 'エントリーシート確認完了',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-16T17:00:00Z'
  },
  {
    id: generateId(),
    applicantId: mockApplicants[0].id,
    stage: '会社説明会',
    startDate: '2024-01-17T14:00:00Z',
    endDate: '2024-01-17T16:00:00Z',
    status: '完了',
    notes: '参加確認済み',
    createdAt: '2024-01-17T14:00:00Z',
    updatedAt: '2024-01-17T16:00:00Z'
  },
  {
    id: generateId(),
    applicantId: mockApplicants[0].id,
    stage: '人事面接',
    startDate: '2024-01-20T14:30:00Z',
    status: '進行中',
    notes: '面接官：田中部長',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  // 佐藤花子の選考履歴
  {
    id: generateId(),
    applicantId: mockApplicants[1].id,
    stage: 'エントリー',
    startDate: '2024-01-16T10:15:00Z',
    endDate: '2024-01-16T18:00:00Z',
    status: '完了',
    notes: 'エントリーシート確認完了。商学部で経営学を専攻、優秀な成績',
    createdAt: '2024-01-16T10:15:00Z',
    updatedAt: '2024-01-16T18:00:00Z'
  },
  {
    id: generateId(),
    applicantId: mockApplicants[1].id,
    stage: '会社説明会',
    startDate: '2024-01-18T16:45:00Z',
    status: '進行中',
    notes: '2024年2月15日の説明会に参加予定。積極的な質問が期待される',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  }
];

export const mockEvaluations: Evaluation[] = [
  {
    id: generateId(),
    applicantId: mockApplicants[0].id,
    selectionHistoryId: mockSelectionHistory[1].id,
    evaluatorName: '人事部 田中',
    firstImpression: '清潔感があり、好感が持てる',
    communicationSkills: '質問に対して的確に答えている',
    logicalThinking: '論理的な思考力が高い',
    initiative: '積極的に質問し、意欲が感じられる',
    teamwork: 'チームワークを重視する姿勢が見える',
    motivation: '志望動機が明確で熱意が伝わる',
    technicalSkills: '技術的なスキルは期待以上',
    overallEvaluation: '総合的に高評価。次の段階に進めたい',
    createdAt: '2024-01-17T16:30:00Z',
    updatedAt: '2024-01-17T16:30:00Z'
  }
];

export const mockTasks: Task[] = [
  // エントリー段階のタスク
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[0].id,
    title: 'エントリーシート確認',
    description: '提出されたエントリーシートの内容を確認し、基本要件を満たしているかチェックする',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: '2024-01-16T17:00:00Z',
    completedAt: '2024-01-16T15:30:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-16T15:30:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[0].id,
    title: 'エントリー受付確認メール送信',
    description: '応募受付の確認メールを送信する',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: '2024-01-15T18:00:00Z',
    completedAt: '2024-01-15T17:30:00Z',
    emailTemplateId: 'entry-confirmation-template',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T17:30:00Z'
  },
  // 会社説明会段階のタスク
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[1].id,
    title: '説明会参加確認メール送信',
    description: '会社説明会への参加確認と詳細案内のメール送信',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: '2024-01-17T10:00:00Z',
    completedAt: '2024-01-16T16:30:00Z',
    emailTemplateId: 'company-info-session-template',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T16:30:00Z'
  },
  // 人事面接段階のタスク
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[2].id,
    title: '面接日程調整メール送信',
    description: '面接の日程調整メールを送信し、候補日を提示する',
    status: '進行中',
    priority: '高',
    assignee: '人事部 佐藤',
    dueDate: '2024-01-21T10:00:00Z',
    emailTemplateId: 'interview-schedule-template',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[2].id,
    title: '面接官アサイン',
    description: '面接官を決定し、スケジュール調整を行う',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: '2024-01-20T12:00:00Z',
    completedAt: '2024-01-19T16:00:00Z',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z'
  },
  // 佐藤花子の会社説明会段階タスク
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[4].id,
    title: '説明会参加確認メール送信',
    description: '会社説明会への参加確認と詳細案内のメール送信',
    status: '進行中',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: '2024-01-25T17:00:00Z',
    emailTemplateId: 'company-info-session-template',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-25T14:00:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[4].id,
    title: '説明会前日リマインダーメール送信',
    description: '参加者への前日確認メール送信',
    status: '未着手',
    priority: '高',
    assignee: '人事部 山田',
    dueDate: '2024-02-14T18:00:00Z',
    emailTemplateId: 'reminder-before-session-template',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[4].id,
    title: '説明会後フォローアップメール送信',
    description: '説明会参加後のお礼と次のステップの案内メール送信',
    status: '未着手',
    priority: '中',
    assignee: '人事部 佐藤',
    dueDate: '2024-02-16T10:00:00Z',
    emailTemplateId: 'followup-after-session-template',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  // 会社説明会段階のタスク
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[1].id,
    title: '参加者名簿作成',
    description: '説明会参加者の名簿を作成し、受付で使用する',
    type: 'document',
    status: '完了',
    priority: '中',
    assignee: '人事部 山田',
    dueDate: '2024-01-17T12:00:00Z',
    completedAt: '2024-01-17T11:30:00Z',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-17T11:30:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[1].id,
    title: '説明会参加案内メール送信',
    description: '会社説明会の詳細案内と参加確認のメールを送信する',
    type: 'email',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: '2024-01-17T10:00:00Z',
    completedAt: '2024-01-16T16:30:00Z',
    emailTemplateId: 'company-info-session-template',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T16:30:00Z'
  },
  // 人事面接段階のタスク
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[2].id,
    title: '面接官アサイン',
    description: '面接官を決定し、スケジュール調整を行う',
    type: 'interview',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: '2024-01-20T12:00:00Z',
    completedAt: '2024-01-19T16:00:00Z',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[2].id,
    title: '面接日程調整メール送信',
    description: '面接の日程調整メールを送信し、候補日を提示する',
    type: 'email',
    status: '進行中',
    priority: '高',
    assignee: '人事部 佐藤',
    dueDate: '2024-01-21T10:00:00Z',
    emailTemplateId: 'interview-schedule-template',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[2].id,
    title: '面接会場予約',
    description: '面接用の会議室を予約し、必要な設備を確認する',
    type: 'general',
    status: '未着手',
    priority: '中',
    assignee: '人事部 山田',
    dueDate: '2024-01-20T13:00:00Z',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z'
  },
  // 佐藤花子のエントリー段階タスク
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[3].id,
    title: 'エントリーシート確認',
    description: '佐藤花子さんのエントリーシートの内容確認と評価',
    type: 'document',
    status: '完了',
    priority: '高',
    assignee: '人事部 山田',
    dueDate: '2024-01-16T17:00:00Z',
    completedAt: '2024-01-16T16:30:00Z',
    createdAt: '2024-01-16T10:15:00Z',
    updatedAt: '2024-01-16T16:30:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[3].id,
    title: '基本要件チェック',
    description: '学歴、専攻、卒業予定年度の確認',
    type: 'general',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: '2024-01-16T17:00:00Z',
    completedAt: '2024-01-16T17:45:00Z',
    createdAt: '2024-01-16T10:15:00Z',
    updatedAt: '2024-01-16T17:45:00Z'
  },
  // 佐藤花子の会社説明会段階タスク
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[4].id,
    title: '参加者名簿作成',
    description: '2月15日説明会の参加者名簿に佐藤花子さんを追加',
    type: 'document',
    status: '完了',
    priority: '中',
    assignee: '人事部 佐藤',
    dueDate: '2024-01-19T12:00:00Z',
    completedAt: '2024-01-19T11:00:00Z',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-19T11:00:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[4].id,
    title: '説明会参加確認メール送信',
    description: '会社説明会への参加確認と詳細案内のメール送信',
    type: 'email',
    status: '進行中',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: '2024-01-25T17:00:00Z',
    emailTemplateId: 'company-info-session-template',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-25T14:00:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[4].id,
    title: '会場設営確認',
    description: '本社会議室Aの設営確認とプロジェクター動作確認',
    type: 'general',
    status: '未着手',
    priority: '中',
    assignee: '人事部 山田',
    dueDate: '2024-02-15T13:00:00Z',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[4].id,
    title: '説明会後フォローアップメール送信',
    description: '説明会参加後のお礼と次のステップの案内メール送信',
    type: 'email',
    status: '未着手',
    priority: '中',
    assignee: '人事部 佐藤',
    dueDate: '2024-02-16T10:00:00Z',
    emailTemplateId: 'followup-after-session-template',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: generateId(),
    selectionHistoryId: mockSelectionHistory[4].id,
    title: '参加確認連絡',
    description: '参加者への前日確認メール送信',
    type: 'email',
    status: '未着手',
    priority: '高',
    assignee: '人事部 山田',
    dueDate: '2024-02-14T18:00:00Z',
    emailTemplateId: 'reminder-before-session-template',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  }
];