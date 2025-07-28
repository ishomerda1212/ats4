import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export interface EntryStageData {
  entryDate?: string;
  source?: string;
  approaches?: {
    approach1?: { completed: boolean; completedAt?: string };
    approach2?: { completed: boolean; completedAt?: string };
    approach3?: { completed: boolean; completedAt?: string };
    approach4?: { completed: boolean; completedAt?: string };
    approach5?: { completed: boolean; completedAt?: string };
  };
}

export interface StageEntryDisplayProps {
  data?: EntryStageData;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  onTaskChange?: (taskName: string, completed: boolean) => void;
  onApproachChange?: (approachNumber: number, completed: boolean) => void;
}

export function StageEntryDisplay({ data }: StageEntryDisplayProps) {

  return (
    <div className="space-y-4">
      {/* エントリー情報（データがある場合のみ表示） */}
      {data && (data.entryDate || data.source) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <h5 className="font-medium">エントリー日</h5>
              <p className="text-sm text-muted-foreground">
                {data.entryDate ? format(new Date(data.entryDate), 'PPP', { locale: ja }) : '未設定'}
              </p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium">応募経路</h5>
            <p className="text-sm text-muted-foreground">{data.source || '未設定'}</p>
          </div>
        </div>
      )}

      {/* アプローチはSelectionStageAccordionで統合管理されるため、ここでは表示しない */}
    </div>
  );
} 