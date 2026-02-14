import { mockMatches } from '@/lib/mock-data';
import { MatchHeader } from '@/components/match/MatchHeader';
import { TeamBreakdown } from '@/components/match/TeamBreakdown';
import Link from 'next/link';

interface MatchPageProps {
  params: {
    id: string;
  };
}

export default function MatchPage({ params }: MatchPageProps) {
  // In a real app, fetch match data based on params.id
  const match = mockMatches.find(m => m.id === params.id) || mockMatches[0];

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/player/player-001"
        className="inline-flex items-center text-sm transition-colors duration-150 hover:opacity-80"
        style={{ color: '#c2ff0b' }}
      >
        ← Back to Player Profile
      </Link>

      {/* Match Header */}
      <MatchHeader match={match} />

      {/* Team Breakdown */}
      <TeamBreakdown team1={match.team1} team2={match.team2} />
    </div>
  );
}
