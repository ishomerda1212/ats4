import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { STAGE_RESULT_OPTIONS } from '@/shared/utils/constants';

interface ResultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStageId: string;
  resultFormData: {
    result: string;
  };
  onResultFormChange: (field: string, value: string) => void;
  onSave: () => void;
}

export function ResultDialog({
  isOpen,
  onOpenChange,
  selectedStageId,
  resultFormData,
  onResultFormChange,
  onSave
}: ResultDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="result-dialog-description">
        <DialogHeader>
          <DialogTitle>書類選考結果変更 {selectedStageId && `(${selectedStageId})`}</DialogTitle>
        </DialogHeader>
        <div id="result-dialog-description" className="sr-only">
          書類選考の合否結果を変更するダイアログです。
        </div>
        <div className="space-y-4">
          {/* 合否選択 */}
          <div>
            <Label htmlFor="resultSelect">合否結果</Label>
            <Select 
              value={resultFormData.result} 
              onValueChange={(value) => onResultFormChange('result', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="合否を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {STAGE_RESULT_OPTIONS['書類選考'].map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
