import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-balance">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Manage events, view statistics, and moderate feedback.
        </p>
      </div>
      <AdminDashboard />
    </div>
  );
}
