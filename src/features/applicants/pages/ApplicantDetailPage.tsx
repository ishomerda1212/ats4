import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicantBasicInfo } from '../components/ApplicantBasicInfo';
import { SelectionStageAccordion } from '@/features/selection-stages/components/SelectionStageAccordion';
import { useApplicantDetail } from '../hooks/useApplicantDetail';
import { EvaluationSection } from '@/features/evaluations/components/EvaluationSection';
import { PDFStorageSection } from '@/features/pdf/components/PDFExportSection';

export function ApplicantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { applicant, history, evaluations, stageDetails, loading } = useApplicantDetail(id!);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">応募者が見つかりませんでした。</p>
        <Link to="/applicants">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/applicants">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">応募者詳細</h1>
          <p className="text-muted-foreground mt-1">{applicant.name}さんの詳細情報</p>
        </div>
      </div>

      <ApplicantBasicInfo applicant={applicant} />
      
      <SelectionStageAccordion 
        applicant={applicant}
        history={history} 
        evaluations={evaluations}
        stageDetails={stageDetails}
      />

      <EvaluationSection
        applicant={applicant}
        evaluations={evaluations}
        onEvaluationUpdate={() => { /* 必要に応じて更新処理を実装 */ }}
      />

      <PDFStorageSection
        applicant={applicant}
      />
    </div>
  );
}