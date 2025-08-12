import { FixedTask } from '../../types/task';

export const documentScreeningTemplates: FixedTask[] = [
  {
    id: 'document-detail-contact',
    stage: '書類選考',
    title: '詳細連絡',
    description: '書類選考の詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  },
  {
    id: 'document-submit-documents',
    stage: '書類選考',
    title: '提出書類',
    description: '書類選考の提出書類確認',
    type: '提出書類',
    isRequired: true,
    estimatedDuration: 30,
    order: 2
  },
  {
    id: 'document-result-contact',
    stage: '書類選考',
    title: '結果連絡',
    description: '書類選考の結果連絡',
    type: '結果連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 3
  }
];
