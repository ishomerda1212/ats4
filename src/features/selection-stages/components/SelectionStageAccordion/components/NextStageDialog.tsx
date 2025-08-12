import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getNextStage } from '../utils/stageHelpers';
import { Applicant } from '@/features/applicants/types/applicant';

interface NextStageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant;
  onAdvanceToStage: (stage: string) => void;
}

export function NextStageDialog({
  isOpen,
  onOpenChange,
  applicant,
  onAdvanceToStage
}: NextStageDialogProps) {
  const nextStage = getNextStage(applicant.currentStage);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="next-stage-dialog-description">
        <DialogHeader>
          <DialogTitle>次の段階を選択</DialogTitle>
        </DialogHeader>
        <div id="next-stage-dialog-description" className="sr-only">
          応募者を次の選考段階に進めるためのダイアログです。進める段階を選択してください。
        </div>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            応募者を次の段階に進めます。どの段階に進めますか？
          </p>
          <div className="space-y-2">
            {nextStage && (
              <Button
                key={nextStage}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onAdvanceToStage(nextStage)}
              >
                {nextStage}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
