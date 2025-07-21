import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Plus, FileText } from 'lucide-react';
import { SelectionHistory, Evaluation } from '@/features/applicants/types/applicant';
import { Applicant } from '@/features/applicants/types/applicant';
import { formatDateTime } from '@/shared/utils/date';
import { Link } from 'react-router-dom';
import { EvaluationCard } from '@/features/evaluations/components/EvaluationCard';
import { StageDisplayFactory } from './StageDisplayFactory';

interface SelectionStageAccordionProps {
  applicant: Applicant;
  history: SelectionHistory[];
  evaluations: Evaluation[];
  stageDetails?: Record<string, Record<string, unknown>>;
}

export function SelectionStageAccordion({ 
  applicant, 
  history, 
  evaluations,
  stageDetails = {}
}: SelectionStageAccordionProps) {
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

  const getStageEvaluations = (historyId: string) => {
    return evaluations.filter(e => e.selectionHistoryId === historyId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>選考履歴</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            次の段階に進める
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-gray-600 text-center py-8">選考履歴がありません。</p>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {history.map((item) => {
              const stageEvaluations = getStageEvaluations(item.id);
              const currentStageData = stageDetails[item.id];
              
              return (
                <AccordionItem key={item.id} value={item.id} className="border rounded-lg">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div className="text-left">
                          <h3 className="font-medium">{item.stage}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(item.startDate)}
                            {item.endDate && ` 〜 ${formatDateTime(item.endDate)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          item.status === '完了' ? 'default' :
                          item.status === '進行中' ? 'secondary' : 'destructive'
                        }>
                          {item.status}
                        </Badge>
                        {stageEvaluations.length > 0 && (
                          <Badge variant="outline">
                            評価 {stageEvaluations.length}件
                          </Badge>
                        )}
                        {currentStageData && Object.keys(currentStageData).length > 0 && (
                          <Badge variant="outline" className="text-green-600">
                            データ入力済み
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-6">
                      {/* 1. 段階詳細情報 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">段階詳細情報</h4>
                        
                        {/* 選考段階固有の表示 */}
                        <StageDisplayFactory 
                          stageType={item.stage} as SelectionStage
                          data={currentStageData}
                          applicantId={applicant.id}
                          applicantName={applicant.name}
                          applicantEmail={applicant.email}
                        />
                      </div>

                      {/* 2. 評定表 */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium">評定表 ({stageEvaluations.length}件)</h4>
                          <Link to={`/applicants/${applicant.id}/evaluation?historyId=${item.id}`}>
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              評定表作成
                            </Button>
                          </Link>
                        </div>
                        
                        {stageEvaluations.length > 0 ? (
                          <div className="space-y-2">
                            {stageEvaluations.map((evaluation) => (
                              <EvaluationCard 
                                key={evaluation.id}
                                evaluation={evaluation}
                                applicantId={applicant.id}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">評定表がありません</p>
                        )}
                      </div>

                      {/* 3. 備考 */}
                      {item.notes && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">備考</h4>
                          <p className="text-sm text-gray-600">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}