
import { StageEntryDisplay, EntryStageData } from './StageEntryDisplay';
import { StageDocumentScreeningDisplay, DocumentScreeningStageData } from './StageDocumentScreeningDisplay';
import { StageCompanyInfoDisplay, CompanyInfoStageData } from './StageCompanyInfoDisplay';
import { StageAptitudeTestDisplay, AptitudeTestStageData } from './StageAptitudeTestDisplay';
import { StageWorkplaceVisitDisplay, WorkplaceVisitStageData } from './StageWorkplaceVisitDisplay';
import { StageJobExperienceDisplay, JobExperienceStageData } from './StageJobExperienceDisplay';
import { StageIndividualInterviewDisplay, IndividualInterviewStageData } from './StageIndividualInterviewDisplay';
import { StageInterviewDisplay } from './StageInterviewDisplay';
import { StageFinalSelectionDisplay, FinalSelectionStageData } from './StageFinalSelectionDisplay';
import { StageCEOSeminarDisplay, CEOSeminarStageData } from './StageCEOSeminarDisplay';

// 選考段階の型定義
export type StageType = 
  | 'エントリー'
  | '書類選考'
  | '会社説明会'
  | '適性検査'
  | '職場見学'
  | '仕事体験'
  | '個別面接'
  | '集団面接'
  | 'CEOセミナー'
  | '人事面接'
  | '最終選考'
  | '内定'
  | '不採用';

interface StageDisplayFactoryProps {
  stageType: StageType;
  data?: Record<string, unknown>;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
}

export function StageDisplayFactory({ stageType, data, applicantId, applicantName, applicantEmail }: StageDisplayFactoryProps) {
  switch (stageType) {
    case 'エントリー':
      return <StageEntryDisplay data={data as EntryStageData} applicantId={applicantId} applicantName={applicantName} applicantEmail={applicantEmail} />;
    case '書類選考':
      return <StageDocumentScreeningDisplay data={data as DocumentScreeningStageData} />;
    case '会社説明会':
      return <StageCompanyInfoDisplay data={data as CompanyInfoStageData} />;
    case '適性検査':
      return <StageAptitudeTestDisplay data={data as AptitudeTestStageData} applicantId={applicantId} applicantName={applicantName} applicantEmail={applicantEmail} />;
    case '職場見学':
      return <StageWorkplaceVisitDisplay data={data as WorkplaceVisitStageData} applicantId={applicantId} applicantName={applicantName} applicantEmail={applicantEmail} />;
    case '仕事体験':
      return <StageJobExperienceDisplay data={data as JobExperienceStageData} />;
    case '個別面接':
      return <StageIndividualInterviewDisplay data={data as IndividualInterviewStageData} applicantId={applicantId} applicantName={applicantName} applicantEmail={applicantEmail} />;
    case '集団面接':
      return <StageInterviewDisplay stageType="グループ面接" data={data as Record<string, unknown>} />;
    case '人事面接':
      return <StageInterviewDisplay stageType={stageType} data={data as Record<string, unknown>} />;
    case '最終選考':
      return <StageFinalSelectionDisplay data={data as FinalSelectionStageData} />;
    case 'CEOセミナー':
      return <StageCEOSeminarDisplay data={data as CEOSeminarStageData} />;
    case '内定':
    case '不採用':
      return <div className="text-center py-4 text-muted-foreground">
        {stageType}段階の詳細表示は実装予定です
      </div>;
    default:
      return <div className="text-center py-4 text-muted-foreground">
        未対応の選考段階です: {stageType}
      </div>;
  }
} 