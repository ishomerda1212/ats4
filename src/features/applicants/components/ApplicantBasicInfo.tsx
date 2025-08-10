import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Phone, MapPin, Calendar, School, Target, Heart, Briefcase, Award, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Applicant } from '../types/applicant';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDate } from '@/shared/utils/date';

interface ApplicantBasicInfoProps {
  applicant: Applicant;
}

export function ApplicantBasicInfo({ applicant }: ApplicantBasicInfoProps) {
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
                <p className="font-medium">住所</p>
                <p className="text-sm text-muted-foreground">{applicant.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 詳細情報セクション */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">詳細情報</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 志望動機・就活の軸・他社状況・将来像 */}
            <div className="space-y-4">
              {applicant.motivation && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-sm">志望動機</h4>
                  </div>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    {applicant.motivation}
                  </p>
                </div>
              )}

              {applicant.jobSearchAxis && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-sm">就活の軸</h4>
                  </div>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    {applicant.jobSearchAxis}
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

              {applicant.futureVision && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium text-sm">将来像</h4>
                  </div>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    {applicant.futureVision}
                  </p>
                </div>
              )}
            </div>

            {/* 長所・短所・経験・活動歴 */}
            <div className="space-y-4">
              {applicant.strengths && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <h4 className="font-medium text-sm">長所</h4>
                  </div>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    {applicant.strengths}
                  </p>
                </div>
              )}

              {applicant.weaknesses && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-medium text-sm">短所</h4>
                  </div>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    {applicant.weaknesses}
                  </p>
                </div>
              )}

              {applicant.experience && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                    <h4 className="font-medium text-sm">経験・活動歴</h4>
                  </div>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    {applicant.experience}
                  </p>
                </div>
              )}
            </div>
          </div>

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