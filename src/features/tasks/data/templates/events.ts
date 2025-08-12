import { FixedTask } from '../../types/task';

export const eventTemplates: FixedTask[] = [
  {
    id: 'company-detail-contact',
    stage: '会社説明会',
    title: '詳細連絡',
    description: '会社説明会の詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  },
  {
    id: 'company-reminder',
    stage: '会社説明会',
    title: 'リマインド',
    description: '会社説明会のリマインド',
    type: 'リマインド',
    isRequired: true,
    estimatedDuration: 10,
    order: 2
  },
  {
    id: 'aptitude-detail-contact',
    stage: '適性検査',
    title: '詳細連絡',
    description: '適性検査の詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  },
  {
    id: 'aptitude-submit-documents',
    stage: '適性検査',
    title: '提出書類',
    description: '適性検査の提出書類確認',
    type: '提出書類',
    isRequired: true,
    estimatedDuration: 30,
    order: 2
  },
  {
    id: 'aptitude-result-contact',
    stage: '適性検査',
    title: '結果連絡',
    description: '適性検査の結果連絡',
    type: '結果連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 3
  },
  {
    id: 'aptitude-experience-detail-contact',
    stage: '適性検査体験',
    title: '詳細連絡',
    description: '適性検査体験の詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  },
  {
    id: 'workplace-detail-contact',
    stage: '職場見学',
    title: '詳細連絡',
    description: '職場見学の詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  },
  {
    id: 'work-experience-detail-contact',
    stage: '仕事体験',
    title: '詳細連絡',
    description: '仕事体験の詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  },
  {
    id: 'ceo-detail-contact',
    stage: 'CEOセミナー',
    title: '詳細連絡',
    description: 'CEOセミナーの詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  },
  {
    id: 'ceo-reminder',
    stage: 'CEOセミナー',
    title: 'リマインド',
    description: 'CEOセミナーのリマインド',
    type: 'リマインド',
    isRequired: true,
    estimatedDuration: 10,
    order: 2
  },
  {
    id: 'offer-detail-contact',
    stage: '内定面談',
    title: '詳細連絡',
    description: '内定面談の詳細連絡',
    type: '詳細連絡',
    isRequired: true,
    estimatedDuration: 15,
    order: 1
  }
];
