// タスクテンプレートの統合エクスポート
export { documentScreeningTasks } from './documentScreening';
export { interviewTasks } from './interviews';
export { eventTasks } from './events';

import { FixedTask } from '../../types/task';
import { documentScreeningTasks } from './documentScreening';
import { interviewTasks } from './interviews';
import { eventTasks } from './events';

export const taskTemplates: FixedTask[] = [
  {
    id: 'template-1',
    stage: 'エントリー',
    title: 'エントリー確認',
    description: '応募者のエントリーを確認する',
    type: 'general',
    order: 1,
  },
  {
    id: 'template-2',
    stage: 'エントリー',
    title: '初期連絡',
    description: '応募者への初期連絡を行う',
    type: 'email',
    order: 2,
  },
  {
    id: 'template-3',
    stage: '書類選考',
    title: '書類確認',
    description: '提出された書類を確認する',
    type: 'document',
    order: 1,
  },
  {
    id: 'template-4',
    stage: '書類選考',
    title: '書類選考結果通知',
    description: '書類選考の結果を通知する',
    type: 'email',
    order: 2,
  },
  {
    id: 'template-5',
    stage: '人事面接',
    title: '面接日程調整',
    description: '面接の日程を調整する',
    type: 'interview',
    order: 1,
  },
  {
    id: 'template-6',
    stage: '人事面接',
    title: '面接実施',
    description: '面接を実施する',
    type: 'interview',
    order: 2,
  },
  {
    id: 'template-7',
    stage: '最終選考',
    title: '最終選考結果通知',
    description: '最終選考の結果を通知する',
    type: 'email',
    order: 1,
  },
];

// 段階別タスクテンプレート
export const stageTaskTemplates: Record<string, FixedTask[]> = {
  'エントリー': taskTemplates.filter(t => t.stage === 'エントリー'),
  '書類選考': documentScreeningTasks,
  '会社説明会': eventTasks.filter(t => t.stage === '会社説明会'),
  '適性検査': eventTasks.filter(t => t.stage === '適性検査'),
  '適性検査体験': eventTasks.filter(t => t.stage === '適性検査体験'),
  '職場見学': eventTasks.filter(t => t.stage === '職場見学'),
  '仕事体験': eventTasks.filter(t => t.stage === '仕事体験'),
  '人事面接': interviewTasks.filter(t => t.stage === '人事面接'),
  '集団面接': interviewTasks.filter(t => t.stage === '集団面接'),
  '最終選考': interviewTasks.filter(t => t.stage === '最終選考'),
  'CEOセミナー': eventTasks.filter(t => t.stage === 'CEOセミナー'),
  '内定面談': eventTasks.filter(t => t.stage === '内定面談'),
};
