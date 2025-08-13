import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/shared/components/layout/Layout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ApplicantListPage } from '@/features/applicants/pages/ApplicantListPage';
import { ApplicantDetailPage } from '@/features/applicants/pages/ApplicantDetailPage';
import { ApplicantCreatePage } from '@/features/applicants/pages/ApplicantCreatePage';
import { ApplicantEditPage } from '@/features/applicants/pages/ApplicantEditPage';
import { EventListPage } from '@/features/events/pages/EventListPage';
import { EventCreatePage } from '@/features/events/pages/EventCreatePage';
import { EventDetailPage } from '@/features/events/pages/EventDetailPage';
import { EventEditPage } from '@/features/events/pages/EventEditPage';
import { EventRegistrationPage } from '@/features/events/pages/EventRegistrationPage';
import { EventSessionDetailPage } from '@/features/events/pages/EventSessionDetailPage';
import { EventSessionParticipantsPage } from '@/features/events/pages/EventSessionParticipantsPage';
import { ApplicantFormPage } from '@/features/applicant-form/pages/ApplicantFormPage';
import { ApplicantResponseViewPage } from '@/features/applicant-form/pages/ApplicantResponseViewPage';
import { TaskListPage } from '@/features/tasks/pages/TaskListPage';
import { EmailTemplateManagementPage } from '@/features/tasks/pages/EmailTemplateManagementPage';
import { ApplicantMailPage } from '@/features/email/pages/ApplicantMailPage';
import { ReportPage } from '@/features/reports/pages/ReportPage/index';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="applicants" element={<ApplicantListPage />} />
          <Route path="applicants/create" element={<ApplicantCreatePage />} />
          <Route path="applicants/:id" element={<ApplicantDetailPage />} />
          <Route path="applicants/:id/edit" element={<ApplicantEditPage />} />
          <Route path="applicants/:id/mail" element={<ApplicantMailPage />} />
          <Route path="events" element={<EventListPage />} />
          <Route path="events/create" element={<EventCreatePage />} />
          <Route path="event/:id" element={<EventDetailPage />} />
          <Route path="event/:id/edit" element={<EventEditPage />} />
          <Route path="event/:id/registration" element={<EventRegistrationPage />} />
          <Route path="event/:id/session/:sessionId" element={<EventSessionDetailPage />} />
          <Route path="event/:id/session/:sessionId/participants" element={<EventSessionParticipantsPage />} />
          <Route path="tasks" element={<TaskListPage />} />
          <Route path="email-templates" element={<EmailTemplateManagementPage />} />
          <Route path="reports" element={<ReportPage />} />
        </Route>
        <Route path="applicant-form/:applicantId/:eventId" element={<ApplicantFormPage />} />
        <Route path="applicant-response/:applicantId/:eventId" element={<ApplicantResponseViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}