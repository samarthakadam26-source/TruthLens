import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <button
          className="lg:hidden fixed top-4 left-4 z-30 rounded-lg bg-navy-800 text-white p-2 shadow-card"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-16 lg:pt-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
