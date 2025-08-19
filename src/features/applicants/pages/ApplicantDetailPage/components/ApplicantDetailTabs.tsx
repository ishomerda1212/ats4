import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  FileText, 
  Mail, 
  FileArchive
} from 'lucide-react';
import { SelectionHistoryTab } from './SelectionHistoryTab';
import { EvaluationTab } from './EvaluationTab';
import { PDFStorageTab } from './PDFStorageTab';
import { EmailHistoryTab } from './EmailHistoryTab';
import { Applicant, SelectionHistory, EvaluationForm } from '@/features/applicants/types/applicant';
import { EvaluationFormData, PDFFormData } from '../types/applicantDetail';

interface ApplicantDetailTabsProps {
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
  pdfDocuments: any[]; // Added for PDFStorageTab
  loading: boolean; // Added for PDFStorageTab
  onDeletePdf: (documentId: string, filePath: string) => void; // Added for PDFStorageTab
  onPreviewPdf: (document: any) => void; // Added for PDFStorageTab
  onDownloadPdf: (document: any) => void; // Added for PDFStorageTab
  showPdfPreview: boolean; // Added for PDFStorageTab
  previewPdfUrl: string; // Added for PDFStorageTab
  previewPdfName: string; // Added for PDFStorageTab
  onClosePdfPreview: () => void; // Added for PDFStorageTab
}

export function ApplicantDetailTabs({
  applicant,
  history,
  stageDetails,
  activeTab,
  onTabChange,
  refresh,
  evaluationForms,
  formData,
  showEvaluationForm,
  isEditing,
  editingFormId,
  viewingFormId,
  onShowEvaluationForm,
  onFormDataChange,
  onSaveEvaluation,
  onEditForm,
  onViewForm,
  onDeleteForm,
  onSaveEdit,
  onCancelEdit,
  pdfFormData,
  showPdfForm,
  onShowPdfForm,
  onPdfFormDataChange,
  onSavePdf,
  pdfDocuments, // Added for PDFStorageTab
  loading, // Added for PDFStorageTab
  onDeletePdf, // Added for PDFStorageTab
  onPreviewPdf, // Added for PDFStorageTab
  onDownloadPdf, // Added for PDFStorageTab
  showPdfPreview, // Added for PDFStorageTab
  previewPdfUrl, // Added for PDFStorageTab
  previewPdfName, // Added for PDFStorageTab
  onClosePdfPreview // Added for PDFStorageTab
}: ApplicantDetailTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="selection-history" className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">選考履歴</span>
        </TabsTrigger>
        <TabsTrigger value="evaluations" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">評定表</span>
        </TabsTrigger>
        <TabsTrigger value="pdf-management" className="flex items-center space-x-2">
          <FileArchive className="h-4 w-4" />
          <span className="hidden sm:inline">PDF管理</span>
        </TabsTrigger>
        <TabsTrigger value="email-history" className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">メール履歴</span>
        </TabsTrigger>
      </TabsList>

      {/* 選考履歴タブ */}
      <TabsContent value="selection-history" className="mt-6">
        <SelectionHistoryTab 
          applicant={applicant} 
          history={history}
          stageDetails={stageDetails}
          refresh={refresh}
        />
      </TabsContent>

      {/* 評定表タブ */}
      <TabsContent value="evaluations" className="mt-6">
        <EvaluationTab
          evaluationForms={evaluationForms}
          formData={formData}
          showEvaluationForm={showEvaluationForm}
          isEditing={isEditing}
          editingFormId={editingFormId}
          viewingFormId={viewingFormId}
          onShowEvaluationForm={onShowEvaluationForm}
          onFormDataChange={onFormDataChange}
          onSaveEvaluation={onSaveEvaluation}
          onEditForm={onEditForm}
          onViewForm={onViewForm}
          onDeleteForm={onDeleteForm}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
      </TabsContent>

      {/* PDF管理タブ */}
      <TabsContent value="pdf-management" className="mt-6">
        <PDFStorageTab
          pdfFormData={pdfFormData}
          showPdfForm={showPdfForm}
          onShowPdfForm={onShowPdfForm}
          onPdfFormDataChange={onPdfFormDataChange}
          onSavePdf={onSavePdf}
          pdfDocuments={pdfDocuments}
          loading={loading}
          onDeletePdf={onDeletePdf}
          onPreviewPdf={onPreviewPdf}
          onDownloadPdf={onDownloadPdf}
          showPdfPreview={showPdfPreview}
          previewPdfUrl={previewPdfUrl}
          previewPdfName={previewPdfName}
          onClosePdfPreview={onClosePdfPreview}
        />
      </TabsContent>

      {/* メール履歴タブ */}
      <TabsContent value="email-history" className="mt-6">
        <EmailHistoryTab />
      </TabsContent>
    </Tabs>
  );
}
