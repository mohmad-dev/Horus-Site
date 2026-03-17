import type { NextFunction, Request, Response } from 'express';

/**
 * Simple temporary admin protection.
 * Accepts either:
 * - Header: x-admin-key: <key>
 * - Header: authorization: Bearer <key>
 *
 * Set expected key in env: ADMIN_API_KEY
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const expected = process.env['ADMIN_API_KEY'];
  if (!expected) {
    res.status(500).json({ success: false, error: 'ADMIN_KEY_NOT_CONFIGURED' });
    return;
  }

  const headerKey = (req.header('x-admin-key') || '').trim();
  const auth = (req.header('authorization') || '').trim();
  const bearerKey = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';

  const provided = headerKey || bearerKey;
  if (!provided || provided !== expected) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
    return;
  }

  next();
}

