import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { generateQRCodeSVG } from '../utils/qr.js';
import { formatFCFA } from '../utils/format.js';
import { IconCheck, IconWallet, IconPhone, IconBolt, IconHeart, IconMapPin, IconScan, IconShield } from './Icons.jsx';

export const ModalHost = () => {
  const { modal, closeModal, pay, showToast, openModal, user, balance, topup, toggleFavorite, favorites, bookService, addProduct, addService, sendMoneyInChat } = useApp();

  if (!modal.open) return null;

  return (
    <div className="sheet-overlay" onClick={closeModal}>
      <div className="sheet-dialog" onClick={(e) => e.stopPropagation()}>
        {modal.type === 'PAYMENT' && <PaymentModal data={modal.data} />}
        {modal.type === 'RECEIPT' && <ReceiptModal data={modal.data} />}
        {modal.type === 'PRODUCT_DETAIL' && <ProductDetailModal data={modal.data} />}
        {modal.type === 'BOOKING' && <BookingModal data={modal.data} />}
        {modal.type === 'TOPUP' && <TopupModal />}
        {modal.type === 'MY_QR' && <MyQrModal />}
        {modal.type === 'SCANNER' && <ScannerModal />}
        {modal.type === 'VENDOR_PUBLISH' && <VendorPublishModal />}
        {modal.type === 'SERVICE_PUBLISH' && <ServicePublishModal />}
        {modal.type === 'CHAT_TRANSFER' && <ChatTransferModal data={modal.data} />}
      </div>
    </div>
  );
};

// 1. Payment Modal
const PaymentModal = ({ data }) => {
  const { amount, title, recipient, onSuccess } = data;
  const { user, balance, pay, showToast, closeModal, openModal } = useApp();
  const [method, setMethod] = useState('Portefeuille AHOUE');
  const [pin, setPin] = useState('1234');

  const isWalletSufficient = balance >= amount;

  const handleConfirm = () => {
    if (user.pin && pin !== user.pin) {
      showToast('Code PIN incorrect : réessayez.');
      return;
    }

    if (method === 'Portefeuille AHOUE' && !isWalletSufficient) {
      showToast('Solde insuffisant : rechargez votre portefeuille.');
      return;
    }

    const res = pay(amount, title, recipient, method);
    if (!res.success) return;

    closeModal();
    showToast('Paiement confirmé. Votre reçu est prêt.');

    if (onSuccess) {
      onSuccess(res);
    } else {
      openModal('RECEIPT', {
        title: 'Paiement confirmé',
        ref: res.ref,
        amount,
        details: [
          ['Prestation / Objet', title],
          ['Bénéficiaire', recipient || 'Marchand AHOUE'],
          ['Moyen de Paiement', method],
          ['Date & Heure', new Date().toLocaleString('fr-FR')]
        ]
      });
    }
  };

  return (
    <div className="payment-modal-content">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--primary-light)',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          color: 'var(--primary)',
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 10
        }}>
          <IconShield size={14} />
          <span>Paiement sécurisé AHOUE</span>
        </div>
        <h3 className="sheet-title" style={{ fontSize: 22, marginBottom: 4, letterSpacing: '-0.02em' }}>
          Validation de règlement
        </h3>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
          Vérifiez les détails et confirmez votre transaction.
        </p>
      </div>

      {/* Recap Ticket Card */}
      <div style={{
        padding: '16px 18px',
        background: 'var(--bg-muted)',
        border: '1px solid var(--line-border)',
        borderRadius: 'var(--radius-card)',
        marginBottom: 18,
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Article / Prestation
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink-primary)', marginTop: 2 }}>
              {title}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Bénéficiaire :</span>
              <span className="verified-pill" style={{ padding: '2px 8px', fontSize: 11 }}>
                {recipient || 'Marchand certifié AHOUE'}
              </span>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingTop: 12,
          borderTop: '1px dashed var(--line-border)'
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)' }}>Montant total</div>
            <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>Frais AHOUE : 0 FCFA offerts</div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
            {formatFCFA(amount)}
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 8, display: 'block' }}>
          Mode de règlement
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {/* Portefeuille AHOUE */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              border: method === 'Portefeuille AHOUE' ? '2px solid var(--primary)' : '1px solid var(--line-border)',
              borderRadius: 'var(--radius-card)',
              background: method === 'Portefeuille AHOUE' ? 'var(--primary-light)' : 'var(--bg-surface)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-btn)',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <IconWallet size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--ink-primary)' }}>
                  Portefeuille AHOUE
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                  Solde disponible : <b>{formatFCFA(balance)}</b>
                  {isWalletSufficient ? (
                    <span style={{ color: 'var(--success)', fontWeight: 700, marginLeft: 6 }}>• Suffisant</span>
                  ) : (
                    <span style={{ color: 'var(--danger)', fontWeight: 700, marginLeft: 6 }}>• Insuffisant</span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!isWalletSufficient && (
                <button
                  type="button"
                  className="btn btn-alt"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal('TOPUP');
                  }}
                  style={{ padding: '4px 10px', fontSize: 11, minHeight: '32px' }}
                >
                  Recharger
                </button>
              )}
              <input
                type="radio"
                name="p-method"
                checked={method === 'Portefeuille AHOUE'}
                onChange={() => setMethod('Portefeuille AHOUE')}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>
          </label>

          {/* Flooz */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              border: method === 'Flooz' ? '2px solid var(--primary)' : '1px solid var(--line-border)',
              borderRadius: 'var(--radius-card)',
              background: method === 'Flooz' ? 'var(--primary-light)' : 'var(--bg-surface)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-btn)',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-orange)',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <IconPhone size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--ink-primary)' }}>
                  Flooz (Moov Money Togo)
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>
                  Débit direct sans frais additionnels
                </div>
              </div>
            </div>
            <input
              type="radio"
              name="p-method"
              checked={method === 'Flooz'}
              onChange={() => setMethod('Flooz')}
              style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </label>

          {/* Mixx by Yas */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              border: method === 'Mixx by Yas' ? '2px solid var(--primary)' : '1px solid var(--line-border)',
              borderRadius: 'var(--radius-card)',
              background: method === 'Mixx by Yas' ? 'var(--primary-light)' : 'var(--bg-surface)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-btn)',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <IconBolt size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--ink-primary)' }}>
                  Mixx by Yas (Togocel T-Money)
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>
                  Débit direct sans frais additionnels
                </div>
              </div>
            </div>
            <input
              type="radio"
              name="p-method"
              checked={method === 'Mixx by Yas'}
              onChange={() => setMethod('Mixx by Yas')}
              style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </label>
        </div>
      </div>

      {/* Code Secret de Validation */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)' }}>
            Code secret de validation
          </label>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setPin('1234')}
            style={{ fontSize: 11.5, padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}
          >
            Utiliser 1234 (test)
          </button>
        </div>

        <input
          type="password"
          maxLength={4}
          style={{
            textAlign: 'center',
            letterSpacing: 14,
            fontSize: 24,
            fontWeight: 800,
            borderRadius: 'var(--radius-btn)',
            padding: '12px',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--line-border)',
            width: '100%'
          }}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••"
        />
        <div style={{ fontSize: 11.5, color: 'var(--ink-muted)', textAlign: 'center', marginTop: 6 }}>
          Votre code PIN sécurise chaque règlement AHOUE.
        </div>
      </div>

      {/* Action Buttons : Acheter (Orange dégradé avec texte anthracite) et Annuler */}
      <button
        id="btn-confirm-payment"
        className="btn btn-orange btn-full"
        onClick={handleConfirm}
        style={{ padding: 14, fontSize: 15, fontWeight: 800, minHeight: '48px', marginBottom: 8 }}
      >
        Acheter • {formatFCFA(amount)}
      </button>

      <button
        className="btn btn-ghost btn-full"
        onClick={closeModal}
        style={{ minHeight: '44px', color: 'var(--ink-secondary)' }}
      >
        Annuler
      </button>
    </div>
  );
};

// 2. Receipt Modal
const ReceiptModal = ({ data }) => {
  const { closeModal } = useApp();
  const qrSvg = generateQRCodeSVG(`ahoue://receipt?ref=${data.ref}&amount=${data.amount}&t=${Date.now()}`, 120);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <IconCheck size={24} />
        </div>
        <div className="sheet-title" style={{ marginBottom: 2 }}>{data.title || 'Paiement confirmé'}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>Réf. Transaction : <b>{data.ref}</b></div>
      </div>

      <div className="card" style={{ marginBottom: 16, background: 'var(--bg-muted)' }}>
        {(data.details || []).map(([k, v], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--line-border)', fontSize: 13 }}>
            <span style={{ color: 'var(--ink-muted)' }}>{k}</span>
            <span style={{ fontWeight: 700, color: 'var(--ink-primary)', textAlign: 'right', maxWidth: '65%', wordBreak: 'break-word' }}>{v}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 2px', fontSize: 15 }}>
          <span style={{ fontWeight: 800, color: 'var(--ink-primary)' }}>Montant Réglé</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--primary)', fontSize: 17 }}>
            {formatFCFA(data.amount)}
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ display: 'inline-block', padding: 10, background: '#fff', borderRadius: 12, border: '1px solid var(--line-border)' }} dangerouslySetInnerHTML={{ __html: qrSvg }} />
        <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>Code QR officiel pour vérification auprès du prestataire</div>
      </div>

      <button className="btn btn-full" onClick={closeModal}>
        Continuer
      </button>
    </div>
  );
};

// 3. Product Detail Modal
const ProductDetailModal = ({ data: product }) => {
  const { closeModal, openModal, toggleFavorite, favorites } = useApp();
  const isFav = favorites.includes(product.id);

  return (
    <div>
      <div style={{ width: '100%', height: 260, borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 14, position: 'relative' }}>
        <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {product.tag && <span className="product-badge-tag" style={{ fontSize: 12, padding: '4px 10px' }}>{product.tag}</span>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div className="sheet-title" style={{ fontSize: 20, marginBottom: 0 }}>{product.title}</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>
          {formatFCFA(product.price)}
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <IconMapPin />
        <span>{product.seller} · {product.location}</span>
      </div>

      <div style={{ fontSize: 14, color: 'var(--ink-secondary)', lineHeight: 1.6, marginBottom: 20, background: 'var(--bg-muted)', padding: 14, borderRadius: 'var(--radius-md)' }}>
        {product.description}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost" onClick={() => toggleFavorite(product.id)} style={{ flexShrink: 0, padding: '0 16px' }}>
          <IconHeart filled={isFav} />
          <span>{isFav ? 'Enregistré' : 'Enregistrer'}</span>
        </button>
        <button
          className="btn btn-orange btn-full"
          onClick={() => {
            closeModal();
            openModal('PAYMENT', {
              amount: product.price,
              title: product.title,
              recipient: product.seller
            });
          }}
        >
          Acheter
        </button>
      </div>
    </div>
  );
};

// 4. Booking Modal
const BookingModal = ({ data: service }) => {
  const { closeModal, bookService } = useApp();
  const [date, setDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    bookService(service.id, `${date} vers ${time}`, notes);
    closeModal();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div className="service-avatar-box">
          {service.initials || service.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="sheet-title" style={{ marginBottom: 0, fontSize: 18 }}>Réserver {service.name}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{service.job} · {service.quarter}</div>
        </div>
      </div>

      <div className="sheet-subtitle" style={{ marginBottom: 14 }}>Tarif indicatif de base : <b>{formatFCFA(service.startingPrice)}</b></div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Date d’intervention souhaitée</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Heure approximative</label>
        <select value={time} onChange={(e) => setTime(e.target.value)}>
          <option value="09:00">Matinée (09h00)</option>
          <option value="11:30">Fin de matinée (11h30)</option>
          <option value="14:00">Après-midi (14h00)</option>
          <option value="16:30">Fin d’après-midi (16h30)</option>
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Détails de l'intervention</label>
        <textarea rows="2" placeholder="Ex: Raccordement tuyauterie, remplacement vanne..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ resize: 'none' }} />
      </div>

      <button className="btn btn-full" onClick={handleSubmit}>
        Confirmer la réservation
      </button>
    </div>
  );
};

// 5. Topup Modal
const TopupModal = () => {
  const { closeModal, topup } = useApp();
  const [method, setMethod] = useState('Flooz');
  const [amount, setAmount] = useState(10000);

  const handleConfirm = () => {
    if (!amount || amount < 500) return;
    topup(amount, method);
    closeModal();
  };

  return (
    <div>
      <div className="sheet-title">Recharger mon Portefeuille AHOUE</div>
      <div className="sheet-subtitle">Alimentation instantanée via Mobile Money sans commission.</div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 6, display: 'block' }}>Moyen de rechargement</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label style={{ border: method === 'Flooz' ? '1.5px solid var(--primary)' : '1px solid var(--line-border)', padding: 12, borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer', background: method === 'Flooz' ? 'var(--primary-light)' : 'var(--bg-surface)' }}>
            <input type="radio" name="tm" checked={method === 'Flooz'} onChange={() => setMethod('Flooz')} />
            <div style={{ fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>Flooz (Moov)</div>
          </label>
          <label style={{ border: method === 'Mixx by Yas' ? '1.5px solid var(--primary)' : '1px solid var(--line-border)', padding: 12, borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer', background: method === 'Mixx by Yas' ? 'var(--primary-light)' : 'var(--bg-surface)' }}>
            <input type="radio" name="tm" checked={method === 'Mixx by Yas'} onChange={() => setMethod('Mixx by Yas')} />
            <div style={{ fontWeight: 800, color: 'var(--ink-primary)', marginTop: 4 }}>Mixx by Yas</div>
          </label>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Montant à créditer (FCFA)</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
          {[5000, 10000, 25000].map(v => (
            <button key={v} className="btn btn-ghost" onClick={() => setAmount(v)} style={{ fontSize: 12 }}>
              {formatFCFA(v)}
            </button>
          ))}
        </div>
        <input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value, 10))} min="500" step="500" />
      </div>

      <button className="btn btn-full" onClick={handleConfirm}>
        Recharger le portefeuille
      </button>
    </div>
  );
};

// 6. My QR Modal
const MyQrModal = () => {
  const { user, closeModal } = useApp();
  const qrSvg = generateQRCodeSVG(`ahoue://pay?phone=${user.phone}&name=${encodeURIComponent(user.name)}`, 190);

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="sheet-title" style={{ marginBottom: 2 }}>Code QR Personnel</div>
      <div className="sheet-subtitle">À présenter pour recevoir un transfert immédiat.</div>

      <div style={{ display: 'inline-block', padding: 16, background: '#FFFFFF', borderRadius: 16, border: '1px solid var(--line-border)', boxShadow: 'var(--shadow-sm)', margin: '16px 0' }} dangerouslySetInnerHTML={{ __html: qrSvg }} />

      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink-primary)' }}>{user.name}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 18 }}>+{user.phone}</div>

      <button className="btn btn-ghost btn-full" onClick={closeModal}>
        Fermer
      </button>
    </div>
  );
};

// 7. Scanner Modal
const ScannerModal = () => {
  const { closeModal, openModal } = useApp();

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="sheet-title" style={{ marginBottom: 2 }}>Scanner un Code QR</div>
      <div className="sheet-subtitle">Pointez la caméra vers un code marchand ou bénéficiaire.</div>

      <div style={{ width: 220, height: 220, margin: '16px auto', background: 'var(--bg-muted)', borderRadius: 16, border: '2px dashed var(--line-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <IconScan size={32} />
        <div style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 600 }}>Caméra en attente</div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button
          className="btn btn-alt btn-full"
          onClick={() => {
            closeModal();
            openModal('PAYMENT', {
              amount: 2500,
              title: 'Paiement Boutique Akossiwa (Scan QR)',
              recipient: 'Boutique Akossiwa'
            });
          }}
        >
          Simuler un scan : Boutique Akossiwa (2&nbsp;500&nbsp;FCFA)
        </button>
      </div>

      <button className="btn btn-ghost btn-full" onClick={closeModal}>
        Annuler
      </button>
    </div>
  );
};

// 8. Vendor Publish Modal
const VendorPublishModal = () => {
  const { closeModal, addProduct, user } = useApp();
  const [title, setTitle] = useState('Tissu Kente Artisanal 4 Yards');
  const [price, setPrice] = useState(14000);
  const [category, setCategory] = useState('Mode & Tissus');
  const [desc, setDesc] = useState('Pièce artisanale de qualité supérieure, fils peignés teints de manière durable.');

  const handleSubmit = () => {
    if (!title || !price) return;
    addProduct({
      title,
      price,
      category,
      description: desc,
      seller: user.shop || user.name,
      location: 'Grand Marché, Lomé',
      tag: 'Nouveauté',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80'
    });
    closeModal();
  };

  return (
    <div>
      <div className="sheet-title">Publier un Article sur le Marché</div>
      <div className="sheet-subtitle">Votre annonce sera visible par toute la communauté d’acheteurs AHOUE.</div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Titre de l’article</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Prix en FCFA</label>
          <input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value, 10))} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Catégorie</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Mode & Tissus">Mode & Tissus</option>
            <option value="Soins & Beauté">Soins & Beauté</option>
            <option value="Artisanat">Artisanat</option>
            <option value="Épicerie">Épicerie</option>
            <option value="Chaussures">Chaussures</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Description</label>
        <textarea rows="2" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ resize: 'none' }} />
      </div>

      <button className="btn btn-full" onClick={handleSubmit}>
        Mettre en vente
      </button>
    </div>
  );
};

// 9. Service Publish Modal
const ServicePublishModal = () => {
  const { closeModal, addService, user } = useApp();
  const [job, setJob] = useState('Climatisation & Froid');
  const [price, setPrice] = useState(8000);
  const [quarter, setQuarter] = useState('Agoè & Lomé');
  const [desc, setDesc] = useState('Installation, dépannage et recharge de climatiseurs split à domicile.');

  const handleSubmit = () => {
    if (!job || !price) return;
    addService({
      name: user.name,
      job,
      quarter,
      startingPrice: price,
      description: desc
    });
    closeModal();
  };

  return (
    <div>
      <div className="sheet-title">Proposer un Service Artisan</div>
      <div className="sheet-subtitle">Faites-vous référencer parmi les professionnels de Lomé.</div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Métier / Spécialité</label>
        <input type="text" value={job} onChange={(e) => setJob(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Tarif indicatif de base (FCFA)</label>
          <input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value, 10))} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Quartier d’intervention</label>
          <input type="text" value={quarter} onChange={(e) => setQuarter(e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Description des compétences</label>
        <textarea rows="2" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ resize: 'none' }} />
      </div>

      <button className="btn btn-full" onClick={handleSubmit}>
        Enregistrer mon activité
      </button>
    </div>
  );
};

// 10. Chat Transfer Modal
const ChatTransferModal = ({ data }) => {
  const { chatId, recipientName } = data;
  const { closeModal, sendMoneyInChat } = useApp();
  const [amount, setAmount] = useState(2500);

  const handleConfirm = () => {
    if (!amount || amount < 100) return;
    const ok = sendMoneyInChat(chatId, amount);
    if (ok) closeModal();
  };

  return (
    <div>
      <div className="sheet-title">Transférer des fonds</div>
      <div className="sheet-subtitle">Envoi direct de FCFA à <b>{recipientName}</b> depuis votre portefeuille AHOUE.</div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 4, display: 'block' }}>Montant en FCFA</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
          {[1000, 2500, 5000].map(v => (
            <button key={v} className="btn btn-ghost" onClick={() => setAmount(v)} style={{ fontSize: 12 }}>
              {formatFCFA(v)}
            </button>
          ))}
        </div>
        <input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value, 10))} min="100" step="500" />
      </div>

      <button className="btn btn-full" onClick={handleConfirm}>
        Transférer
      </button>
    </div>
  );
};
