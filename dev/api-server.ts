import 'dotenv/config';

import express from 'express';
import { join } from 'path';
import apiRouter from '../routes/api';
import { connectDB } from '../src/config/db';

const app = express();

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

