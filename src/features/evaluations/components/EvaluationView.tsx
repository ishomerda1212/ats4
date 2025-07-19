import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Evaluation } from '../types/evaluation';
import { EVALUATION_FIELDS } from '../types/evaluation';
import { formatDateTime } from '@/shared/utils/date';

interface EvaluationViewProps {
  evaluation: Evaluation;
  applicantId: string;
  onEdit?: (evaluation: Evaluation) => void;
  onDelete?: (evaluation: Evaluation) => void;
}

export function EvaluationView({ evaluation, applicantId, onEdit, onDelete }: EvaluationViewProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>評定表詳細</CardTitle>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(evaluation)}>
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={() => onDelete(evaluation)}>
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </Button>
            )}
            <Link to={`/applicants/${applicantId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 評価者情報 */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{evaluation.evaluatorName}</p>
              <p className="text-sm text-muted-foreground">評価者</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="text-right">
              <p className="text-sm font-medium">{formatDateTime(evaluation.createdAt)}</p>
              <p className="text-xs text-muted-foreground">評価日時</p>
            </div>
          </div>
        </div>

        {/* 評価項目 */}
        <div className="space-y-6">
          {EVALUATION_FIELDS.map((fieldConfig) => {
            const value = evaluation[fieldConfig.key as keyof Evaluation] as string;
            return (
              <div key={fieldConfig.key} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {fieldConfig.label}
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {value || '記載なし'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 更新情報 */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>作成日: {formatDateTime(evaluation.createdAt)}</span>
            <span>最終更新: {formatDateTime(evaluation.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}