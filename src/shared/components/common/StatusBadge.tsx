import { Badge } from '@/components/ui/badge';
import { SelectionStage } from '@/features/applicants/types/applicant';
import { STAGE_COLORS } from '@/shared/utils/constants';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  stage: SelectionStage;
  className?: string;
}

export function StatusBadge({ stage, className }: StatusBadgeProps) {
  return (
    <Badge 
      className={cn(
        STAGE_COLORS[stage],
        'font-medium',
        className
      )}
    >
      {stage}
    </Badge>
  );
}