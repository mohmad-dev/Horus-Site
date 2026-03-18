import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { join } from 'path';
import apiRouter from '../routes/api';
import { connectDB } from '../src/config/db';

const app = express();

// CORS configuration - allow localhost:4200 and FRONTEND_URL from env
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:4200',
      process.env['FRONTEND_URL'],
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(apiRouter);

// Deep-link fallback for dev/prod-like behavior.
// Note: Works when dist exists (after ng build).
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/Horus-Site/browser/index.html'));
});

const port = process.env['PORT'] || 4000;

(async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
})().catch((err) => {
  console.error('Failed to start API server', err);
  process.exit(1);
});

