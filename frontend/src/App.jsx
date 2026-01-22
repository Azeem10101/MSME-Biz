import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, User, History, Sparkles, ShoppingBag, Wallet, Package, ArrowLeft,
  Mic, ArrowUp, Menu, Download, TrendingUp, Sun, Moon, Bell,
  BarChart3, AlertTriangle, CheckCircle2, X, Zap, Globe, IndianRupee,
  MessageCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsWidget from './AnalyticsWidget';

// Toast Notification
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, x: 20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="toast"
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '14px 20px',
      borderRadius: '12px',
      background: type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' :
        type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
          'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      zIndex: 9999,
      fontWeight: 600,
      fontSize: '0.9rem'
    }}
  >
    {type === 'success' ? <CheckCircle2 size={18} /> :
      type === 'error' ? <AlertTriangle size={18} /> : <Bell size={18} />}
    <span>{message}</span>
    <button onClick={onClose} style={{
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      borderRadius: '4px',
      padding: '4px',
      display: 'flex'
    }}>
      <X size={14} />
    </button>
  </motion.div>
);

// Welcome Hero
const WelcomeHero = ({ onGetStarted }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      textAlign: 'center',
      padding: '60px 40px',
      maxWidth: '600px',
      margin: '0 auto'
    }}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", delay: 0.2 }}
      style={{
        width: '80px',
        height: '80px',
        background: 'var(--gradient-purple)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)'
      }}
    >
      <Sparkles size={40} color="white" />
    </motion.div>

    <h1 style={{
      fontSize: '2.2rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea, #764ba2, #f5576c)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '16px'
    }}>
      Welcome to BizAssist
    </h1>

    <p style={{
      color: 'var(--text-secondary)',
      fontSize: '1.1rem',
      lineHeight: '1.6',
      marginBottom: '32px'
    }}>
      Your AI-powered business companion for Indian MSMEs.
      Track sales, expenses, and inventory with just your voice.
    </p>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '32px'
    }}>
      {[
        { icon: <MessageCircle size={24} />, label: 'Natural Language', desc: 'Hindi & English' },
        { icon: <Mic size={24} />, label: 'Voice Input', desc: 'Speak naturally' },
        { icon: <BarChart3 size={24} />, label: 'Smart Analytics', desc: 'Real-time insights' }
      ].map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          style={{
            padding: '20px 16px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            textAlign: 'center'
          }}
        >
          <div style={{ color: 'var(--accent-purple)', marginBottom: '8px' }}>{f.icon}</div>
          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{f.label}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.desc}</div>
        </motion.div>
      ))}
    </div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onGetStarted}
      style={{
        background: 'var(--gradient-purple)',
        color: 'white',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)'
      }}
    >
      Get Started <ChevronRight size={18} />
    </motion.button>
  </motion.div>
);

// Quick Action Suggestions
const QuickActions = ({ onAction }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      justifyContent: 'center',
      padding: '16px'
    }}
  >
    {[
      { text: '📊 Show analytics', query: 'Show my analytics' },
      { text: '📦 Check inventory', query: 'Show inventory' },
      { text: '💰 Record a sale', query: 'Sold 5 notebooks for 500' },
      { text: '📜 Recent history', query: 'Show recent transactions' }
    ].map((action, i) => (
      <motion.button
        key={i}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onAction(action.query)}
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px',
          padding: '8px 16px',
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {action.text}
      </motion.button>
    ))}
  </motion.div>
);

// Quick Sell Form
const QuickSellForm = ({ item, onCancel, onSubmit }) => {
  const [qty, setQty] = useState(1);
  const [customer, setCustomer] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="quick-form-overlay"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.9 }}
        className="quick-form"
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '2rem' }}>{item.icon}</span>
          <div>
            <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Quick Sell</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{item.name} • ₹{item.price}/unit</p>
          </div>
        </div>

        <div className="input-group">
          <label>Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            min="1"
            autoFocus
          />
        </div>

        <div className="input-group">
          <label>Customer (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Sharma ji"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </div>

        <div style={{
          background: 'var(--gradient-teal)',
          padding: '16px',
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.9, color: 'white' }}>TOTAL AMOUNT</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white' }}>
            ₹{(qty * item.price).toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSubmit(qty, customer)}
            style={{
              flex: 1,
              background: 'var(--gradient-purple)',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={18} /> Confirm
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            style={{
              padding: '14px 24px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Theme Toggle
const ThemeToggle = ({ isDark, onToggle }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onToggle}
    className="theme-toggle"
  >
    {isDark ? <Sun size={16} /> : <Moon size={16} />}
    <span>{isDark ? 'Light' : 'Dark'}</span>
  </motion.button>
);

// Result Display
const ResultDisplay = ({ data }) => {
  if (!data || data.intent === 'UNKNOWN') return null;

  if (data.view_type === 'inventory_list') {
    return (
      <div className="inventory-list" style={{ marginTop: '12px' }}>
        <div className="list-header"><Package size={16} /> Inventory Status</div>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {data.inventory?.map((item, i) => (
            <div key={i} className="list-item">
              <span style={{ fontWeight: '600' }}>{item.item}</span>
              <span className={`stock-badge ${item.stock < 10 ? 'low' : 'ok'}`}>
                {Math.max(0, Math.round(item.stock))} units
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.view_type === 'list' && data.transactions) {
    return (
      <div className="transaction-list" style={{ marginTop: '12px' }}>
        <div className="list-header"><History size={16} /> Recent Transactions</div>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {data.transactions.map((t, i) => (
            <div key={i} className="list-item">
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t.item}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(t.date).toLocaleDateString('en-IN')}
                </div>
              </div>
              <span style={{
                fontWeight: '700',
                color: t.type === 'SALE' ? 'var(--accent-success)' : 'var(--accent-error)'
              }}>
                {t.type === 'SALE' ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isQuery = data.intent === 'SUMMARY_QUERY' || data.intent === 'INSIGHT_QUERY';
  if (isQuery && data.stats) {
    return (
      <div style={{ marginTop: '12px' }}>
        <div className="stats-grid">
          <div className="stat-card sales">
            <div className="stat-label">Revenue</div>
            <div className="stat-value">₹{(data.stats.total_sales || 0).toLocaleString('en-IN')}</div>
          </div>
          <div className="stat-card expenses">
            <div className="stat-label">Expenses</div>
            <div className="stat-value">₹{(data.stats.total_expenses || 0).toLocaleString('en-IN')}</div>
          </div>
          <div className="stat-card profit">
            <div className="stat-label">Profit</div>
            <div className="stat-value">₹{(data.stats.net_profit || 0).toLocaleString('en-IN')}</div>
          </div>
          <div className="stat-card records">
            <div className="stat-label">Records</div>
            <div className="stat-value">{data.stats.transaction_count || 0}</div>
          </div>
        </div>
        <AnalyticsWidget />
      </div>
    );
  }

  // Entry cards (sales, expenses, inventory)
  if (data.intent === 'SALE_ENTRY' || data.intent === 'EXPENSE_ENTRY' ||
    data.intent === 'INVENTORY_UPDATE' || data.intent === 'STOCK_PURCHASE') {
    const gradients = {
      'SALE_ENTRY': 'var(--gradient-teal)',
      'EXPENSE_ENTRY': 'var(--gradient-orange)',
      'INVENTORY_UPDATE': 'var(--gradient-purple)',
      'STOCK_PURCHASE': 'var(--gradient-blue)'
    };
    const icons = {
      'SALE_ENTRY': <ShoppingBag size={14} />,
      'EXPENSE_ENTRY': <Wallet size={14} />,
      'INVENTORY_UPDATE': <Package size={14} />,
      'STOCK_PURCHASE': <TrendingUp size={14} />
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="result-card"
        style={{ marginTop: '12px' }}
      >
        <div className="intent-badge" style={{ background: gradients[data.intent] }}>
          {icons[data.intent]}
          {data.intent.replace(/_/g, ' ')}
        </div>
        <div className="data-grid">
          {data.items?.map((item, i) => (
            <div key={i} className="data-item">
              <span className="label">{item.product_name} × {item.quantity}</span>
              <span className="value">₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          {data.total && (
            <div className="data-item" style={{ paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
              <span className="label" style={{ fontWeight: 700 }}>Total</span>
              <span className="value" style={{ fontSize: '1.1rem', color: 'var(--accent-success)' }}>
                ₹{data.total.toLocaleString('en-IN')}
              </span>
            </div>
          )}
          {data.amount && (
            <div className="data-item">
              <span className="label">{data.category || 'Amount'}</span>
              <span className="value" style={{ color: 'var(--accent-error)' }}>
                ₹{data.amount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return null;
};

// Main App
function App() {
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [activeQuickItem, setActiveQuickItem] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  const inventory = [
    { id: 1, name: 'Milk (1L)', price: 60, icon: '🥛' },
    { id: 2, name: 'Bread', price: 40, icon: '🍞' },
    { id: 3, name: 'Notebook', price: 50, icon: '📓' },
    { id: 4, name: 'Rice (1kg)', price: 80, icon: '🍚' },
  ];

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetch('http://localhost:8000/stats/low_stock')
      .then(res => res.json())
      .then(data => setLowStockCount(data.count))
      .catch(() => { });
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      showToast('Voice not supported in this browser', 'error');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      showToast('🎤 Voice captured!', 'success');
    };
    recognition.onerror = () => {
      setIsListening(false);
      showToast('Voice recognition failed', 'error');
    };

    recognition.start();
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setShowWelcome(false);
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8).map(m => ({ role: m.role, text: m.text }))
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.answer || 'Done!',
        result: data
      }]);

      // Show appropriate toast
      if (data.intent === 'SALE_ENTRY') showToast('✅ Sale recorded!', 'success');
      else if (data.intent === 'EXPENSE_ENTRY') showToast('💸 Expense logged!', 'success');
      else if (data.intent === 'STOCK_PURCHASE') showToast('📦 Stock updated!', 'success');
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '⚠️ Connection error. Is the server running?',
        isError: true
      }]);
      showToast('Server connection failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    await sendMessage(msg);
  };

  const handleQuickSale = async (qty, customer) => {
    const item = activeQuickItem;
    setActiveQuickItem(null);
    const msg = `Sold ${qty} ${item.name} for ${item.price * qty}${customer ? ` to ${customer}` : ''}`;
    await sendMessage(msg);
  };

  return (
    <div className="app-layout">
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo-area">
          <div>
            <div className="logo-icon"><Sparkles size={22} color="white" /></div>
            <span className="logo-text">MSME<br />BizAssist</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="icon-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <ArrowLeft size={18} />
          </motion.button>
        </div>

        <nav className="nav-section">
          <motion.button
            whileHover={{ x: 4 }}
            className="nav-item active"
            onClick={() => sendMessage('Show inventory')}
            style={{ position: 'relative' }}
          >
            <Package size={20} />
            <span>Inventory</span>
            {lowStockCount > 0 && <span className="notification-badge">{lowStockCount}</span>}
          </motion.button>

          <div style={{ marginTop: '16px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
              color: 'var(--text-muted)', paddingLeft: '16px', letterSpacing: '0.1em'
            }}>Quick Sell</span>
            <div className="quick-sell-grid" style={{ marginTop: '8px' }}>
              {inventory.map(item => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="quick-sell-btn"
                  onClick={() => setActiveQuickItem(item)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ x: 4 }}
            className="nav-item"
            onClick={() => sendMessage('Show analytics')}
            style={{ background: 'linear-gradient(135deg, rgba(245, 175, 25, 0.2), rgba(241, 39, 17, 0.2))' }}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </motion.button>

          <motion.button whileHover={{ x: 4 }} className="nav-item" onClick={() => sendMessage('Show recent transactions')}>
            <History size={20} /><span>History</span>
          </motion.button>

          <motion.button
            whileHover={{ x: 4 }}
            className="nav-item"
            onClick={() => window.open('http://localhost:8000/export/html', '_blank')}
          >
            <Download size={20} /><span>Export Report</span>
          </motion.button>
        </nav>

        <div style={{
          marginTop: 'auto',
          padding: '12px',
          background: 'var(--glass-bg)',
          borderRadius: '10px',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Globe size={14} style={{ color: 'var(--accent-purple)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Supports Hindi & English
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            "Becha 5 notebook 500 mein"
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!sidebarOpen && (
              <motion.button whileHover={{ scale: 1.1 }} className="icon-btn" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
              </motion.button>
            )}
            <div className="header-info">
              <h2>BizAssist Dashboard</h2>
              <p>AI-Powered Business Intelligence • Made for Indian MSMEs</p>
            </div>
          </div>
          <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        </header>

        <div className="chat-messages">
          {showWelcome && messages.length === 0 ? (
            <WelcomeHero onGetStarted={() => {
              setShowWelcome(false);
              sendMessage('What can you help me with?');
            }} />
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`message-wrapper ${msg.role}`}
                  >
                    <div className={`avatar ${msg.role}`}>
                      {msg.role === 'bot' ? <Bot size={20} color="white" /> : <User size={20} color="white" />}
                    </div>
                    <div className="message-content">
                      <div className="bubble" style={msg.isError ? { borderColor: 'var(--accent-error)' } : {}}>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                        {msg.result && <ResultDisplay data={msg.result} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="message-wrapper bot">
                  <div className="avatar bot"><Bot size={20} color="white" /></div>
                  <div className="bubble">
                    <div className="loading-dots">
                      <div className="loading-dot" />
                      <div className="loading-dot" />
                      <div className="loading-dot" />
                    </div>
                  </div>
                </motion.div>
              )}

              {messages.length > 0 && messages.length < 3 && !loading && (
                <QuickActions onAction={sendMessage} />
              )}
            </>
          )}
          <div ref={chatEndRef} />
        </div>

        <footer className="input-container">
          <form className="input-box" onSubmit={handleSubmit}>
            <IndianRupee size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Try: 'Sold 5 notebooks for 500' or 'बेचा 10 दूध 600 में'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`icon-btn ${isListening ? 'mic-btn-active' : ''}`}
              onClick={handleMicClick}
            >
              <Mic size={20} />
            </motion.button>
            <motion.button
              type="submit"
              className="send-btn"
              disabled={loading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp size={22} strokeWidth={2.5} />
            </motion.button>
          </form>
        </footer>
      </main>

      <AnimatePresence>
        {activeQuickItem && (
          <QuickSellForm
            item={activeQuickItem}
            onCancel={() => setActiveQuickItem(null)}
            onSubmit={handleQuickSale}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
