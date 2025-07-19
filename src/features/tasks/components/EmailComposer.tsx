import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Save, X, FileText } from 'lucide-react';
import { EmailTemplate, Task } from '../types/task';
import { Applicant } from '@/features/applicants/types/applicant';
import { useTasks } from '../hooks/useTasks';

interface EmailComposerProps {
  task: Task;
  applicant: Applicant;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EmailComposer({ task, applicant, onCancel, onSuccess }: EmailComposerProps) {
  const { emailTemplates, getEmailTemplatesByStage, sendEmail, loading } = useTasks();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [senderName, setSenderName] = useState('人事部');

  // 選考段階に応じたテンプレートを取得 + タスクに紐づくテンプレート
  const stageTemplates = getEmailTemplatesByStage(applicant.currentStage);
  const taskTemplate = task.emailTemplateId ? 
    emailTemplates.find(t => t.id === task.emailTemplateId) : null;
  
  const availableTemplates = taskTemplate ? 
    [taskTemplate, ...stageTemplates.filter(t => t.id !== taskTemplate.id)] : 
    stageTemplates;

  // タスクに紐づくテンプレートがある場合は初期選択
  useEffect(() => {
    if (taskTemplate && !selectedTemplate) {
      setSelectedTemplate(taskTemplate);
      setSubject(replaceVariables(taskTemplate.subject, variables));
      setBody(replaceVariables(taskTemplate.body, variables));
    }
  }, [taskTemplate]);

  // 変数置換用のデータ
  const variables = {
    applicantName: applicant.name,
    companyName: '株式会社サンプル',
    senderName: senderName,
    contactInfo: 'hr@sample.com\n03-1234-5678',
    eventDate: '2024年3月15日（金）14:00-16:00',
    venue: '本社会議室A',
    interviewDates: '・3月20日（水）10:00-11:00\n・3月21日（木）14:00-15:00\n・3月22日（金）16:00-17:00',
    duration: '60',
  };

  // テンプレート選択時の処理
  const handleTemplateSelect = (templateId: string) => {
    const template = availableTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setSubject(replaceVariables(template.subject, variables));
      setBody(replaceVariables(template.body, variables));
    }
  };

  // 変数を実際の値に置換
  const replaceVariables = (text: string, vars: Record<string, string>) => {
    let result = text;
    Object.entries(vars).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return result;
  };

  // メール送信
  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert('件名と本文を入力してください');
      return;
    }

    try {
      await sendEmail({
        taskId: task.id,
        applicantId: applicant.id,
        templateId: selectedTemplate?.id,
        subject,
        body,
        sentBy: senderName,
      });
      onSuccess();
    } catch (error) {
      // エラーハンドリングはuseTasks内で行われる
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>メール作成: {task.title}</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          宛先: {applicant.name}さん ({applicant.email})
        </div>
        {taskTemplate && (
          <div className="text-sm text-blue-600">
            推奨テンプレート: {taskTemplate.name}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* テンプレート選択 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">テンプレート選択</label>
          <Select onValueChange={handleTemplateSelect}>
            <SelectTrigger>
              <SelectValue placeholder={taskTemplate ? `${taskTemplate.name}（推奨）` : "テンプレートを選択（任意）"} />
            </SelectTrigger>
            <SelectContent>
              {availableTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>{template.name}</span>
                    {template.id === taskTemplate?.id && (
                      <Badge variant="default" className="text-xs ml-2">推奨</Badge>
                    )}
                    {template.isDefault && (
                      <Badge variant="secondary" className="text-xs">デフォルト</Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 送信者名 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">送信者名</label>
          <Input
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="送信者名"
          />
        </div>

        {/* 件名 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">件名 *</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="メールの件名"
          />
        </div>

        {/* 本文 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">本文 *</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="メールの本文"
            className="min-h-[300px] resize-none"
          />
        </div>

        {/* 使用可能な変数の表示 */}
        {selectedTemplate && (
          <div className="space-y-2">
            <label className="text-sm font-medium">使用可能な変数</label>
            <div className="flex flex-wrap gap-1">
              {selectedTemplate.variables.map((variable) => (
                <Badge key={variable} variant="outline" className="text-xs">
                  {`{{${variable}}}`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={loading || !subject.trim() || !body.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? '送信中...' : 'メール送信'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}