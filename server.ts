import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// استيراد الإعدادات من ملف config.js
import options from './config.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// التعامل مع الملفات الاستاتيكية والصفحة الرئيسية
if (!IS_PRODUCTION) {
  app.use(express.static('.'));
} else {
  app.get('/', (req, res) => {
    res.status(200).send('ChatKit Server is running correctly on Railway!');
  });
}

// Endpoint لجلب الـ Base URL
app.get('/api/base-url', (_req, res) => {
  res.json({ baseUrl: process.env.BASE_URL || `http://localhost:${PORT}` });
});

// Endpoint لجلب الإعدادات (بدون الـ API keys)
app.get('/api/chatkit/config', async (_req, res) => {
  try {
    if (!options) {
      return res.status(500).json({ error: 'Config file is empty or missing' });
    }
    const { api, ...configWithoutApi } = options as any;
    res.json(configWithoutApi);
  } catch (error) {
    console.error("Config Error:", error);
    res.status(500).json({ error: 'Failed to load config' });
  }
});

// Endpoint لإنشاء الجلسة والربط بـ OpenAI
app.post('/api/chatkit/session', async (req, res) => {
  try {
    const { CHATKIT_WORKFLOW_ID, OPENAI_API_KEY } = process.env;

    if (!OPENAI_API_KEY || !CHATKIT_WORKFLOW_ID) {
      return res.status(500).json({ error: 'Server missing Environment Variables (API Key or Workflow ID)' });
    }

    const userId = req.body?.userId || `user_${Date.now()}`;

    // الربط مع OpenAI SDK
    const session = await openai.beta.chatkit.sessions.create({
      user: userId,
      workflow: { id: CHATKIT_WORKFLOW_ID }
    });

    res.json({
      client_secret: session.client_secret,
      user_id: userId
    });
  } catch (error) {
    console.error("Session Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// التشغيل على 0.0.0.0 لضمان عمله على Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ChatKit server running at http://0.0.0.0:${PORT}`);
});
