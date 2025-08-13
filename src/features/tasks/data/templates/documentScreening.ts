import { FixedTask } from '../../types/task';

export const documentScreeningTasks: FixedTask[] = [
  {
    id: 'doc-screening-1',
    stage: '書類選考',
    title: '履歴書・職務経歴書確認',
    description: '応募者の履歴書・職務経歴書の内容を確認し、基本要件との適合性を評価する',
    type: 'document',
    order: 1,
  },
  {
    id: 'doc-screening-2',
    stage: '書類選考',
    title: '志望動機確認',
    description: '応募者の志望動機の妥当性と企業への理解度を評価する',
    type: 'document',
    order: 2,
  },
  {
    id: 'doc-screening-3',
    stage: '書類選考',
    title: '書類選考結果通知',
    description: '書類選考の結果を応募者に通知する',
    type: 'email',
    order: 3,
  },
];
