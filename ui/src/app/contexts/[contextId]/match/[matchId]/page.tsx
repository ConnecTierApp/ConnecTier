import Link from 'next/link';

export const metadata = {
  title: 'Match Details | ConnecTier',
  description: 'View details of an entity match',
};

interface MatchDetailsPageProps {
  params: {
    contextId: string;
    matchId: string;
  };
}

export function MatchDetailsPage({ params }: MatchDetailsPageProps) {
  const { contextId, matchId } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-4">
        <Link href={`/contexts/${contextId}`} className="text-indigo-600 hover:text-indigo-800">
          ← Back to Context
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Match Details</h1>
      <p className="text-gray-600 mb-6">
        Context: {contextId} | Match ID: {matchId}
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Entities Involved</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium">Entity 1</h3>
                <p className="text-gray-600">Sample entity details will appear here</p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-medium">Entity 2</h3>
                <p className="text-gray-600">Sample entity details will appear here</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Reasoning</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="font-medium">System</p>
                <p className="text-gray-700">Starting entity matching process...</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-md">
                <p className="font-medium">AI</p>
                <p className="text-gray-700">I&apos;ve analyzed both entities and found several matching attributes...</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="font-medium">System</p>
                <p className="text-gray-700">Match confidence: 87%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchDetailsPage;
