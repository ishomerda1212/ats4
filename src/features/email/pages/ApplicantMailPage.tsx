import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useApplicantDetail } from '@/features/applicants/hooks/useApplicantDetail';
import { ApplicantInfoPanel } from '@/features/applicants/components/ApplicantInfoPanel';
import { EmailSender } from '../components/EmailSender';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function ApplicantMailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const stage = searchParams.get('stage') || '';
  const navigate = useNavigate();

  const { applicant, history, loading } = useApplicantDetail(id!);

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
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>
        <div>
          <h1 className="text-2xl font-bold">メール送信</h1>
          <p className="text-muted-foreground mt-1">{applicant.name}さんへの詳細連絡</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        <div className="overflow-y-auto">
          <ApplicantInfoPanel applicant={applicant} history={history} />
        </div>
        <div className="overflow-y-auto">
          <EmailSender 
            applicantId={applicant.id}
            applicantName={applicant.name}
            applicantEmail={applicant.email}
            stage={stage}
          />
        </div>
      </div>
    </div>
  );
} 