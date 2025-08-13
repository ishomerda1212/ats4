import { FixedTask } from '../types/task';
import { stageTaskTemplates } from './templates';

export const getFixedTasksByStage = (stage: string): FixedTask[] => {
  return stageTaskTemplates[stage] || [];
}; 