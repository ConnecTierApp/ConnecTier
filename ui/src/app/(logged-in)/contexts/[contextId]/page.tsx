"use client";

import Link from 'next/link';
import { useContext } from '@/hooks/use-context';
import React from 'react';
import { ContextChat } from './components/context-chat/context-chat';

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
