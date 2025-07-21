import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { generateId } from '@/shared/utils/date';
import { toast } from '@/hooks/use-toast';
import { Task, EmailTemplate, EmailLog } from '../types/task';

// モックデータ
const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'entry-confirmation-template',
    name: 'エントリー受付確認',
    subject: '【{{companyName}}】ご応募ありがとうございます',
    body: `{{applicantName}}様

この度は弊社にご応募いただき、誠にありがとうございます。
{{companyName}}採用担当の{{senderName}}です。

エントリーシートを確認させていただき、
書類選考の結果を1週間以内にご連絡いたします。

ご不明な点がございましたら、お気軽にお問い合わせください。

{{companyName}}
{{senderName}}
{{contactInfo}}`,
    stage: 'エントリー',
    isDefault: true,
    variables: ['applicantName', 'companyName', 'senderName', 'contactInfo'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'company-info-session-template',
    name: '会社説明会参加確認',
    subject: '【{{companyName}}】会社説明会のご案内',
    body: `{{applicantName}}様

いつもお世話になっております。
{{companyName}}採用担当の{{senderName}}です。

この度は弊社にご応募いただき、誠にありがとうございます。

下記の通り会社説明会を開催いたします。
ぜひご参加ください。

■日時：{{eventDate}}
■会場：{{venue}}
■持参物：筆記用具

ご不明な点がございましたら、お気軽にお問い合わせください。

{{companyName}}
{{senderName}}
{{contactInfo}}`,
    stage: '会社説明会',
    isDefault: true,
    variables: ['applicantName', 'companyName', 'senderName', 'eventDate', 'venue', 'contactInfo'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'interview-schedule-template',
    name: '面接日程調整',
    subject: '【{{companyName}}】面接日程のご相談',
    body: `{{applicantName}}様

お疲れ様です。
{{companyName}}採用担当の{{senderName}}です。

書類選考の結果、面接にお進みいただくことになりました。
おめでとうございます。

つきましては、面接の日程調整をさせていただきたく、
下記候補日の中からご都合の良い日時をお知らせください。

{{interviewDates}}

面接時間は約{{duration}}分を予定しております。

ご返信をお待ちしております。

{{companyName}}
{{senderName}}
{{contactInfo}}`,
    stage: '人事面接',
    isDefault: true,
    variables: ['applicantName', 'companyName', 'senderName', 'interviewDates', 'duration', 'contactInfo'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'followup-after-session-template',
    name: '説明会後フォローアップ',
    subject: '【{{companyName}}】説明会ご参加ありがとうございました',
    body: `{{applicantName}}様

本日は貴重なお時間をいただき、
弊社説明会にご参加いただき誠にありがとうございました。
{{companyName}}採用担当の{{senderName}}です。

弊社についてご理解を深めていただけましたでしょうか。

次のステップとして、適性検査のご案内をさせていただきます。
詳細につきましては、来週中にご連絡いたします。

ご質問等ございましたら、お気軽にお問い合わせください。

{{companyName}}
{{senderName}}
{{contactInfo}}`,
    stage: '会社説明会',
    isDefault: false,
    variables: ['applicantName', 'companyName', 'senderName', 'contactInfo'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'reminder-before-session-template',
    name: '説明会前日リマインダー',
    subject: '【{{companyName}}】明日の説明会について（リマインダー）',
    body: `{{applicantName}}様

いつもお世話になっております。
{{companyName}}採用担当の{{senderName}}です。

明日開催予定の会社説明会についてリマインダーをお送りします。

■日時：{{eventDate}}
■会場：{{venue}}
■持参物：筆記用具、学生証

会場へのアクセス方法や当日の流れについて
ご不明な点がございましたら、お気軽にお問い合わせください。

明日お会いできることを楽しみにしております。

{{companyName}}
{{senderName}}
{{contactInfo}}`,
    stage: '会社説明会',
    isDefault: false,
    variables: ['applicantName', 'companyName', 'senderName', 'eventDate', 'venue', 'contactInfo'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [emailTemplates, setEmailTemplates] = useLocalStorage<EmailTemplate[]>('emailTemplates', mockEmailTemplates);
  const [emailLogs, setEmailLogs] = useLocalStorage<EmailLog[]>('emailLogs', []);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(current => [...current, newTask]);
    
    toast({
      title: "タスクを追加しました",
      description: `${task.title}が正常に追加されました。`,
    });
    
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(current =>
      current.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
    
    toast({
      title: "タスクを更新しました",
      description: "タスクが正常に更新されました。",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(current => current.filter(task => task.id !== id));
  };

  const getTasksBySelectionHistory = (selectionHistoryId: string) => {
    return tasks.filter(task => task.selectionHistoryId === selectionHistoryId);
  };

  const getEmailTemplatesByStage = (stage: string) => {
    return emailTemplates.filter(template => template.stage === stage);
  };

  const sendEmail = async (emailData: {
    taskId: string;
    applicantId: string;
    templateId?: string;
    subject: string;
    body: string;
    sentBy: string;
  }) => {
    try {
      const response = await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('メール送信に失敗しました');
      }

      const result = await response.json();
      
      if (result.success) {
        // メール送信ログを記録
        const emailLog: EmailLog = {
          id: generateId(),
          taskId: emailData.taskId,
          applicantId: emailData.applicantId,
          templateId: emailData.templateId,
          subject: emailData.subject,
          body: emailData.body,
          sentAt: new Date().toISOString(),
          sentBy: emailData.sentBy,
          status: 'sent',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setEmailLogs(current => [...current, emailLog]);
        
        // タスクを完了に更新
        updateTask(emailData.taskId, {
          status: '完了',
          completedAt: new Date()
        });
        
        toast({
          title: "メールを送信しました",
          description: "メールが正常に送信されました。",
        });
        
        return result;
      } else {
        throw new Error(result.message || 'メール送信に失敗しました');
      }
    } catch (error) {
      console.error('メール送信エラー:', error);
      
      // エラーログを記録
      const errorLog: EmailLog = {
        id: generateId(),
        taskId: emailData.taskId,
        applicantId: emailData.applicantId,
        templateId: emailData.templateId,
        subject: emailData.subject,
        body: emailData.body,
        sentAt: new Date().toISOString(),
        sentBy: emailData.sentBy,
        status: 'failed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setEmailLogs(current => [...current, errorLog]);
      
      toast({
        title: "メール送信エラー",
        description: error instanceof Error ? error.message : "メール送信に失敗しました",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const addEmailTemplate = (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEmailTemplates(current => [...current, newTemplate]);
    
    toast({
      title: "メールテンプレートを追加しました",
      description: `${template.name}が正常に追加されました。`,
    });
    
    return newTemplate;
  };

  const updateEmailTemplate = (id: string, updates: Partial<EmailTemplate>) => {
    setEmailTemplates(current =>
      current.map(template =>
        template.id === id
          ? { ...template, ...updates, updatedAt: new Date() }
          : template
      )
    );
    
    toast({
      title: "メールテンプレートを更新しました",
      description: "メールテンプレートが正常に更新されました。",
    });
  };

  const deleteEmailTemplate = (id: string) => {
    setEmailTemplates(current => current.filter(template => template.id !== id));
  };

  return {
    tasks,
    emailTemplates,
    emailLogs,
    addTask,
    updateTask,
    deleteTask,
    getTasksBySelectionHistory,
    getEmailTemplatesByStage,
    sendEmail,
    addEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
  };
}