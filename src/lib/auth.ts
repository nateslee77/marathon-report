import { NextAuthOptions } from 'next-auth';
import { supabaseAdmin } from './supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'bungie',
      name: 'Bungie',
      type: 'oauth',
      clientId: process.env.BUNGIE_CLIENT_ID!,
      clientSecret: process.env.BUNGIE_CLIENT_SECRET!,
      authorization: {
        url: 'https://www.bungie.net/en/OAuth/Authorize',
        params: {},
      },
      token: 'https://www.bungie.net/platform/app/oauth/token/',
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
          return false;
        }

        return true;
      } catch (error) {
        console.error('Sign-in error:', error);
        return false;
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
    signIn: '/',
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
