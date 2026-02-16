import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';

// Force NEXTAUTH_URL - Vercel's VERCEL_URL can override it
process.env.NEXTAUTH_URL = 'https://www.marathonintel.com';

const nextAuth = NextAuth(authOptions);

async function handler(req: NextRequest) {
  const url = new URL(req.url);
  console.log('Auth route hit:', req.method, url.pathname, url.search);

  try {
    return await nextAuth(req as any);
  } catch (error) {
    console.error('Auth route error:', error);
    throw error;
  }
}

export { handler as GET, handler as POST };
