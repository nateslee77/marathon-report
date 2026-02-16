import { NextAuthOptions } from 'next-auth';
import { supabaseAdmin } from './supabase';

const SITE_URL = process.env.NEXTAUTH_URL || 'https://www.marathonintel.com';

export const authOptions: NextAuthOptions = {
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, JSON.stringify(metadata, null, 2));
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', code, JSON.stringify(metadata, null, 2));
    },
  },
  providers: [
    {
      id: 'bungie',
      name: 'Bungie',
      type: 'oauth',
      clientId: process.env.BUNGIE_CLIENT_ID!,
      clientSecret: process.env.BUNGIE_CLIENT_SECRET!,
      checks: ['none'],
      authorization: {
        url: 'https://www.bungie.net/en/OAuth/Authorize',
        params: {
          response_type: 'code',
          redirect_uri: `${SITE_URL}/api/auth/callback/bungie`,
        },
      },
      token: {
        url: 'https://www.bungie.net/platform/app/oauth/token/',
        async request({ params }) {
          console.log('Token exchange starting, code:', params.code?.slice(0, 10) + '...');
          const response = await fetch(
            'https://www.bungie.net/platform/app/oauth/token/',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: params.code as string,
                client_id: process.env.BUNGIE_CLIENT_ID!,
                client_secret: process.env.BUNGIE_CLIENT_SECRET!,
              }),
            }
          );
          const tokens = await response.json();
          console.log('Token exchange response status:', response.status);
          console.log('Token exchange response keys:', Object.keys(tokens));
          if (tokens.error) {
            console.error('Token exchange error:', JSON.stringify(tokens));
          }
          return { tokens };
        },
      },
      userinfo: {
        url: 'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
        async request({ tokens }) {
          const response = await fetch(
            'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                'X-API-Key': process.env.BUNGIE_API_KEY!,
              },
            }
          );
          const data = await response.json();
          return data.Response;
        },
      },
      profile(profile) {
        const primaryMembership =
          profile.primaryMembershipId && profile.destinyMemberships
            ? profile.destinyMemberships.find(
                (m: any) => m.membershipId === profile.primaryMembershipId
              )
            : profile.destinyMemberships?.[0];

        return {
          id: profile.bungieNetUser.membershipId,
          name:
            primaryMembership?.displayName ||
            profile.bungieNetUser.uniqueName ||
            profile.bungieNetUser.displayName,
          bungieMembershipId: profile.bungieNetUser.membershipId,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.bungieMembershipId) {
        return false;
      }

      if (!supabaseAdmin) {
        console.warn('Supabase not configured - skipping user persistence');
        return true;
      }

      try {
        const { error } = await supabaseAdmin.from('users').upsert(
          {
            id: user.bungieMembershipId,
            bungie_membership_id: user.bungieMembershipId,
            display_name: user.name,
          },
          {
            onConflict: 'id',
          }
        );

        if (error) {
          console.error('Supabase upsert error:', error);
          // Still allow sign-in even if Supabase fails
          return true;
        }

        return true;
      } catch (error) {
        console.error('Sign-in error:', error);
        // Still allow sign-in even if Supabase fails
        return true;
      }
    },
    async session({ session, token }) {
      if (token.bungieMembershipId) {
        session.user.bungieMembershipId = token.bungieMembershipId as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.bungieMembershipId) {
        token.bungieMembershipId = user.bungieMembershipId;
      }
      return token;
    },
  },
  pages: {
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module 'next-auth' {
  interface User {
    bungieMembershipId?: string;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      bungieMembershipId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    bungieMembershipId?: string;
  }
}
