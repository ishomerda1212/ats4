import { BaseEntity } from '@/shared/types/common';

export interface EvaluationFormData {
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

export interface Evaluation extends BaseEntity, EvaluationFormData {
  applicantId: string;
  selectionHistoryId: string;
}

export const EVALUATION_FIELDS = [
  { key: 'firstImpression', label: '第一印象', placeholder: '身だしなみ、表情、態度などの第一印象について記入してください' },
  { key: 'communicationSkills', label: 'コミュニケーション能力', placeholder: '質問への回答、説明の分かりやすさ、聞く姿勢について記入してください' },
  { key: 'logicalThinking', label: '論理的思考力', placeholder: '筋道立てて考える力、問題解決能力について記入してください' },
  { key: 'initiative', label: '積極性・主体性', placeholder: '自ら行動する姿勢、チャレンジ精神について記入してください' },
  { key: 'teamwork', label: '協調性', placeholder: 'チームワーク、他者との協力姿勢について記入してください' },
  { key: 'motivation', label: '志望動機・熱意', placeholder: '志望理由の明確さ、入社への熱意について記入してください' },
  { key: 'technicalSkills', label: '技術的スキル', placeholder: '専門知識、技術力、学習意欲について記入してください' },
  { key: 'overallEvaluation', label: '総合評価', placeholder: '全体的な評価、今後の期待、推薦度について記入してください' }
] as const;