import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Applicant } from '@/features/applicants/types/applicant';
import { SELECTION_STAGES } from '@/shared/utils/constants';

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
  // 現在の段階以外のすべての段階を取得
  const availableStages = SELECTION_STAGES.filter(stage => stage !== applicant.currentStage);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>次の段階を選択</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            応募者を次の段階に進めます。どの段階に進めますか？
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {availableStages.map((stage) => (
              <Button
                key={stage}
                variant="outline"
                className="h-auto p-4 text-left justify-start hover:bg-gray-50"
                onClick={() => onAdvanceToStage(stage)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{stage}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
