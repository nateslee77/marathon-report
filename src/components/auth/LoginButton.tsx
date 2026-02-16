'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-600 text-white rounded opacity-50 cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          {session.user.name}
        </span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('bungie')}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
    >
      Sign in with Bungie
    </button>
  );
}
