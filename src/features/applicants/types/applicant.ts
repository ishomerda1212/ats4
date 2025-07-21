import { BaseEntity } from '@/shared/types/common';

export type Gender = '男性' | '女性' | 'その他';
export type Source = 'マイナビ' | '学情' | 'オファーボックス' | 'その他';

export type SelectionStage = 
  | 'エントリー'
  | '書類選考'
  | '会社説明会'
  | '適性検査'
  | '職場見学'
  | '仕事体験'
  | '個別面接'
  | '集団面接'
  | 'CEOセミナー'
  | '人事面接'
  | '最終選考'
  | '内定'
  | '不採用';

export type SelectionStatus = '進行中' | '完了' | '不採用';

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
}

export interface SelectionHistory extends BaseEntity {
  applicantId: string;
  stage: SelectionStage;
  startDate: Date;
  endDate?: Date;
  status: SelectionStatus;
  notes?: string;
}

export interface Evaluation extends BaseEntity {
  applicantId: string;
  selectionHistoryId: string;
  evaluatorName: string;
  firstImpression: string;
  communicationSkills: string;
  logicalThinking: string;
  initiative: string;
  teamwork: string;
  motivation: string;
  technicalSkills: string;
  overallEvaluation: string;
}

export type TaskStatus = '未着手' | '進行中' | '完了';

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