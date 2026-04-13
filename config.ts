/**
 * ChatKit Server
 *
 * Handles authentication and session management for your ChatKit widget.
 * Keeps your OpenAI API key secure by never exposing it to the browser.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ FIX: كان NODE_ENV غلط
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ✅ Detect Railway / deployed URL automatically
const BASE_URL =
  process.env.BASE_URL ||
  process.env.RAILWAY_STATIC_URL ||
  `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

// Only serve static files in development
if (!IS_PRODUCTION) {
  app.use(express.static('.'));
} else {
  app.get('/', (req, res) => {
    res.status(403).send('Access denied. API only.');
  });
}

// Load config from config.ts
async function loadConfig() {
  const configPath = join(__dirname, 'config.ts');
  const configContent = readFileSync(configPath, 'utf-8');

  const jsCode = configContent
    .replace(/import type.*from.*;?\s*/g, '')
    .replace(/: ChatKitOptions/g, '');

  const moduleCode = jsCode + '\nexport default options;';
  const dataUrl = `data:text/javascript;base64,${Buffer.from(moduleCode).toString('base64')}`;

  const module = await import(dataUrl);
  return module.default;
}

// ✅ Return correct base URL
app.get('/api/base-url', (_req, res) => {
  res.json({ baseUrl: BASE_URL });
});

// Serve config (without api section)
app.get('/api/chatkit/config', async (_req, res) => {
  try {
    const config = await loadConfig();
    const { api, ...configWithoutApi } = config;
    res.json(configWithoutApi);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load config' });
  }
});

// ✅ Create session
app.post('/api/chatkit/session', async (req, res) => {
  try {
    const { CHATKIT_WORKFLOW_ID } = process.env;

    if (!process.env.OPENAI_API_KEY || !CHATKIT_WORKFLOW_ID) {
      return res.status(500).json({
        error: 'Missing OPENAI_API_KEY or CHATKIT_WORKFLOW_ID'
      });
    }

    const userId =
      req.body?.userId ||
      `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session = await openai.beta.chatkit.sessions.create({
      user: userId,
      workflow: { id: CHATKIT_WORKFLOW_ID }
    });

    res.json({
      client_secret: session.client_secret,
      user_id: userId
    });
  } catch (error) {
    console.error('❌ Session Error:', error);

    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌍 BASE URL: ${BASE_URL}`);
  console.log(
    `📍 Mode: ${IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'}\n`
  );
});
