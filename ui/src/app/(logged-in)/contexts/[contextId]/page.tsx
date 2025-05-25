"use client";

import Link from 'next/link';
import { useContext } from '@/hooks/use-context';
import { useMatches } from '@/hooks/use-matches';
import React from 'react';
import { ContextChat } from './components/context-chat/context-chat';
import { Button } from '@/components/ui/button';

interface ContextPageProps {
  params: Promise<{ contextId: string }>;
}

function ContextPage({ params }: ContextPageProps) {
  const { contextId } = React.use(params);
  const { data: context } = useContext(contextId);
  const { data: matchesResponse, error: matchesError, isLoading: matchesLoading } = useMatches(contextId);
  const matches = matchesResponse?.results || [];
  const rankedMatches = matches
    .map(match => ({
      ...match,
      numericalScore: (({
        poor: 0,
        fair: 1,
        good: 2,
        excellent: 4,
      })[match.score || 'poor']) || 0,
    }))
    .sort((a, b) => (b.numericalScore || 0) - (a.numericalScore || 0));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/contexts" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Cohorts
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">Cohort: {context?.name}</h1>
      <p className="text-gray-600 mb-6">View and manage cohort</p>

      {/* Matches Section */}
      <div className="mb-8">
        {matchesLoading ? (
          <div className="bg-gray-100 text-gray-700 p-4 rounded">Loading matches...</div>
        ) : matchesError ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">Failed to load matches.</div>
        ) : matches.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Available Matches</h2>
            <ul className="space-y-2">
              {rankedMatches.map(match => (
                <li key={match.match_id} className="p-4 border rounded bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="text-sm text-gray-500 mt-1">Match Quality: <span className="font-bold">{match.score?.toUpperCase()}</span></div>
                    <div className="text-sm text-gray-500 mt-1">
                      {match.entities.map(e => {
                        const bgColor = e.type === 'startup' ? 'bg-blue-100' : 'bg-orange-100';
                        const textColor = e.type === 'startup' ? 'text-blue-700' : 'text-orange-700';
                        return (
                          <span key={e.entity_id} className={`mr-2 text-xs ${bgColor} ${textColor} rounded px-2 py-0.5`}>{e.type}: {e.name}</span>
                        );
                      })}
                    </div>
                    {match.reasoning && (
                      <div className="text-xs text-gray-600 italic mt-1">
                        Reasoning: {match.reasoning}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/contexts/${contextId}/match/${match.match_id}`}
                  >
                    <Button variant="outline" className='cursor-pointer'>
                      View Details
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-blue-50 text-blue-800 p-4 rounded">No matches available for this cohort yet.</div>
        )}
      </div>

      <div className="flex flex-col min-h-[60vh]">
        {/* Streaming chat UI */}
        {context && (
          <ContextChat contextId={contextId} contextName={context.name} />
        )}
      </div>
    </div>
  );
}

export default ContextPage;
