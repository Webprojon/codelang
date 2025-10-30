import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

export default function Layout() {
  return (
    <div className="layout">
      <header className="header-sticky">
        <Navbar />
      </header>

      <div className="app-shell">
        <aside>
          <Sidebar />
        </aside>

        <main className="page-main">
          <Suspense fallback={<div className="fallback">Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
