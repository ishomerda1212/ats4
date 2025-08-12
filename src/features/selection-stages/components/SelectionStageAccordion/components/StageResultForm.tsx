import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit } from 'lucide-react';

interface StageData {
  result?: string;
}

interface StageResultFormProps {
  stageId: string;
  stageDetails: Record<string, unknown>;
  onOpenResultDialog: (stageId: string, stageData?: StageData) => void;
}

export function StageResultForm({ 
  stageId, 
  stageDetails, 
  onOpenResultDialog 
}: StageResultFormProps) {
  // 書類選考の場合のみ表示
  const stageData = stageDetails[stageId];
  if (!stageData) return null;

  return (
    <div className="mt-4 p-4 border rounded-lg bg-purple-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-purple-900 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          書類選考結果
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenResultDialog(stageId, stageData)}
          className="border-purple-200 text-purple-700 hover:bg-purple-100"
        >
          <Edit className="h-3 w-3 mr-1" />
          合否変更
        </Button>
      </div>
      <div className="text-sm text-purple-800">
        {(stageData as StageData).result ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">結果:</span>
              <Badge className={
                (stageData as StageData).result === '合格' ? 'bg-green-100 text-green-800' :
                (stageData as StageData).result === '不合格' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }>
                {(stageData as StageData).result}
              </Badge>
            </div>
          </div>
        ) : (
          <p className="text-purple-600">合否結果が設定されていません</p>
        )}
      </div>
    </div>
  );
}
