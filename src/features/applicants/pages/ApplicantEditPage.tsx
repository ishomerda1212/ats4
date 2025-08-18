import { useParams } from 'react-router-dom';
import { useApplicants } from '../hooks/useApplicants';
import { ApplicantForm } from '../components/ApplicantForm';

export function ApplicantEditPage() {
  const { id } = useParams<{ id: string }>();
  const { applicants, loading, refresh } = useApplicants();

  const applicant = applicants.find(a => a.id === id);

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">応募者情報編集</h1>
        <p className="text-muted-foreground mt-1">{applicant.name}さんの情報を編集します</p>
      </div>

      <ApplicantForm applicant={applicant} mode="edit" onRefresh={refresh} />
    </div>
  );
}