import { useParams, useSearchParams } from 'react-router-dom';
import { useApplicantDetail } from '@/features/applicants/hooks/useApplicantDetail';
import { useEvaluations } from '../hooks/useEvaluations';
import { EvaluationView } from '../components/EvaluationView';
import { ApplicantInfoPanel } from '../components/ApplicantInfoPanel';

export function EvaluationViewPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const evaluationId = searchParams.get('evaluationId');
  
  const { applicant, history, loading } = useApplicantDetail(id!);
  const { evaluations } = useEvaluations(id);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!applicant || !evaluationId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">応募者または評定表が見つかりませんでした。</p>
      </div>
    );
  }

  const evaluation = evaluations.find(e => e.id === evaluationId);
  if (!evaluation) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">評定表が見つかりませんでした。</p>
      </div>
    );
  }

  const selectionHistory = history.find(h => h.id === evaluation.selectionHistoryId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">評定表詳細</h1>
        <p className="text-muted-foreground mt-1">
          {applicant.name}さんの{selectionHistory?.stage}評定表
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        <div className="overflow-y-auto">
          <ApplicantInfoPanel 
            applicant={applicant} 
            selectionHistory={selectionHistory}
          />
        </div>
        
        <div className="overflow-y-auto">
          <EvaluationView 
            evaluation={evaluation}
            applicantId={applicant.id}
          />
        </div>
      </div>
    </div>
  );
}