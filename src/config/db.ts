import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | null = null;

function maskMongoUri(uri: string): string {
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

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (connectionPromise) return connectionPromise;

  const uri = process.env['MONGODB_URI'];
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  console.log(`Attempting to connect to: ${maskMongoUri(uri)}`);

  mongoose.set('strictQuery', true);

  connectionPromise = mongoose.connect(uri).finally(() => {
    connectionPromise = null;
  });

  return connectionPromise;
}

