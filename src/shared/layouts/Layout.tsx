import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

export default function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-x-hidden w-full">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <div className="flex flex-1 w-full min-w-0 min-h-0">
        <aside>
          <Sidebar />
        </aside>

        <main className="flex-1 bg-white p-4 md:p-6 overflow-y-auto overscroll-contain min-w-0 min-h-0">
          <Suspense
            fallback={<div className="p-4 text-gray-500">Loading...</div>}
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
