import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { IconSearch, IconSend, IconWallet, IconArrowLeft, IconChat } from '../components/Icons.jsx';

export const ChatPage = () => {
  const { chats, activeChatId, setActiveChatId, sendMessage, openModal } = useApp();
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    sendMessage(activeChat.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className={`chat-layout ${activeChatId ? 'has-active-chat' : ''}`}>
      {/* Master List Pane */}
      <div className="chat-master">
        <div className="chat-master-header">
          <div className="search-field">
            <IconSearch />
            <input
              type="text"
              placeholder="Rechercher une discussion..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-list-scroll">
          {filteredChats.map(chat => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isSelected = chat.id === activeChatId;
            const snippet = lastMsg ? (lastMsg.isTransfer ? `Virement: ${lastMsg.text}` : lastMsg.text) : 'Aucun message';

            return (
              <div
                key={chat.id}
                className={`chat-row ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveChatId(chat.id)}
              >
                <div className="chat-avatar">
                  {chat.initials || chat.name.slice(0, 2).toUpperCase()}
                  {chat.online && <span className="chat-online-badge"></span>}
                </div>
                <div className="chat-preview">
                  <div className="chat-title-line">
                    <span className="chat-title">{chat.name}</span>
                    <span className="chat-time">{lastMsg?.time}</span>
                  </div>
                  <div className="chat-snippet">{snippet}</div>
                </div>
                {chat.unread > 0 && <span className="chat-badge">{chat.unread}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Conversation Pane */}
      {activeChat ? (
        <div className="chat-detail">
          {/* Conversation Header */}
          <div className="chat-detail-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className="btn-icon chat-back-btn"
                style={{ border: 'none' }}
                onClick={() => setActiveChatId(null)}
              >
                <IconArrowLeft />
              </button>
              <div className="chat-avatar" style={{ width: 40, height: 40 }}>
                {activeChat.initials || activeChat.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink-primary)' }}>{activeChat.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--success)', fontWeight: 700 }}>En ligne</div>
              </div>
            </div>

            <button
              className="btn btn-alt"
              onClick={() => openModal('CHAT_TRANSFER', { chatId: activeChat.id, recipientName: activeChat.name })}
              style={{ padding: '7px 14px', fontSize: 13, minHeight: '38px' }}
            >
              <IconWallet />
              <span>Transférer</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="chat-messages-body">
            {activeChat.messages.map(msg => (
              <div
                key={msg.id}
                className={`bubble ${msg.fromMe ? 'outgoing' : 'incoming'} ${msg.isTransfer ? 'transfer-bubble' : ''}`}
              >
                {!msg.fromMe && activeChat.isGroup && msg.sender && (
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', marginBottom: 2 }}>
                    {msg.sender}
                  </div>
                )}
                <div>{msg.text}</div>
                <div className="bubble-meta">{msg.time}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Compose Bar */}
          <div className="chat-compose-wrapper">
            <input
              type="text"
              placeholder={`Écrire un message à ${activeChat.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              autoComplete="off"
            />
            <button
              className="btn"
              onClick={handleSend}
              style={{ padding: '10px 18px', borderRadius: 'var(--radius-full)' }}
            >
              <IconSend />
              <span>Envoyer</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-detail">
          <div className="chat-empty-state">
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)' }}>
              <IconChat size={28} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink-primary)' }}>Aucune discussion sélectionnée</div>
            <div style={{ fontSize: 13, maxWidth: 320 }}>Sélectionnez un contact dans la liste à gauche pour consulter l'historique et échanger.</div>
          </div>
        </div>
      )}
    </div>
  );
};
