import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ApiInit } from '@/components/layout/ApiInit';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background dot-grid">
      <ApiInit />
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto ambient-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
