import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, MapPin, School, User } from 'lucide-react';
import { Applicant, SelectionHistory } from '@/features/applicants/types/applicant';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDate, formatDateTime } from '@/shared/utils/date';

interface ApplicantInfoPanelProps {
  applicant: Applicant;
  selectionHistory?: SelectionHistory;
}

export function ApplicantInfoPanel({ applicant, selectionHistory }: ApplicantInfoPanelProps) {
  return (
    <div className="space-y-6">
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
              <Badge variant="secondary">{applicant.source}</Badge>
              <Badge variant="outline">{applicant.gender}</Badge>
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

      <Card>
        <CardHeader>
          <CardTitle>現在の選考段階</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <StatusBadge stage={applicant.currentStage} />
            
            {selectionHistory && (
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">{selectionHistory.stage}</p>
                  <p className="text-xs text-muted-foreground">
                    開始: {formatDateTime(selectionHistory.startDate)}
                  </p>
                  {selectionHistory.endDate && (
                    <p className="text-xs text-muted-foreground">
                      完了: {formatDateTime(selectionHistory.endDate)}
                    </p>
                  )}
                </div>
                
                {selectionHistory.notes && (
                  <div>
                    <p className="text-sm font-medium">備考</p>
                    <p className="text-sm text-muted-foreground">{selectionHistory.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>登録情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">登録日: </span>
            <span>{formatDate(applicant.createdAt)}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">最終更新: </span>
            <span>{formatDate(applicant.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}