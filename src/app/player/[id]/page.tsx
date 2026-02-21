'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { getFireteam, mockSearchPlayers } from '@/lib/mock-data';
import { TripleCardView } from '@/components/player/TripleCardView';
import { buildDefaultPlayer } from '@/lib/default-player';
import { DetailedPlayer } from '@/types';

interface PlayerPageProps {
  params: {
    id: string;
  };
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const { addRecentPlayer, user, selectedAvatar } = useApp();
  const [fireteam, setFireteam] = useState<DetailedPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // 1. Check mock data
      const mock = getFireteam(params.id);
      if (mock.length > 0) {
        setFireteam(mock);
        setLoading(false);
        return;
      }

      // 2. Signed-in user viewing their own profile
      if (user && user.id === params.id) {
        setFireteam([buildDefaultPlayer(user, selectedAvatar)]);
        setLoading(false);
        return;
      }

      // 3. Real player — fetch from Supabase via API
      try {
        const res = await fetch(`/api/player/${encodeURIComponent(params.id)}`);
        if (res.ok) {
          const data = await res.json();
          const player = buildDefaultPlayer(
            { id: data.id, name: data.name, tag: data.tag },
            data.avatar,
          );
          setFireteam([player]);

          // Add to recent players
          addRecentPlayer({
            id: data.id,
            name: data.name,
            tag: data.tag,
            platform: 'PC',
            rank: 0,
            kd: 0,
            winRate: 0,
            competitiveRank: 'Unranked',
          });
        } else {
          setFireteam([]);
        }
      } catch {
        setFireteam([]);
      }

      setLoading(false);
    }

    load();
  }, [params.id, user, selectedAvatar, addRecentPlayer]);

  // Add mock player to recent on mount (keep existing behavior)
  useEffect(() => {
    const searchPlayer = mockSearchPlayers.find((p) => p.id === params.id);
    if (searchPlayer) {
      addRecentPlayer(searchPlayer);
    }
  }, [params.id, addRecentPlayer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-sm text-text-tertiary font-mono animate-pulse">Loading...</div>
      </div>
    );
  }

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
