"use client";

import { Button } from '@/components/ui/button';
import { useContexts } from '@/hooks/use-contexts';
import Link from 'next/link';


function ContextsPage() {
  const { data: contextsResponse, error, isLoading } = useContexts();
  const contexts = contextsResponse?.results;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {typeof error === 'string' ? error : 'Failed to load data.'}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-100 text-gray-700 p-4 rounded">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Cohorts</h1>
      <p className="mb-4">List of cohorts (groupings for entity matching sessions)</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Cohorts</h2>
          <Link href="/contexts/new">
            <Button variant="default" className="cursor-pointer">
              Create New Cohort
            </Button>
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-500">Your cohorts will appear here.</p>

          {/* Placeholder for cohort list */}
          <div className="mt-4 space-y-2">
            {contexts?.map((context) => (
              <Link key={context.context_id} href={`/contexts/${context.context_id}`} className="block p-4 border border-gray-200 rounded hover:bg-gray-50">
                {context.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContextsPage;
