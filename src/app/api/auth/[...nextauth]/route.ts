import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force NEXTAUTH_URL - Vercel's VERCEL_URL can override it
process.env.NEXTAUTH_URL = 'https://www.marathonintel.com';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
