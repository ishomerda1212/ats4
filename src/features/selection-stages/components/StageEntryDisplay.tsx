import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

export interface StageEntryDisplayProps {
  data?: any;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  onTaskChange?: (taskName: string, completed: boolean) => void;
}

export function StageEntryDisplay({ data, onApproachChange }: StageEntryDisplayProps) {
  const [approaches, setApproaches] = useState(data?.approaches || {
    approach1: { completed: false },
    approach2: { completed: false },
    approach3: { completed: false },
    approach4: { completed: false },
    approach5: { completed: false }
  });

  const handleApproachChange = (approachNumber: number, checked: boolean) => {
    const newApproaches = { ...approaches };
    const approachKey = `approach${approachNumber}` as keyof typeof approaches;
    
    newApproaches[approachKey] = {
      completed: checked,
      completedAt: checked ? new Date().toISOString() : undefined
    };
    
    setApproaches(newApproaches);
    onApproachChange?.(approachNumber, checked);
  };

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

      {/* アプローチ（常に表示） */}
      <div>
        <h5 className="font-medium mb-3">アプローチ</h5>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((num) => {
            const approachKey = `approach${num}` as keyof typeof approaches;
            const approach = approaches[approachKey];
            
            return (
              <div key={num} className="flex items-center space-x-3">
                <Checkbox
                  id={`approach${num}`}
                  checked={approach?.completed || false}
                  onCheckedChange={(checked: boolean | 'indeterminate') => handleApproachChange(num, checked === true)}
                />
                <div className="flex-1">
                  <label htmlFor={`approach${num}`} className="text-sm font-medium">
                    アプローチ{num}
                  </label>
                  {approach?.completed && approach?.completedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      完了日: {format(new Date(approach.completedAt), 'PPP', { locale: ja })}
                    </p>
                  )}
                </div>
                {approach?.completed && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 