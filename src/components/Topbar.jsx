import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { IconWallet, IconSunMoon } from './Icons.jsx';
import { formatFCFA, formatShortFCFA } from '../utils/format.js';

export const Topbar = () => {
  const { activeTab, activeMarketTab, balance, toggleTheme, setActiveTab } = useApp();

  let title = 'Discussions';
  let subtitle = 'Messagerie instantanée & transferts';

  switch (activeTab) {
    case 'chat':
      title = 'Discussions';
      subtitle = 'Messagerie instantanée directe et transferts';
      break;
    case 'marche':
      title = activeMarketTab === 'marche' ? 'Marché Local' : 'Prestataires & Artisans';
      subtitle = 'Produits locaux et artisans vérifiés au Togo';
      break;
    case 'mini':
      title = 'Services Publics';
      subtitle = 'Factures CEET, Canal+, TDE et télécoms';
      break;
    case 'dec':
      title = 'Moments';
      subtitle = 'Créateurs et tendances locales';
      break;
    case 'profil':
      title = 'Portefeuille';
      subtitle = 'Solde, encaissements QR et historique';
      break;
    default:
      break;
  }

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        {/* Mobile Brand Mark with mandatory white pastille */}
        <div className="mobile-brand-mark" onClick={() => setActiveTab('chat')} style={{ cursor: 'pointer' }}>
          <div className="brand-badge-pastille mini">
            <img src="/brand/logo-icon.png" alt="AHOUE" className="brand-logo-img-mini" />
          </div>
          <span className="brand-name-mini">AHOUE</span>
        </div>

        <div className="navbar-page-title">
          <h2 className="page-title">{title}</h2>
          <span className="page-subtitle">{subtitle}</span>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Balance badge with insécable FCFA formatting */}
        <button className="badge-wallet-preview" onClick={() => setActiveTab('profil')} title="Mon Portefeuille AHOUE">
          <IconWallet size={16} />
          <span className="wallet-amount-full">{formatFCFA(balance)}</span>
          <span className="wallet-amount-short">{formatShortFCFA(balance)}</span>
        </button>

        <button className="btn-icon" onClick={toggleTheme} title="Changer de thème">
          <IconSunMoon />
        </button>
      </div>
    </header>
  );
};
