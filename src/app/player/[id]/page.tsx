'use client';

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { getFireteam, mockSearchPlayers } from '@/lib/mock-data';
import { TripleCardView } from '@/components/player/TripleCardView';

interface PlayerPageProps {
  params: {
    id: string;
  };
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const { addRecentPlayer } = useApp();

  const fireteam = getFireteam(params.id);

  // Add to recent on mount
  useEffect(() => {
    const searchPlayer = mockSearchPlayers.find((p) => p.id === params.id);
    if (searchPlayer) {
      addRecentPlayer(searchPlayer);
    }
  }, [params.id, addRecentPlayer]);

  return <TripleCardView players={fireteam} />;
}
