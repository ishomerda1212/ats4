// タスクテンプレートの再エクスポート
export { FIXED_TASK_TEMPLATES } from './templates';

import { FIXED_TASK_TEMPLATES } from './templates';
import { SelectionStage } from '@/features/applicants/types/applicant';

/**
 * 選考段階に応じた固定タスクを取得する
 */
export const getFixedTasksByStage = (stage: SelectionStage) => {
  return FIXED_TASK_TEMPLATES[stage] || [];
}; 