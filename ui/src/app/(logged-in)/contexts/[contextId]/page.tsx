"use client";

import Link from 'next/link';
import { useContext } from '@/hooks/use-context';
import React from 'react';

interface ContextPageProps {
  params: Promise<{ contextId: string }>;
}

function ContextPage({ params }: ContextPageProps) {
  const { contextId } = React.use(params);
  const { data: context } = useContext(contextId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/contexts" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Cohorts
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Cohort: {context?.name}</h1>
      <p className="text-gray-600 mb-6">View and manage cohort</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Matched Pairs</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <p>Your matched entity pairs will appear here.</p>
              <Link href={`/contexts/${contextId}/match/sample-match-1`} className="text-indigo-600 hover:text-indigo-800">
                View sample match
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Run New Pairing</h2>
          <div className="border-t border-gray-200 pt-4">
            <p className="mb-4">Start a new entity matching process with your selected entities.</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Start New Matching Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContextPage;
