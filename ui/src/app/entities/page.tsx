import Link from 'next/link';

export const metadata = {
  title: 'Entities | ConnecTier',
  description: 'List of all entities in ConnecTier',
};

export function EntitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Entities</h1>
      <p className="mb-4">List of all entities in the system</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Entities</h2>
          <Link 
            href="/entities/new" 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Create New Entity
          </Link>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href="/entities/sample-entity-1" className="text-indigo-600 hover:text-indigo-900">
                      Sample Entity 1
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Person
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    May 24, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href="/entities/sample-entity-1" className="text-indigo-600 hover:text-indigo-900 mr-4">
                      View
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href="/entities/sample-entity-2" className="text-indigo-600 hover:text-indigo-900">
                      Sample Entity 2
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Company
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    May 23, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href="/entities/sample-entity-2" className="text-indigo-600 hover:text-indigo-900 mr-4">
                      View
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntitiesPage;
