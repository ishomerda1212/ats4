import { ApplicantForm } from '../components/ApplicantForm';

export function ApplicantCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">新規応募者登録</h1>
        <p className="text-muted-foreground mt-1">新しい応募者の情報を登録します</p>
      </div>

      <ApplicantForm mode="create" />
    </div>
  );
}