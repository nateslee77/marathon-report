'use client';

import { DetailedPlayer } from '@/types';
import { PlayerCard } from './PlayerCard';

interface TripleCardViewProps {
  players: DetailedPlayer[];
}

export function TripleCardView({ players }: TripleCardViewProps) {
  const [primary, teammate1, teammate2] = players;

  return (
    <div
      className="grid animate-fade-in"
      style={{
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 16,
        minHeight: 'calc(100vh - 48px)',
      }}
    >
      {primary && <PlayerCard player={primary} isCenter />}
      {teammate1 && <PlayerCard player={teammate1} />}
      {teammate2 && <PlayerCard player={teammate2} />}
    </div>
  );
}
