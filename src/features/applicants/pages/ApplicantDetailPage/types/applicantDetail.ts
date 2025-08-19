import { Applicant, SelectionHistory, EvaluationForm } from '@/features/applicants/types/applicant';
import { PDFDocument } from '../hooks/usePDFStorage';

export interface ApplicantDetailPageProps {
  applicant: Applicant;
  history: SelectionHistory[];
  stageDetails: Record<string, unknown>;
}

export interface EvaluationFormData {
  evaluator: string;
  overallRating: string;
  motivation: {
    companyMotivation: string;
    industryMotivation: string;
    jobMotivation: string;
  };
  experience: {
    pastExperience: string;
    focusedActivity: string;
    learnedFromActivities: string;
  };
  selfUnderstanding: {
    strengthsWeaknesses: string;
    othersOpinion: string;
  };
  problemSolving: {
    failureExperience: string;
    difficultSituation: string;
  };
  futureVision: {
    careerVision: string;
    futurePosition: string;
  };
  reverseQuestion: {
    questions: string;
  };
}

export interface PDFFormData {
  category: string;
  file: File | null;
}

export interface EvaluationTabProps {
  evaluationForms: EvaluationForm[];
  formData: EvaluationFormData;
  showEvaluationForm: boolean;
  isEditing: boolean;
  editingFormId: string | null;
  viewingFormId: string | null;
  onShowEvaluationForm: (show: boolean) => void;
  onFormDataChange: (section: string, field: string, value: string) => void;
  onSaveEvaluation: () => void;
  onEditForm: (form: EvaluationForm) => void;
  onViewForm: (formId: string) => void;
  onDeleteForm: (formId: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export interface PDFStorageTabProps {
  pdfFormData: PDFFormData;
  showPdfForm: boolean;
  onShowPdfForm: (show: boolean) => void;
  onPdfFormDataChange: (field: string, value: string | File | null) => void;
  onSavePdf: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EmailHistoryTabProps {
  // メール履歴機能は開発中のため、将来的に拡張予定
}

export interface ApplicantDetailTabsProps {
  applicant: Applicant;
  history: SelectionHistory[];
  stageDetails: Record<string, unknown>;
  activeTab: string;
  onTabChange: (value: string) => void;
  refresh?: () => void;
  // 評定表関連
  evaluationForms: EvaluationForm[];
  formData: EvaluationFormData;
  showEvaluationForm: boolean;
  isEditing: boolean;
  editingFormId: string | null;
  viewingFormId: string | null;
  onShowEvaluationForm: (show: boolean) => void;
  onFormDataChange: (section: string, field: string, value: string) => void;
  onSaveEvaluation: () => void;
  onEditForm: (form: EvaluationForm) => void;
  onViewForm: (formId: string) => void;
  onDeleteForm: (formId: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  // PDF管理関連
  pdfFormData: PDFFormData;
  showPdfForm: boolean;
  onShowPdfForm: (show: boolean) => void;
  onPdfFormDataChange: (field: string, value: string | File | null) => void;
  onSavePdf: () => void;
  pdfDocuments: PDFDocument[];
  loading: boolean;
  onDeletePdf: (documentId: string, filePath: string) => void;
}
