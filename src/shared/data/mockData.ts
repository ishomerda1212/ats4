import { Applicant, SelectionHistory, Evaluation } from '@/features/applicants/types/applicant';
import { Task } from '@/features/applicants/types/applicant';

export const mockApplicants: Applicant[] = [
  {
    id: 'applicant-1',
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
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-20T14:30:00Z')
  },
  {
    id: 'applicant-2',
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
    createdAt: new Date('2024-01-16T10:15:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z')
  },
  {
    id: 'applicant-3',
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
    createdAt: new Date('2024-01-10T08:30:00Z'),
    updatedAt: new Date('2024-01-22T11:20:00Z')
  },
  {
    id: 'applicant-4',
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
    createdAt: new Date('2024-01-20T13:45:00Z'),
    updatedAt: new Date('2024-01-20T13:45:00Z')
  },
  {
    id: 'applicant-5',
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
    createdAt: new Date('2024-01-05T07:20:00Z'),
    updatedAt: new Date('2024-01-25T15:10:00Z')
  },
  // 全ての選考段階を持つサンプル応募者
  {
    id: 'applicant-6',
    source: 'マイナビ',
    name: '伊藤 優子',
    nameKana: 'イトウ ユウコ',
    gender: '女性',
    schoolName: '一橋大学',
    faculty: '商学部',
    department: '経営学科',
    graduationYear: 2025,
    address: '東京都千代田区',
    phone: '090-6789-0123',
    email: 'ito@example.com',
    currentStage: '内定',
    // 詳細情報
    motivation: '御社の経営理念に共感し、特に人材育成の取り組みに興味を持っています。学生時代にリーダーシップを発揮した経験を活かし、チームの成長に貢献したいと考えています。',
    jobSearchAxis: '人材育成・組織開発、経営戦略、社会貢献',
    otherCompanyStatus: '大手IT企業2社から内定、ベンチャー企業1社から最終選考中',
    futureVision: '5年後にはマネージャーとしてチームを率い、10年後には人材育成の専門家として組織全体の成長に貢献したい。',
    strengths: 'リーダーシップ、コミュニケーション能力、論理的思考、責任感、学習意欲',
    weaknesses: '完璧主義すぎる傾向、時々細かいことにこだわりすぎる',
    experience: '大学サークル（経営研究会）会長、アルバイト（塾講師2年）、ボランティア活動（地域の子供向け学習支援）、趣味（読書、旅行、料理）',
    createdAt: new Date('2024-01-01T08:00:00Z'),
    updatedAt: new Date('2024-01-30T16:00:00Z')
  }
];

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
    notes: 'エントリーシート確認完了。商学部で経営学を専攻、優秀な成績',
    createdAt: new Date('2024-01-16T10:15:00Z'),
    updatedAt: new Date('2024-01-16T18:00:00Z')
  },
  {
    id: 'history-5',
    applicantId: mockApplicants[1].id,
    stage: '会社説明会',
    startDate: new Date('2024-01-18T16:45:00Z'),
    status: '進行中',
    notes: '2024年2月15日の説明会に参加予定。積極的な質問が期待される',
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z')
  },
  // 伊藤優子の全選考段階履歴
  {
    id: 'history-6',
    applicantId: mockApplicants[5].id,
    stage: 'エントリー',
    startDate: new Date('2024-01-01T08:00:00Z'),
    endDate: new Date('2024-01-02T17:00:00Z'),
    status: '完了',
    notes: 'エントリーシート確認完了。経営学専攻で優秀な成績',
    createdAt: new Date('2024-01-01T08:00:00Z'),
    updatedAt: new Date('2024-01-02T17:00:00Z')
  },
  {
    id: 'history-6-5',
    applicantId: mockApplicants[5].id,
    stage: '書類選考',
    startDate: new Date('2024-01-03T09:00:00Z'),
    endDate: new Date('2024-01-04T17:00:00Z'),
    status: '完了',
    notes: '書類選考実施。経営学の知識と志望動機が評価された',
    createdAt: new Date('2024-01-03T09:00:00Z'),
    updatedAt: new Date('2024-01-04T17:00:00Z')
  },
  {
    id: 'history-7',
    applicantId: mockApplicants[5].id,
    stage: '会社説明会',
    startDate: new Date('2024-01-05T14:00:00Z'),
    endDate: new Date('2024-01-05T16:00:00Z'),
    status: '完了',
    notes: '参加確認済み。積極的な質問が印象的',
    createdAt: new Date('2024-01-05T14:00:00Z'),
    updatedAt: new Date('2024-01-05T16:00:00Z')
  },
  {
    id: 'history-8',
    applicantId: mockApplicants[5].id,
    stage: '適性検査',
    startDate: new Date('2024-01-08T10:00:00Z'),
    endDate: new Date('2024-01-08T12:00:00Z'),
    status: '完了',
    notes: 'Web適性検査実施。結果：優秀',
    createdAt: new Date('2024-01-08T10:00:00Z'),
    updatedAt: new Date('2024-01-08T12:00:00Z')
  },
  {
    id: 'history-9',
    applicantId: mockApplicants[5].id,
    stage: '職場見学',
    startDate: new Date('2024-01-12T13:00:00Z'),
    endDate: new Date('2024-01-12T15:00:00Z'),
    status: '完了',
    notes: '本社オフィス見学実施。社員との交流も良好',
    createdAt: new Date('2024-01-12T13:00:00Z'),
    updatedAt: new Date('2024-01-12T15:00:00Z')
  },
  {
    id: 'history-9-5',
    applicantId: mockApplicants[5].id,
    stage: '仕事体験',
    startDate: new Date('2024-01-14T09:00:00Z'),
    endDate: new Date('2024-01-14T17:00:00Z'),
    status: '完了',
    notes: '実際の業務を体験。積極的な姿勢が評価された',
    createdAt: new Date('2024-01-14T09:00:00Z'),
    updatedAt: new Date('2024-01-14T17:00:00Z')
  },
  {
    id: 'history-9-6',
    applicantId: mockApplicants[5].id,
    stage: '個別面接',
    startDate: new Date('2024-01-16T14:00:00Z'),
    endDate: new Date('2024-01-16T15:30:00Z'),
    status: '完了',
    notes: '個別面接実施。志望動機とキャリアプランについて詳細に話し合った',
    createdAt: new Date('2024-01-16T14:00:00Z'),
    updatedAt: new Date('2024-01-16T15:30:00Z')
  },
  {
    id: 'history-9-7',
    applicantId: mockApplicants[5].id,
    stage: '集団面接',
    startDate: new Date('2024-01-17T10:00:00Z'),
    endDate: new Date('2024-01-17T12:00:00Z'),
    status: '完了',
    notes: '集団面接実施。リーダーシップと協調性を評価',
    createdAt: new Date('2024-01-17T10:00:00Z'),
    updatedAt: new Date('2024-01-17T12:00:00Z')
  },
  {
    id: 'history-10',
    applicantId: mockApplicants[5].id,
    stage: 'CEOセミナー',
    startDate: new Date('2024-01-15T18:00:00Z'),
    endDate: new Date('2024-01-15T20:00:00Z'),
    status: '完了',
    notes: 'CEOセミナー参加。経営理念への理解が深い',
    createdAt: new Date('2024-01-15T18:00:00Z'),
    updatedAt: new Date('2024-01-15T20:00:00Z')
  },
  {
    id: 'history-11',
    applicantId: mockApplicants[5].id,
    stage: '人事面接',
    startDate: new Date('2024-01-18T14:00:00Z'),
    endDate: new Date('2024-01-18T15:30:00Z'),
    status: '完了',
    notes: '人事面接実施。企業文化への適合性を確認',
    createdAt: new Date('2024-01-18T14:00:00Z'),
    updatedAt: new Date('2024-01-18T15:30:00Z')
  },
  {
    id: 'history-12',
    applicantId: mockApplicants[5].id,
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
    applicantId: mockApplicants[5].id,
    stage: '内定',
    startDate: new Date('2024-01-30T10:00:00Z'),
    status: '完了',
    notes: '内定通知完了。入社予定日：2025年4月1日',
    createdAt: new Date('2024-01-30T10:00:00Z'),
    updatedAt: new Date('2024-01-30T16:00:00Z')
  }
];

export const mockEvaluations: Evaluation[] = [
  {
    id: 'evaluation-1',
    applicantId: mockApplicants[0].id,
    selectionHistoryId: mockSelectionHistory[1].id,
    evaluatorName: '人事部 田中',
    motivationReason: '志望動機が明確で、当社の経営理念への理解が深い。業界選択の理由も具体的で説得力がある。',
    experienceBackground: '学生時代のリーダーシップ経験が豊富で、具体的な成果を挙げている。困難な状況での対応も適切。',
    selfUnderstanding: '自分の強みと弱みを客観的に把握しており、改善への姿勢も見られる。',
    problemSolving: '失敗経験を適切に分析し、改善策を考えている。課題解決への主体性が高い。',
    futureVision: 'キャリアビジョンが明確で、当社での成長可能性が高い。',
    reverseQuestion: '事前に十分な準備をしており、会社への興味が深い。',
    createdAt: new Date('2024-01-17T16:30:00Z'),
    updatedAt: new Date('2024-01-17T16:30:00Z')
  },
  // 伊藤優子のCEOセミナー評価
  {
    id: 'evaluation-2',
    applicantId: mockApplicants[5].id,
    selectionHistoryId: 'history-10', // CEOセミナーの履歴ID
    evaluatorName: '人事部 佐藤',
    motivationReason: '経営理念への理解が深く、当社を選んだ理由が明確。業界・職種選択の理由も一貫している。',
    experienceBackground: '経営研究会での活動経験が豊富で、リーダーシップを発揮している。具体的な成果も挙げている。',
    selfUnderstanding: '自分の特徴を客観的に把握しており、強みを活かす姿勢が見られる。',
    problemSolving: '困難な状況での対応力が高く、改善への意識も強い。',
    futureVision: '将来像が明確で、当社でのキャリアパスと一致している。',
    reverseQuestion: '準備度が高く、会社への興味が深い。自分の意思で判断する姿勢が見られる。',
    createdAt: new Date('2024-01-15T20:30:00Z'),
    updatedAt: new Date('2024-01-15T20:30:00Z')
  }
];

// 選考段階の詳細データ（各段階の表示コンポーネントで使用）
export const mockStageDetails = {
  // 伊藤優子のCEOセミナー詳細データ
  'history-10': {
    sessionDate: new Date('2024-01-15T18:00:00Z'),
    sessionName: 'CEOセミナー 第1回',
    eventName: '2025年度新卒採用 CEOセミナー',
    reservationStatus: '予約済み',
    attendanceStatus: '参加',
    impression: '経営理念への理解が深く、真剣に参加している。セミナー後の質疑応答での確な質問をしており、会社の未来について深く考えていることが伝わった。',
    notes: '経営学専攻の知識を活かした視点が評価できる。他の参加者との交流も良好。',
    tasks: {
      detailedContact: { completed: true, completedAt: new Date('2024-01-10T14:30:00Z') },
      reminder: { completed: true, completedAt: new Date('2024-01-14T16:00:00Z') }
    }
  },
  // 伊藤優子のエントリー詳細データ
  'history-6': {
    approaches: {
      approach1: { completed: true, completedAt: new Date('2024-01-01T10:00:00Z') },
      approach2: { completed: true, completedAt: new Date('2024-01-02T14:30:00Z') },
      approach3: { completed: false },
      approach4: { completed: false },
      approach5: { completed: false }
    }
  },
  // 伊藤優子の書類選考詳細データ
  'history-6-5': {
    result: '合格',
    resultDate: new Date('2024-01-04T17:00:00Z'),
    evaluator: '人事部 田中',
    evaluationNotes: '経営学の知識が豊富で、志望動機も明確。エントリーシートの内容も充実しており、次の段階に進めることを推奨。',
    notes: '経営学の知識と志望動機が評価された。',
    tasks: {
      detailedContact: { completed: true, completedAt: new Date('2024-01-02T16:30:00Z') },
      resultNotification: { completed: true, completedAt: new Date('2024-01-04T18:00:00Z') }
    }
  },
  // 伊藤優子の適性検査詳細データ
  'history-8': {
    sessionDate: new Date('2024-01-08T10:00:00Z'),
    sessionName: '適性検査 第1回',
    eventName: '2025年度新卒採用 適性検査',
    testType: 'Web適性検査',
    score: 85,
    result: '優秀',
    notes: '論理的思考力と問題解決能力が高い。特に数理系の問題で優秀な成績。',
    tasks: {
      detailedContact: { completed: true, completedAt: new Date('2024-01-05T14:30:00Z') }
    }
  },
  // 伊藤優子の人事面接詳細データ
  'history-11': {
    interviewer: '佐藤部長',
    duration: '90分',
    impression: '志望動機が明確で、会社への理解が深い。経営学の知識を活かした視点が評価できる。',
    strengths: '論理的思考力、コミュニケーション能力、リーダーシップ',
    weaknesses: '技術的な経験がやや不足',
    overallRating: 'A',
    notes: '次の段階に進めることを推奨。グループ面接でのリーダーシップ発揮を期待。'
  },
  // 伊藤優子の最終選考詳細データ
  'history-12': {
    candidateDates: [
      new Date('2024-01-25T10:00:00Z'),
      new Date('2024-01-26T10:00:00Z'),
      new Date('2024-01-27T10:00:00Z')
    ],
    result: '合格',
    resultDate: new Date('2024-01-28T17:00:00Z'),
    evaluator: '田中社長、人事部 佐藤部長',
    comments: '最終選考で総合的な評価を実施。志望動機、キャリアプラン、企業文化への適合性すべてにおいて高評価。リーダーシップとコミュニケーション能力も優秀。',
    notes: '最終選考実施。最終的な採用判断',
    tasks: {
      detailedContact: { completed: true, completedAt: new Date('2024-01-24T16:30:00Z') },
      documentCollection: { completed: true, completedAt: new Date('2024-01-26T14:00:00Z') },
      resultNotification: { completed: true, completedAt: new Date('2024-01-28T18:00:00Z') }
    }
  },
  // 伊藤優子の職場見学詳細データ
  'history-9': {
    sessionDate: new Date('2024-01-12T13:00:00Z'),
    sessionName: '職場見学 第1回',
    eventName: '2025年度新卒採用 職場見学',
    location: '本社オフィス（東京都渋谷区）',
    attendanceStatus: '参加',
    impression: '本社オフィス見学実施。社員との交流も良好で、職場の雰囲気を理解できた。',
    notes: '社員との交流も良好。職場の雰囲気を理解できた。',
    tasks: {
      detailedContact: { completed: true, completedAt: new Date('2024-01-10T16:30:00Z') }
    }
  },
  // 伊藤優子の仕事体験詳細データ
  'history-9-5': {
    sessionDate: new Date('2024-01-14T09:00:00Z'),
    sessionName: '仕事体験 第1回',
    eventName: '2025年度新卒採用 仕事体験',
    location: '本社オフィス（東京都渋谷区）',
    attendanceStatus: '参加',
    impression: '実際の業務を体験。積極的な姿勢で取り組み、チームワークも良好。実務経験を通じて会社への理解が深まった。',
    notes: '積極的な姿勢が評価された。実務経験を通じて会社への理解が深まった。',
    tasks: {
      detailedContact: { completed: true, completedAt: new Date('2024-01-12T14:30:00Z') }
    }
  },
  // 伊藤優子の会社説明会詳細データ
  'history-7': {
    sessionDate: new Date('2024-01-05T14:00:00Z'),
    sessionName: '会社説明会 第1回',
    eventName: '2025年度新卒採用 会社説明会',
    location: '本社オフィス（東京都渋谷区）',
    attendanceStatus: '参加',
    impression: '会社説明会に参加。企業理念や事業内容について理解を深めた。',
    notes: '企業理念や事業内容について理解を深めた。',
    tasks: {
      detailedContact: { completed: true, completedAt: new Date('2024-01-03T16:30:00Z') }
    }
  },
  // 田中太郎の会社説明会詳細データ
  'history-2': {
    sessionDate: new Date('2024-01-17T14:00:00Z'),
    sessionName: '会社説明会 第2回',
    eventName: '2025年度新卒採用 会社説明会',
    location: '本社オフィス（東京都渋谷区）',
    attendanceStatus: '参加',
    impression: '会社説明会に参加。技術的な質問が多く、関心の高さが伺える。',
    notes: '技術的な質問が多く、関心の高さが伺える。',
    tasks: {
      detailedContact: { completed: true, completedAt: new Date('2024-01-15T16:30:00Z') }
    }
  },
  // 伊藤優子の個別面接詳細データ
  'history-9-6': {
    interviewDate: new Date('2024-01-16T14:00:00Z'),
    interviewTime: '14:00-15:30',
    location: '本社オフィス（東京都渋谷区）',
    attendanceStatus: '参加',
    interviewer: '田中部長',
    impression: '志望動機とキャリアプランについて詳細に話し合った。将来のビジョンが明確で、会社への理解も深い。',
    notes: '志望動機とキャリアプランについて詳細に話し合った。将来のビジョンが明確。',
    tasks: {
      detailedContact: { completed: true, completedAt: new Date('2024-01-14T16:30:00Z') }
    }
  },
  // 伊藤優子の集団面接詳細データ
  'history-9-7': {
    sessionDate: new Date('2024-01-17T10:00:00Z'),
    sessionName: '集団面接 第1回',
    eventName: '2025年度新卒採用 集団面接',
    location: '本社オフィス（東京都渋谷区）',
    candidateDates: [
      new Date('2024-01-17T10:00:00Z'),
      new Date('2024-01-18T10:00:00Z'),
      new Date('2024-01-19T10:00:00Z')
    ],
    attendanceStatus: '参加',
    result: '合格',
    resultDate: new Date('2024-01-20T17:00:00Z'),
    groupSize: 5,
    evaluator: '人事部 佐藤、営業部 田中',
    impression: '集団面接でリーダーシップを発揮。他の参加者の意見も引き出し、チームワークを重視する姿勢が評価された。',
    notes: '集団面接実施。リーダーシップと協調性を評価。',
    tasks: {
      detailedContact: { completed: true, completedAt: new Date('2024-01-15T16:30:00Z') },
      resultNotification: { completed: true, completedAt: new Date('2024-01-20T18:00:00Z') }
    }
  }
};

export const mockTasks: Task[] = [
  // エントリー段階のタスク
  {
    id: 'task-1',
    selectionHistoryId: 'history-1',
    title: 'エントリーシート確認',
    description: '提出されたエントリーシートの内容を確認し、基本要件を満たしているかチェックする',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: new Date('2024-01-16T17:00:00Z'),
    completedAt: new Date('2024-01-16T15:30:00Z'),
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-16T15:30:00Z')
  },
  {
    id: 'task-2',
    selectionHistoryId: 'history-1',
    title: 'エントリー受付確認メール送信',
    description: '応募受付の確認メールを送信する',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: new Date('2024-01-15T18:00:00Z'),
    completedAt: new Date('2024-01-15T17:30:00Z'),
    emailTemplateId: 'entry-confirmation-template',
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T17:30:00Z')
  },
  // 会社説明会段階のタスク
  {
    id: 'task-3',
    selectionHistoryId: 'history-2',
    title: '説明会参加確認メール送信',
    description: '会社説明会への参加確認と詳細案内のメール送信',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: new Date('2024-01-17T10:00:00Z'),
    completedAt: new Date('2024-01-16T16:30:00Z'),
    emailTemplateId: 'company-info-session-template',
    createdAt: new Date('2024-01-16T10:00:00Z'),
    updatedAt: new Date('2024-01-16T16:30:00Z')
  },
  // 人事面接段階のタスク
  {
    id: 'task-4',
    selectionHistoryId: 'history-3',
    title: '面接日程調整メール送信',
    description: '面接の日程調整メールを送信し、候補日を提示する',
    status: '進行中',
    priority: '高',
    assignee: '人事部 佐藤',
    dueDate: new Date('2024-01-21T10:00:00Z'),
    emailTemplateId: 'interview-schedule-template',
    createdAt: new Date('2024-01-18T09:00:00Z'),
    updatedAt: new Date('2024-01-20T10:00:00Z')
  },
  {
    id: 'task-5',
    selectionHistoryId: 'history-3',
    title: '面接官アサイン',
    description: '面接官を決定し、スケジュール調整を行う',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: new Date('2024-01-20T12:00:00Z'),
    completedAt: new Date('2024-01-19T16:00:00Z'),
    createdAt: new Date('2024-01-18T09:00:00Z'),
    updatedAt: new Date('2024-01-19T16:00:00Z')
  },
  // 佐藤花子の会社説明会段階タスク
  {
    id: 'task-6',
    selectionHistoryId: 'history-5',
    title: '説明会参加確認メール送信',
    description: '会社説明会への参加確認と詳細案内のメール送信',
    status: '進行中',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: new Date('2024-01-25T17:00:00Z'),
    emailTemplateId: 'company-info-session-template',
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-25T14:00:00Z')
  },
  {
    id: 'task-7',
    selectionHistoryId: 'history-5',
    title: '説明会前日リマインダーメール送信',
    description: '参加者への前日確認メール送信',
    status: '未着手',
    priority: '高',
    assignee: '人事部 山田',
    dueDate: new Date('2024-02-14T18:00:00Z'),
    emailTemplateId: 'reminder-before-session-template',
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z')
  },
  {
    id: 'task-8',
    selectionHistoryId: 'history-5',
    title: '説明会後フォローアップメール送信',
    description: '説明会参加後のお礼と次のステップの案内メール送信',
    status: '未着手',
    priority: '中',
    assignee: '人事部 佐藤',
    dueDate: new Date('2024-02-16T10:00:00Z'),
    emailTemplateId: 'followup-after-session-template',
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z')
  },
  // 会社説明会段階のタスク
  {
    id: 'task-9',
    selectionHistoryId: 'history-2',
    title: '参加者名簿作成',
    description: '説明会参加者の名簿を作成し、受付で使用する',
    type: 'document',
    status: '完了',
    priority: '中',
    assignee: '人事部 山田',
    dueDate: new Date('2024-01-17T12:00:00Z'),
    completedAt: new Date('2024-01-17T11:30:00Z'),
    createdAt: new Date('2024-01-16T10:00:00Z'),
    updatedAt: new Date('2024-01-17T11:30:00Z')
  },
  {
    id: 'task-10',
    selectionHistoryId: 'history-2',
    title: '説明会参加案内メール送信',
    description: '会社説明会の詳細案内と参加確認のメールを送信する',
    type: 'email',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: new Date('2024-01-17T10:00:00Z'),
    completedAt: new Date('2024-01-16T16:30:00Z'),
    emailTemplateId: 'company-info-session-template',
    createdAt: new Date('2024-01-16T10:00:00Z'),
    updatedAt: new Date('2024-01-16T16:30:00Z')
  },
  // 人事面接段階のタスク
  {
    id: 'task-11',
    selectionHistoryId: 'history-3',
    title: '面接官アサイン',
    description: '面接官を決定し、スケジュール調整を行う',
    type: 'interview',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: new Date('2024-01-20T12:00:00Z'),
    completedAt: new Date('2024-01-19T16:00:00Z'),
    createdAt: new Date('2024-01-18T09:00:00Z'),
    updatedAt: new Date('2024-01-19T16:00:00Z')
  },
  {
    id: 'task-12',
    selectionHistoryId: 'history-3',
    title: '面接日程調整メール送信',
    description: '面接の日程調整メールを送信し、候補日を提示する',
    type: 'email',
    status: '進行中',
    priority: '高',
    assignee: '人事部 佐藤',
    dueDate: new Date('2024-01-21T10:00:00Z'),
    emailTemplateId: 'interview-schedule-template',
    createdAt: new Date('2024-01-18T09:00:00Z'),
    updatedAt: new Date('2024-01-20T10:00:00Z')
  },
  {
    id: 'task-13',
    selectionHistoryId: 'history-3',
    title: '面接会場予約',
    description: '面接用の会議室を予約し、必要な設備を確認する',
    type: 'general',
    status: '未着手',
    priority: '中',
    assignee: '人事部 山田',
    dueDate: new Date('2024-01-20T13:00:00Z'),
    createdAt: new Date('2024-01-18T09:00:00Z'),
    updatedAt: new Date('2024-01-18T09:00:00Z')
  },
  // 佐藤花子のエントリー段階タスク
  {
    id: 'task-14',
    selectionHistoryId: 'history-4',
    title: 'エントリーシート確認',
    description: '佐藤花子さんのエントリーシートの内容確認と評価',
    type: 'document',
    status: '完了',
    priority: '高',
    assignee: '人事部 山田',
    dueDate: new Date('2024-01-16T17:00:00Z'),
    completedAt: new Date('2024-01-16T16:30:00Z'),
    createdAt: new Date('2024-01-16T10:15:00Z'),
    updatedAt: new Date('2024-01-16T16:30:00Z')
  },
  {
    id: 'task-15',
    selectionHistoryId: 'history-4',
    title: '基本要件チェック',
    description: '学歴、専攻、卒業予定年度の確認',
    type: 'general',
    status: '完了',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: new Date('2024-01-16T17:00:00Z'),
    completedAt: new Date('2024-01-16T17:45:00Z'),
    createdAt: new Date('2024-01-16T10:15:00Z'),
    updatedAt: new Date('2024-01-16T17:45:00Z')
  },
  // 佐藤花子の会社説明会段階タスク
  {
    id: 'task-16',
    selectionHistoryId: 'history-5',
    title: '参加者名簿作成',
    description: '2月15日説明会の参加者名簿に佐藤花子さんを追加',
    type: 'document',
    status: '完了',
    priority: '中',
    assignee: '人事部 佐藤',
    dueDate: new Date('2024-01-19T12:00:00Z'),
    completedAt: new Date('2024-01-19T11:00:00Z'),
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-19T11:00:00Z')
  },
  {
    id: 'task-17',
    selectionHistoryId: 'history-5',
    title: '説明会参加確認メール送信',
    description: '会社説明会への参加確認と詳細案内のメール送信',
    type: 'email',
    status: '進行中',
    priority: '高',
    assignee: '人事部 田中',
    dueDate: new Date('2024-01-25T17:00:00Z'),
    emailTemplateId: 'company-info-session-template',
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-25T14:00:00Z')
  },
  {
    id: 'task-18',
    selectionHistoryId: 'history-5',
    title: '会場設営確認',
    description: '本社会議室Aの設営確認とプロジェクター動作確認',
    type: 'general',
    status: '未着手',
    priority: '中',
    assignee: '人事部 山田',
    dueDate: new Date('2024-02-15T13:00:00Z'),
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z')
  },
  {
    id: 'task-19',
    selectionHistoryId: 'history-5',
    title: '説明会後フォローアップメール送信',
    description: '説明会参加後のお礼と次のステップの案内メール送信',
    type: 'email',
    status: '未着手',
    priority: '中',
    assignee: '人事部 佐藤',
    dueDate: new Date('2024-02-16T10:00:00Z'),
    emailTemplateId: 'followup-after-session-template',
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z')
  },
  {
    id: 'task-20',
    selectionHistoryId: 'history-5',
    title: '参加確認連絡',
    description: '参加者への前日確認メール送信',
    type: 'email',
    status: '未着手',
    priority: '高',
    assignee: '人事部 山田',
    dueDate: new Date('2024-02-14T18:00:00Z'),
    emailTemplateId: 'reminder-before-session-template',
    createdAt: new Date('2024-01-18T16:45:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z')
  }
];