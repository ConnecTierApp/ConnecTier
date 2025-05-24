import { EntitiesList } from '@/components/entities/entities-list';
import { Suspense } from 'react';

export const metadata = {
  title: 'Entities | ConnecTier',
  description: 'List of all entities in ConnecTier',
};

function EntitiesPage() {
  return <Suspense fallback={<div>Loading...</div>}>
    <EntitiesList />
  </Suspense>;
}

export default EntitiesPage;
