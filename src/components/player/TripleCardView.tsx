'use client';

import { DetailedPlayer } from '@/types';
import { PlayerCard } from './PlayerCard';
import { MobilePlayerCard } from './MobilePlayerCard';

interface TripleCardViewProps {
  players: DetailedPlayer[];
}

export function TripleCardView({ players }: TripleCardViewProps) {
  const [primary, teammate1, teammate2] = players;

  return (
    <>
      {/* Desktop: 3-column grid */}
      <div
        className="hidden md:grid animate-fade-in"
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

      {/* Mobile: stacked condensed cards */}
      <div className="md:hidden animate-fade-in">
        <div
          className="game-card overflow-hidden"
          style={{ margin: '0' }}
        >
          {primary && <MobilePlayerCard player={primary} isCenter />}
          {teammate1 && <MobilePlayerCard player={teammate1} />}
          {teammate2 && <MobilePlayerCard player={teammate2} />}
        </div>
      </div>
    </>
  );
}
