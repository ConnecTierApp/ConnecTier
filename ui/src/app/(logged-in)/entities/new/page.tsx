"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import { useApiMutation } from '../../../../hooks/use-api';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};


function NewEntityPage({ searchParams }: Props) {
  const usedSearchParams = React.use(searchParams);
  const router = useRouter();
  const type = typeof usedSearchParams.type === 'string' ? usedSearchParams.type : '';
  const capitalizedType = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Entity';
  
  const { createEntity, createDocument } = useApiMutation();
  const [name, setName] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Function to get plural form of entity type
  const getTypeLabel = (singularType: string): string => {
    if (!singularType) return 'Entities';
    // Basic pluralization logic
    if (singularType.toLowerCase() === 'company') return 'Companies';
    return `${singularType.charAt(0).toUpperCase() + singularType.slice(1)}s`;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // First create the entity
      const entityData = await createEntity({
        name,
        type: type || 'startup', // Default to startup if no type provided
      });
      
      // If transcript is provided, create the document
      if (transcript.trim()) {
        try {
          await createDocument({
            entity_id: entityData.entity_id,
            type: 'transcript',
            content: transcript,
          });
        } catch (docError) {
          console.error('Failed to create document:', docError);
          // Still continue with redirect even if document creation fails
        }
      }
      
      // Redirect to the entity detail page
      router.push(`/entities/${entityData.entity_id}`);
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred';
      
      if (err && typeof err === 'object') {
        if ('response' in err && 
            err.response && 
            typeof err.response === 'object' && 
            'data' in err.response && 
            err.response.data && 
            typeof err.response.data === 'object' && 
            'error' in err.response.data && 
            typeof err.response.data.error === 'string') {
          errorMessage = err.response.data.error;
        } else if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/entities" className="text-indigo-600 hover:text-indigo-800">
          ← Back to {getTypeLabel(type)}
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Create New {capitalizedType}</h1>
      
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {capitalizedType} Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder={`Enter ${type || 'entity'} name`}
              required
            />
          </div>
          
          {/* Type is determined from the query string and preserved in a hidden input */}
          <input type="hidden" id="type" name="type" value={type} />
          
          <div>
            <label htmlFor="transcript" className="block text-sm font-medium text-gray-700">
              Interview Transcript
            </label>
            <textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Paste interview transcript here"
            ></textarea>
            <p className="mt-1 text-sm text-gray-500">
              Optional. If provided, a document will be created and associated with this {type || 'entity'}.  
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              href="/entities"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : `Create ${capitalizedType}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewEntityPage;
