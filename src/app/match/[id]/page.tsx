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
  const match = mockMatches.find(m => m.id === params.id) || mockMatches[0];

  return (
    <div className="space-y-6 animate-fade-in max-w-[1200px] mx-auto px-4 md:px-0 py-4 md:py-0">
      {/* Back Link */}
      <Link
        href="/player/player-001"
        className="inline-flex items-center gap-2 text-sm transition-colors duration-150 hover:opacity-80"
        style={{ color: '#c2ff0b', minHeight: 44 }}
      >
        <span style={{ fontSize: '0.75rem' }}>&larr;</span>
        Back to Player Profile
      </Link>

      {/* Match Header */}
      <MatchHeader match={match} />

      {/* Team Breakdown */}
      <TeamBreakdown team1={match.team1} team2={match.team2} matchResult={match.result} />
    </div>
  );
}
