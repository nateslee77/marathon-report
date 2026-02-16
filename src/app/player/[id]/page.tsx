'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { getFireteam, mockSearchPlayers } from '@/lib/mock-data';
import { TripleCardView } from '@/components/player/TripleCardView';
import { buildDefaultPlayer } from '@/lib/default-player';

interface PlayerPageProps {
  params: {
    id: string;
  };
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const { addRecentPlayer, user, selectedAvatar } = useApp();

  let fireteam = getFireteam(params.id);

  // If no mock player found, check if this is the signed-in user's own profile
  if (fireteam.length === 0 && user && user.id === params.id) {
    fireteam = [buildDefaultPlayer(user, selectedAvatar)];
  }

  // Add to recent on mount
  useEffect(() => {
    const searchPlayer = mockSearchPlayers.find((p) => p.id === params.id);
    if (searchPlayer) {
      addRecentPlayer(searchPlayer);
    }
  }, [params.id, addRecentPlayer]);

  if (fireteam.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center space-y-3">
          <div className="text-2xl font-bold" style={{ color: '#e5e5e5' }}>Player not found</div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            No player exists with this ID.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm font-mono"
            style={{ color: '#c2ff0b' }}
          >
            &larr; Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return <TripleCardView players={fireteam} />;
}
