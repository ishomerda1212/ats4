import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye } from 'lucide-react';
import { Evaluation } from '../types/evaluation';
import { Applicant } from '@/features/applicants/types/applicant';
import { EvaluationForm } from './EvaluationForm';
import { EvaluationView } from './EvaluationView';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/shared/utils/date';

interface EvaluationSectionProps {
  applicant: Applicant;
  evaluations: Evaluation[];
  onEvaluationUpdate: (evaluations: Evaluation[]) => void;
}

export function EvaluationSection({ applicant, evaluations }: EvaluationSectionProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);





  const openEditDialog = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsViewDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>評定表</CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新規作成
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {evaluations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">評定表がありません</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              最初の評定表を作成
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {evaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-medium">{evaluation.evaluatorName}</h4>
                    <p className="text-sm text-muted-foreground">
                      作成日: {formatDate(evaluation.createdAt)}
                    </p>
                    {evaluation.updatedAt && evaluation.updatedAt !== evaluation.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        更新日: {formatDate(evaluation.updatedAt)}
                      </p>
                    )}
                  </div>
                                     <Badge className="bg-gray-100 text-gray-800">
                     {evaluation.selectionHistoryId ? '選考段階' : '一般'}
                   </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewDialog(evaluation)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(evaluation)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* 新規作成ダイアログ */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>評定表作成</DialogTitle>
          </DialogHeader>
          <EvaluationForm
            applicantId={applicant.id}
            selectionHistoryId=""
          />
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>評定表編集</DialogTitle>
          </DialogHeader>
          {selectedEvaluation && (
            <EvaluationForm
              applicantId={applicant.id}
              selectionHistoryId={selectedEvaluation.selectionHistoryId}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 表示ダイアログ */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>評定表詳細</DialogTitle>
          </DialogHeader>
          {selectedEvaluation && (
            <EvaluationView evaluation={selectedEvaluation} applicantId={applicant.id} />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
} 