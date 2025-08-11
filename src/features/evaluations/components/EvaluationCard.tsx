import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Evaluation } from '../types/evaluation';
import { formatDateTime } from '@/shared/utils/date';

interface EvaluationCardProps {
  evaluation: Evaluation;
  applicantId?: string;
  onView?: (evaluation: Evaluation) => void;
  onEdit?: (evaluation: Evaluation) => void;
}

export function EvaluationCard({ evaluation, applicantId, onView, onEdit }: EvaluationCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium">{evaluation.evaluatorName}</h4>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(evaluation.createdAt)}
            </p>
          </div>
          <Badge className="bg-gray-100 text-gray-800">評定表</Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div>
            <p className="text-sm font-medium">志望理由</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {evaluation.motivationReason}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {(onView || applicantId) && (
            applicantId ? (
              <Link to={`/applicants/${applicantId}/evaluation/view?evaluationId=${evaluation.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  詳細
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="outline" onClick={() => onView!(evaluation)}>
                <Eye className="h-3 w-3 mr-1" />
                詳細
              </Button>
            )
          )}
          {onEdit && (
            <Button size="sm" variant="outline" onClick={() => onEdit(evaluation)}>
              <Eye className="h-3 w-3 mr-1" />
              編集
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}