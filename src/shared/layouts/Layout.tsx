import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Suspense, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-x-hidden w-full">
      <header className="sticky top-0 z-50">
        <Navbar onMenuClick={toggleMobileSidebar} />
      </header>

      <div className="flex flex-1 w-full min-w-0 min-h-0 relative">
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
        )}

        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300
             ${
               isMobileSidebarOpen
                 ? 'translate-x-0'
                 : '-translate-x-full lg:translate-x-0'
             }`}
        >
          <Sidebar onClose={closeMobileSidebar} />
        </aside>

        <main className="flex-1 bg-white p-4 md:p-6 overflow-y-auto overscroll-contain min-w-0 min-h-0">
          <Suspense
            fallback={
              <div className="flex-center p-8">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
