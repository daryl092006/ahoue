import React from 'react';
import { useApp } from './context/AppContext.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Topbar } from './components/Topbar.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { ModalHost } from './components/ModalHost.jsx';
import { FloatingActionButton } from './components/FloatingActionButton.jsx';
import { ChatPage } from './pages/ChatPage.jsx';
import { MarketPage } from './pages/MarketPage.jsx';
import { MiniAppsPage } from './pages/MiniAppsPage.jsx';
import { DiscoverPage } from './pages/DiscoverPage.jsx';
import { WalletPage } from './pages/WalletPage.jsx';

export const App = () => {
  const { activeTab, toast } = useApp();

  return (
    <div id="app">
      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Main Responsive Application Stage */}
      <main className="app-main">
        {/* Top Navbar */}
        <Topbar />

        {/* Content Viewport */}
        <section className="content-viewport">
          {activeTab === 'chat' && <ChatPage />}
          {activeTab === 'marche' && <MarketPage />}
          {activeTab === 'mini' && <MiniAppsPage />}
          {activeTab === 'dec' && <DiscoverPage />}
          {activeTab === 'profil' && <WalletPage />}
        </section>

        {/* Brand Floating Action Button (+) */}
        <FloatingActionButton />
      </main>

      {/* Mobile Navigation */}
      <BottomNav />

      {/* Universal Modal Dialog Host */}
      <ModalHost />

      {/* Toast Notification Container */}
      <div id="toast" className={toast.show ? 'show' : ''} role="status">
        {toast.message}
      </div>
    </div>
  );
};
