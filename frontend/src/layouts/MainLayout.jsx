import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="crm-main-wrapper">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="crm-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
