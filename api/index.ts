import { createApp } from '../server';

let cachedApp: any = null;

function getApp() {
  if (!cachedApp) {
    console.log('⚡ [VERCEL SERVERLESS] Initializing Express app instance...');
    cachedApp = createApp();
  }
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  try {
    const app = getApp();
    return app(req, res);
  } catch (err: any) {
    console.error('💥 [VERCEL CRITICAL HANDLER ERROR]:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: err?.message || String(err),
        stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined
      }));
    }
  }
}
