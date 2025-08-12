export interface SelectionStageTemplate {
  id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  defaultTasks: DefaultTask[];
  emailTemplates: string[]; // EmailTemplate IDs
  estimatedDuration?: number; // 日数
  requiredDocuments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DefaultTask {
  id: string;
  title: string;
  description: string;
  type: 'general' | 'email' | 'document' | 'interview' | 'evaluation';
  dueOffsetDays?: number; // 段階開始からの日数
  isRequired: boolean;
  emailTemplateId?: string;
}

export interface SelectionStageProgress {
  id: string;
  applicantId: string;
  stageTemplateId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'rejected';
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}