import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Mail, User, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface EmailSenderProps {
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  stage?: string;
  onEmailSent?: () => void;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 'detailed-contact',
    name: '詳細連絡',
    subject: '【{company_name}】選考詳細について',
    body: `{applicant_name} 様

{company_name}の採用担当者です。

{stage}の詳細についてご連絡いたします。

【日時】
{date_time}

【場所】
{location}

【持ち物】
{bring_items}

【注意事項】
{notes}

ご不明な点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。

{company_name}
採用担当者
{contact_info}`,
    variables: ['company_name', 'applicant_name', 'stage', 'date_time', 'location', 'bring_items', 'notes', 'contact_info']
  },
  {
    id: 'result-notification',
    name: '結果連絡',
    subject: '【{company_name}】選考結果について',
    body: `{applicant_name} 様

{company_name}の採用担当者です。

{stage}の結果についてご連絡いたします。

【結果】
{result}

【コメント】
{comments}

【次のステップ】
{next_steps}

ご不明な点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。

{company_name}
採用担当者
{contact_info}`,
    variables: ['company_name', 'applicant_name', 'stage', 'result', 'comments', 'next_steps', 'contact_info']
  },
  {
    id: 'document-collection',
    name: '提出書類回収',
    subject: '【{company_name}】提出書類について',
    body: `{applicant_name} 様

{company_name}の採用担当者です。

提出書類についてご連絡いたします。

【必要な書類】
{required_documents}

【提出期限】
{deadline}

【提出方法】
{submission_method}

【注意事項】
{notes}

ご不明な点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。

{company_name}
採用担当者
{contact_info}`,
    variables: ['company_name', 'applicant_name', 'required_documents', 'deadline', 'submission_method', 'notes', 'contact_info']
  }
];

export function EmailSender({ applicantId, applicantName, applicantEmail, stage, onEmailSent }: EmailSenderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [emailData, setEmailData] = useState({
    to: applicantEmail || '',
    subject: '',
    body: '',
    variables: {} as Record<string, string>
  });
  const [isSending, setIsSending] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setEmailData(prev => ({
        ...prev,
        subject: template.subject,
        body: template.body,
        variables: {
          company_name: '株式会社サンプル',
          applicant_name: applicantName || '',
          stage: stage || '',
          date_time: '',
          location: '',
          bring_items: '',
          notes: '',
          contact_info: 'TEL: 03-1234-5678\nEmail: recruit@sample.co.jp',
          result: '',
          comments: '',
          next_steps: '',
          required_documents: '',
          deadline: '',
          submission_method: ''
        }
      }));
    }
  };

  const handleVariableChange = (variable: string, value: string) => {
    setEmailData(prev => ({
      ...prev,
      variables: {
        ...prev.variables,
        [variable]: value
      }
    }));
  };

  const replaceVariables = (text: string, variables: Record<string, string>) => {
    let result = text;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
  };

  const handleSendEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.body) {
      toast.error('必須項目を入力してください');
      return;
    }

    setIsSending(true);
    try {
      // 変数を置換
      const finalSubject = replaceVariables(emailData.subject, emailData.variables);
      const finalBody = replaceVariables(emailData.body, emailData.variables);

      // PHP APIに送信
      const response = await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: finalSubject,
          body: finalBody,
          applicantId,
          stage
        })
      });

      if (response.ok) {
        toast.success('メールを送信しました');
        onEmailSent?.();
        // フォームをリセット
        setEmailData({
          to: applicantEmail || '',
          subject: '',
          body: '',
          variables: {}
        });
        setSelectedTemplate('');
      } else {
        const error = await response.text();
        toast.error(`メール送信に失敗しました: ${error}`);
      }
    } catch (error) {
      toast.error('メール送信に失敗しました');
      console.error('Email send error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const selectedTemplateData = emailTemplates.find(t => t.id === selectedTemplate);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          メール送信
        </CardTitle>
        <CardDescription>
          応募者にメールを送信します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* テンプレート選択 */}
        <div className="space-y-2">
          <Label>メールテンプレート</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="テンプレートを選択してください" />
            </SelectTrigger>
            <SelectContent>
              {emailTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTemplate && (
          <>
            {/* 送信先 */}
            <div className="space-y-2">
              <Label>送信先</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="メールアドレス"
                />
              </div>
            </div>

            {/* 変数入力 */}
            <div className="space-y-4">
              <Label>テンプレート変数</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTemplateData?.variables.map(variable => (
                  <div key={variable} className="space-y-2">
                    <Label className="text-sm">{variable}</Label>
                    <Input
                      value={emailData.variables[variable] || ''}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                      placeholder={variable}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* プレビュー/編集切り替え */}
            <div className="flex gap-2">
              <Button
                variant={isPreviewMode ? "outline" : "default"}
                onClick={() => setIsPreviewMode(false)}
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                編集
              </Button>
              <Button
                variant={isPreviewMode ? "default" : "outline"}
                onClick={() => setIsPreviewMode(true)}
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                プレビュー
              </Button>
            </div>

            {/* 件名と本文 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>件名</Label>
                <Input
                  value={isPreviewMode ? replaceVariables(emailData.subject, emailData.variables) : emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="件名"
                  readOnly={isPreviewMode}
                />
              </div>

              <div className="space-y-2">
                <Label>本文</Label>
                <Textarea
                  value={isPreviewMode ? replaceVariables(emailData.body, emailData.variables) : emailData.body}
                  onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="本文"
                  rows={15}
                  readOnly={isPreviewMode}
                />
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSendEmail}
                disabled={isSending || !emailData.to || !emailData.subject || !emailData.body}
                className="min-w-[120px]"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    送信中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    送信
                  </>
                )}
              </Button>
            </div>

            {/* 送信状況 */}
            {isSending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                メールを送信中...
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 