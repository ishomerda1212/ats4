import { BaseEntity } from '@/shared/types/common';

export type Gender = '男性' | '女性' | 'その他';
export type Source = 'マイナビ' | '学情' | 'オファーボックス' | 'その他';

export type SelectionStage = 
  | 'エントリー'
  | '書類選考'
  | '会社説明会'
  | '適性検査'
  | '適性検査体験'
  | '職場見学'
  | '仕事体験'
  | '人事面接'
  | '集団面接'
  | '最終選考'
  | 'CEOセミナー'
  | '内定面談'
  | '不採用';

export interface EvaluationForm {
  id: string;
  applicantId: string;
  title: string;
  stage: SelectionStage;
  evaluator: string; // 評定者
  overallRating: string; // 総合評価
  createdAt: string;
  updatedAt: string;
  sections: {
    motivation: {
      companyMotivation: string;
      industryMotivation: string;
      jobMotivation: string;
      criteria: string[];
    };
    experience: {
      pastExperience: string;
      focusedActivity: string;
      learnedFromActivities: string;
      criteria: string[];
    };
    selfUnderstanding: {
      strengthsWeaknesses: string;
      othersOpinion: string;
      criteria: string[];
    };
    problemSolving: {
      failureExperience: string;
      difficultSituation: string;
      criteria: string[];
    };
    futureVision: {
      careerVision: string;
      futurePosition: string;
      criteria: string[];
    };
    reverseQuestion: {
      questions: string;
      criteria: string[];
    };
  };
}

export type SelectionStatus = 
  | '進行中' 
  | '完了' 
  | '不採用' 
  | '合格' 
  | '不合格' 
  | '保留' 
  | '辞退' 
  | 'キャンセル' 
  | '参加予定'
  | '参加' 
  | '不参加' 
  | '内定' 
  | '不内定' 
  | '確定'
  | '無断欠席'
  | '未承諾'
  | '承諾';

export interface Applicant extends BaseEntity {
  source: Source; // 反響
  name: string; // 氏名
  nameKana: string; // フリガナ
  gender: Gender; // 性別
  schoolName: string; // 学校名
  faculty: string; // 学部
  department: string; // 学科・コース
  graduationYear: number; // 卒業年度
  address: string; // 現住所
  phone: string; // 携帯電話
  email: string; // メール
  currentStage: SelectionStage; // 現在の選考段階
  
  // 詳細情報
  motivation?: string; // 志望動機
  jobSearchAxis?: string; // 就活の軸
  otherCompanyStatus?: string; // 他社状況
  futureVision?: string; // 将来像
  strengths?: string; // 長所
  weaknesses?: string; // 短所
  experience?: string; // 経験・活動歴（趣味・サークル・アルバイト）
  
  // 選考履歴
  history?: SelectionHistory[];
}

export interface SelectionHistory extends BaseEntity {
  applicantId: string;
  stage: SelectionStage;
  startDate: Date;
  endDate?: Date;
  status: SelectionStatus;
  notes?: string;
}

export type TaskStatus = '未着手' | '進行中' | '完了' | '提出待ち' | '返信待ち';

export interface Task extends BaseEntity {
  selectionHistoryId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority?: '低' | '中' | '高';
  assignee?: string;
  dueDate?: Date;
  completedAt?: Date;
  type?: 'general' | 'email' | 'document' | 'interview' | 'evaluation';
  emailTemplateId?: string;
}