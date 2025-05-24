"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Building, Users, Plus, Trash2, Eye } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { useEntities } from '@/hooks/use-entities';

export function Entities() {
  const searchParams = useSearchParams();
  const entityType = searchParams.get('type') || 'all';
  const { data: entitiesResponse, error, isLoading } = useEntities(entityType);
  const entities = entitiesResponse?.results;
  
  // Filter entities based on type parameter
  let pageTitle = 'All Entities';
  let pageDescription = 'List of all entities in the system';
  let createButtonText = 'Create New Entity';
  let entityTypeIcon = null;
  
  if (entityType === 'startup') {
    pageTitle = 'Startups';
    pageDescription = 'List of all Startups';
    createButtonText = 'Add New Startup';
    entityTypeIcon = <Building className="h-5 w-5" />;
  } else if (entityType === 'mentor') {
    pageTitle = 'Mentors';
    pageDescription = 'List of all Mentors';
    createButtonText = 'Add New Mentor';
    entityTypeIcon = <Users className="h-5 w-5" />;
  } else {
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {entityTypeIcon && (
            <div className="p-1.5 rounded-md bg-primary/10">
              {entityTypeIcon}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground">{pageDescription}</p>
          </div>
        </div>
        <Link 
          href={`/entities/new${entityType !== 'all' ? `?type=${entityType}` : ''}`}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          {createButtonText}
        </Link>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    Name
                  </th>
                  {entityType === 'all' && (
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                      Type
                    </th>
                  )}
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    Last Updated
                  </th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {entities && entities.length > 0 ? entities.map((entity) => (
                  <tr
                    key={entity.entity_id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">
                      <Link href={`/entities/${entity.entity_id}`} className="font-medium hover:underline">
                        {entity.name}
                      </Link>
                    </td>
                    {entityType === 'all' && (
                      <td className="p-4 align-middle capitalize">
                        {entity.type}
                      </td>
                    )}
                    <td className="p-4 align-middle">
                      {entity.createdAt}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/entities/${entity.entity_id}`}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                        <button 
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={entityType === 'all' ? 4 : 3} className="p-4 text-center text-muted-foreground">
                      Nothing found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
