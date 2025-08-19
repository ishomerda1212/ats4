import { SelectionStageAccordion } from '@/features/selection-stages/components/SelectionStageAccordion';
import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';

interface SelectionHistoryTabProps {
  applicant: Applicant;
  history: SelectionHistory[];
  stageDetails: Record<string, unknown>;
  refresh?: () => void;
}

export function SelectionHistoryTab({ 
  applicant, 
  history, 
  stageDetails,
  refresh
}: SelectionHistoryTabProps) {
  return (
    <SelectionStageAccordion 
      applicant={applicant} 
      history={history}
      stageDetails={stageDetails}
      onRefresh={refresh}
    />
  );
}
