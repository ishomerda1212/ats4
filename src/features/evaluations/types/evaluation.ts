import { BaseEntity } from '@/shared/types/common';

export interface EvaluationFormData {
  evaluatorName: string;
  motivationReason: string;
  experienceBackground: string;
  selfUnderstanding: string;
  problemSolving: string;
  futureVision: string;
  reverseQuestion: string;
}

export interface Evaluation extends BaseEntity, EvaluationFormData {
  applicantId: string;
  selectionHistoryId: string;
}

export const EVALUATION_FIELDS = [
  { 
    key: 'motivationReason', 
    label: '1. 志望理由系', 
    placeholder: `「なぜ当社を志望しましたか？」
「この業界を選んだ理由は？」
「この職種を選んだ理由は？」

📌 判断基準
- 動機が具体的で一貫しているか
- 会社や業界の理解度
- 他社ではなく自社を選ぶ理由の説得力` 
  },
  { 
    key: 'experienceBackground', 
    label: '2. 経歴・経験系', 
    placeholder: `「これまでどんな経験をしてきましたか？」
「学生時代・前職で一番力を入れたことは？」
「アルバイトや活動で学んだことは？」

📌 判断基準
- 成果や役割の具体性
- 困難に対する行動プロセス
- 自社の業務に活かせるスキルや姿勢` 
  },
  { 
    key: 'selfUnderstanding', 
    label: '3. 自己理解系', 
    placeholder: `「あなたの強みと弱みは？」
「周りからどんな人だと言われますか？」

📌 判断基準
- 自分の特徴を客観的に把握しているか
- 弱みを改善する姿勢があるか
- 強みが仕事で活かせるか` 
  },
  { 
    key: 'problemSolving', 
    label: '4. 課題対応・行動特性系', 
    placeholder: `「失敗した経験は？ どう乗り越えましたか？」
「困難な状況でどう行動しましたか？」

📌 判断基準
- 課題を分析する力
- 解決への主体性
- 再発防止や改善への意識` 
  },
  { 
    key: 'futureVision', 
    label: '5. 将来像系', 
    placeholder: `「将来どんなキャリアを描いていますか？」
「3年後・5年後はどんな立場で働いていたいですか？」

📌 判断基準
- 目標の明確さと現実性
- 自社でのキャリアパスとの一致度` 
  },
  { 
    key: 'reverseQuestion', 
    label: '6. 逆質問', 
    placeholder: `「何か質問はありますか？」

📌 判断基準
- 準備度（事前に調べているか）
- 会社や職務への興味の深さ
- 自分の意思で判断する姿勢` 
  }
] as const;