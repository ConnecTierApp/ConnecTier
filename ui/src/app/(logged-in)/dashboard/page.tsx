export const metadata = {
  title: 'Dashboard | ConnecTier',
  description: 'Your ConnecTier dashboard',
};

function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col space-y-2">
            <h3 className="text-lg font-semibold">Recent Startups</h3>
            <p className="text-sm text-muted-foreground">View and manage your recent startup entities.</p>
            <div className="mt-4">
              <div className="text-sm text-muted-foreground">No recent startups</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col space-y-2">
            <h3 className="text-lg font-semibold">Recent Mentors</h3>
            <p className="text-sm text-muted-foreground">View and manage your recent mentor entities.</p>
            <div className="mt-4">
              <div className="text-sm text-muted-foreground">No recent mentors</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col space-y-2">
            <h3 className="text-lg font-semibold">Recent Contexts</h3>
            <p className="text-sm text-muted-foreground">View and manage your recent matching contexts.</p>
            <div className="mt-4">
              <div className="text-sm text-muted-foreground">No recent contexts</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="border-t border-border pt-4">
            <p className="text-muted-foreground">Welcome to ConnecTier! Your recent activity will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
