import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ChevronDown, ChevronRight, Monitor, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

export interface CompanyInfoStageData {
  id?: string;
  sessionDate?: string;
  sessionName?: string;
  eventName?: string;
  attendanceStatus?: string;
  location?: string;
  format?: '対面' | 'オンライン' | 'ハイブリッド';
  impression?: string;
  notes?: string;
  tasks?: {
    detailedContact?: { completed: boolean; completedAt?: string };
  };
}

export interface StageCompanyInfoDisplayProps {
  data?: CompanyInfoStageData;
}

export function StageCompanyInfoDisplay({ data }: StageCompanyInfoDisplayProps) {
  const [isSessionInfoExpanded, setIsSessionInfoExpanded] = useState(false);

  const getAttendanceStatusBadge = (status?: string) => {
    switch (status) {
      case '参加':
        return <Badge className="bg-green-100 text-green-800">参加</Badge>;
      case '欠席':
        return <Badge className="bg-red-100 text-red-800">欠席</Badge>;
      case '遅刻':
        return <Badge className="bg-yellow-100 text-yellow-800">遅刻</Badge>;
      case '早退':
        return <Badge className="bg-purple-100 text-purple-800">早退</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">未定</Badge>;
    }
  };

  const getFormatBadge = (format?: string) => {
    switch (format) {
      case '対面':
        return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><Users className="w-3 h-3" />対面</Badge>;
      case 'オンライン':
        return <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1"><Monitor className="w-3 h-3" />オンライン</Badge>;
      case 'ハイブリッド':
        return <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1"><Users className="w-3 h-3" />ハイブリッド</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">未定</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* 
        ========================================
        会社説明会段階のタスク設定
        ========================================
        以下のタスクを各選考段階に応じて設定してください：
        
        - 詳細連絡
        ========================================
      */}
      
      {/* セッション情報（参加実績）（データがある場合のみ表示） */}
      {data && (data.sessionDate || data.sessionName || data.eventName || data.attendanceStatus) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">セッション情報（参加実績）</h5>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSessionInfoExpanded(!isSessionInfoExpanded)}
              className="flex items-center gap-1"
            >
              {isSessionInfoExpanded ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  詳細を隠す
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  詳細を表示
                </>
              )}
            </Button>
          </div>
          
          {/* 常に表示される基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <h6 className="font-medium">セッション日時</h6>
                <p className="text-sm text-muted-foreground">
                  {data.sessionDate ? format(new Date(data.sessionDate), 'PPP', { locale: ja }) : '未設定'}
                </p>
              </div>
            </div>
            
            <div>
              <h6 className="font-medium">参加実績</h6>
              <div className="mt-1">
                {getAttendanceStatusBadge(data.attendanceStatus)}
              </div>
            </div>
          </div>

          {/* アコーディオンで隠す詳細情報 */}
          {isSessionInfoExpanded && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <h6 className="font-medium">イベント名</h6>
                <p className="text-sm text-muted-foreground">{data.eventName || '未設定'}</p>
              </div>

              <div>
                <h6 className="font-medium">セッション名</h6>
                <p className="text-sm text-muted-foreground">{data.sessionName || '未設定'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h6 className="font-medium">場所</h6>
                    <p className="text-sm text-muted-foreground">{data.location || '未設定'}</p>
                  </div>
                </div>
                
                <div>
                  <h6 className="font-medium">開催形式</h6>
                  <div className="mt-1">
                    {getFormatBadge(data.format)}
                  </div>
                </div>
              </div>

              {data.impression && (
                <div>
                  <h6 className="font-medium">印象・感想</h6>
                  <p className="text-sm text-muted-foreground mt-1">{data.impression}</p>
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
        </div>
      )}

      {/* タスクはSelectionStageAccordionで統合管理されるため、ここでは表示しない */}
    </div>
  );
} 