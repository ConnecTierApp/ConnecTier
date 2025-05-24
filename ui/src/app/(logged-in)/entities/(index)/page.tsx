import { Entities } from '@/app/(logged-in)/entities/(index)/components/entities/entities';
import { Suspense } from 'react';

export const metadata = {
  title: 'Entities | ConnecTier',
  description: 'List of all entities in ConnecTier',
};

function EntitiesPage() {
  return <Suspense fallback={<div>Loading...</div>}>
    <Entities />
  </Suspense>;
}

export default EntitiesPage;
