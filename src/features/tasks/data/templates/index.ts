// タスクテンプレートの統合エクスポート
export { documentScreeningTemplates } from './documentScreening';
export { interviewTemplates } from './interviews';
export { eventTemplates } from './events';

import { FixedTask } from '../../types/task';
import { SelectionStage } from '@/features/applicants/types/applicant';
import { documentScreeningTemplates } from './documentScreening';
import { interviewTemplates } from './interviews';
import { eventTemplates } from './events';

// エントリー段階のテンプレート
const entryTemplates: FixedTask[] = [
  {
    id: 'entry-approach-1',
    stage: 'エントリー',
    title: 'アプローチ1',
    description: 'アプローチ1の実施',
    type: 'アプローチ1',
    isRequired: true,
    estimatedDuration: 30,
    order: 1
  },
  {
    id: 'entry-approach-2',
    stage: 'エントリー',
    title: 'アプローチ2',
    description: 'アプローチ2の実施',
    type: 'アプローチ2',
    isRequired: true,
    estimatedDuration: 30,
    order: 2
  },
  {
    id: 'entry-approach-3',
    stage: 'エントリー',
    title: 'アプローチ3',
    description: 'アプローチ3の実施',
    type: 'アプローチ3',
    isRequired: true,
    estimatedDuration: 30,
    order: 3
  },
  {
    id: 'entry-approach-4',
    stage: 'エントリー',
    title: 'アプローチ4',
    description: 'アプローチ4の実施',
    type: 'アプローチ4',
    isRequired: true,
    estimatedDuration: 30,
    order: 4
  },
  {
    id: 'entry-approach-5',
    stage: 'エントリー',
    title: 'アプローチ5',
    description: 'アプローチ5の実施',
    type: 'アプローチ5',
    isRequired: true,
    estimatedDuration: 30,
    order: 5
  }
];

// 不採用段階のテンプレート
const rejectionTemplates: FixedTask[] = [
  {
    id: 'rejection-notification',
    stage: '不採用',
    title: '不採用通知',
    description: '不採用の通知',
    type: '不採用通知',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  }
];

// 全テンプレートを統合
export const FIXED_TASK_TEMPLATES: Record<SelectionStage, FixedTask[]> = {
  'エントリー': entryTemplates,
  '書類選考': documentScreeningTemplates,
  '会社説明会': eventTemplates.filter(t => t.stage === '会社説明会'),
  '適性検査': eventTemplates.filter(t => t.stage === '適性検査'),
  '適性検査体験': eventTemplates.filter(t => t.stage === '適性検査体験'),
  '職場見学': eventTemplates.filter(t => t.stage === '職場見学'),
  '仕事体験': eventTemplates.filter(t => t.stage === '仕事体験'),
  '人事面接': interviewTemplates.filter(t => t.stage === '人事面接'),
  '集団面接': interviewTemplates.filter(t => t.stage === '集団面接'),
  '最終選考': interviewTemplates.filter(t => t.stage === '最終選考'),
  'CEOセミナー': eventTemplates.filter(t => t.stage === 'CEOセミナー'),
  '内定面談': eventTemplates.filter(t => t.stage === '内定面談'),
  '不採用': rejectionTemplates
};
