export const metadata = {
  title: 'Dashboard | ConnecTier',
  description: 'Your ConnecTier dashboard',
};

export function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-500">Welcome to ConnecTier! Your recent activity will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
