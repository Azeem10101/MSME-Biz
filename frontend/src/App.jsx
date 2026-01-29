import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, User, History, Sparkles, ShoppingBag, Wallet, Package, ArrowLeft,
  Search, Mic, ArrowUp, Menu, X, Download, TrendingUp, Sun, Moon,
  RotateCcw, Wifi, WifiOff, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsWidget from './AnalyticsWidget';

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
        <h3 style={{ fontFamily: 'Syne', fontSize: '1.5rem', marginBottom: '8px' }}>
          {item.icon} Quick Sell: {item.name.split(' ')[0]}
        </h3>
        <p style={{ fontWeight: '600', marginBottom: '20px' }}>Current Price: ₹{item.price}</p>

        <div className="input-group">
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '4px', fontSize: '0.8rem' }}>QUANTITY</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            min="1"
            style={{
              width: '100%',
              padding: '12px',
              border: 'var(--border-thin)',
              borderRadius: '8px',
              fontFamily: 'Space Grotesk',
              fontWeight: '700',
              fontSize: '1.2rem',
              boxShadow: 'var(--shadow-brutal)',
              background: 'var(--white)',
              color: 'var(--black)'
            }}
          />
        </div>

        <div className="input-group" style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '4px', fontSize: '0.8rem' }}>CUSTOMER NAME (OPTIONAL)</label>
          <input
            type="text"
            placeholder="e.g. Ramesh"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: 'var(--border-thin)',
              borderRadius: '8px',
              fontFamily: 'Space Grotesk',
              fontWeight: '600',
              boxShadow: 'var(--shadow-brutal)',
              background: 'var(--white)',
              color: 'var(--black)'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button
            className="nav-item active"
            style={{ flex: 1, justifyContent: 'center', padding: '16px' }}
            onClick={() => onSubmit(qty, customer)}
          >
            Confirm Sale
          </button>
          <button
            className="nav-item"
            style={{ flex: 1, justifyContent: 'center', padding: '16px' }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ThemeToggle = ({ isDark, onToggle }) => (
  <motion.button
    whileHover={{ scale: 1.05, x: -2, y: -2, boxShadow: '4px 4px 0px var(--shadow-color)' }}
    whileTap={{ scale: 0.95 }}
    className="theme-toggle"
    onClick={onToggle}
    style={{
      background: 'var(--black)',
      color: 'var(--white)',
      border: 'var(--border-thin)',
      padding: '8px 16px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '900',
      fontSize: '0.8rem',
      cursor: 'pointer',
      boxShadow: '2px 2px 0px var(--shadow-color)',
      transition: 'box-shadow 0.2s, transform 0.2s',
      fontFamily: 'Syne',
      textTransform: 'uppercase'
    }}
  >
    {isDark ? <Sun size={16} /> : <Moon size={16} />}
    <span>{isDark ? 'Light' : 'Dark'}</span>
  </motion.button>
);

const TransactionHistory = ({ transactions }) => {
  // Use useMemo to calculate dates only once per render
  // eslint-disable-next-line react-hooks/purity
  const { todayStr, yesterdayStr } = React.useMemo(() => {
    const now = Date.now();
    return {
      todayStr: new Date(now).toISOString().split('T')[0],
      yesterdayStr: new Date(now - 86400000).toISOString().split('T')[0]
    };
  }, []);

  const formatDate = (dateStr) => {
    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';
    return dateStr.split('-').reverse().join('-');
  };

  return (
    <div style={{ marginTop: '16px', background: 'var(--white)', border: 'var(--border-thick)', borderRadius: '12px', boxShadow: 'var(--shadow-brutal)', overflow: 'hidden' }}>
      <div style={{ padding: '12px', background: '#bfdbfe', borderBottom: 'var(--border-thin)', fontWeight: '900', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#000' }}>
        <History size={16} /> RECENT TRANSACTIONS
      </div>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {transactions.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderBottom: i === transactions.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: t.type === 'SALE' ? '#dcfce7' : '#fee2e2',
                border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {t.type === 'SALE' ? '🟢' : '🔴'}
              </div>
              <div>
                <div style={{ fontWeight: '800', color: 'var(--black)', fontSize: '0.9rem' }}>
                  {t.type === 'SALE' ? (t.customer ? `${t.customer} bought ${t.item}` : `Sold ${t.item}`) : t.item}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: '600' }}>
                  {formatDate(t.date)} • {t.quantity > 0 ? `${t.quantity} Units` : 'Expense'}
                </div>
              </div>
            </div>
            <div style={{ fontWeight: '900', fontSize: '1rem', color: t.type === 'SALE' ? '#15803d' : '#b91c1c' }}>
              {t.type === 'SALE' ? '+' : '-'}₹{Math.abs(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InventoryList = ({ items }) => (
  <div style={{ marginTop: '16px', background: 'var(--white)', border: 'var(--border-thick)', borderRadius: '12px', boxShadow: 'var(--shadow-brutal)', overflow: 'hidden' }}>
    <div style={{ padding: '12px', background: '#c084fc', borderBottom: 'var(--border-thin)', fontWeight: '900', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
      <Package size={16} /> CURRENT STOCK
    </div>
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
          <span style={{ fontWeight: '700' }}>{item.item}</span>
          <span style={{
            background: item.stock < 5 ? '#fecaca' : '#dcfce7',
            padding: '4px 12px',
            borderRadius: '12px',
            border: '2px solid #000',
            fontWeight: '800',
            fontSize: '0.8rem',
            color: '#000'
          }}>
            {item.stock} units
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ResultDisplay = ({ data }) => {
  // If no data or UNKNOWN/GENERAL_QUERY, don't show a card
  if (!data || data.intent === 'UNKNOWN' || data.intent === 'GENERAL_QUERY') {
    return null;
  }

  if (data.view_type === 'inventory_list') {
    return <InventoryList items={data.inventory} />;
  }

  const isQuery = data.intent === 'SUMMARY_QUERY' || data.intent === 'INSIGHT_QUERY';

  if (isQuery) {
    return (
      <div style={{ marginTop: '16px' }}>
        {data.stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ padding: '12px', border: 'var(--border-thick)', borderRadius: '12px', background: '#4ade80', boxShadow: 'var(--shadow-brutal)', color: '#000' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.8 }}>TOTAL SALES</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>₹{data.stats.total_sales || 0}</div>
            </div>
            <div style={{ padding: '12px', border: 'var(--border-thick)', borderRadius: '12px', background: '#fb923c', boxShadow: 'var(--shadow-brutal)', color: '#000' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.8 }}>EXPENSES</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>₹{data.stats.total_expenses || 0}</div>
            </div>
            <div style={{ padding: '12px', border: 'var(--border-thick)', borderRadius: '12px', background: '#FBFF00', boxShadow: 'var(--shadow-brutal)', color: '#000' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.8 }}>NET PROFIT</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>₹{data.stats.net_profit || 0}</div>
            </div>
            <div style={{ padding: '12px', border: 'var(--border-thick)', borderRadius: '12px', background: 'var(--white)', boxShadow: 'var(--shadow-brutal)', color: 'var(--black)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.8 }}>RECORDS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>{data.stats.transaction_count || 0}</div>
            </div>
          </div>
        )}

        {/* CONDITIONALLY RENDER LIST OR CHART */}
        {data.view_type === 'list' && data.transactions ? (
          <TransactionHistory transactions={data.transactions} />
        ) : (
          <AnalyticsWidget />
        )}

        <div style={{
          background: '#a855f7',
          color: '#fff',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '0.6rem',
          fontWeight: '900',
          display: 'inline-block',
          border: '1.5px solid #000',
          marginBottom: '8px',
          marginTop: '16px'
        }}>
          {data.view_type === 'list' ? 'HISTORY VIEW' : 'DASHBOARD VIEW'} • {data.start_date || new Date().toISOString().split('T')[0]}
        </div>
      </div>
    );
  }

  const getIcon = () => {
    switch (data.intent) {
      case 'SALE_ENTRY': return <ShoppingBag size={14} color="#000" />;
      case 'EXPENSE_ENTRY': return <Wallet size={14} color="#000" />;
      case 'INVENTORY_UPDATE': return <Package size={14} color="#000" />;
      default: return <Sparkles size={14} color="#000" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`result-card ${data.intent}`}
    >
      <div className="intent-badge">
        {getIcon()}
        {data.intent.replace('_', ' ')}
      </div>

      <div className="data-grid">
        {data.date && (
          <div className="data-item">
            <span className="label">Date</span>
            <span className="value">{data.date.split('-').reverse().join('-')}</span>
          </div>
        )}

        {data.intent === 'SALE_ENTRY' && (
          <>
            <div style={{ margin: '8px 0', borderTop: '2px solid #000', paddingTop: '12px' }}>
              {data.items.map((item, i) => (
                <div key={i} className="data-item" style={{ marginBottom: '6px' }}>
                  <span className="label" style={{ color: '#000' }}>{item.product_name} ({item.quantity})</span>
                  <span className="value">₹{item.unit_price}</span>
                </div>
              ))}
            </div>
            {data.customer_name && (
              <div className="data-item" style={{ marginBottom: '8px' }}>
                <span className="label">Customer</span>
                <span className="value">{data.customer_name}</span>
              </div>
            )}
            <div className="data-item" style={{ marginTop: '8px', borderTop: 'var(--border-thick)', paddingTop: '12px' }}>
              <span className="label" style={{ fontWeight: '800', color: 'var(--black)' }}>Total Revenue</span>
              <span className="value" style={{ fontSize: '1.2rem', color: 'var(--black)', fontWeight: '900' }}>₹{data.total}</span>
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
              <span className="value" style={{ color: 'var(--black)', fontWeight: '900' }}>₹{data.amount}</span>
            </div>
            {data.description && (
              <div className="data-item">
                <span className="label">Notes</span>
                <span className="value">{data.description}</span>
              </div>
            )}
          </>
        )}

        {data.intent === 'INVENTORY_UPDATE' && (
          <>
            <div className="data-item">
              <span className="label">Product</span>
              <span className="value">{data.item}</span>
            </div>
            <div className="data-item">
              <span className="label">Change</span>
              <span className="value" style={{ color: 'var(--black)', fontWeight: '900' }}>
                {data.quantity_change > 0 ? '+' : ''}{data.quantity_change} Units
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};


// Generate unique ID for messages
const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function App() {
  const [messages, setMessages] = useState([
    { id: generateId(), role: 'bot', text: 'Namaste! I am your AI Business Assistant. Let\'s get started!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // Default open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Health check on mount and periodically
  useEffect(() => {
    const checkHealth = () => {
      fetch('http://localhost:8000/health', { method: 'GET' })
        .then(res => {
          setIsConnected(res.ok);
        })
        .catch(() => setIsConnected(false));
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  const [activeQuickItem, setActiveQuickItem] = useState(null);

  const [inventory] = useState([
    { id: 1, name: 'Milk (1L)', price: 60, icon: '🥛' },
    { id: 2, name: 'Bread', price: 40, icon: '🍞' },
    { id: 3, name: 'Notebook', price: 50, icon: '📓' },
    { id: 4, name: 'Rice (1kg)', price: 80, icon: '🍚' },
  ]);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleReset = () => {
    setMessages([
      { id: generateId(), role: 'bot', text: 'Namaste! I am your AI Business Assistant. Let\'s get started!' }
    ]);
  };

  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser does not support speech recognition");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev + " " + transcript).trim());
    };

    recognition.start();
  };

  const handleQuickSale = async (qty, customer, customMessage) => {
    let message = customMessage;

    if (!message) {
      const item = activeQuickItem;
      setActiveQuickItem(null);
      message = `Sold ${qty} ${item.name} for ${item.price} each${customer ? ` to ${customer}` : ''}`;
    } else {
      // If it's a custom action (like History/Help), just send it.
      // No item logic needed.
    }

    setMessages(prev => [...prev, { id: generateId(), role: 'user', text: message }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          history: messages.map(m => ({
            role: m.role,
            text: m.text,
            result: m.result
          }))
        })
      });

      const data = await response.json();
      // If answer exists, use it. If not, maybe it's an error message? Fallback to generic.
      const botText = data.answer || data.message || 'Quick Sale Recorded!';
      setMessages(prev => [...prev, { id: generateId(), role: 'bot', text: botText, result: data }]);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
      setMessages(prev => [...prev, { id: generateId(), role: 'bot', text: '⚠️ Connection Error: Please ensure the backend server is running on port 8000.', isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { id: generateId(), role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({
            role: m.role,
            text: m.text,
            result: m.result
          }))
        })
      });

      const data = await response.json();
      const botText = data.answer || data.message || 'Data Extracted Successfully!';
      setMessages(prev => [...prev, { id: generateId(), role: 'bot', text: botText, result: data }]);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
      setMessages(prev => [...prev, { id: generateId(), role: 'bot', text: '⚠️ Connection Error: Please ensure the backend server is running on port 8000. Run: python app.py', isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Instant Report View
  const handleViewReport = () => {
    window.open('http://localhost:8000/export/html', '_blank');
  };

  return (
    <div className="app-layout">
      {/* Mobile Toggle Button (Visible only on mobile) */}
      <button
        className="icon-btn"
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, display: 'none' }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar: Add 'closed' class if sidebarOpen is false */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo-area" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-icon">
              <Sparkles size={20} color="#000" weight="bold" />
            </div>
            <span className="logo-text" style={{ color: 'var(--black)' }}>MSME<br />BIZ</span>
          </div>
          {/* Close Sidebar Button */}
          <button className="icon-btn" style={{ background: 'var(--white)', border: 'var(--border-thin)', color: 'var(--black)' }} onClick={() => setSidebarOpen(false)}>
            <ArrowLeft size={20} />
          </button>
        </div>

        <nav className="nav-section">
          <button
            className="nav-item active"
            onClick={() => handleQuickSale(0, '', 'Show me my inventory list')}
            title="Check Stock"
            style={{ color: '#000' }}
          >
            <Package size={22} color="#000" weight="bold" />
            <span>Inventory</span>
          </button>

          <div style={{ marginTop: '24px', marginBottom: '12px' }}>
            <span className="label" style={{ paddingLeft: '12px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Quick Sell</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px' }}>
              {inventory.map(item => (
                <button
                  key={item.id}
                  className="icon-btn"
                  style={{
                    flexDirection: 'column',
                    height: 'auto',
                    padding: '12px 8px',
                    fontSize: '0.8rem',
                    gap: '4px'
                  }}
                  onClick={() => setActiveQuickItem(item)}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <span style={{ fontWeight: '700' }}>{item.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="nav-item"
            style={{ marginBottom: '16px', backgroundColor: '#FBFF00', border: 'var(--border-thin)', boxShadow: 'var(--shadow-brutal)', color: '#000', fontWeight: 'bold' }}
            onClick={() => handleQuickSale(0, '', 'Show me the sales trends')}
          >
            <TrendingUp size={22} color="#000" />
            <span>Analytics</span>
          </button>

          <button
            className="nav-item"
            style={{ backgroundColor: '#60a5fa', border: 'var(--border-thin)', boxShadow: 'var(--shadow-brutal)', color: '#000', fontWeight: 'bold' }}
            onClick={() => handleQuickSale(0, '', 'Show me my recent history')}
          >
            <History size={22} color="#000" />
            <span>History</span>
          </button>

          <button
            className="nav-item"
            style={{ marginTop: '16px', backgroundColor: '#4ade80', border: 'var(--border-thin)', boxShadow: 'var(--shadow-brutal)', color: '#000', fontWeight: 'bold' }}
            onClick={handleViewReport}
          >
            <Download size={22} color="#000" />
            <span>View Dashboard (PDF/HTML)</span>
          </button>
        </nav>

        <button
          className="nav-item"
          style={{
            marginTop: 'auto',
            background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
            border: 'var(--border-thin)',
            boxShadow: 'var(--shadow-brutal)',
            color: '#000',
            fontWeight: 'bold'
          }}
          onClick={() => handleQuickSale(0, '', 'What can you do?')}
        >
          <Sparkles size={22} color="#000" />
          <span>AI Concierge</span>
        </button>

        {/* Powered by Gemini Badge */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'linear-gradient(135deg, #4285f4 0%, #9b72cb 50%, #d96570 100%)',
            color: '#fff',
            borderRadius: '20px',
            fontSize: '0.65rem',
            fontWeight: '700',
            border: 'var(--border-thin)',
            boxShadow: '2px 2px 0px var(--shadow-color)'
          }}>
            <Zap size={12} />
            Powered by Gemini
          </span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="chat-header">
          <div className="header-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Open Sidebar Button (Visible if Closed) */}
            {!sidebarOpen && (
              <button
                className="icon-btn"
                style={{
                  background: 'var(--white)',
                  color: 'var(--black)',
                  border: 'var(--border-thin)',
                  boxShadow: '2px 2px 0px var(--black)'
                }}
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
            )}
            <div>
              <h2>Biz Insight Dashboard</h2>
              <p>Multilingual Smart Extraction v3.0</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Connection Status */}
            {/* Connection Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: isConnected ? '#ffffff' : '#fee2e2',
              color: isConnected ? '#166534' : '#991b1b',
              border: '2px solid #000',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '900',
              boxShadow: '2px 2px 0px #000'
            }}>
              {isConnected ? <Wifi size={14} strokeWidth={3} /> : <WifiOff size={14} />}
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </div>

            {/* New Chat Button */}
            <motion.button
              whileHover={{ scale: 1.05, x: -2, y: -2, boxShadow: '4px 4px 0px var(--shadow-color)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'var(--black)',
                color: 'var(--white)',
                border: 'var(--border-thin)',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '900',
                fontSize: '0.8rem',
                fontFamily: 'Syne',
                textTransform: 'uppercase',
                boxShadow: '2px 2px 0px var(--shadow-color)',
                transition: 'box-shadow 0.2s, transform 0.2s'
              }}
            >
              <RotateCcw size={14} strokeWidth={3} />
              New
            </motion.button>

            <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>
        </header>

        <div className="chat-messages">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`message-wrapper ${msg.role}`}
              >
                <div className={`avatar ${msg.role}`}>
                  {msg.role === 'bot' ? (
                    <Bot size={24} color="var(--black)" />
                  ) : <User size={24} />}
                </div>
                <div className="message-content">
                  <div className="bubble">
                    {msg.text}
                    {msg.result && <ResultDisplay data={msg.result} />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="message-wrapper bot">
              <div className="avatar bot"><Bot size={24} /></div>
              <div className="message-content">
                <div className="bubble" style={{ display: 'flex', gap: '8px' }}>
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0], backgroundColor: ['#000', '#fb923c', '#000'] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      style={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid #000' }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
        <footer className="input-container">
          <form className="input-box" onSubmit={handleSubmit}>
            <Search size={24} color="var(--black)" />
            <input
              type="text"
              placeholder="Type naturally: 'Sold 5 notebooks to Rahul' or 'How's business today?'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <style>{`
                  .mic-btn-active { background: #ef4444 !important; color: white !important; border: 2px solid var(--black) !important; }
                  .mic-btn-inactive { background: var(--white) !important; color: var(--black) !important; border: var(--border-thin) !important; }
                `}</style>
              <button
                type="button"
                className={`icon-btn ${isListening ? 'mic-btn-active' : 'mic-btn-inactive'}`}
                onClick={handleMicClick}
                title="Voice Input (Speak in any language)"
              >
                <Mic size={24} />
              </button>
              <button type="submit" className="send-btn" disabled={loading || !input.trim()} title="Send Message">
                <ArrowUp size={24} strokeWidth={3} />
              </button>
            </div>
          </form>
        </footer>
      </main>

      {/* Quick Sell Popup */}
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
