"use client";

import { useContext } from '@/hooks/use-context';
import Link from 'next/link';
import React from 'react';
import { StatusUpdates } from './components/status-updates/status-updates';
import { Matches } from './components/matches/matches';
import { Input } from '@/components/ui/input';

interface ContextPageProps {
  params: Promise<{ contextId: string }>;
}

function ContextPage({ params }: ContextPageProps) {
  const { contextId } = React.use(params);
  const { data: context } = useContext(contextId);

  // Search state for entity name
  const [search, setSearch] = React.useState('');

  // Handle search input and submit on Enter
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/contexts" className="text-indigo-600 hover:underline">
          ← Back to Cohorts
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">Cohort: {context?.name}</h1>
      <p className="text-gray-600 mb-6">View matches and get status updates.</p>

      {/* Search bar for entity name */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search by entity name..."
          value={search}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          <Matches
            contextId={contextId}
            name={search || undefined}
          />
        </div>
        {/* Right column */}
        <div className="w-full lg:w-[400px] xl:w-[500px] flex-shrink-0">
          {context && (
            <div className="sticky top-24">
              <StatusUpdates contextId={contextId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContextPage;
