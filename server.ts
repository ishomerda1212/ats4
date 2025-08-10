import express from 'express';
import cors from 'cors';
import { sendFormResponseEmail, testEmailService } from './src/api/emailService';

const app = express();
const PORT = 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// フォーム回答送信API
app.post('/api/submit-form-response', async (req, res) => {
  try {
    const { applicantId, eventId, applicantName, eventName, eventStage, responses } = req.body;

    // 必須パラメータのチェック
    if (!applicantId || !eventId || !responses) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    // メール送信
    const result = await sendFormResponseEmail({
      applicantId,
      eventId,
      applicantName: applicantName || '不明',
      eventName: eventName || '不明',
      eventStage: eventStage || '不明',
      responses
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// テスト用API
app.post('/api/test-email', async (req, res) => {
  try {
    const result = await testEmailService();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Test API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      timestamp: new Date().toISOString()
    });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Email API server running on http://localhost:${PORT}`);
  console.log(`📧 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Form submission: http://localhost:${PORT}/api/submit-form-response`);
  console.log(`🧪 Test email: http://localhost:${PORT}/api/test-email`);
}); 