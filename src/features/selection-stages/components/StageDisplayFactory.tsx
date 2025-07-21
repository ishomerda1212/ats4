import { StageEntryDisplay } from './StageEntryDisplay';
import { StageCompanyInfoDisplay } from './StageCompanyInfoDisplay';
import { StageAptitudeTestDisplay } from './StageAptitudeTestDisplay';
import { StageInterviewDisplay } from './StageInterviewDisplay';
import { StageCEOSeminarDisplay } from './StageCEOSeminarDisplay';
import { StageWorkplaceVisitDisplay } from './StageWorkplaceVisitDisplay';
import { StageJobExperienceDisplay } from './StageJobExperienceDisplay';
import { StageIndividualInterviewDisplay } from './StageIndividualInterviewDisplay';
import { StageDocumentScreeningDisplay } from './StageDocumentScreeningDisplay';
import { StageGroupInterviewDisplay } from './StageGroupInterviewDisplay';
import { StageFinalSelectionDisplay } from './StageFinalSelectionDisplay';

// 選考段階の型定義
type StageType = 
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
  | '内定';

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
      return <StageEntryDisplay data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case '書類選考':
      return <StageDocumentScreeningDisplay data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case '会社説明会':
      return <StageCompanyInfoDisplay data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case '適性検査':
      return <StageAptitudeTestDisplay data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case '職場見学':
      return <StageWorkplaceVisitDisplay data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case '仕事体験':
      return <StageJobExperienceDisplay data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case '個別面接':
      return <StageIndividualInterviewDisplay data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case '集団面接':
      return <StageGroupInterviewDisplay data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case '人事面接':
      return <StageInterviewDisplay stageType={stageType} data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case '最終選考':
      return <StageFinalSelectionDisplay data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case 'CEOセミナー':
      return <StageCEOSeminarDisplay data={data as any} applicantId={applicantId ?? ''} applicantName={applicantName ?? ''} applicantEmail={applicantEmail ?? ''} />;
    case '内定':
      return (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium text-lg">{stageType}情報</h4>
          <p className="text-sm text-gray-600 mt-1">
            {stageType}の表示コンポーネントは準備中です。
          </p>
          {data && Object.keys(data).length > 0 && (
            <div className="mt-3">
              <h5 className="text-sm font-medium">入力データ:</h5>
              <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      );
    default:
      return (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium text-lg">未対応の選考段階</h4>
          <p className="text-sm text-gray-600 mt-1">
            {stageType}段階の表示コンポーネントが未実装です。
          </p>
        </div>
      );
  }
} 