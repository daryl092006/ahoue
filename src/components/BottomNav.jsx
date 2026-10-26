import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { IconChat, IconMarket, IconGrid, IconCompass, IconWallet } from './Icons.jsx';

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
        onClick={() => setActiveTab('chat')}
      >
        <IconChat size={20} />
        <span>Chat</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'marche' ? 'active' : ''}`}
        onClick={() => setActiveTab('marche')}
      >
        <IconMarket size={20} />
        <span>Marché</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'mini' ? 'active' : ''}`}
        onClick={() => setActiveTab('mini')}
      >
        <IconGrid size={20} />
        <span>Services</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'dec' ? 'active' : ''}`}
        onClick={() => setActiveTab('dec')}
      >
        <IconCompass size={20} />
        <span>Découvrir</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'profil' ? 'active' : ''}`}
        onClick={() => setActiveTab('profil')}
      >
        <IconWallet size={20} />
        <span>Portefeuille</span>
      </button>
    </nav>
  );
};
