import Link from 'next/link';

export const metadata = {
  title: 'Contexts | ConnecTier',
  description: 'List of entity matching contexts',
};

function ContextsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contexts</h1>
      <p className="mb-4">List of contexts (groupings for entity matching sessions)</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Contexts</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Create New Context
          </button>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-500">Your contexts will appear here.</p>
          
          {/* Placeholder for context list */}
          <div className="mt-4 space-y-2">
            <Link href="/contexts/sample-context-1" className="block p-4 border border-gray-200 rounded hover:bg-gray-50">
              Sample Context 1
            </Link>
            <Link href="/contexts/sample-context-2" className="block p-4 border border-gray-200 rounded hover:bg-gray-50">
              Sample Context 2
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContextsPage;
