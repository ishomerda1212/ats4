import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';
import { Task } from '@/features/applicants/types/applicant';
import { EvaluationForm } from '@/features/applicants/types/applicant';

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
    currentStage: '内定面談',
    // 詳細情報
    motivation: '御社のグローバル展開とイノベーションに興味を持っています。学生時代に国際交流プログラムに参加した経験を活かし、海外市場での事業展開に貢献したいと考えています。',
    jobSearchAxis: 'グローバル事業、マーケティング、新規事業開発',
    otherCompanyStatus: '外資系企業1社から内定、日系大手企業2社から最終選考中',
    futureVision: '3年後には海外拠点での勤務を希望し、5年後にはグローバルマーケティングの専門家として活躍したい。',
    strengths: '語学力（英語・中国語）、国際感覚、コミュニケーション能力、分析力、行動力',
    weaknesses: '時々完璧を求めすぎる、細かい計画を立てすぎる傾向',
    experience: '国際交流プログラム参加（中国・アメリカ）、インターンシップ（外資系企業）、ボランティア（国際協力NGO）、趣味（語学学習、旅行、料理）',
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
    currentStage: '内定面談',
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
    currentStage: '内定面談',
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
    notes: 'Web適性検査実施。結果：優秀。論理的思考力と分析力が高い',
    createdAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-01-20T12:00:00Z')
  },
  {
    id: 'history-5-3',
    applicantId: mockApplicants[1].id,
    stage: '職場見学',
    startDate: new Date('2024-01-22T13:00:00Z'),
    endDate: new Date('2024-01-22T15:00:00Z'),
    status: '完了',
    notes: '本社オフィス見学実施。社員との交流も良好。グローバルチームへの関心が高い',
    createdAt: new Date('2024-01-22T13:00:00Z'),
    updatedAt: new Date('2024-01-22T15:00:00Z')
  },
  {
    id: 'history-5-4',
    applicantId: mockApplicants[1].id,
    stage: '仕事体験',
    startDate: new Date('2024-01-24T09:00:00Z'),
    endDate: new Date('2024-01-24T17:00:00Z'),
    status: '完了',
    notes: '実際の業務を体験。マーケティング部門での実習。積極的な姿勢と語学力を活かした活躍',
    createdAt: new Date('2024-01-24T09:00:00Z'),
    updatedAt: new Date('2024-01-24T17:00:00Z')
  },
  {
    id: 'history-5-5',
    applicantId: mockApplicants[1].id,
    stage: '人事面接',
    startDate: new Date('2024-01-26T14:00:00Z'),
    endDate: new Date('2024-01-26T15:30:00Z'),
    status: '完了',
    notes: '人事面接実施。志望動機とキャリアプランについて詳細に話し合った。海外勤務への意欲が高い',
    createdAt: new Date('2024-01-26T14:00:00Z'),
    updatedAt: new Date('2024-01-26T15:30:00Z')
  },
  {
    id: 'history-5-6',
    applicantId: mockApplicants[1].id,
    stage: '集団面接',
    startDate: new Date('2024-01-28T10:00:00Z'),
    endDate: new Date('2024-01-28T12:00:00Z'),
    status: '完了',
    notes: '集団面接実施。リーダーシップと協調性を評価。国際的な視点での発言が印象的',
    createdAt: new Date('2024-01-28T10:00:00Z'),
    updatedAt: new Date('2024-01-28T12:00:00Z')
  },
  {
    id: 'history-5-7',
    applicantId: mockApplicants[1].id,
    stage: 'CEOセミナー',
    startDate: new Date('2024-01-30T18:00:00Z'),
    endDate: new Date('2024-01-30T20:00:00Z'),
    status: '完了',
    notes: 'CEOセミナー参加。経営理念への理解が深い。グローバル戦略について鋭い質問',
    createdAt: new Date('2024-01-30T18:00:00Z'),
    updatedAt: new Date('2024-01-30T20:00:00Z')
  },
  {
    id: 'history-5-8',
    applicantId: mockApplicants[1].id,
    stage: '人事面接',
    startDate: new Date('2024-02-01T14:00:00Z'),
    endDate: new Date('2024-02-01T15:30:00Z'),
    status: '完了',
    notes: '人事面接実施。企業文化への適合性を確認。海外勤務への適性も評価',
    createdAt: new Date('2024-02-01T14:00:00Z'),
    updatedAt: new Date('2024-02-01T15:30:00Z')
  },
  {
    id: 'history-5-9',
    applicantId: mockApplicants[1].id,
    stage: '最終選考',
    startDate: new Date('2024-02-05T10:00:00Z'),
    endDate: new Date('2024-02-05T11:30:00Z'),
    status: '完了',
    notes: '最終選考実施。最終的な採用判断。グローバル事業での活躍が期待される',
    createdAt: new Date('2024-02-05T10:00:00Z'),
    updatedAt: new Date('2024-02-05T11:30:00Z')
  },
  {
    id: 'history-5-10',
    applicantId: mockApplicants[1].id,
    stage: '内定面談',
    startDate: new Date('2024-02-10T10:00:00Z'),
    status: '進行中',
    notes: '内定面談完了。入社予定日：2025年4月1日。グローバルマーケティング部門配属予定',
    createdAt: new Date('2024-02-10T10:00:00Z'),
    updatedAt: new Date('2024-02-10T10:00:00Z')
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
    stage: '人事面接',
    startDate: new Date('2024-01-16T14:00:00Z'),
    endDate: new Date('2024-01-16T15:30:00Z'),
    status: '完了',
    notes: '人事面接実施。志望動機とキャリアプランについて詳細に話し合った',
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
    stage: '内定面談',
    startDate: new Date('2024-01-30T10:00:00Z'),
    status: '完了',
    notes: '内定面談完了。入社予定日：2025年4月1日',
    createdAt: new Date('2024-01-30T10:00:00Z'),
    updatedAt: new Date('2024-01-30T16:00:00Z')
  }
];

// 評定表のモックデータ
export const mockEvaluationForms: EvaluationForm[] = [
  {
    id: 'eval-1',
    applicantId: 'applicant-2', // 佐藤花子
    title: '人事面接評定表',
    stage: '人事面接',
    evaluator: '田中部長',
    overallRating: 'A',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    sections: {
      motivation: {
        companyMotivation: '貴社のグローバル展開に興味を持ち、特にアジア市場での事業拡大に携わりたいと考えています。学生時代の国際交流プログラムで得た経験を活かしたいです。',
        industryMotivation: 'IT業界の急速な発展と、それに伴う社会への影響力に魅力を感じています。特に、グローバルな視点でのサービス展開に興味があります。',
        jobMotivation: 'マーケティング職を志望する理由は、顧客のニーズを理解し、価値のあるサービスを提供することにやりがいを感じるからです。',
        criteria: ['動機が具体的で一貫しているか', '会社や業界の理解度', '他社ではなく自社を選ぶ理由の説得力']
      },
      experience: {
        pastExperience: '大学では国際交流プログラムに参加し、海外の学生との交流を通じて異文化理解力を身につけました。また、マーケティングのゼミで市場分析の基礎を学びました。',
        focusedActivity: '国際交流プログラムでは、日本文化を紹介するイベントの企画・運営に力を入れました。参加者100名規模のイベントを成功させ、異文化間のコミュニケーションの重要性を学びました。',
        learnedFromActivities: 'アルバイトでは、カフェでの接客を通じて顧客のニーズを理解することの大切さを学びました。また、チームワークの重要性も実感しました。',
        criteria: ['成果や役割の具体性', '困難に対する行動プロセス', '自社の業務に活かせるスキルや姿勢']
      },
      selfUnderstanding: {
        strengthsWeaknesses: '強みは語学力（英語・中国語）と異文化理解力です。弱みは完璧主義すぎることと、時々細かい計画を立てすぎることです。',
        othersOpinion: '周りからは「国際的な視点を持っている」「責任感が強い」「リーダーシップがある」と言われます。',
        criteria: ['自分の特徴を客観的に把握しているか', '弱みを改善する姿勢があるか', '強みが仕事で活かせるか']
      },
      problemSolving: {
        failureExperience: '国際交流イベントで、参加者の集客が思うようにいかなかった経験があります。SNSでの宣伝を強化し、既存の参加者に紹介を依頼することで解決しました。',
        difficultSituation: 'チーム内で意見が対立した際は、まず全員の意見を聞き、共通点を見つけることから始めました。結果として、より良いアイデアが生まれました。',
        criteria: ['課題を分析する力', '解決への主体性', '再発防止や改善への意識']
      },
      futureVision: {
        careerVision: '将来的には、グローバルマーケティングのスペシャリストとして、海外市場での事業展開に携わりたいと考えています。',
        futurePosition: '3年後には、海外拠点でのマーケティング業務に携わり、5年後には、グローバルマーケティング戦略の立案に参加できる立場になりたいです。',
        criteria: ['目標の明確さと現実性', '自社でのキャリアパスとの一致度']
      },
      reverseQuestion: {
        questions: 'グローバル展開における現地の文化や習慣への配慮について、どのような取り組みをされていますか？また、海外拠点でのキャリアパスについて教えてください。',
        criteria: ['準備度（事前に調べているか）', '会社や職務への興味の深さ', '自分の意思で判断する姿勢']
      }
    }
  },
  {
    id: 'eval-2',
    applicantId: 'applicant-6', // 伊藤優子
    title: '最終選考評定表',
    stage: '最終選考',
    evaluator: '山田部長',
    overallRating: 'B',
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z',
    sections: {
      motivation: {
        companyMotivation: '貴社の経営理念と、社会貢献への取り組みに共感しています。特に、持続可能な成長を目指す姿勢が印象的です。',
        industryMotivation: '製造業の技術革新と、それによる社会への貢献に魅力を感じています。ものづくりの大切さを理解しています。',
        jobMotivation: '営業職を志望する理由は、顧客との直接的な関わりを通じて、社会に価値を提供することにやりがいを感じるからです。',
        criteria: ['動機が具体的で一貫しているか', '会社や業界の理解度', '他社ではなく自社を選ぶ理由の説得力']
      },
      experience: {
        pastExperience: '大学では経営学を専攻し、マーケティングや組織論を学びました。また、サークル活動では副会長を務め、組織運営の経験を積みました。',
        focusedActivity: 'サークル活動では、新入生の勧誘活動に力を入れました。従来の方法を見直し、SNSを活用した新しいアプローチを導入し、入会者数を前年比150%に増加させました。',
        learnedFromActivities: 'アルバイトでは、小売店での接客を通じて、顧客のニーズを理解し、適切な提案をすることの大切さを学びました。',
        criteria: ['成果や役割の具体性', '困難に対する行動プロセス', '自社の業務に活かせるスキルや姿勢']
      },
      selfUnderstanding: {
        strengthsWeaknesses: '強みはリーダーシップとコミュニケーション能力です。弱みは技術的な知識が不足していることと、時々感情的に判断してしまうことです。',
        othersOpinion: '周りからは「リーダーシップがある」「責任感が強い」「面倒見が良い」と言われます。',
        criteria: ['自分の特徴を客観的に把握しているか', '弱みを改善する姿勢があるか', '強みが仕事で活かせるか']
      },
      problemSolving: {
        failureExperience: 'サークル活動で、イベントの企画が失敗した経験があります。原因を分析し、次回は事前の準備を徹底し、成功させることができました。',
        difficultSituation: 'チーム内で意見が対立した際は、全員の意見を聞き、共通の目標を見つけることで解決しました。',
        criteria: ['課題を分析する力', '解決への主体性', '再発防止や改善への意識']
      },
      futureVision: {
        careerVision: '将来的には、営業部門のマネージャーとして、チームを率いて成果を上げたいと考えています。',
        futurePosition: '3年後には、営業チームのリーダーとして、5年後には、営業部門のマネージャーとして活躍したいです。',
        criteria: ['目標の明確さと現実性', '自社でのキャリアパスとの一致度']
      },
      reverseQuestion: {
        questions: '営業部門でのキャリアパスについて教えてください。また、新入社員の教育制度についても詳しく聞かせてください。',
        criteria: ['準備度（事前に調べているか）', '会社や職務への興味の深さ', '自分の意思で判断する姿勢']
      }
    }
  }
];

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