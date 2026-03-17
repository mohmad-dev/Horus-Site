import 'dotenv/config';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

// Ensure we load the root .env regardless of where the script is invoked from
dotenv.config({ path: resolve(process.cwd(), '.env') });
import mongoose from 'mongoose';

function maskMongoUri(uri: string): string {
  // Masks credentials in URIs like:
  // mongodb://user:pass@host/db  or  mongodb+srv://user:pass@host/db
  // Output keeps user, masks password: mongodb://user:***@host/db
  try {
    const schemeIdx = uri.indexOf('://');
    const atIdx = uri.indexOf('@');
    if (schemeIdx === -1 || atIdx === -1) return uri;

    const creds = uri.slice(schemeIdx + 3, atIdx);
    const colonIdx = creds.indexOf(':');
    if (colonIdx === -1) return uri;

    const user = creds.slice(0, colonIdx);
    return `${uri.slice(0, schemeIdx + 3)}${user}:***${uri.slice(atIdx)}`;
  } catch {
    return uri;
  }
}

async function main() {
  const uri = process.env['MONGODB_URI'];
  if (!uri) {
    console.error('MongoDB FAIL: MONGODB_URI is not set');
    process.exit(1);
  }

  console.log('Using MONGODB_URI:', maskMongoUri(uri));

  try {
    await mongoose.connect(uri);
    console.log('MongoDB OK');
  } catch (error: any) {
    console.error('MongoDB FAIL:', error?.message ?? String(error));
    process.exit(1);
  } finally {
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
  }
}

main();

