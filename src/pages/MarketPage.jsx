import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { IconSearch, IconPlus, IconMapPin, IconHeart, IconStar } from '../components/Icons.jsx';
import { formatFCFA } from '../utils/format.js';

export const MarketPage = () => {
  const {
    products,
    services,
    activeMarketTab,
    setActiveMarketTab,
    favorites,
    toggleFavorite,
    openModal
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const isMarche = activeMarketTab === 'marche';
  const categories = ['Tous', 'Mode & Tissus', 'Soins & Beauté', 'Artisanat', 'Épicerie', 'Chaussures'];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'Tous' || p.category === selectedCategory;
    const matchesQuery = p.title.toLowerCase().includes(search.toLowerCase()) ||
                         p.seller.toLowerCase().includes(search.toLowerCase()) ||
                         p.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Filter services
  const filteredServices = services.filter(s => {
    return s.name.toLowerCase().includes(search.toLowerCase()) ||
           s.job.toLowerCase().includes(search.toLowerCase()) ||
           s.quarter.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      {/* Top Controls Bar */}
      <div className="market-header-bar">
        <div className="segmented-control" style={{ marginBottom: 0 }}>
          <button
            className={`seg-btn ${isMarche ? 'active' : ''}`}
            onClick={() => setActiveMarketTab('marche')}
          >
            Marché & Produits
          </button>
          <button
            className={`seg-btn ${!isMarche ? 'active' : ''}`}
            onClick={() => setActiveMarketTab('metiers')}
          >
            Métiers & Artisans
          </button>
        </div>

        <div className="market-actions-row">
          <div className="search-field">
            <IconSearch />
            <input
              type="text"
              placeholder={isMarche ? "Rechercher pagne, savon, café..." : "Rechercher plombier, électricien, couturier..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="btn btn-alt btn-market-publish"
            onClick={() => openModal(isMarche ? 'VENDOR_PUBLISH' : 'SERVICE_PUBLISH')}
          >
            <IconPlus />
            <span className="btn-market-text-full">{isMarche ? "Vendre un article" : "Proposer un service"}</span>
            <span className="btn-market-text-short">{isMarche ? "Vendre" : "Proposer"}</span>
          </button>
        </div>
      </div>

      {isMarche ? (
        <div>
          {/* Category Chips Bar */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  className="category-pill"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    background: active ? 'var(--primary)' : 'var(--bg-surface)',
                    color: active ? '#FFFFFF' : 'var(--ink-secondary)',
                    border: `1px solid ${active ? 'var(--primary)' : 'var(--line-border)'}`
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Products Fluid Responsive Grid */}
          {filteredProducts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Aucun article trouvé</div>
              <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>Essayez avec un autre mot-clé ou modifiez la catégorie sélectionnée.</div>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(p => {
                const isFav = favorites.includes(p.id);
                return (
                  <div key={p.id} className="product-card">
                    <div
                      className="product-media"
                      onClick={() => openModal('PRODUCT_DETAIL', p)}
                    >
                      <img src={p.image} alt={p.title} loading="lazy" />
                      <button
                        className={`btn-fav ${isFav ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(p.id);
                        }}
                        title="Favori"
                      >
                        <IconHeart filled={isFav} />
                      </button>
                      {p.tag && <span className="product-badge-tag">{p.tag}</span>}
                    </div>

                    <div
                      className="product-name"
                      onClick={() => openModal('PRODUCT_DETAIL', p)}
                    >
                      {p.title}
                    </div>

                    <div className="product-meta">
                      <IconMapPin />
                      <span>{p.location}</span>
                      <span>·</span>
                      <span>{p.seller}</span>
                    </div>

                    <div className="product-price-row">
                      <div className="product-price">{formatFCFA(p.price)}</div>
                      <button
                        className="btn btn-orange btn-buy"
                        onClick={() => openModal('PAYMENT', {
                          amount: p.price,
                          title: p.title,
                          recipient: p.seller
                        })}
                      >
                        Acheter
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Services / Artisans List */
        <div>
          {filteredServices.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Aucun prestataire trouvé</div>
              <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>Vérifiez les termes de votre recherche.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredServices.map(s => (
                <div key={s.id} className="service-card">
                  <div className="service-avatar-box">
                    {s.initials || s.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="service-body">
                    <div className="service-header-line">
                      <span className="service-name">{s.name}</span>
                      {s.verified && <span className="verified-pill">Vérifié AHOUE</span>}
                    </div>
                    <div className="service-specialty">{s.job}</div>
                    <div className="service-subline">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--accent-orange)' }}>
                        <IconStar /> {s.rating.toFixed(1)}
                      </span>
                      <span>({s.reviewsCount} avis)</span>
                      <span>·</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <IconMapPin /> {s.quarter}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 6 }}>
                      {s.description}
                    </div>
                  </div>

                  <div className="service-action-col" style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 16, borderLeft: '1px solid var(--line-border-subtle)' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>Tarif indicatif</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, color: 'var(--primary)', marginBottom: 8 }}>
                      {formatFCFA(s.startingPrice)}
                    </div>
                    <button
                      className="btn"
                      onClick={() => openModal('BOOKING', s)}
                      style={{ padding: '8px 16px', fontSize: 13 }}
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
