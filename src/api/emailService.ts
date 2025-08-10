import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// レスポンスの型定義
interface SessionResponse {
  sessionId: string;
  sessionName?: string;
  sessionDate?: string;
  sessionTime?: string;
  sessionVenue?: string;
  status: 'participate' | 'not_participate' | 'pending';
}

// メール送信データの型定義
interface EmailData {
  applicantId: string;
  eventId: string;
  applicantName: string;
  eventName: string;
  eventStage: string;
  responses: SessionResponse[];
}

// メール送信設定
const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmailを使用
  auth: {
    user: 'ishome.kai@gmail.com', // 送信元メールアドレス
    pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Gmailのアプリパスワード
  }
});

// ログディレクトリの作成
const logDir = path.join(process.cwd(), 'public', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// ログファイルのパス
const logFile = path.join(logDir, 'form_response_log.txt');

// メール本文を作成する関数
function createEmailBody(applicantName: string, eventName: string, eventStage: string, responses: SessionResponse[]) {
  let body = '採用担当者 各位\n\n';
  body += '日程調整フォームへの回答がありました。\n\n';
  body += '【応募者情報】\n';
  body += `氏名: ${applicantName}\n`;
  body += `イベント: ${eventName}\n`;
  body += `選考段階: ${eventStage}\n\n`;
  body += '【回答内容】\n';
  
  responses.forEach((response) => {
    const sessionName = response.sessionName || '不明なセッション';
    const sessionDate = response.sessionDate || '';
    const sessionTime = response.sessionTime || '';
    const sessionVenue = response.sessionVenue || '';
    
    let status = '';
    switch (response.status) {
      case 'participate':
        status = '参加';
        break;
      case 'not_participate':
        status = '不参加';
        break;
      case 'pending':
        status = '保留';
        break;
      default:
        status = '未回答';
    }
    
    body += `・${sessionName}\n`;
    body += `  日時: ${sessionDate} ${sessionTime}\n`;
    body += `  会場: ${sessionVenue}\n`;
    body += `  回答: ${status}\n\n`;
  });
  
  body += `回答日時: ${new Date().toLocaleString('ja-JP')}\n`;
  body += '---\n';
  body += 'このメールは採用管理システムから自動送信されています。\n';
  
  return body;
}

// ログを記録する関数
function logEmailResponse(data: EmailData) {
  const logData = {
    timestamp: new Date().toISOString(),
    applicantId: data.applicantId,
    eventId: data.eventId,
    applicantName: data.applicantName,
    eventName: data.eventName,
    status: 'sent'
  };
  
  const logEntry = JSON.stringify(logData) + '\n';
  fs.appendFileSync(logFile, logEntry);
}

// メール送信のメイン関数
export async function sendFormResponseEmail(data: EmailData) {
  try {
    const { applicantName, eventName, eventStage, responses } = data;
    
    // メール送信先
    const to = 'ishome.kai@gmail.com'; // 実際の担当者メールアドレスに変更
    
    // メール件名
    const subject = `【日程調整回答】${applicantName}様 - ${eventName}`;
    
    // メール本文
    const body = createEmailBody(applicantName, eventName, eventStage, responses);
    
    // メール送信オプション
    const mailOptions = {
      from: 'ishome.kai@gmail.com',
      to: to,
      subject: subject,
      text: body
    };
    
    // メール送信
    const info = await transporter.sendMail(mailOptions);
    
    // ログを記録
    logEmailResponse(data);
    
    return {
      success: true,
      message: 'フォーム回答が正常に送信されました',
      timestamp: new Date().toISOString(),
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('メール送信エラー:', error);
    
    return {
      success: false,
      error: 'メール送信に失敗しました',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// テスト用の関数
export async function testEmailService() {
  const testData: EmailData = {
    applicantId: 'test-001',
    eventId: 'event-001',
    applicantName: 'テスト太郎',
    eventName: '人事面接',
    eventStage: '人事面接',
    responses: [
      {
        sessionId: 'session-1',
        sessionName: '午前の部',
        sessionDate: '2024/01/20',
        sessionTime: '09:00-10:00',
        sessionVenue: '会議室A',
        status: 'participate'
      },
      {
        sessionId: 'session-2',
        sessionName: '午後の部',
        sessionDate: '2024/01/20',
        sessionTime: '14:00-15:00',
        sessionVenue: '会議室B',
        status: 'not_participate'
      }
    ]
  };
  
  return await sendFormResponseEmail(testData);
} 