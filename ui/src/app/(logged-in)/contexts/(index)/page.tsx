"use client";

import { Button } from '@/components/ui/button';
import { useContexts } from '@/hooks/use-contexts';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header/page-header';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Plus, Eye } from 'lucide-react';

function ContextsPage() {
  const { data: contextsResponse, error, isLoading } = useContexts();
  const contexts = contextsResponse?.results;

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {typeof error === 'string' ? error : 'Failed to load data.'}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-gray-100 text-gray-700 p-4 rounded">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Your Cohorts"
        subtitle="List of all cohorts (contexts) you have access to."
        actionArea={
          <Link href="/contexts/new">
            <Button variant="default" className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Create New Cohort
            </Button>
          </Link>
        }
      />

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contexts && contexts.length > 0 ? (
              contexts.map((context) => (
                <TableRow key={context.context_id}>
                  <TableCell>
                    <Link href={`/contexts/${context.context_id}`} className="font-medium hover:underline">
                      {context.name}
                    </Link>
                  </TableCell>
                  <TableCell>{context.created_at}</TableCell>
                  <TableCell>
                    <Link
                      href={`/contexts/${context.context_id}`}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No cohorts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default ContextsPage;
