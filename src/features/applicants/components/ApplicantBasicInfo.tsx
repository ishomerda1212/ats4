import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Phone, MapPin, Calendar, School, Target, Heart, Briefcase, Award, User, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Applicant } from '../types/applicant';
import { TaskInstance } from '@/features/tasks/types/task';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDate } from '@/shared/utils/date';

// 次のタスク用の拡張されたTaskInstance型
interface ExtendedTaskInstance extends TaskInstance {
  title: string;
  description: string;
  type: string;
}

interface ApplicantBasicInfoProps {
  applicant: Applicant;
  nextTask?: ExtendedTaskInstance | null;
}

export function ApplicantBasicInfo({ applicant, nextTask }: ApplicantBasicInfoProps) {
  console.log('🔍 ApplicantBasicInfo render - nextTask:', nextTask);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case '未着手':
        return 'bg-gray-100 text-gray-800';
      case '進行中':
        return 'bg-blue-100 text-blue-800';
      case '提出待ち':
        return 'bg-orange-100 text-orange-800';
      case '完了':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>基本情報</CardTitle>
          <Link to={`/applicants/${applicant.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div>
              <h2 className="text-2xl font-bold">{applicant.name}</h2>
              <p className="text-muted-foreground">{applicant.nameKana}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">{applicant.source}</Badge>
              <Badge className="bg-gray-100 text-gray-800">{applicant.gender}</Badge>
            </div>
          </div>
          <StatusBadge stage={applicant.currentStage} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <School className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{applicant.schoolName}</p>
                <p className="text-sm text-muted-foreground">
                  {applicant.faculty} {applicant.department}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{applicant.graduationYear}年卒業予定</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">メールアドレス</p>
                <p className="text-sm text-muted-foreground">{applicant.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">電話番号</p>
                <p className="text-sm text-muted-foreground">{applicant.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">現住所</p>
                <p className="text-sm text-muted-foreground">{applicant.currentAddress}</p>
              </div>
            </div>

            {applicant.birthplace && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">出身地</p>
                  <p className="text-sm text-muted-foreground">{applicant.birthplace}</p>
                </div>
              </div>
            )}
          </div>
        </div>

          {/* 詳細情報セクション */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">詳細情報</h3>
            
            <div className="space-y-4">
              {applicant.experience && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-sm">学業・バイト・サークル</h4>
                  </div>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    {applicant.experience}
                  </p>
                </div>
              )}

              {applicant.otherCompanyStatus && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-orange-600" />
                    <h4 className="font-medium text-sm">他社状況</h4>
                  </div>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    {applicant.otherCompanyStatus}
                  </p>
                </div>
              )}

              {applicant.appearance && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-sm">見た目</h4>
                  </div>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    {applicant.appearance}
                  </p>
                </div>
              )}
            </div>

            {/* 次のタスクセクション */}
            {nextTask && (
              <div className="pt-4 border-t mt-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-sm">次のタスク</h4>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-sm text-blue-900">{nextTask.title}</h5>
                      <Badge className={`text-xs ${getStatusColor(nextTask.status)}`}>
                        {nextTask.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-700 mb-2">{nextTask.description}</p>
                    {nextTask.dueDate && (
                      <p className="text-xs text-blue-600">
                        期限: {formatDate(nextTask.dueDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 登録日と最終更新日 */}
            <div className="pt-4 border-t mt-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>登録日: {formatDate(applicant.createdAt)}</span>
                <span>最終更新: {formatDate(applicant.updatedAt)}</span>
              </div>
            </div>
          </div>
      </CardContent>
    </Card>
  );
}

export default ApplicantBasicInfo;