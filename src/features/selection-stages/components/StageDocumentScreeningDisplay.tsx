import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export interface DocumentScreeningStageData {
  id?: string;
  result?: string;
  resultDate?: string;
  evaluator?: string;
  comments?: string;
  notes?: string;
  tasks?: {
    detailedContact?: { completed: boolean; completedAt?: string };
    resultNotification?: { completed: boolean; completedAt?: string };
  };
}

export interface StageDocumentScreeningDisplayProps {
  data?: DocumentScreeningStageData;
}

export function StageDocumentScreeningDisplay({ 
  data 
}: StageDocumentScreeningDisplayProps) {

  const getResultBadge = (result?: string) => {
    switch (result) {
      case '合格':
        return <Badge className="bg-green-100 text-green-800">合格</Badge>;
      case '不合格':
        return <Badge className="bg-red-100 text-red-800">不合格</Badge>;
      case '保留':
        return <Badge className="bg-yellow-100 text-yellow-800">保留</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">未定</Badge>;
    }
  };

  const getResultIcon = (result?: string) => {
    switch (result) {
      case '合格':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case '不合格':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case '保留':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 
        ========================================
        書類選考段階のタスク設定
        ========================================
        以下のタスクを各選考段階に応じて設定してください：
        
        - 詳細連絡
        - 結果連絡
        ========================================
      */}
      
      {/* 合否（データがある場合のみ表示） */}
      {data && (data.result || data.resultDate) && (
        <div className="space-y-4">
          <h5 className="font-medium">合否</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              {getResultIcon(data.result)}
              <div>
                <h6 className="font-medium">選考結果</h6>
                <div className="mt-1">
                  {getResultBadge(data.result)}
                </div>
              </div>
            </div>
            
            <div>
              <h6 className="font-medium">結果確定日</h6>
              <p className="text-sm text-muted-foreground">
                {data.resultDate ? format(new Date(data.resultDate), 'PPP', { locale: ja }) : '未設定'}
              </p>
            </div>
          </div>

          {data.evaluator && (
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <h6 className="font-medium">評価者</h6>
                <p className="text-sm text-muted-foreground">{data.evaluator}</p>
              </div>
            </div>
          )}

          {data.comments && (
            <div>
              <h6 className="font-medium">評価コメント</h6>
              <p className="text-sm text-muted-foreground mt-1">{data.comments}</p>
            </div>
          )}

          {data.notes && (
            <div>
              <h6 className="font-medium">備考</h6>
              <p className="text-sm text-muted-foreground mt-1">{data.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* タスクはSelectionStageAccordionで統合管理されるため、ここでは表示しない */}
    </div>
  );
} 