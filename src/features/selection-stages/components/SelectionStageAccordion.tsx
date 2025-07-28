import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Plus } from 'lucide-react';
import { SelectionHistory, Evaluation } from '@/features/applicants/types/applicant';
import { Applicant } from '@/features/applicants/types/applicant';
import { formatDateTime } from '@/shared/utils/date';
import { StageDisplayFactory } from './StageDisplayFactory';

export type StageType = 
  | 'エントリー'
  | '書類選考'
  | '会社説明会'
  | '適性検査'
  | '職場見学'
  | '職務体験'
  | '個別面接'
  | '集団面接'
  | '最終選考'
  | '内定'
  | '不採用';

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
              const currentStageData = stageDetails[item.id];
              
              return (
                <AccordionItem 
                  key={item.id} 
                  value={item.id} 
                  className={`border rounded-lg ${
                    item.status === '進行中' 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800' 
                      : item.status === '完了'
                      ? 'bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-700'
                      : item.status === '不採用'
                      ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
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
                        <Badge className="bg-gray-100 text-gray-800">
                          {item.status}
                        </Badge>

                        {currentStageData && Object.keys(currentStageData).length > 0 && (
                          <Badge className="bg-gray-100 text-green-600">
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
                          stageType={item.stage as StageType}
                          data={currentStageData}
                          applicantId={applicant.id}
                          applicantName={applicant.name}
                          applicantEmail={applicant.email}
                        />
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