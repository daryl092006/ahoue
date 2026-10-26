import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { IconChat, IconMarket, IconGrid, IconCompass, IconWallet, IconSettings } from './Icons.jsx';

export const Sidebar = () => {
  const { activeTab, setActiveTab, chats, user } = useApp();
  const unreadTotal = chats.reduce((sum, c) => sum + (c.unread || 0), 0);

  return (
    <aside className="app-sidebar">
      {/* Brand Header with Official Icon and Slogan */}
      <div className="sidebar-brand" onClick={() => setActiveTab('chat')} style={{ cursor: 'pointer' }}>
        <div className="brand-badge-pastille" title="AHOUE — Une maison pour tout le quotidien">
          <img src="/brand/logo-icon.png" alt="AHOUE" className="brand-logo-img" />
        </div>
        <div className="brand-text-block">
          <h1 className="brand-title">AHOUE</h1>
          <div className="brand-slogan">TOUT À PORTÉE DE MAIN</div>
        </div>
      </div>

      {/* Primary Navigation Links */}
      <nav className="sidebar-nav">
        <button
          className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <IconChat />
          <span>Discussions</span>
          {unreadTotal > 0 && <span className="nav-badge-count">{unreadTotal}</span>}
        </button>

        <button
          className={`nav-link ${activeTab === 'marche' ? 'active' : ''}`}
          onClick={() => setActiveTab('marche')}
        >
          <IconMarket />
          <span>Marché & Métiers</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'mini' ? 'active' : ''}`}
          onClick={() => setActiveTab('mini')}
        >
          <IconGrid />
          <span>Services Publics</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'dec' ? 'active' : ''}`}
          onClick={() => setActiveTab('dec')}
        >
          <IconCompass />
          <span>Moments</span>
        </button>

        <button
          className={`nav-link ${activeTab === 'profil' ? 'active' : ''}`}
          onClick={() => setActiveTab('profil')}
        >
          <IconWallet />
          <span>Portefeuille</span>
        </button>
      </nav>

      {/* Brand Value Pill */}
      <div className="sidebar-brand-quote">
        <div className="quote-title">Une maison pour tout le quotidien</div>
        <div className="quote-sub">Proximité · Simplicité · Confiance</div>
      </div>

      {/* Sidebar Footer User Profile */}
      <div className="sidebar-footer">
        <div className="user-profile-chip" onClick={() => setActiveTab('profil')} style={{ cursor: 'pointer' }}>
          <div className="avatar-circle">{user.avatarInitials}</div>
          <div style={{ minWidth: 0 }}>
            <div className="user-name">{user.name}</div>
            <div className="user-phone">+{user.phone}</div>
          </div>
        </div>
        <button className="btn-icon" title="Paramètres du compte" onClick={() => setActiveTab('profil')}>
          <IconSettings />
        </button>
      </div>
    </aside>
  );
};
