import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, MapPin, School, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';
import { formatDateTime } from '@/shared/utils/date';

interface ApplicantInfoPanelProps {
  applicant: Applicant;
  history?: SelectionHistory[];
  selectionHistory?: SelectionHistory;
}

export function ApplicantInfoPanel({ applicant, history = [] }: ApplicantInfoPanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case '完了':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '進行中':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case '不採用':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 応募者基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle>応募者情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div>
              <h3 className="text-xl font-bold">{applicant.name}</h3>
              <p className="text-muted-foreground">{applicant.nameKana}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">{applicant.source}</Badge>
              <Badge className="bg-gray-100 text-blue-600 border-blue-600">データ入力済み</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <School className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{applicant.schoolName}</p>
                <p className="text-sm text-muted-foreground">
                  {applicant.faculty} {applicant.department}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{applicant.graduationYear}年卒業予定</p>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{applicant.email}</p>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{applicant.phone}</p>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{applicant.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 選考履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>選考履歴</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-gray-600 text-center py-4">選考履歴がありません。</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-3 border rounded-lg ${
                    item.id === applicant.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                      : item.status === '進行中'
                      ? 'border-orange-300 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-700'
                      : item.status === '完了'
                      ? 'border-gray-300 bg-gray-50 dark:bg-gray-950/20 dark:border-gray-700'
                      : item.status === '不採用'
                      ? 'border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-700'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.stage}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(item.startDate)}
                          {item.endDate && ` 〜 ${formatDateTime(item.endDate)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800">{item.status}</Badge>
                      {item.id === applicant.id && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-600">
                          現在
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {item.notes && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">{item.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
