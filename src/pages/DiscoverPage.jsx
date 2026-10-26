import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  IconPlus,
  IconHeart,
  IconChat,
  IconShare,
  IconMapPin,
  IconMusic,
  IconCheck,
  IconWallet,
  IconSend
} from '../components/Icons.jsx';
import { formatFCFA } from '../utils/format.js';

export const DiscoverPage = () => {
  const {
    reels,
    activeReelFilter,
    likeReel,
    toggleFollow,
    addReelComment,
    publishReel,
    showToast,
    openModal,
    setActiveTab,
    setActiveChatId
  } = useApp();

  const [filter, setFilter] = useState(activeReelFilter || 'pour');
  const [category, setCategory] = useState('tout');
  const [commentOpenId, setCommentOpenId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [publishOpen, setPublishOpen] = useState(false);

  // New reel form state
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newLocation, setNewLocation] = useState('Grand Marché, Lomé');
  const [newSound, setNewSound] = useState('Afrobeats Lomé – Rythmes du Golfe');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1590736969955-71cc94801759?w=900&auto=format&fit=crop&q=80');

  // Stories togolaises
  const stories = [
    { id: 'st_mine', name: 'Votre Story', initials: '+', isMine: true, image: null },
    { id: 'st_1', name: 'Akossiwa Wax', initials: 'AW', image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=200&auto=format&fit=crop&q=80', creatorUid: 'u_akossiwa' },
    { id: 'st_2', name: 'Chef Kossi', initials: 'CK', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&auto=format&fit=crop&q=80', creatorUid: 'u_kossi' },
    { id: 'st_3', name: 'Atelier Tsévié', initials: 'AT', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&auto=format&fit=crop&q=80', creatorUid: 'u_tsevie' },
    { id: 'st_4', name: 'Ferme Kloto', initials: 'FK', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&auto=format&fit=crop&q=80', creatorUid: 'u_ferme' },
    { id: 'st_5', name: 'Sika Bijoux', initials: 'SB', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80', creatorUid: 'u_sika' }
  ];

  const categories = [
    { id: 'tout', label: 'Tout' },
    { id: 'wax', label: 'Wax & Mode' },
    { id: 'cuisine', label: 'Cuisine locale' },
    { id: 'artisanat', label: 'Artisanat' },
    { id: 'terroir', label: 'Terroir & Café' }
  ];

  const photoPresets = [
    { label: 'Pagne Wax Lomé', url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=900&auto=format&fit=crop&q=80' },
    { label: 'Plat Ayimolou', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&auto=format&fit=crop&q=80' },
    { label: 'Artisanat Raphia', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&auto=format&fit=crop&q=80' },
    { label: 'Café de Kpalimé', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=900&auto=format&fit=crop&q=80' }
  ];

  // Filtering
  let visibleReels = filter === 'abo' ? reels.filter(r => r.followed) : reels;
  if (category === 'wax') {
    visibleReels = visibleReels.filter(r => (r.title + r.text).toLowerCase().includes('wax') || (r.title + r.text).toLowerCase().includes('pagne'));
  } else if (category === 'cuisine') {
    visibleReels = visibleReels.filter(r => (r.title + r.text).toLowerCase().includes('ayimolou') || (r.title + r.text).toLowerCase().includes('poisson') || (r.title + r.text).toLowerCase().includes('repas'));
  } else if (category === 'artisanat') {
    visibleReels = visibleReels.filter(r => (r.title + r.text).toLowerCase().includes('raphia') || (r.title + r.text).toLowerCase().includes('sac') || (r.title + r.text).toLowerCase().includes('artisan'));
  } else if (category === 'terroir') {
    visibleReels = visibleReels.filter(r => (r.title + r.text).toLowerCase().includes('café') || (r.title + r.text).toLowerCase().includes('kpalimé') || (r.title + r.text).toLowerCase().includes('ferme'));
  }

  const handlePostComment = (reelId) => {
    if (!commentText.trim()) return;
    addReelComment(reelId, commentText.trim());
    setCommentText('');
  };

  const handlePublish = () => {
    if (!newTitle.trim() || !newText.trim()) {
      showToast('Indiquez un titre et une description pour continuer.');
      return;
    }

    publishReel({
      title: newTitle.trim(),
      text: newText.trim(),
      location: newLocation,
      soundTitle: newSound,
      image: newImage,
      gradient: 'linear-gradient(180deg, rgba(14,18,32,0.2) 0%, rgba(14,18,32,0.5) 45%, rgba(14,18,32,0.95) 100%)'
    });

    setNewTitle('');
    setNewText('');
    setPublishOpen(false);
  };

  const activeReelForComment = reels.find(r => r.id === commentOpenId);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* 1. Horizontal Stories Bar */}
      <div className="stories-strip" aria-label="Stories des créateurs togolais">
        {stories.map(st => (
          <div
            key={st.id}
            className="story-item"
            onClick={() => {
              if (st.isMine) {
                setPublishOpen(true);
              } else {
                showToast(`Story de ${st.name} consultée.`);
              }
            }}
          >
            <div className={`story-ring ${st.isMine ? 'story-mine' : ''}`}>
              {st.image ? (
                <img src={st.image} alt={st.name} className="story-avatar-img" />
              ) : (
                <div className="story-avatar-text">{st.initials}</div>
              )}
            </div>
            <span className="story-name">{st.name}</span>
          </div>
        ))}
      </div>

      {/* 2. Top Filter and Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
        <div className="segmented-control" style={{ marginBottom: 0 }}>
          <button
            className={`seg-btn ${filter === 'pour' ? 'active' : ''}`}
            onClick={() => setFilter('pour')}
          >
            Pour vous
          </button>
          <button
            className={`seg-btn ${filter === 'abo' ? 'active' : ''}`}
            onClick={() => setFilter('abo')}
          >
            Abonnements
          </button>
        </div>

        <button
          className="btn btn-alt"
          onClick={() => setPublishOpen(true)}
          style={{ minHeight: '40px', padding: '8px 16px', fontSize: 13 }}
        >
          <IconPlus size={16} />
          <span>Publier un Moment</span>
        </button>
      </div>

      {/* 3. Category Filter Chips */}
      <div className="discover-chips-row">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`discover-chip ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. Feed Grid */}
      <div className="reels-feed-wrapper">
        {visibleReels.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '56px 24px', background: 'var(--bg-surface)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, marginBottom: 8, color: 'var(--ink-primary)' }}>
              Aucun Moment trouvé dans cette sélection
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ink-muted)', marginBottom: 20, maxWidth: 420, margin: '0 auto 20px' }}>
              Explorez tous les contenus ou soyez le premier à partager une création avec la communauté AHOUE.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-alt" onClick={() => { setFilter('pour'); setCategory('tout'); }}>
                Réinitialiser les filtres
              </button>
              <button className="btn btn-orange" onClick={() => setPublishOpen(true)}>
                Publier un Moment
              </button>
            </div>
          </div>
        ) : (
          visibleReels.map(r => (
            <div key={r.id} className="reel-card-desktop">
              {/* Screen Banner with Photo Background */}
              <div
                className="reel-screen"
                style={{
                  backgroundImage: `url(${r.image || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&auto=format&fit=crop&q=80'})`,
                  backgroundColor: '#0E1220'
                }}
                onDoubleClick={() => likeReel(r.id)}
              >
                {/* Vignette Gradient for Legibility */}
                <div className="reel-vignette" />

                {/* Top Overlay: Location Badge & Status */}
                <div className="reel-header-overlay">
                  <div className="reel-location-badge">
                    <IconMapPin size={13} />
                    <span>{r.location || 'Lomé, Togo'}</span>
                  </div>

                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    backdropFilter: 'blur(4px)'
                  }}>
                    AHOUE Direct
                  </div>
                </div>

                {/* Bottom Overlay: Creator, Title, Description, Audio + Right Vertical Rail */}
                <div className="reel-body-overlay">
                  <div className="reel-info-col">
                    {/* Creator Row */}
                    <div className="reel-creator-row">
                      <div className="reel-avatar">
                        {r.initials || r.creator.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="reel-creator-name">{r.creator}</div>
                      </div>
                      <button
                        className={`reel-follow-btn ${r.followed ? 'followed' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollow(r.creatorUid);
                        }}
                      >
                        {r.followed ? '✓ Abonné' : '+ Suivre'}
                      </button>
                    </div>

                    {/* Headline Title */}
                    <div className="reel-title-text">
                      {r.title || 'Création togolaise'}
                    </div>

                    {/* Description */}
                    <div className="reel-description-text">
                      {r.text}
                    </div>

                    {/* Sound Track Badge with Animated Equalizer */}
                    <div className="reel-sound-badge">
                      <div className="sound-bars">
                        <span />
                        <span />
                        <span />
                      </div>
                      <IconMusic size={12} />
                      <span>{r.soundTitle || 'Rythmes de Lomé'}</span>
                    </div>
                  </div>

                  {/* Right Vertical Action Rail */}
                  <div className="reel-actions-rail" onClick={(e) => e.stopPropagation()}>
                    {/* Like Button */}
                    <div className="reel-rail-item">
                      <button
                        className={`reel-rail-btn ${r.liked ? 'active-like' : ''}`}
                        onClick={() => likeReel(r.id)}
                        aria-label="Aimer"
                      >
                        <IconHeart size={20} filled={r.liked} />
                      </button>
                      <span className="reel-rail-label">{r.likes}</span>
                    </div>

                    {/* Comments Button */}
                    <div className="reel-rail-item">
                      <button
                        className="reel-rail-btn"
                        onClick={() => setCommentOpenId(r.id)}
                        aria-label="Commentaires"
                      >
                        <IconChat size={20} />
                      </button>
                      <span className="reel-rail-label">{r.comments.length}</span>
                    </div>

                    {/* Share Button */}
                    <div className="reel-rail-item">
                      <button
                        className="reel-rail-btn"
                        onClick={() => showToast('Lien copié. Partagez-le avec vos proches.')}
                        aria-label="Partager"
                      >
                        <IconShare size={19} />
                      </button>
                      <span className="reel-rail-label">Partager</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA Bar */}
              <div className="reel-cta-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ink-secondary)', fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                  <span>Disponible à Lomé</span>
                </div>

                <button
                  className="btn btn-alt"
                  onClick={() => {
                    openModal('PAYMENT', {
                      amount: 8500,
                      title: r.title || 'Sac en raphia',
                      recipient: r.creator
                    });
                  }}
                  style={{ padding: '6px 14px', fontSize: 12.5, minHeight: '36px' }}
                >
                  <IconWallet size={15} />
                  <span>Commander</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Comments Sheet Drawer Modal */}
      {commentOpenId && activeReelForComment && (
        <div className="sheet-overlay" onClick={() => setCommentOpenId(null)}>
          <div className="sheet-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h3 className="sheet-title" style={{ fontSize: 18, marginBottom: 2 }}>
                  Commentaires ({activeReelForComment.comments.length})
                </h3>
                <p style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                  Échanges sur « {activeReelForComment.title || 'ce Moment'} »
                </p>
              </div>
              <button className="btn-icon" onClick={() => setCommentOpenId(null)}>✕</button>
            </div>

            <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {activeReelForComment.comments.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: 13, padding: '28px 0' }}>
                  Aucun commentaire pour le moment. Soyez le premier à réagir !
                </div>
              ) : (
                activeReelForComment.comments.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div className="avatar-circle" style={{ width: 34, height: 34, fontSize: 12, flexShrink: 0 }}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 'var(--radius-card)', padding: '10px 14px' }}>
                      <div style={{ fontWeight: 800, fontSize: 12.5, color: 'var(--ink-primary)' }}>{c.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-secondary)', marginTop: 2 }}>{c.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Écrire un commentaire..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePostComment(activeReelForComment.id);
                }}
                style={{ flex: 1, borderRadius: 'var(--radius-btn)' }}
              />
              <button
                className="btn btn-orange"
                onClick={() => handlePostComment(activeReelForComment.id)}
                style={{ padding: '10px 16px', minHeight: '44px', fontWeight: 700 }}
              >
                <IconSend size={16} />
                <span>Publier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Publish New Moment Modal */}
      {publishOpen && (
        <div className="sheet-overlay" onClick={() => setPublishOpen(false)}>
          <div className="sheet-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <h3 className="sheet-title" style={{ fontSize: 20, marginBottom: 4 }}>
                Publier un Moment AHOUE
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--ink-muted)' }}>
                Partagez une création, un arrivage ou votre atelier avec la communauté togolaise.
              </p>
            </div>

            {/* Titre */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 5, display: 'block' }}>
                Titre du Moment
              </label>
              <input
                type="text"
                placeholder="Ex. Nouveaux pagnes wax arrivés au Grand Marché"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 5, display: 'block' }}>
                Description détaillée
              </label>
              <textarea
                rows="3"
                placeholder="Décrivez votre création, les prix, et où vous trouver..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>

            {/* Lieu et Son */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 5, display: 'block' }}>
                  Lieu
                </label>
                <select
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--line-border)', background: 'var(--bg-surface)' }}
                >
                  <option value="Grand Marché, Lomé">Grand Marché, Lomé</option>
                  <option value="Bè-Plage, Lomé">Bè-Plage, Lomé</option>
                  <option value="Adidogomé, Lomé">Adidogomé, Lomé</option>
                  <option value="Tsévié & Lomé">Tsévié & Lomé</option>
                  <option value="Kpalimé, Plateaux">Kpalimé, Plateaux</option>
                  <option value="Kara, Togo">Kara, Togo</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 5, display: 'block' }}>
                  Bande sonore
                </label>
                <select
                  value={newSound}
                  onChange={(e) => setNewSound(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--line-border)', background: 'var(--bg-surface)' }}
                >
                  <option value="Afrobeats Lomé – Rythmes du Golfe">Afrobeats Lomé</option>
                  <option value="Agbadja Moderne – Toofan">Agbadja Moderne</option>
                  <option value="Balafon & Cordes – Kloto">Balafon & Cordes</option>
                  <option value="Cascade de Kpimé – Nature">Cascade de Kpimé</option>
                </select>
              </div>
            </div>

            {/* Choix du visuel */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-secondary)', marginBottom: 8, display: 'block' }}>
                Photo d'illustration
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {photoPresets.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => setNewImage(p.url)}
                    style={{
                      height: 64,
                      borderRadius: 'var(--radius-card)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: newImage === p.url ? '3px solid var(--primary)' : '1px solid var(--line-border)',
                      position: 'relative'
                    }}
                  >
                    <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions : Orange button pour valider */}
            <button
              className="btn btn-orange btn-full"
              onClick={handlePublish}
              style={{ minHeight: '48px', fontWeight: 800, fontSize: 15, marginBottom: 8 }}
            >
              Publier le Moment
            </button>
            <button
              className="btn btn-ghost btn-full"
              onClick={() => setPublishOpen(false)}
              style={{ minHeight: '44px' }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
