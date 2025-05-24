import Link from 'next/link';

export const metadata = {
  title: 'Entity Details | ConnecTier',
  description: 'View entity details in ConnecTier',
};

interface EntityDetailPageProps {
  params: Promise<{ entityId: string }>;
}

async function EntityDetailPage({ params }: EntityDetailPageProps) {
  const { entityId } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/entities" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Entities
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Entity: {entityId}</h1>
      <p className="text-gray-600 mb-6">View and manage entity details</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Entity Details</h2>
            <div className="space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                Edit
              </button>
              <button className="px-3 py-1 border border-red-300 rounded text-sm text-red-700 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">Sample Entity Name</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">Company</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  This is a sample entity description. It would contain information about the entity, 
                  its purpose, and any other relevant details.
                </dd>
              </div>
              
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 mb-2">Attributes</dt>
                <dd className="mt-1">
                  <ul className="divide-y divide-gray-200 border rounded-md">
                    <li className="flex justify-between px-4 py-3">
                      <span className="text-sm font-medium">Email</span>
                      <span className="text-sm text-gray-500">example@company.com</span>
                    </li>
                    <li className="flex justify-between px-4 py-3">
                      <span className="text-sm font-medium">Phone</span>
                      <span className="text-sm text-gray-500">+1 (555) 123-4567</span>
                    </li>
                    <li className="flex justify-between px-4 py-3">
                      <span className="text-sm font-medium">Address</span>
                      <span className="text-sm text-gray-500">123 Main St, City, Country</span>
                    </li>
                    <li className="flex justify-between px-4 py-3">
                      <span className="text-sm font-medium">Website</span>
                      <span className="text-sm text-gray-500">www.example.com</span>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Related Contexts</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-3">
              <Link 
                href="/contexts/sample-context-1" 
                className="block p-3 border rounded-md hover:bg-gray-50"
              >
                <p className="font-medium">Sample Context 1</p>
                <p className="text-sm text-gray-600">Last updated: May 24, 2025</p>
              </Link>
              <Link 
                href="/contexts/sample-context-2" 
                className="block p-3 border rounded-md hover:bg-gray-50"
              >
                <p className="font-medium">Sample Context 2</p>
                <p className="text-sm text-gray-600">Last updated: May 22, 2025</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntityDetailPage;
