import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, School, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Applicant } from '../types/applicant';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDate } from '@/shared/utils/date';
import { useTaskManagement } from '@/features/tasks/hooks/useTaskManagement';
import { TaskStatus } from '@/features/tasks/types/task';

interface ApplicantCardProps {
  applicant: Applicant;
}

export function ApplicantCard({ applicant }: ApplicantCardProps) {
  const { getNextTaskAllStages, getDaysUntilDue, getDueStatus } = useTaskManagement();
  const nextTask = getNextTaskAllStages(applicant);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case '進行中':
        return <Clock className="h-3 w-3 text-yellow-600" />;
      case '未着手':
        return <AlertCircle className="h-3 w-3 text-gray-400" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return 'bg-green-100 text-green-800';
      case '進行中':
        return 'bg-yellow-100 text-yellow-800';
      case '未着手':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueStatusColor = (dueStatus?: string) => {
    switch (dueStatus) {
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'urgent':
        return 'bg-orange-100 text-orange-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">{applicant.name}</h3>
              <Badge className="bg-green-100 text-green-800 text-xs">{applicant.source}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{applicant.nameKana}</p>
          </div>
          <StatusBadge stage={applicant.currentStage} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <School className="h-4 w-4 text-muted-foreground" />
            <span>{applicant.schoolName}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{applicant.faculty} {applicant.department}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{applicant.email}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{applicant.phone}</span>
          </div>
        </div>
        
        {/* 次のタスク表示 */}
        {nextTask && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(nextTask.status)}
                <span className="text-sm font-medium">次のタスク:</span>
                <span className="text-sm">{nextTask.title}</span>
                <Badge className={`text-xs ${getStatusColor(nextTask.status)}`}>
                  {nextTask.status}
                </Badge>
              </div>
              {nextTask.dueDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(nextTask.dueDate)}
                  </span>
                  {(() => {
                    const daysUntilDue = getDaysUntilDue(nextTask.dueDate);
                    const dueStatus = getDueStatus(nextTask.dueDate, nextTask.status);
                    if (dueStatus && dueStatus !== 'normal') {
                      return (
                        <Badge className={`text-xs ${getDueStatusColor(dueStatus)}`}>
                          {dueStatus === 'overdue' 
                            ? `期限切れ (${Math.abs(daysUntilDue)}日前)`
                            : `あと${daysUntilDue}日`
                          }
                        </Badge>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>更新: {formatDate(applicant.updatedAt)}</span>
          </div>
          
          <Link to={`/applicants/${applicant.id}`}>
            <Button size="sm">詳細を見る</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}