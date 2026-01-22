import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, User, History, Package, ArrowLeft, Mic, ArrowUp, Menu, Download,
  TrendingUp, Sun, Moon, BarChart3, X, IndianRupee, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsWidget from './AnalyticsWidget';

// Quick Sell Modal
const QuickSellModal = ({ item, onCancel, onSubmit }) => {
  const [qty, setQty] = useState(1);
  const [customer, setCustomer] = useState('');

  return (
    <div className="quick-form-overlay" onClick={onCancel}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="quick-form"
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 32 }}>{item.icon}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Quick Sell</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {item.name} • ₹{item.price}/unit
            </p>
          </div>
        </div>

        <div className="input-group">
          <label>Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={e => setQty(Math.max(1, Number(e.target.value)))}
            min="1"
            autoFocus
          />
        </div>

        <div className="input-group">
          <label>Customer (optional)</label>
          <input
            type="text"
            placeholder="e.g. Sharma ji"
            value={customer}
            onChange={e => setCustomer(e.target.value)}
          />
        </div>

        <div style={{
          background: 'var(--accent)',
          padding: 16,
          borderRadius: 8,
          textAlign: 'center',
          marginBottom: 20
        }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.9, color: 'white', textTransform: 'uppercase' }}>Total</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
            ₹{(qty * item.price).toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => onSubmit(qty, customer)}
            style={{
              flex: 1, padding: 12, background: 'var(--accent)', color: 'white',
              border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            <CheckCircle2 size={18} /> Confirm
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: '12px 20px', background: 'transparent', color: 'var(--text-secondary)',
              border: '1px solid var(--border)', borderRadius: 8, fontWeight: 500, cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Result Display
const ResultDisplay = ({ data }) => {
  if (!data || data.intent === 'UNKNOWN') return null;

  if (data.view_type === 'inventory_list') {
    return (
      <div className="inventory-list">
        <div className="list-header"><Package size={14} /> Inventory</div>
        {data.inventory?.map((item, i) => (
          <div key={i} className="list-item">
            <span style={{ fontWeight: 500 }}>{item.item}</span>
            <span className={`stock-badge ${item.stock < 10 ? 'low' : 'ok'}`}>
              {Math.max(0, Math.round(item.stock))} units
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (data.view_type === 'list' && data.transactions) {
    return (
      <div className="transaction-list">
        <div className="list-header"><History size={14} /> Recent</div>
        {data.transactions.map((t, i) => (
          <div key={i} className="list-item">
            <div>
              <div style={{ fontWeight: 500 }}>{t.item}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(t.date).toLocaleDateString('en-IN')}
              </div>
            </div>
            <span style={{
              fontWeight: 600,
              color: t.type === 'SALE' ? 'var(--accent)' : '#f87171'
            }}>
              {t.type === 'SALE' ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if ((data.intent === 'SUMMARY_QUERY' || data.intent === 'INSIGHT_QUERY') && data.stats) {
    return (
      <div>
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

  if (['SALE_ENTRY', 'EXPENSE_ENTRY', 'INVENTORY_UPDATE', 'STOCK_PURCHASE'].includes(data.intent)) {
    return (
      <div className="result-card">
        <div className="intent-badge">
          {data.intent === 'SALE_ENTRY' && <TrendingUp size={12} />}
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
            <div className="data-item" style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <span className="label" style={{ fontWeight: 600 }}>Total</span>
              <span className="value" style={{ color: 'var(--accent)' }}>
                ₹{data.total.toLocaleString('en-IN')}
              </span>
            </div>
          )}
          {data.amount && (
            <div className="data-item">
              <span className="label">{data.category || 'Amount'}</span>
              <span className="value" style={{ color: '#f87171' }}>
                ₹{data.amount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

// Main App
function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m your BizAssist. I can help you track sales, expenses, and inventory. Just type naturally in Hindi or English.\n\nTry: "Sold 5 notebooks for 500" or "Show analytics"' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [lowStock, setLowStock] = useState(0);
  const [quickItem, setQuickItem] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const chatRef = useRef(null);

  const inventory = [
    { id: 1, name: 'Milk (1L)', price: 60, icon: '🥛' },
    { id: 2, name: 'Bread', price: 40, icon: '🍞' },
    { id: 3, name: 'Notebook', price: 50, icon: '📓' },
    { id: 4, name: 'Rice (1kg)', price: 80, icon: '🍚' },
  ];

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDark);
  }, [isDark]);

  useEffect(() => {
    fetch('http://localhost:8000/stats/low_stock')
      .then(r => r.json())
      .then(d => setLowStock(d.count))
      .catch(() => { });
  }, [messages]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleMic = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    const rec = new window.webkitSpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = e => setInput(e.results[0][0].transcript);
    rec.start();
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.answer || 'Done!', result: data }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Connection error. Is the server running?' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleQuickSale = (qty, customer) => {
    const item = quickItem;
    setQuickItem(null);
    sendMessage(`Sold ${qty} ${item.name} for ${item.price * qty}${customer ? ` to ${customer}` : ''}`);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <div className="logo-area">
          <div>
            <div className="logo-icon"><Bot size={20} color="white" /></div>
            <span className="logo-text">MSME<br />BizAssist</span>
          </div>
          <button className="icon-btn" onClick={() => setSidebarOpen(false)}>
            <ArrowLeft size={16} />
          </button>
        </div>

        <nav className="nav-section">
          <button className="nav-item active" onClick={() => sendMessage('Show inventory')}>
            <Package size={18} /> Inventory
            {lowStock > 0 && <span className="notification-badge">{lowStock}</span>}
          </button>

          <div style={{ padding: '12px 0' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0 16px', textTransform: 'uppercase', marginBottom: 8 }}>
              Quick Sell
            </div>
            <div className="quick-sell-grid">
              {inventory.map(item => (
                <button key={item.id} className="quick-sell-btn" onClick={() => setQuickItem(item)}>
                  <span>{item.icon}</span>
                  <span>{item.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="nav-item" onClick={() => sendMessage('Show analytics')}>
            <BarChart3 size={18} /> Analytics
          </button>

          <button className="nav-item" onClick={() => sendMessage('Show recent transactions')}>
            <History size={18} /> History
          </button>

          <button className="nav-item" onClick={() => window.open('http://localhost:8000/export/html', '_blank')}>
            <Download size={18} /> Export
          </button>
        </nav>

        <div style={{ padding: 16, fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          Supports Hindi & English
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {!sidebarOpen && (
              <button className="icon-btn" onClick={() => setSidebarOpen(true)}>
                <Menu size={18} />
              </button>
            )}
            <div className="header-info">
              <h2>BizAssist</h2>
              <p>AI-Powered Business Assistant</p>
            </div>
          </div>
          <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            {isDark ? 'Light' : 'Dark'}
          </button>
        </header>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`message-wrapper ${msg.role}`}
            >
              <div className={`avatar ${msg.role}`}>
                {msg.role === 'bot' ? <Bot size={18} color="white" /> : <User size={18} color="white" />}
              </div>
              <div className="message-content">
                <div className="bubble">
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  {msg.result && <ResultDisplay data={msg.result} />}
                </div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="message-wrapper bot">
              <div className="avatar bot"><Bot size={18} color="white" /></div>
              <div className="bubble">
                <div className="loading-dots">
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatRef} />
        </div>

        <footer className="input-container">
          <form className="input-box" onSubmit={handleSubmit}>
            <IndianRupee size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className={`icon-btn ${isListening ? 'mic-btn-active' : ''}`}
              onClick={handleMic}
            >
              <Mic size={18} />
            </button>
            <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
              <ArrowUp size={18} />
            </button>
          </form>
        </footer>
      </main>

      <AnimatePresence>
        {quickItem && (
          <QuickSellModal
            item={quickItem}
            onCancel={() => setQuickItem(null)}
            onSubmit={handleQuickSale}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
