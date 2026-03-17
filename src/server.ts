import 'dotenv/config';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// In local dev we run the API as a separate process (see `npm run dev`).
// This flag prevents the Angular SSR dev server from importing backend/db code.
const apiEnabled = process.env['SSR_DISABLE_API'] !== '1';
let connectDB: undefined | (() => Promise<unknown>);

if (apiEnabled) {
  const [{ default: apiRouter }, db] = await Promise.all([
    import('../routes/api'),
    import('./config/db'),
  ]);
  connectDB = db.connectDB;
  app.use(apiRouter);
}

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  (async () => {
    if (connectDB) await connectDB();

    app.listen(port, (error) => {
      if (error) {
        throw error;
      }

      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  })().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
