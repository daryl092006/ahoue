import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { generateQRCodeSVG } from '../utils/qr.js';
import { formatFCFA } from '../utils/format.js';
import { IconBolt, IconQr, IconScan, IconShield } from '../components/Icons.jsx';

export const WalletPage = () => {
  const { balance, transactions, bookings, user, openModal, updatePin } = useApp();
  const qrSvg = generateQRCodeSVG(`ahoue://pay?phone=${user.phone}&name=${encodeURIComponent(user.name)}`, 140);

  const handlePromptPin = () => {
    const newPin = prompt('Entrez votre nouveau code PIN de sécurité (4 chiffres) :', '1234');
    if (newPin && /^\d{4}$/.test(newPin)) {
      updatePin(newPin);
    }
  };

  return (
    <div className="wallet-grid">
      {/* Left Column: Virtual Card, QR and Security */}
      <div>
        <div className="wallet-card-premium">
          <div className="wallet-chip-line">
            <span className="wallet-org-tag">AHOUE PAY · TOGO</span>
            <span style={{ fontWeight: 800, fontSize: 11, background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>Compte vérifié</span>
          </div>

          <div style={{ fontSize: 12.5, opacity: 0.85, marginBottom: 4 }}>Solde disponible</div>
          <div className="wallet-balance-num">{formatFCFA(balance)}</div>

          <div className="wallet-quick-actions">
            <button className="wallet-act-btn primary" onClick={() => openModal('TOPUP')}>
              <IconBolt />
              <span>Recharger</span>
            </button>
            <button className="wallet-act-btn" onClick={() => openModal('MY_QR')}>
              <IconQr />
              <span>Mon QR</span>
            </button>
            <button className="wallet-act-btn" onClick={() => openModal('SCANNER')}>
              <IconScan />
              <span>Scanner</span>
            </button>
          </div>
        </div>

        {/* QR Code Quick Card */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink-primary)', marginBottom: 2 }}>Encaisser un Paiement</div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 12 }}>Faites scanner ce code pour recevoir des fonds instantanément.</div>

          <div
            style={{ display: 'inline-block', padding: 12, background: '#FFFFFF', borderRadius: 16, border: '1px solid var(--line-border)', boxShadow: 'var(--shadow-xs)', marginBottom: 10 }}
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />

          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink-secondary)' }}>+{user.phone}</div>
        </div>

        {/* Security & Access */}
        <div className="card">
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconShield />
            <span>Sécurité & Accès</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--line-border-subtle)', fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 700 }}>Code PIN de transaction</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>Défini pour valider chaque opération</div>
            </div>
            <button className="btn btn-ghost" onClick={handlePromptPin} style={{ padding: '5px 12px', fontSize: 12 }}>Modifier</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 700 }}>Plafond de sécurité</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>100&nbsp;000&nbsp;FCFA / opération</div>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Actif</span>
          </div>
        </div>
      </div>

      {/* Right Column: Transactions & Bookings */}
      <div>
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
          <div className="card" style={{ marginBottom: 0, padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 600 }}>Dépenses du mois</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 800, color: 'var(--danger)', marginTop: 4 }}>-16&nbsp;500&nbsp;FCFA</div>
          </div>
          <div className="card" style={{ marginBottom: 0, padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 600 }}>Recharges reçues</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 800, color: 'var(--success)', marginTop: 4 }}>+25&nbsp;000&nbsp;FCFA</div>
          </div>
          <div className="card" style={{ marginBottom: 0, padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 600 }}>Réservations en cours</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>{bookings.length} active</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16 }}>Journal des Mouvements Financiers</div>
            <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>Mouvements récents</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Intitulé de l’opération</th>
                  <th>Moyen & Réf.</th>
                  <th>Date & Heure</th>
                  <th style={{ textAlign: 'right' }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{tx.title}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{tx.method}</div>
                      <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--ink-secondary)' }}>{tx.ref}</div>
                    </td>
                    <td style={{ color: 'var(--ink-muted)', fontSize: 12.5 }}>
                      {tx.date}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 800, color: tx.amount > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {tx.amount > 0 ? '+' : ''}{formatFCFA(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bookings Overview */}
        {bookings.length > 0 && (
          <div className="card" style={{ marginTop: 18 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Réservations Artisans Enregistrées</div>
            {bookings.map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{b.serviceName} ({b.job})</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{b.date} · {b.notes || ''}</div>
                </div>
                <span className="verified-pill">{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
