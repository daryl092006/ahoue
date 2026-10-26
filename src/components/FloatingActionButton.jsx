import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  IconPlus,
  IconChat,
  IconWallet,
  IconScan,
  IconQr,
  IconBolt,
  IconPhone,
  IconCompass,
  IconMarket,
  IconChevronRight
} from './Icons.jsx';

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeTab, activeChatId, openModal, setActiveTab } = useApp();

  // Charte & UX : Pas de bouton flottant au niveau des discussions (en particulier dans une discussion spécifique)
  if (activeTab === 'chat') {
    return null;
  }

  const handleAction = (action) => {
    setIsOpen(false);
    action();
  };

  // Actions contextuelles par écran (Charte AHOUE : "un seul « + » orange en bas à droite regroupe les actions de la page")
  const getContextualActions = () => {
    switch (activeTab) {
      case 'chat':
        return [
          {
            label: "Transférer de l'argent",
            desc: "Envoi direct sans frais",
            icon: <IconWallet size={18} />,
            action: () => openModal('CHAT_TRANSFER', { chatId: 'c_maman', recipientName: 'Maman' })
          },
          {
            label: "Afficher mon QR",
            desc: "Pour recevoir un paiement",
            icon: <IconQr size={18} />,
            action: () => openModal('MY_QR')
          }
        ];
      case 'marche':
        return [
          {
            label: "Vendre un article",
            desc: "Publier dans le Grand Marché",
            icon: <IconMarket size={18} />,
            action: () => openModal('VENDOR_PUBLISH')
          },
          {
            label: "Proposer un service",
            desc: "Inscrire votre métier ou atelier",
            icon: <IconPlus size={18} />,
            action: () => openModal('SERVICE_PUBLISH')
          }
        ];
      case 'mini':
        return [
          {
            label: "Payer une facture",
            desc: "Électricité CEET, TDE, Canal+",
            icon: <IconBolt size={18} />,
            action: () => openModal('PAYMENT', {
              amount: 10000,
              title: 'Facture CEET Électricité',
              recipient: 'CEET Togo'
            })
          },
          {
            label: "Acheter du crédit",
            desc: "Recharge Flooz ou Mixx by Yas",
            icon: <IconPhone size={18} />,
            action: () => openModal('TOPUP')
          }
        ];
      case 'dec':
        return [
          {
            label: "Publier un Moment",
            desc: "Partager une vidéo ou annonce",
            icon: <IconCompass size={18} />,
            action: () => {
              const el = document.getElementById('reel-composer');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }
        ];
      case 'profil':
      default:
        return [
          {
            label: "Recharger mon portefeuille",
            desc: "Via Flooz ou Mixx by Yas",
            icon: <IconWallet size={18} />,
            action: () => openModal('TOPUP')
          },
          {
            label: "Scanner un QR Code",
            desc: "Payer chez un commerçant",
            icon: <IconScan size={18} />,
            action: () => openModal('SCANNER')
          },
          {
            label: "Mon Code QR",
            desc: "Recevoir des fonds",
            icon: <IconQr size={18} />,
            action: () => openModal('MY_QR')
          }
        ];
    }
  };

  const actions = getContextualActions();

  return (
    <div className="fab-container">
      {isOpen && (
        <>
          <div className="fab-backdrop" onClick={() => setIsOpen(false)} />
          <div className="fab-menu" role="menu" aria-label="Actions rapides">
            <div className="fab-menu-header">
              <span className="fab-menu-title">Actions rapides</span>
              <span className="fab-menu-badge">AHOUE</span>
            </div>
            <div className="fab-menu-list">
              {actions.map((item, idx) => (
                <button
                  key={idx}
                  className="fab-menu-item"
                  onClick={() => handleAction(item.action)}
                >
                  <div className="fab-item-icon">{item.icon}</div>
                  <div className="fab-item-text">
                    <div className="fab-item-title">{item.label}</div>
                    <div className="fab-item-desc">{item.desc}</div>
                  </div>
                  <IconChevronRight size={16} className="fab-item-arrow" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        id="btn-ahoue-fab"
        className={`fab-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Actions de la page"
        title="Actions de la page (+)"
      >
        <span className={`fab-icon-wrap ${isOpen ? 'rotate' : ''}`}>
          <IconPlus size={24} />
        </span>
      </button>
    </div>
  );
};
