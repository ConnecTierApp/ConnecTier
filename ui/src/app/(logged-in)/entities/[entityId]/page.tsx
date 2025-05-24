"use client"

import { useDocument } from '@/hooks/use-document';
import { useEntity } from '@/hooks/use-entity';
import { Building, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface EntityDetailPageProps {
  params: Promise<{ entityId: string }>;
}

function getTypeIcon(type: string) {
  if (type === 'startup') return <Building className="inline-block h-5 w-5 mr-1 text-primary" />;
  if (type === 'mentor') return <Users className="inline-block h-5 w-5 mr-1 text-primary" />;
  return null;
}

function getTypeLabel(type: string) {
  if (type === 'startup') return 'Startup';
  if (type === 'mentor') return 'Mentor';
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function EntityDetailPage({ params }: EntityDetailPageProps) {
  const { entityId } = React.use(params);
  const {
    data: apiEntity,
    error,
    isLoading,
  } = useEntity(entityId);

  const documentId = apiEntity?.document_ids?.[0];

  // fetch documents
  const { data: documents, error: documentsError, isLoading: documentsLoading } = useDocument(documentId || '');

  if (error || documentsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded">{typeof error === 'string' ? error : 'Failed to load data.'}</div>
      </div>
    );
  }

  if (isLoading || !apiEntity || documentsLoading || !documents) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-4">
        <Link href={`/entities?type=${apiEntity.type}`} className="text-indigo-600 hover:text-indigo-800">
          ← Back to {getTypeLabel(apiEntity.type)}s
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {getTypeIcon(apiEntity.type)}
        <h1 className="text-2xl font-bold">{apiEntity.name}</h1>
        <span className="text-sm text-muted-foreground font-medium">({getTypeLabel(apiEntity.type)})</span>
      </div>
      <p className="text-gray-600 mb-6">View and manage entity details</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{getTypeLabel(apiEntity.type)} Details</h2>
            {/* <div className="space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                Edit
              </button>
              <button className="px-3 py-1 border border-red-300 rounded text-sm text-red-700 hover:bg-red-50">
                Delete
              </button>
            </div> */}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{apiEntity.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">{getTypeIcon(apiEntity.type)} {getTypeLabel(apiEntity.type)}</dd>
              </div>
              {/* Add more fields here as needed */}
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Interview</dt>
                <dd className="mt-1 text-sm italic text-muted-foreground max-h-[200px] overflow-y-scroll whitespace-pre-wrap break-words outline-1 outline-gray-200 rounded p-2 bg-gray-50">
                  {documents?.content}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Related Cohorts</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-3">
              {/* Placeholder for related contexts */}
              <div className="text-muted-foreground italic">No related cohorts found.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntityDetailPage;

