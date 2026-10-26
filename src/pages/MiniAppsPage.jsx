import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  IconSearch,
  IconChevronRight,
  IconBolt,
  IconTv,
  IconTruck,
  IconPhone,
  IconHeartbeat,
  IconWater,
  IconGraduation,
  IconWifi
} from '../components/Icons.jsx';

export const MiniAppsPage = () => {
  const { openModal } = useApp();
  const [search, setSearch] = useState('');

  const minis = [
    {
      id: 'ceet',
      name: 'Électricité CEET',
      icon: <IconBolt size={22} />,
      bg: 'var(--accent-orange-light)',
      color: 'var(--accent-orange)',
      desc: 'Recharge compteur prépayé et règlement de factures'
    },
    {
      id: 'canal',
      name: 'Canal+ Togo',
      icon: <IconTv size={22} />,
      bg: 'var(--primary-light)',
      color: 'var(--primary)',
      desc: 'Réabonnement décodeur avec réactivation immédiate'
    },
    {
      id: 'livraison',
      name: 'Livraison Express',
      icon: <IconTruck size={22} />,
      bg: 'var(--success-light)',
      color: 'var(--success)',
      desc: 'Courses moto rapides et sécurisées dans Grand Lomé'
    },
    {
      id: 'recharge',
      name: 'Recharge Télécoms',
      icon: <IconPhone size={22} />,
      bg: 'var(--danger-light)',
      color: 'var(--danger)',
      desc: 'Crédit d’appel et forfaits internet Togocel & Moov'
    },
    {
      id: 'sante',
      name: 'Consultation & Santé',
      icon: <IconHeartbeat size={22} />,
      bg: '#FDF4FF',
      color: '#A855F7',
      desc: 'Prise de rendez-vous CHU Tokoin, Campus et cliniques'
    },
    {
      id: 'tde',
      name: 'Eau Potable TDE',
      icon: <IconWater size={22} />,
      bg: '#F0F9FF',
      color: '#0284C7',
      desc: 'Règlement quittance Société Togolaise des Eaux'
    },
    {
      id: 'scolarite',
      name: 'Droits Universitaires',
      icon: <IconGraduation size={22} />,
      bg: '#F5F3FF',
      color: '#7C3AED',
      desc: 'Université de Lomé, Kara et lycées officiels'
    },
    {
      id: 'canalbox',
      name: 'Fibre CanalBox',
      icon: <IconWifi size={22} />,
      bg: '#ECFDF5',
      color: '#059669',
      desc: 'Abonnement et renouvellement fibre optique très haut débit'
    }
  ];

  const filtered = minis.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleLaunch = (miniId) => {
    switch (miniId) {
      case 'ceet':
        openModal('PAYMENT', {
          amount: 10000,
          title: 'Recharge Électricité CEET (Compteur 01458920193)',
          recipient: 'CEET Lomé',
          onSuccess: (res) => {
            const token = Array.from({ length: 5 }, () => Math.floor(1000 + Math.random() * 9000)).join(' ');
            openModal('RECEIPT', {
              title: 'Reçu Officiel CEET',
              ref: res.ref,
              amount: 10000,
              details: [
                ['Compagnie', 'CEET Togo'],
                ['Compteur', '01458920193'],
                ['Mode', 'Prépayé (Jeton instantané)'],
                ['Code Jeton (20 chiffres)', token],
                ['Volume d’énergie', '80.0 kWh'],
                ['Statut', 'Validé']
              ]
            });
          }
        });
        break;

      case 'canal':
        openModal('PAYMENT', {
          amount: 10000,
          title: 'Canal+ Togo (Formule Évasion)',
          recipient: 'Canal+ Afrique',
          onSuccess: (res) => {
            openModal('RECEIPT', {
              title: 'Paiement confirmé. Votre abonnement est actif.',
              ref: res.ref,
              amount: 10000,
              details: [
                ['Abonné', 'Gaston Denis'],
                ['Carte Décodeur', '14285901234'],
                ['Formule', 'Évasion (1 mois)'],
                ['Signal TV', 'Réactivé immédiatement']
              ]
            });
          }
        });
        break;

      case 'livraison':
        openModal('PAYMENT', {
          amount: 1500,
          title: 'Course Moto (Grand Marché → Bè-Château)',
          recipient: 'AHOUE Express Moto',
          onSuccess: (res) => {
            openModal('RECEIPT', {
              title: 'Course réservée. Le livreur est prévenu.',
              ref: res.ref,
              amount: 1500,
              details: [
                ['Livreur', 'Koffi Amégan (Moto Haojue)'],
                ['Prise en charge', 'Grand Marché de Lomé'],
                ['Destination', 'Bè-Château'],
                ['Statut', 'Coursier en route']
              ]
            });
          }
        });
        break;

      case 'recharge':
        openModal('PAYMENT', {
          amount: 2000,
          title: 'Recharge Mobile Togocel (+228 90 12 34 56)',
          recipient: 'Togocel Togo',
          onSuccess: (res) => {
            openModal('RECEIPT', {
              title: 'Recharge confirmée. Votre crédit est disponible.',
              ref: res.ref,
              amount: 2000,
              details: [
                ['Numéro', '+228 90 12 34 56'],
                ['Opérateur', 'Togocel'],
                ['Type', 'Crédit principal'],
                ['Statut', 'Disponible']
              ]
            });
          }
        });
        break;

      case 'sante':
        openModal('PAYMENT', {
          amount: 5000,
          title: 'Consultation Médecine Générale (CHU Tokoin)',
          recipient: 'CHU Sylvanus Olympio',
          onSuccess: (res) => {
            openModal('RECEIPT', {
              title: 'Ticket Médical Validé',
              ref: res.ref,
              amount: 5000,
              details: [
                ['Établissement', 'CHU Sylvanus Olympio'],
                ['Spécialité', 'Médecine Générale'],
                ['Date & Heure', 'Demain à 09h00'],
                ['Patient', 'Gaston Denis']
              ]
            });
          }
        });
        break;

      case 'tde':
        openModal('PAYMENT', {
          amount: 4500,
          title: 'Facture Eau TDE (Police 0847291)',
          recipient: 'TDE Lomé',
          onSuccess: (res) => {
            openModal('RECEIPT', {
              title: 'Quittance TDE Soldée',
              ref: res.ref,
              amount: 4500,
              details: [
                ['Organisme', 'Société Togolaise des Eaux'],
                ['Police', '0847291'],
                ['Période', 'Octobre 2026'],
                ['Statut', 'Soldé en totalité']
              ]
            });
          }
        });
        break;

      case 'scolarite':
        openModal('PAYMENT', {
          amount: 25000,
          title: 'Droits Universitaires (Université de Lomé)',
          recipient: 'Université de Lomé',
          onSuccess: (res) => {
            openModal('RECEIPT', {
              title: 'Quittance Universitaire Officielle',
              ref: res.ref,
              amount: 25000,
              details: [
                ['Établissement', 'Université de Lomé (UL)'],
                ['Matricule', '245890-UL'],
                ['Année Académique', '2026 - 2027'],
                ['Statut', 'Inscription confirmée']
              ]
            });
          }
        });
        break;

      case 'canalbox':
        openModal('PAYMENT', {
          amount: 25000,
          title: 'Abonnement Fibre CanalBox (Fibre Confort 100 Mbps)',
          recipient: 'CanalBox Togo',
          onSuccess: (res) => {
            openModal('RECEIPT', {
              title: 'Fibre CanalBox Prolongée',
              ref: res.ref,
              amount: 25000,
              details: [
                ['Ligne', 'CBX-982104'],
                ['Formule', 'Fibre Confort 100 Mbps'],
                ['Période', '+30 jours'],
                ['Débit', 'Très Haut Débit Illimité']
              ]
            });
          }
        });
        break;

      default:
        break;
    }
  };

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h2 className="section-title" style={{ margin: 0, fontSize: 18 }}>Services Numériques Essentiels</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 2 }}>Paiements de factures et accès aux services publics du Togo en un clic.</div>
        </div>

        <div className="search-field" style={{ maxWidth: 380 }}>
          <IconSearch />
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="minis-grid">
        {filtered.map(m => (
          <button
            key={m.id}
            className="mini-card-btn"
            onClick={() => handleLaunch(m.id)}
          >
            <div className="mini-icon-frame" style={{ background: m.bg, color: m.color }}>
              {m.icon}
            </div>
            <div className="mini-card-info">
              <div className="mini-title">{m.name}</div>
              <div className="mini-desc">{m.desc}</div>
            </div>
            <div style={{ color: 'var(--ink-muted)' }}>
              <IconChevronRight />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
