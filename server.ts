/**
 * ChatKit Server - Optimized for Railway
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// استيراد الإعدادات مباشرة - تأكد من وجود ملف config.ts في نفس المجلد
// نستخدم .js في الـ import لأن tsx/node بيتعامل معاها كدة في الـ ESM
import { options } from './config.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// التعامل مع الملفات الاستاتيكية
if (!IS_PRODUCTION) {
  app.use(express.static('.'));
} else {
  app.get('/', (req, res) => {
    res.status(200).send('ChatKit Server is running...');
  });
}

// Serve base URL config
app.get('/api/base-url', (_req, res) => {
  res.json({ baseUrl: process.env.BASE_URL || `http://localhost:${PORT}` });
});

/**
 * تحديث: جلب الإعدادات مباشرة من الـ Object المستورد
 * ده بيحل مشكلة الـ 500 Error الناتجة عن فشل قراءة الملفات في الـ Hosting
 */
app.get('/api/chatkit/config', async (_req, res) => {
  try {
    if (!options) {
        throw new Error("Config options not found");
    }
    const { api, ...configWithoutApi } = options as any;
    res.json(configWithoutApi);
  } catch (error) {
    console.error("Config Error:", error);
    res.status(500).json({ error: 'Failed to load config' });
  }
});

// Create session for user
app.post('/api/chatkit/session', async (req, res) => {
  try {
    const { CHATKIT_WORKFLOW_ID, OPENAI_API_KEY } = process.env;
    
    if (!OPENAI_API_KEY || !CHATKIT_WORKFLOW_ID) {
      return res.status(500).json({ error: 'Missing Environment Variables' });
    }

    const userId = req.body?.userId || `user_${Date.now()}`;

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

// Listen on 0.0.0.0 for Railway compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 ChatKit server running at http://0.0.0.0:${PORT}`);
  console.log(`📍 Mode: ${IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'}\n`);
});
