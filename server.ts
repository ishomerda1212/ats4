import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sendFormResponseEmail, testEmailService } from './src/api/emailService';
import pool from './src/database/connection';

// 環境変数の確認
console.log('🔍 Environment variables check:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const PORT = 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// データベース接続テスト
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({
      success: true,
      message: 'Database connection successful',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error.message
    });
  }
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

// データベースAPI

// 応募者一覧取得API
app.get('/api/applicants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applicants ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Database error'
    });
  }
});

// 応募者詳細取得API
app.get('/api/applicants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM applicants WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Applicant not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Database error'
    });
  }
});

// イベント一覧取得API
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Database error'
    });
  }
});

// イベント詳細取得API
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Database error'
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