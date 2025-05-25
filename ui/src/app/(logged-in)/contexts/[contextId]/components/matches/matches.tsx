import { Button } from '@/components/ui/button';
import { useMatches } from '@/hooks/use-matches';
import Link from 'next/link';
import React from 'react';

interface MatchesProps {
  contextId: string;
  name?: string;
}

export const Matches: React.FC<MatchesProps> = ({ contextId, name }) => {
  // Build endpoint with optional name param
  const { data: matchesResponse, error: matchesError, isLoading: matchesLoading } = useMatches(`/contexts/${contextId}/matches/`, {
    refreshInterval: 1000,
  });

  const matches = matchesResponse?.results || [];
  const rankedMatches = matches
    .filter(match => match.entities.some(entity => entity.name.toLowerCase().includes(name?.toLowerCase() || '')))
    .map(match => ({
      ...match,
      numericalScore: (({
        poor: 0,
        fair: 1,
        good: 2,
        excellent: 3,
      })[match.score || 'poor']) || 0,
    }))
    .sort((a, b) => (b.numericalScore || 0) - (a.numericalScore || 0));

  if (matchesLoading) {
    return <div className="bg-gray-100 text-gray-700 p-4 rounded">Loading matches...</div>;
  }
  if (matchesError) {
    return <div className="bg-red-100 text-red-700 p-4 rounded">Failed to load matches.</div>;
  }
  if (!matches.length) {
    return <div className="bg-blue-50 text-blue-800 p-4 rounded">No matches available for this cohort yet.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Available Matches</h2>
      <ul className="space-y-10">
        {rankedMatches.map(match => {
          const startup = match.entities.find(e => e.type === 'startup');
          const mentor = match.entities.find(e => e.type === 'mentor');
          const startupName = startup?.name || 'Startup';
          const mentorName = mentor?.name || 'Mentor';
          // Confidence: numericalScore * 25, min 25% for poor
          const confidencePercent = (match.numericalScore !== undefined ? (match.numericalScore + 1) * 25 : 25);
          const matchScore = match.score ? match.score.charAt(0).toUpperCase() + match.score.slice(1) : 'Unknown';
          return (
            <li
              key={match.match_id}
              className="relative rounded-2xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur-sm p-8 max-w-xl mx-auto"
            >
              {/* Status */}
              <div className="flex items-center gap-x-2 text-xs mb-6">
                <div className="rounded-full bg-green-500 h-2.5 w-2.5 animate-pulse" />
                <span className="text-gray-500">AI Powered Matching Active</span>
              </div>
              {/* Entities Row */}
              <div className="flex flex-col gap-8 sm:flex-row sm:gap-8 sm:items-center mb-6">
                {/* Startup */}
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{startupName}</h3>
                    <span className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-0.5 mt-1 inline-block">Startup</span>
                  </div>
                </div>
                {/* VS Divider */}
                <div className="hidden sm:flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-gray-400">&</span>
                </div>
                {/* Mentor */}
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-600">
                      <path d="M14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                      <path d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{mentorName}</h3>
                    <span className="text-xs text-orange-700 bg-orange-100 rounded px-2 py-0.5 mt-1 inline-block">Mentor</span>
                  </div>
                </div>
              </div>
              {/* Confidence Bar Section */}
              <div className="border-t border-gray-100 pt-6 mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Match confidence</span>
                  <span className="text-sm font-semibold text-indigo-600">{confidencePercent}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      match.score === 'excellent' ? 'bg-green-500' :
                      match.score === 'good' ? 'bg-blue-500' :
                      match.score === 'fair' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${confidencePercent}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Quality: <span className="font-bold">{matchScore}</span></div>
              </div>
              {/* Reasoning */}
              {match.reasoning && (
                <div className="rounded-md bg-indigo-50 px-4 py-3 mt-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-indigo-600">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-indigo-700">
                        {match.reasoning}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* View Details Button */}
              <div className="mt-8 flex justify-end hidden">
                <Link href={`/contexts/${contextId}/match/${match.match_id}`}>
                  <Button variant="outline" className="cursor-pointer px-6 py-2 text-base font-semibold">
                    View Details
                  </Button>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
