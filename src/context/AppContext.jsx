import React, { createContext, useContext, useState, useEffect } from 'react';
import { playSendSound, playReceiveSound, playSuccessSound, playNotificationSound, playTapSound } from '../utils/audio.js';
import { formatFCFA } from '../utils/format.js';

const STORAGE_KEY = 'ahoue_react_v1';

const INITIAL_DATA = {
  user: {
    id: 'usr_me_01',
    name: 'Gaston Denis',
    phone: '22890123456',
    avatarInitials: 'GD',
    shop: 'Atelier Franco-Togolais',
    roles: { merchant: true, provider: false },
    pin: '1234',
    limit: 100000,
    theme: 'light'
  },
  balance: 45000,
  activeTab: 'chat',
  activeChatId: 'c_maman',
  activeMarketTab: 'marche',
  activeReelFilter: 'pour',

  chats: [
    {
      id: 'c_maman',
      name: 'Maman',
      initials: 'MA',
      phone: '22891234567',
      unread: 1,
      isGroup: false,
      online: true,
      messages: [
        { id: 'm1', text: 'Tu viens dimanche ?', fromMe: false, time: '10:14' },
        { id: 'm2', text: 'Oui, j’apporte le pain.', fromMe: true, time: '10:18' }
      ]
    },
    {
      id: 'c_etudiants',
      name: 'Promo Master UL Lomé',
      initials: 'UL',
      phone: '',
      unread: 3,
      isGroup: true,
      online: false,
      messages: [
        { id: 'm4', sender: 'Koffi', text: 'Bonjour à tous, le cours d’économie de demain 8h est en Amphi 500.', fromMe: false, time: '09:05' },
        { id: 'm5', sender: 'Afi', text: 'Merci pour l’information Koffi.', fromMe: false, time: '09:12' },
        { id: 'm6', sender: 'Edem', text: 'N’oubliez pas d’apporter vos quittances de scolarité.', fromMe: false, time: '09:30' }
      ]
    },
    {
      id: 'c_kodjo',
      name: 'Kodjo Agbéti – Plombier',
      initials: 'KA',
      phone: '22892345678',
      unread: 0,
      isGroup: false,
      online: true,
      messages: [
        { id: 'm7', text: 'Bonjour patron, je serai chez vous à Bè vers 14h pour réparer la tuyauterie.', fromMe: false, time: 'Hier' },
        { id: 'm8', text: 'Bien noté Kodjo, je vous attends.', fromMe: true, time: 'Hier' }
      ]
    },
    {
      id: 'c_akossiwa',
      name: 'Boutique Akossiwa Wax',
      initials: 'BA',
      phone: '22893456789',
      unread: 0,
      isGroup: false,
      online: true,
      messages: [
        { id: 'm9', text: 'Bonjour ! Votre nouveau pagne wax 6 yards est préparé et disponible en boutique.', fromMe: false, time: 'Hier' },
        { id: 'm10', text: 'Merci beaucoup, je passe récupérer ce soir.', fromMe: true, time: 'Hier' }
      ]
    }
  ],

  products: [
    {
      id: 'p1',
      title: 'Pagne Wax Véritable 6 Yards',
      category: 'Mode & Tissus',
      price: 12000,
      seller: 'Boutique Akossiwa',
      location: 'Grand Marché, Lomé',
      tag: 'Certifié Vlisco',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80',
      description: 'Coton peigné de haute qualité, teintes lumineuses résistantes au lavage. Idéal pour cérémonies et confections de prestige.'
    },
    {
      id: 'p2',
      title: 'Savon Noir au Beurre de Karité Bio',
      category: 'Soins & Beauté',
      price: 1500,
      seller: 'Coopérative Féminine de Kara',
      location: 'Kara & Lomé',
      tag: '100% Naturel',
      image: 'https://images.unsplash.com/photo-1607006314647-750539c323f4?w=600&auto=format&fit=crop&q=80',
      description: 'Fabriqué artisanalement avec des cendres végétales et du beurre de karité pur non raffiné. Nourrit et nettoie en profondeur.'
    },
    {
      id: 'p3',
      title: 'Sac en raphia',
      category: 'Artisanat',
      price: 8500,
      seller: 'Atelier Tsévié Création',
      location: 'Tsévié',
      tag: 'Fait main',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80',
      description: 'Tressage traditionnel togolais en fibres végétales naturelles de raphia avec poignées doublées en cuir résistant.'
    },
    {
      id: 'p4',
      title: 'Café Robusta Pur de Kpalimé 500g',
      category: 'Épicerie',
      price: 3000,
      seller: 'Ferme des Plateaux Danyi',
      location: 'Kpalimé',
      tag: 'Terroir Bio',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
      description: 'Grains torréfiés artisanalement dans les hauteurs fraîches du Kloto. Arômes corsés avec des notes chocolatées intenses.'
    },
    {
      id: 'p5',
      title: 'Huile de Palme Rouge Vierge 1L',
      category: 'Épicerie',
      price: 1800,
      seller: 'Marché de Bè',
      location: 'Bè, Lomé',
      tag: 'Pression à froid',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
      description: 'Première pression à froid naturelle, riche en vitamines A et E. Indispensable pour la gastronomie togolaise authentique.'
    },
    {
      id: 'p6',
      title: 'Sandales Élégantes en Cuir Cousu',
      category: 'Chaussures',
      price: 6500,
      seller: 'Cordonnerie Moderne Agoè',
      location: 'Agoè-Nyivé',
      tag: 'Cuir Véritable',
      image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=600&auto=format&fit=crop&q=80',
      description: 'Cuir véritable tanné localement, semelle confort amortissante. Excellente durabilité garantie.'
    }
  ],

  services: [
    {
      id: 's1',
      name: 'Kodjo Agbéti',
      initials: 'KA',
      job: 'Plomberie & Sanitaire',
      quarter: 'Bè & Grand Lomé',
      rating: 4.9,
      reviewsCount: 38,
      startingPrice: 5000,
      verified: true,
      description: 'Dépannage d’urgence, fuites d’eau, installation de chauffe-eau et raccordements TDE certifiés.'
    },
    {
      id: 's2',
      name: 'Yawo Kossi',
      initials: 'YK',
      job: 'Électricité Bâtiment & Solaire',
      quarter: 'Adidogomé & Tokoin',
      rating: 4.8,
      reviewsCount: 42,
      startingPrice: 7000,
      verified: true,
      description: 'Câblage général, dépannage compteurs CEET prépayés, installations de panneaux solaires.'
    },
    {
      id: 's3',
      name: 'Atelier Ama Couture',
      initials: 'AC',
      job: 'Haute Couture & Pagne Wax',
      quarter: 'Hédzranawoé',
      rating: 4.95,
      reviewsCount: 64,
      startingPrice: 4000,
      verified: true,
      description: 'Robes de cérémonie, costumes sur-mesure deux-pièces, retouches et créations rapides.'
    },
    {
      id: 's4',
      name: 'Garage Mawuli Express',
      initials: 'GM',
      job: 'Mécanique Auto & Climatisation',
      quarter: 'Agoè-Télécom',
      rating: 4.7,
      reviewsCount: 29,
      startingPrice: 10000,
      verified: true,
      description: 'Diagnostic électronique multimarque, vidange express, freinage et climatisation automobile.'
    },
    {
      id: 's5',
      name: 'Salon Dédé Beauté',
      initials: 'SD',
      job: 'Coiffure & Soins Capillaires',
      quarter: 'Bè-Kpota',
      rating: 4.85,
      reviewsCount: 51,
      startingPrice: 3500,
      verified: true,
      description: 'Tresses régulières, knotless braids, soins capillaires aux huiles locales et tissages.'
    }
  ],

  bookings: [
    {
      id: 'bk_1',
      serviceName: 'Kodjo Agbéti',
      job: 'Plomberie & Sanitaire',
      date: 'Demain vers 14h00',
      price: 5000,
      status: 'Confirmée',
      notes: 'Réparation raccordement robinetterie cuisine'
    }
  ],

  favorites: ['p1', 'p4'],

  transactions: [
    {
      id: 'tx_01',
      title: 'Recharge Portefeuille Flooz',
      amount: 25000,
      type: 'credit',
      date: 'Aujourd’hui, 11:30',
      method: 'Flooz (+228 90 XX XX XX)',
      ref: 'FLZ-893420'
    },
    {
      id: 'tx_02',
      title: 'Achat Savon de Karité Bio',
      amount: -1500,
      type: 'debit',
      date: 'Hier, 16:45',
      method: 'Portefeuille AHOUE',
      ref: 'AH-671239'
    },
    {
      id: 'tx_03',
      title: 'Facture CEET Électricité',
      amount: -10000,
      type: 'debit',
      date: '21 Oct, 09:15',
      method: 'Mixx by Yas',
      ref: 'CET-459102'
    },
    {
      id: 'tx_04',
      title: 'Virement vers Maman',
      amount: -5000,
      type: 'debit',
      date: '19 Oct, 18:20',
      method: 'Portefeuille AHOUE',
      ref: 'TRF-120984'
    }
  ],

  reels: [
    {
      id: 'r1',
      creator: 'Akossiwa Lomé',
      creatorUid: 'u_akossiwa',
      initials: 'AL',
      title: 'Collection Wax Véritable 6 Yards',
      text: 'Arrivage exclusif de pagnes wax aux motifs lumineux. Venez choisir vos motifs au Grand Marché de Lomé !',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=900&auto=format&fit=crop&q=80',
      soundTitle: 'Afrobeats Lomé – Rythmes du Golfe',
      location: 'Grand Marché, Lomé',
      likes: 342,
      comments: [
        { name: 'Koffi', text: 'Les motifs sont magnifiques, quel est le prix au yard ?' },
        { name: 'Maman', text: 'Je passe demain à la boutique.' }
      ],
      followed: false,
      liked: false,
      gradient: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(14,18,32,0.88) 100%)'
    },
    {
      id: 'r2',
      creator: 'Chef Kossi',
      creatorUid: 'u_kossi',
      initials: 'CK',
      title: 'Ayimolou traditionnel au poisson braisé',
      text: 'L’authentique Ayimolou togolais : riz et haricots mijotés, sauce pimentée douce, poisson frais du port et wagashi chaud.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&auto=format&fit=crop&q=80',
      soundTitle: 'Agbadja Moderne – Toofan',
      location: 'Bè-Plage, Lomé',
      likes: 856,
      comments: [
        { name: 'Afi', text: 'Le meilleur de tout Lomé sans hésiter.' },
        { name: 'Edem', text: 'Livraison possible vers Adidogomé ?' }
      ],
      followed: true,
      liked: true,
      gradient: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(14,18,32,0.88) 100%)'
    },
    {
      id: 'r3',
      creator: 'Atelier Tsévié',
      creatorUid: 'u_tsevie',
      initials: 'AT',
      title: 'Sac en raphia fait main',
      text: 'Tressage traditionnel en raphia naturel avec poignées en cuir surpiqué. Deux jours de savoir-faire togolais.',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&auto=format&fit=crop&q=80',
      soundTitle: 'Balafon & Cordes – Kloto',
      location: 'Tsévié & Lomé',
      likes: 620,
      comments: [
        { name: 'Yawo', text: 'Très beau travail artisanal.' }
      ],
      followed: false,
      liked: false,
      gradient: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(14,18,32,0.88) 100%)'
    },
    {
      id: 'r4',
      creator: 'Ferme des Plateaux',
      creatorUid: 'u_ferme',
      initials: 'FP',
      title: 'Café Robusta Pur de Kpalimé',
      text: 'Cueillette manuelle des cerises de café sur les hauteurs fraîches du Kloto. Torréfaction locale artisanale.',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=900&auto=format&fit=crop&q=80',
      soundTitle: 'Cascade de Kpimé – Sons naturels',
      location: 'Kpalimé, Togo',
      likes: 512,
      comments: [
        { name: 'Kossiwa', text: 'Le café a un arôme corsé exceptionnel.' }
      ],
      followed: true,
      liked: false,
      gradient: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(14,18,32,0.88) 100%)'
    }
  ]
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Assurer que les reels ont les images et titres récents
        if (!parsed.reels || !parsed.reels.length || !parsed.reels[0].image) {
          parsed.reels = INITIAL_DATA.reels;
        }
        return { ...INITIAL_DATA, ...parsed };
      }
    } catch (e) {}
    return INITIAL_DATA;
  });

  const [toast, setToast] = useState({ show: false, message: '' });
  const [modal, setModal] = useState({ open: false, type: null, data: null });

  // Save on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  // Apply dark theme
  useEffect(() => {
    if (state.user?.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [state.user?.theme]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2400);
  };

  const openModal = (type, data = null) => {
    playTapSound();
    setModal({ open: true, type, data });
  };

  const closeModal = () => {
    setModal({ open: false, type: null, data: null });
  };

  const setActiveTab = (tab) => {
    playTapSound();
    setState(prev => ({
      ...prev,
      activeTab: tab,
      activeChatId: window.innerWidth < 768 ? null : prev.activeChatId
    }));
  };

  const setActiveChatId = (chatId) => {
    playTapSound();
    setState(prev => {
      const chats = prev.chats.map(c => c.id === chatId ? { ...c, unread: 0 } : c);
      return { ...prev, activeChatId: chatId, chats };
    });
  };

  const setActiveMarketTab = (tab) => {
    playTapSound();
    setState(prev => ({ ...prev, activeMarketTab: tab }));
  };

  const toggleTheme = () => {
    playTapSound();
    setState(prev => {
      const newTheme = prev.user.theme === 'dark' ? 'light' : 'dark';
      showToast(newTheme === 'dark' ? 'Mode sombre activé' : 'Mode clair activé');
      return { ...prev, user: { ...prev.user, theme: newTheme } };
    });
  };

  const sendMessage = (chatId, text, isTransfer = false, amount = 0) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg = {
      id: 'm_' + Date.now(),
      text,
      fromMe: true,
      time,
      isTransfer,
      amount
    };

    playSendSound();

    setState(prev => {
      const chats = prev.chats.map(c => {
        if (c.id === chatId) {
          return { ...c, messages: [...c.messages, newMsg] };
        }
        return c;
      });
      return { ...prev, chats };
    });

    // Auto-reply
    const chat = state.chats.find(c => c.id === chatId);
    if (chat && !chat.isGroup) {
      setTimeout(() => {
        let reply = 'C’est bien noté, je vous réponds sous peu.';
        if (isTransfer) {
          reply = `Transfert de ${amount.toLocaleString('fr-FR')} FCFA bien reçu sur mon compte AHOUE. Merci !`;
        } else if (text.toLowerCase().includes('prix') || text.toLowerCase().includes('combien')) {
          reply = 'Tous nos tarifs sont transparents et consultables sur le Marché AHOUE.';
        } else if (text.toLowerCase().includes('bonjour') || text.toLowerCase().includes('salut')) {
          reply = 'Bonjour ! Comment puis-je vous aider aujourd’hui ?';
        } else if (chat.id === 'c_maman') {
          reply = 'D’accord mon enfant. Prends bien soin de toi.';
        } else if (chat.id === 'c_kodjo') {
          reply = 'Entendu, j’arrive avec l’équipement complet pour l’intervention.';
        }

        const replyMsg = {
          id: 'm_' + Date.now(),
          text: reply,
          fromMe: false,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };

        playReceiveSound();

        setState(prev => ({
          ...prev,
          chats: prev.chats.map(c => c.id === chatId ? { ...c, messages: [...c.messages, replyMsg] } : c)
        }));
      }, 1000);
    }
  };

  const sendMoneyInChat = (chatId, amount) => {
    if (state.balance < amount) {
      showToast('Solde insuffisant : rechargez votre portefeuille.');
      return false;
    }
    const chat = state.chats.find(c => c.id === chatId);
    if (!chat) return false;

    const ref = 'TRF-' + Math.floor(100000 + Math.random() * 900000);
    const newTx = {
      id: 'tx_' + Date.now(),
      title: `Transfert vers ${chat.name}`,
      amount: -amount,
      type: 'debit',
      method: 'Portefeuille AHOUE',
      date: `Aujourd’hui, ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      ref
    };

    setState(prev => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [newTx, ...prev.transactions]
    }));

    sendMessage(chatId, `Transfert de ${formatFCFA(amount)} envoyé.`, true, amount);
    playSuccessSound();
    showToast(`Transfert envoyé. Le bénéficiaire est crédité.`);
    return true;
  };

  const topup = (amount, method = 'Flooz') => {
    const ref = 'TOP-' + Math.floor(100000 + Math.random() * 900000);
    const newTx = {
      id: 'tx_' + Date.now(),
      title: `Recharge ${method}`,
      amount,
      type: 'credit',
      method: `${method} (+228 90 XX XX XX)`,
      date: `Aujourd’hui, ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      ref
    };

    setState(prev => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTx, ...prev.transactions]
    }));

    playSuccessSound();
    showToast(`Recharge confirmée. Votre solde est à jour.`);
  };

  const pay = (amount, title, recipient = 'Marchand AHOUE', method = 'Portefeuille AHOUE') => {
    if (method === 'Portefeuille AHOUE' && state.balance < amount) {
      showToast('Solde insuffisant : rechargez votre portefeuille.');
      return { success: false };
    }

    const ref = 'AH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newTx = {
      id: 'tx_' + Date.now(),
      title,
      amount: -amount,
      type: 'debit',
      method,
      date: `Aujourd’hui, ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      ref
    };

    setState(prev => ({
      ...prev,
      balance: method === 'Portefeuille AHOUE' ? prev.balance - amount : prev.balance,
      transactions: [newTx, ...prev.transactions]
    }));

    playSuccessSound();
    return { success: true, ref };
  };

  const toggleFavorite = (productId) => {
    playTapSound();
    setState(prev => {
      const favs = [...prev.favorites];
      const idx = favs.indexOf(productId);
      if (idx >= 0) favs.splice(idx, 1);
      else favs.push(productId);
      return { ...prev, favorites: favs };
    });
  };

  const bookService = (serviceId, date, notes) => {
    const svc = state.services.find(s => s.id === serviceId);
    if (!svc) return false;

    const newBooking = {
      id: 'bk_' + Date.now(),
      serviceName: svc.name,
      job: svc.job,
      date,
      price: svc.startingPrice,
      status: 'Confirmée',
      notes
    };

    setState(prev => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings]
    }));

    playNotificationSound();
    showToast(`Réservation confirmée avec ${svc.name}.`);
    return true;
  };

  const addProduct = (prod) => {
    const newProd = {
      id: 'p_' + Date.now(),
      ...prod
    };
    setState(prev => ({
      ...prev,
      products: [newProd, ...prev.products]
    }));
    playSuccessSound();
    showToast('Article publié sur le Marché.');
  };

  const addService = (svc) => {
    const newSvc = {
      id: 's_' + Date.now(),
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      initials: (svc.name || 'Artisan').slice(0, 2).toUpperCase(),
      ...svc
    };
    setState(prev => ({
      ...prev,
      services: [newSvc, ...prev.services]
    }));
    playSuccessSound();
    showToast('Activité artisan enregistrée.');
  };

  const likeReel = (reelId) => {
    playTapSound();
    setState(prev => ({
      ...prev,
      reels: prev.reels.map(r => {
        if (r.id === reelId) {
          const liked = !r.liked;
          return { ...r, liked, likes: r.likes + (liked ? 1 : -1) };
        }
        return r;
      })
    }));
  };

  const toggleFollow = (creatorUid) => {
    playTapSound();
    setState(prev => ({
      ...prev,
      reels: prev.reels.map(r => r.creatorUid === creatorUid ? { ...r, followed: !r.followed } : r)
    }));
    showToast('Abonnement renouvelé.');
  };

  const addReelComment = (reelId, text) => {
    playSendSound();
    setState(prev => ({
      ...prev,
      reels: prev.reels.map(r => {
        if (r.id === reelId) {
          return {
            ...r,
            comments: [...r.comments, { name: prev.user.name, text }]
          };
        }
        return r;
      })
    }));
  };

  const publishReel = (data, fallbackGrad) => {
    const isObj = typeof data === 'object' && data !== null;
    const text = isObj ? data.text : data;
    const gradient = isObj ? data.gradient : fallbackGrad;
    const title = isObj ? data.title : 'Moment partagé';
    const image = isObj ? data.image : 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&auto=format&fit=crop&q=80';
    const location = isObj ? data.location : 'Lomé, Togo';
    const soundTitle = isObj ? data.soundTitle : 'Rythmes du Golfe – Lomé';

    const newReel = {
      id: 'r_' + Date.now(),
      creator: state.user.name,
      creatorUid: state.user.id,
      initials: state.user.avatarInitials,
      title,
      text,
      image,
      location,
      soundTitle,
      likes: 1,
      comments: [],
      followed: false,
      liked: true,
      gradient: gradient || 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(14,18,32,0.88) 100%)'
    };
    setState(prev => ({
      ...prev,
      reels: [newReel, ...prev.reels]
    }));
    playSuccessSound();
    showToast('Votre Moment est publié.');
  };

  const updatePin = (newPin) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, pin: newPin }
    }));
    showToast('Code PIN mis à jour.');
  };

  return (
    <AppContext.Provider value={{
      ...state,
      toast,
      modal,
      showToast,
      openModal,
      closeModal,
      setActiveTab,
      setActiveChatId,
      setActiveMarketTab,
      toggleTheme,
      sendMessage,
      sendMoneyInChat,
      topup,
      pay,
      toggleFavorite,
      bookService,
      addProduct,
      addService,
      likeReel,
      toggleFollow,
      addReelComment,
      publishReel,
      updatePin
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
