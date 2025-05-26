"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Building, Users, Plus, Trash2, Eye } from 'lucide-react';
import { PageHeader } from '@/components/page-header/page-header';
import { Loader2 } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { useEntities } from '@/hooks/use-entities';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

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
      <PageHeader
        icon={entityTypeIcon}
        title={pageTitle}
        subtitle={pageDescription}
        actionArea={
          <Link
            href={`/entities/new${entityType !== 'all' ? `?type=${entityType}` : ''}`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            {createButtonText}
          </Link>
        }
      />

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {entityType === 'all' && <TableHead>Type</TableHead>}
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities && entities.length > 0 ? entities.map((entity) => (
              <TableRow key={entity.entity_id}>
                <TableCell>
                  <Link href={`/entities/${entity.entity_id}`} className="font-medium hover:underline">
                    {entity.name}
                  </Link>
                </TableCell>
                {entityType === 'all' && (
                  <TableCell className="capitalize">{entity.type}</TableCell>
                )}
                <TableCell>{entity.createdAt}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={entityType === 'all' ? 4 : 3} className="text-center text-muted-foreground">
                  Nothing found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
