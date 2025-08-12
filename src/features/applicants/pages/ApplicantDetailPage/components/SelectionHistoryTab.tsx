import { SelectionStageAccordion } from '@/features/selection-stages/components/SelectionStageAccordion';
import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';

interface SelectionHistoryTabProps {
  applicant: Applicant;
  history: SelectionHistory[];
  stageDetails: Record<string, unknown>;
}

export function SelectionHistoryTab({ 
  applicant, 
  history, 
  stageDetails 
}: SelectionHistoryTabProps) {
  return (
    <SelectionStageAccordion 
      applicant={applicant} 
      history={history}
      stageDetails={stageDetails}
    />
  );
}
