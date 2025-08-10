import { useParams } from 'react-router-dom';
import { useApplicantDetail } from '@/features/applicants/hooks/useApplicantDetail';
import { EvaluationForm } from '../components/EvaluationForm';
import { ApplicantInfoPanel } from '../components/ApplicantInfoPanel';

export function EvaluationPage() {
  const { id } = useParams<{ id: string }>();
  
  console.log('EvaluationPage - URL params:', { id });
  
  const { applicant, history, loading } = useApplicantDetail(id!);

  console.log('EvaluationPage - Data:', { applicant, history });

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
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-shrink-0 p-4 border-b">
        <h1 className="text-2xl font-bold">評定表入力</h1>
        <p className="text-muted-foreground mt-1">
          {applicant.name}さんの評定表
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-0">
        <div className="overflow-y-auto">
          <ApplicantInfoPanel 
            applicant={applicant} 
            history={history}
          />
        </div>
        
        <div className="overflow-y-auto">
          <EvaluationForm 
            applicantId={applicant.id}
          />
        </div>
      </div>
    </div>
  );
}