import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, School, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Applicant } from '../types/applicant';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDate } from '@/shared/utils/date';

interface ApplicantCardProps {
  applicant: Applicant;
}

export function ApplicantCard({ applicant }: ApplicantCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">{applicant.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {applicant.source}
              </Badge>
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