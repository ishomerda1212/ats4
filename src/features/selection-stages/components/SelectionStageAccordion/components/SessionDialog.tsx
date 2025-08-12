import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Users as UsersIcon, Monitor } from 'lucide-react';
import { formatDateTime } from '@/shared/utils/date';
import { SESSION_TYPE_OPTIONS, STAGE_RESULT_OPTIONS } from '@/shared/utils/constants';
import { EventSession } from '@/features/events/types/event';

type Session = EventSession;

interface SessionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingStage: string;
  sessionFormData: {
    selectedSessionId: string;
    sessionType: string;
    result: string;
  };
  availableSessions: Session[];
  onSessionSelection: (sessionId: string) => void;
  onSessionFormChange: (field: string, value: string) => void;
  onSave: () => void;
}

export function SessionDialog({
  isOpen,
  onOpenChange,
  editingStage,
  sessionFormData,
  availableSessions,
  onSessionSelection,
  onSessionFormChange,
  onSave
}: SessionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-describedby="session-dialog-description">
        <DialogHeader>
          <DialogTitle>
            {editingStage} - セッション情報登録
          </DialogTitle>
        </DialogHeader>
        <div id="session-dialog-description" className="sr-only">
          {editingStage}のセッション情報を登録するダイアログです。セッションを選択し、合否を設定してください。
        </div>
        <div className="space-y-4">
          {/* セッション選択 */}
          <div>
            <Label htmlFor="sessionSelect">セッション選択</Label>
            <Select 
              value={sessionFormData.selectedSessionId} 
              onValueChange={onSessionSelection}
            >
              <SelectTrigger>
                <SelectValue placeholder="セッションを選択してください" />
              </SelectTrigger>
              <SelectContent>
                {(() => {
                  if (availableSessions.length === 0) {
                    return (
                      <SelectItem value="no-sessions" disabled>
                        利用可能なセッションがありません
                      </SelectItem>
                    );
                  }
                  return availableSessions.map(session => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name} - {formatDateTime(session.start)}
                    </SelectItem>
                  ));
                })()}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              イベント管理で登録されているセッションから選択してください
            </p>
          </div>

          {/* 対面/オンライン選択 */}
          <div>
            <Label htmlFor="sessionTypeSelect">実施形式</Label>
            <Select 
              value={sessionFormData.sessionType} 
              onValueChange={(value) => onSessionFormChange('sessionType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="実施形式を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {SESSION_TYPE_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>
                    <div className="flex items-center space-x-2">
                      {option === '対面' && <UsersIcon className="h-4 w-4" />}
                      {option === 'オンライン' && <Monitor className="h-4 w-4" />}
                      <span>{option}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              セッションの実施形式を選択してください
            </p>
          </div>

          {/* 合否選択 */}
          <div>
            <Label htmlFor="resultSelect">合否</Label>
            <Select 
              value={sessionFormData.result} 
              onValueChange={(value) => onSessionFormChange('result', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="合否を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {(() => {
                  const resultOptions = STAGE_RESULT_OPTIONS[editingStage as keyof typeof STAGE_RESULT_OPTIONS] || [];
                  return resultOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ));
                })()}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {editingStage}の結果を選択してください
            </p>
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
