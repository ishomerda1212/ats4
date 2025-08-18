import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getNextStage } from '../utils/stageHelpers';
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
  const nextStage = getNextStage(applicant.currentStage);
  
  // 現在の段階を除外したすべての選考段階を取得
  const availableStages = SELECTION_STAGES.filter(stage => stage !== applicant.currentStage);

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
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {/* 推奨の次の段階を最初に表示 */}
            {nextStage && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">推奨の次の段階</p>
                <Button
                  key={nextStage}
                  variant="default"
                  className="w-full justify-start"
                  onClick={() => onAdvanceToStage(nextStage)}
                >
                  {nextStage}
                </Button>
              </div>
            )}
            
            {/* その他の段階を表示 */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">その他の段階</p>
              {availableStages
                .filter(stage => !nextStage || stage !== nextStage)
                .map((stage) => (
                  <Button
                    key={stage}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onAdvanceToStage(stage)}
                  >
                    {stage}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
