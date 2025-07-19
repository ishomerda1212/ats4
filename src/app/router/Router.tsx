import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/shared/components/layout/Layout';
import { ApplicantListPage } from '@/features/applicants/pages/ApplicantListPage';
import { ApplicantDetailPage } from '@/features/applicants/pages/ApplicantDetailPage';
import { ApplicantCreatePage } from '@/features/applicants/pages/ApplicantCreatePage';
import { ApplicantEditPage } from '@/features/applicants/pages/ApplicantEditPage';
import { EvaluationPage } from '@/features/evaluations/pages/EvaluationPage';
import { EvaluationViewPage } from '@/features/evaluations/pages/EvaluationViewPage';
import { EventListPage } from '@/features/events/pages/EventListPage';
import { EventDetailPage } from '@/features/events/pages/EventDetailPage';
import { EventCreatePage } from '@/features/events/pages/EventCreatePage';
import { EventEditPage } from '@/features/events/pages/EventEditPage';
import { EventRegistrationPage } from '@/features/events/pages/EventRegistrationPage';
import { EventSessionParticipantsPage } from '@/features/events/pages/EventSessionParticipantsPage';
import { StageManagementPage } from '@/features/selection-stages/pages/StageManagementPage';
import { EmailTemplateManagementPage } from '@/features/tasks/pages/EmailTemplateManagementPage';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/applicants" replace />} />
          <Route path="applicants" element={<ApplicantListPage />} />
          <Route path="applicants/create" element={<ApplicantCreatePage />} />
          <Route path="applicants/:id" element={<ApplicantDetailPage />} />
          <Route path="applicants/:id/edit" element={<ApplicantEditPage />} />
          <Route path="applicants/:id/evaluation" element={<EvaluationPage />} />
          <Route path="applicants/:id/evaluation/view" element={<EvaluationViewPage />} />
          <Route path="events" element={<EventListPage />} />
          <Route path="events/create" element={<EventCreatePage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="events/:id/edit" element={<EventEditPage />} />
          <Route path="reports" element={<div>レポート（実装予定）</div>} />
          <Route path="events/:eventId/sessions/:sessionId/participants" element={<EventSessionParticipantsPage />} />
          <Route path="stages" element={<StageManagementPage />} />
          <Route path="email-templates" element={<EmailTemplateManagementPage />} />
        </Route>
        <Route path="register/:applicantId" element={<EventRegistrationPage />} />
      </Routes>
    </BrowserRouter>
  );
}