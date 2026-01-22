import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, User, History, Sparkles, ShoppingBag, Wallet, Package, ArrowLeft,
  Search, Mic, ArrowUp, Menu, Download, TrendingUp, Sun, Moon, Bell,
  PieChart, BarChart3, AlertTriangle, CheckCircle2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsWidget from './AnalyticsWidget';

// Toast Notification System
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.9 }}
    style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      padding: '16px 24px',
      borderRadius: '12px',
      background: type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' :
        type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
          'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      zIndex: 9999,
      fontWeight: 600
    }}
  >
    {type === 'success' ? <CheckCircle2 size={20} /> :
      type === 'error' ? <AlertTriangle size={20} /> : <Bell size={20} />}
    {message}
    <button onClick={onClose} style={{
      background: 'transparent',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      marginLeft: '8px'
    }}>
      <X size={18} />
    </button>
  </motion.div>
);

// Enhanced Quick Sell Form
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
        initial={{ y: 50, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 50, scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="quick-form"
        onClick={e => e.stopPropagation()}
      >
        <h3>
          <span style={{ marginRight: '8px' }}>{item.icon}</span>
          Quick Sell: {item.name.split(' ')[0]}
        </h3>
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          fontSize: '0.95rem'
        }}>
          Unit Price: <strong style={{ color: 'var(--accent-success)' }}>₹{item.price}</strong>
        </p>

        <div className="input-group">
          <label>Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            min="1"
          />
        </div>

        <div className="input-group">
          <label>Customer Name (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Ramesh"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </div>

        <div style={{
          marginTop: '8px',
          padding: '12px',
          background: 'var(--glass-bg)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Amount</span>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            background: 'var(--gradient-teal)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ₹{qty * item.price}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="nav-item active"
            style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
            onClick={() => onSubmit(qty, customer)}
          >
            <CheckCircle2 size={18} />
            Confirm Sale
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="nav-item"
            style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
            onClick={onCancel}
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
    className="theme-toggle"
    onClick={onToggle}
  >
    {isDark ? <Sun size={16} /> : <Moon size={16} />}
    <span>{isDark ? 'Light' : 'Dark'}</span>
  </motion.button>
);

// Transaction History Component
const TransactionHistory = ({ transactions }) => {
  const formatDate = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="transaction-list">
      <div className="list-header">
        <History size={16} /> Recent Transactions
      </div>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {transactions.map((t, i) => (
          <motion.div
            key={i}
            className="list-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: t.type === 'SALE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: t.type === 'SALE' ? 'var(--accent-success)' : 'var(--accent-error)'
              }}>
                {t.type === 'SALE' ? <TrendingUp size={18} /> : <Wallet size={18} />}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {t.type === 'SALE' ? (t.customer ? `${t.customer} • ${t.item}` : t.item) : t.item}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formatDate(t.date)} {t.quantity > 0 && `• ${t.quantity} units`}
                </div>
              </div>
            </div>
            <div style={{
              fontWeight: '700',
              color: t.type === 'SALE' ? 'var(--accent-success)' : 'var(--accent-error)'
            }}>
              {t.type === 'SALE' ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Inventory List Component
const InventoryList = ({ items }) => (
  <div className="inventory-list">
    <div className="list-header">
      <Package size={16} /> Current Stock
    </div>
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="list-item"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <span style={{ fontWeight: '600' }}>{item.item}</span>
          <span className={`stock-badge ${item.stock < 10 ? 'low' : 'ok'}`}>
            {Math.round(item.stock)} units
          </span>
        </motion.div>
      ))}
    </div>
  </div>
);

// Result Display Component
const ResultDisplay = ({ data }) => {
  if (!data || data.intent === 'UNKNOWN') return null;

  if (data.view_type === 'inventory_list') {
    return <InventoryList items={data.inventory} />;
  }

  const isQuery = data.intent === 'SUMMARY_QUERY' || data.intent === 'INSIGHT_QUERY';

  if (isQuery) {
    return (
      <div style={{ marginTop: '16px' }}>
        {data.stats && (
          <div className="stats-grid">
            <motion.div
              className="stat-card sales"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="stat-label">Sales</div>
              <div className="stat-value">₹{(data.stats.total_sales || 0).toLocaleString('en-IN')}</div>
            </motion.div>
            <motion.div
              className="stat-card expenses"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="stat-label">Expenses</div>
              <div className="stat-value">₹{(data.stats.total_expenses || 0).toLocaleString('en-IN')}</div>
            </motion.div>
            <motion.div
              className="stat-card profit"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="stat-label">Profit</div>
              <div className="stat-value">₹{(data.stats.net_profit || 0).toLocaleString('en-IN')}</div>
            </motion.div>
            <motion.div
              className="stat-card records"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="stat-label">Records</div>
              <div className="stat-value">{data.stats.transaction_count || 0}</div>
            </motion.div>
          </div>
        )}

        {data.view_type === 'list' && data.transactions ? (
          <TransactionHistory transactions={data.transactions} />
        ) : (
          <AnalyticsWidget />
        )}
      </div>
    );
  }

  // Entry cards
  const getGradient = () => {
    switch (data.intent) {
      case 'SALE_ENTRY': return 'var(--gradient-teal)';
      case 'EXPENSE_ENTRY': return 'var(--gradient-orange)';
      case 'INVENTORY_UPDATE': case 'STOCK_PURCHASE': return 'var(--gradient-purple)';
      default: return 'var(--gradient-blue)';
    }
  };

  const getIcon = () => {
    switch (data.intent) {
      case 'SALE_ENTRY': return <ShoppingBag size={14} />;
      case 'EXPENSE_ENTRY': return <Wallet size={14} />;
      case 'INVENTORY_UPDATE': case 'STOCK_PURCHASE': return <Package size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="result-card"
    >
      <div className="intent-badge" style={{ background: getGradient() }}>
        {getIcon()}
        {data.intent.replace(/_/g, ' ')}
      </div>

      <div className="data-grid">
        {data.date && (
          <div className="data-item">
            <span className="label">Date</span>
            <span className="value">{new Date(data.date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}</span>
          </div>
        )}

        {data.intent === 'SALE_ENTRY' && data.items && (
          <>
            {data.items.map((item, i) => (
              <div key={i} className="data-item">
                <span className="label">{item.product_name} × {item.quantity}</span>
                <span className="value">₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            {data.customer_name && (
              <div className="data-item">
                <span className="label">Customer</span>
                <span className="value">{data.customer_name}</span>
              </div>
            )}
            <div className="data-item" style={{
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid var(--glass-border)'
            }}>
              <span className="label" style={{ fontWeight: 700 }}>Total Revenue</span>
              <span className="value" style={{
                fontSize: '1.2rem',
                background: 'var(--gradient-teal)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>₹{data.total.toLocaleString('en-IN')}</span>
            </div>
          </>
        )}

        {data.intent === 'EXPENSE_ENTRY' && (
          <>
            <div className="data-item">
              <span className="label">Category</span>
              <span className="value">{data.category}</span>
            </div>
            <div className="data-item">
              <span className="label">Amount</span>
              <span className="value" style={{ color: 'var(--accent-error)' }}>
                ₹{data.amount.toLocaleString('en-IN')}
              </span>
            </div>
            {data.description && (
              <div className="data-item">
                <span className="label">Notes</span>
                <span className="value">{data.description}</span>
              </div>
            )}
          </>
        )}

        {(data.intent === 'INVENTORY_UPDATE' || data.intent === 'STOCK_PURCHASE') && (
          <>
            <div className="data-item">
              <span className="label">Product</span>
              <span className="value">{data.item || data.item_name}</span>
            </div>
            <div className="data-item">
              <span className="label">Change</span>
              <span className="value" style={{
                color: (data.quantity_change || data.quantity) > 0 ? 'var(--accent-success)' : 'var(--accent-error)'
              }}>
                {(data.quantity_change || data.quantity) > 0 ? '+' : ''}{data.quantity_change || data.quantity} units
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Main App Component
function App() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '👋 Welcome to MSME BizAssist! I\'m your AI-powered business companion. Try saying "Sold 5 notebooks for 500" or "Show my analytics"'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [activeQuickItem, setActiveQuickItem] = useState(null);
  const chatEndRef = useRef(null);

  const [inventory] = useState([
    { id: 1, name: 'Milk (1L)', price: 60, icon: '🥛' },
    { id: 2, name: 'Bread', price: 40, icon: '🍞' },
    { id: 3, name: 'Notebook', price: 50, icon: '📓' },
    { id: 4, name: 'Rice (1kg)', price: 80, icon: '🍚' },
  ]);

  const [isListening, setIsListening] = useState(false);

  // Effects
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

  // Show toast helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Mic handler
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      showToast('Speech recognition not supported', 'error');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev + " " + transcript).trim());
      showToast('Voice captured!', 'success');
    };
    recognition.onerror = () => showToast('Voice recognition failed', 'error');

    recognition.start();
  };

  // Quick sale handler
  const handleQuickSale = async (qty, customer, customMessage) => {
    let message = customMessage;
    if (!message) {
      const item = activeQuickItem;
      setActiveQuickItem(null);
      message = `Sold ${qty} ${item.name} for ${item.price * qty} to ${customer || 'customer'}`;
      showToast(`Sale recorded: ${qty}x ${item.name.split(' ')[0]}`, 'success');
    }

    setMessages(prev => [...prev, { role: 'user', text: message }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          history: messages.slice(-10).map(m => ({ role: m.role, text: m.text, result: m.result }))
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.answer || data.message || 'Operation completed!',
        result: data
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '⚠️ Connection issue. Please check if the server is running.',
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10).map(m => ({ role: m.role, text: m.text, result: m.result }))
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.answer || data.message || 'Data processed successfully!',
        result: data
      }]);

      if (data.intent === 'SALE_ENTRY') showToast('Sale recorded!', 'success');
      if (data.intent === 'EXPENSE_ENTRY') showToast('Expense logged!', 'success');
      if (data.intent === 'STOCK_PURCHASE') showToast('Stock restocked!', 'success');
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '⚠️ Unable to process request. Please try again.',
        isError: true
      }]);
      showToast('Request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo-area">
          <div>
            <div className="logo-icon">
              <Sparkles size={22} color="white" />
            </div>
            <span className="logo-text">MSME<br />BizAssist</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="icon-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <ArrowLeft size={18} />
          </motion.button>
        </div>

        <nav className="nav-section">
          {/* Inventory Button with Badge */}
          <motion.button
            whileHover={{ x: 4 }}
            className="nav-item active"
            onClick={() => handleQuickSale(0, '', 'Show inventory')}
            style={{ position: 'relative' }}
          >
            <Package size={20} />
            <span>Inventory</span>
            {lowStockCount > 0 && (
              <span className="notification-badge">{lowStockCount}</span>
            )}
          </motion.button>

          {/* Quick Sell Section */}
          <div style={{ marginTop: '16px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              paddingLeft: '16px',
              letterSpacing: '0.1em'
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

          {/* Analytics */}
          <motion.button
            whileHover={{ x: 4 }}
            className="nav-item"
            onClick={() => handleQuickSale(0, '', 'Show analytics')}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 175, 25, 0.2), rgba(241, 39, 17, 0.2))',
              marginTop: '8px'
            }}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </motion.button>

          {/* History */}
          <motion.button
            whileHover={{ x: 4 }}
            className="nav-item"
            onClick={() => handleQuickSale(0, '', 'Show recent transactions')}
          >
            <History size={20} />
            <span>History</span>
          </motion.button>

          {/* Export */}
          <motion.button
            whileHover={{ x: 4 }}
            className="nav-item"
            onClick={() => window.open('http://localhost:8000/export/html', '_blank')}
            style={{ marginTop: '8px' }}
          >
            <Download size={20} />
            <span>Export Report</span>
          </motion.button>
        </nav>

        {/* AI Concierge */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="nav-item"
          onClick={() => handleQuickSale(0, '', 'What can you help me with?')}
          style={{
            marginTop: 'auto',
            background: 'var(--gradient-purple)',
            color: 'white'
          }}
        >
          <Sparkles size={20} />
          <span>AI Assistant</span>
        </motion.button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="chat-header">
          <div className="header-info" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!sidebarOpen && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-btn"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </motion.button>
            )}
            <div>
              <h2>BizAssist Dashboard</h2>
              <p>AI-Powered Business Intelligence • v2.0</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>
        </header>

        {/* Chat Messages */}
        <div className="chat-messages">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`message-wrapper ${msg.role}`}
              >
                <div className={`avatar ${msg.role}`}>
                  {msg.role === 'bot' ? <Bot size={20} color="white" /> : <User size={20} color="white" />}
                </div>
                <div className="message-content">
                  <div className="bubble" style={msg.isError ? { borderColor: 'var(--accent-error)' } : {}}>
                    {msg.text}
                    {msg.result && <ResultDisplay data={msg.result} />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="message-wrapper bot"
            >
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

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <footer className="input-container">
          <form className="input-box" onSubmit={handleSubmit}>
            <Search size={20} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Try: 'Sold 5 notebooks for 500' or 'Show analytics'..."
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

      {/* Quick Sell Modal */}
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
