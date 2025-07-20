import { Badge } from '@/components/ui/badge';
import { Calendar, Users, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface StageInterviewDisplayProps {
  stageType: '人事面接' | 'グループ面接' | '最終面接';
  data?: {
    interviewDate?: string;
    interviewer?: string;
    interviewers?: string;
    duration?: string;
    participants?: string;
    impression?: string;
    result?: string;
    notes?: string;
  };
}

export function StageInterviewDisplay({ stageType, data }: StageInterviewDisplayProps) {
  const getResultIcon = (result?: string) => {
    switch (result) {
      case '合格':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '不合格':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case '要再面接':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getResultBadgeVariant = (result?: string) => {
    switch (result) {
      case '合格':
        return 'default' as const;
      case '不合格':
        return 'destructive' as const;
      case '要再面接':
        return 'secondary' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getStageIcon = () => {
    switch (stageType) {
      case '人事面接':
        return <User className="h-4 w-4" />;
      case 'グループ面接':
        return <Users className="h-4 w-4" />;
      case '最終面接':
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 
        ========================================
        面接段階のタスク設定
        ========================================
        以下のタスクを各選考段階に応じて設定してください：
        
        人事面接：
        - 面接官の調整
        - 面接日時の調整
        - 面接会場の確保
        - 面接資料の準備
        - 面接結果の記録
        - 結果通知の送信
        - 不合格者のフォローアップ
        
        グループ面接：
        - 面接官の調整
        - 参加者の調整
        - 面接日時の調整
        - グループ分けの調整
        - 面接会場の確保
        - 面接資料の準備
        - 面接結果の記録
        - 結果通知の送信
        
        最終面接：
        - 面接官の調整
        - 面接日時の調整
        - 面接会場の確保
        - 面接資料の準備
        - 面接結果の記録
        - 結果通知の送信
        - 内定の検討
        ========================================
      */}
      
      {/* 面接結果（データがある場合のみ表示） */}
      {data && (data.interviewDate || data.interviewer || data.interviewers || data.result) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <h5 className="font-medium">面接日</h5>
                <p className="text-sm text-muted-foreground">
                  {data.interviewDate ? format(new Date(data.interviewDate), 'PPP', { locale: ja }) : '未設定'}
                </p>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium">面接官</h5>
              <p className="text-sm text-muted-foreground">
                {data.interviewer || data.interviewers || '未設定'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.duration && (
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h5 className="font-medium">面接時間</h5>
                  <p className="text-sm text-muted-foreground">{data.duration}</p>
                </div>
              </div>
            )}
            
            {data.participants && stageType === 'グループ面接' && (
              <div>
                <h5 className="font-medium">参加者数</h5>
                <p className="text-sm text-muted-foreground">{data.participants}</p>
              </div>
            )}
          </div>

          {data.impression && (
            <div>
              <h5 className="font-medium">印象・評価</h5>
              <p className="text-sm text-muted-foreground mt-1">{data.impression}</p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {getResultIcon(data.result)}
            <div>
              <h5 className="font-medium">結果</h5>
              <Badge variant={getResultBadgeVariant(data.result)}>
                {data.result || '未判定'}
              </Badge>
            </div>
          </div>

          {data.notes && (
            <div>
              <h5 className="font-medium">備考</h5>
              <p className="text-sm text-muted-foreground mt-1">{data.notes}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 