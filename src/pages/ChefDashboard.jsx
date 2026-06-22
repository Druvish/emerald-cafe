import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Coffee, Lock, Check, Delete, Share2, Play, CheckCircle2, TrendingUp, ShoppingCart, DollarSign, Award, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChefDashboard = () => {
  const { orders, updateOrderStatus } = useCart();

  // Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  // Mobile Category Lane Switcher Tab
  const [activeMobileTab, setActiveMobileTab] = useState('Pending');

  // Trigger clock ticks for order aging warnings
  const [timeTick, setTimeTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick((t) => t + 1);
    }, 30000); // Trigger re-render every 30 seconds to update card timers
    return () => clearInterval(timer);
  }, []);

  // Web Audio Synthesizer
  const playBuzzerSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio Context block:', e);
    }
  };

  const playSuccessSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      const now = ctx.currentTime;
      playTone(523.25, now, 0.15); // C5
      playTone(659.25, now + 0.1, 0.22); // E5
    } catch (e) {
      console.warn('Audio Context block:', e);
    }
  };

  // Keyboard Event Handlers for PIN lock screen
  useEffect(() => {
    if (isAuthenticated) return;

    const handleKeyDown = (e) => {
      const key = e.key;
      
      if (key >= '0' && key <= '9') {
        if (pin.length < 4) {
          setPin((prev) => prev + key);
        }
      } else if (key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
      } else if (key === 'Enter') {
        verifyPin();
      } else if (key === 'Escape') {
        setPin('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isAuthenticated]);

  const handleKeypadPress = (val) => {
    if (val === 'back') {
      setPin((prev) => prev.slice(0, -1));
    } else if (val === 'enter') {
      verifyPin();
    } else {
      if (pin.length < 4) {
        setPin((prev) => prev + val);
      }
    }
  };

  const verifyPin = () => {
    if (pin === '8850') {
      playSuccessSound();
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      playBuzzerSound();
      setPinError(true);
      setPin('');
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => setPinError(false), 800);
    }
  };

  // KDS Helper calculations
  const getMinutesElapsed = (createdAt) => {
    const diffMs = Date.now() - new Date(createdAt).getTime();
    return Math.floor(diffMs / 60000);
  };

  const getWhatsAppLink = (order) => {
    let phone = order.customer_phone.replace(/\D/g, '');
    if (phone.length === 10) {
      phone = '91' + phone;
    }
    const text = encodeURIComponent(
      `Hi ${order.customer_name}! ☕ Your The Emerald Roast order is ready for pickup. \n\n` +
      `Pickup Code: ${order.pickup_code}\n` +
      `Items: ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}\n\n` +
      `Please show this code at our counter. Thank you!`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  // Active orders filter
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const preparingOrders = orders.filter(o => o.status === 'Preparing');
  const readyOrders = orders.filter(o => o.status === 'Ready');
  const servedOrders = orders.filter(o => o.status === 'Served');

  // Analytics Metrics
  const totalSales = servedOrders.reduce((sum, o) => sum + parseFloat(o.grand_total), 0);
  const activeQueuedCount = pendingOrders.length + preparingOrders.length + readyOrders.length;
  
  // Calculate best-selling item
  const itemCounts = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });
  });
  let bestSeller = 'N/A';
  let maxQty = 0;
  Object.keys(itemCounts).forEach((name) => {
    if (itemCounts[name] > maxQty) {
      maxQty = itemCounts[name];
      bestSeller = name;
    }
  });

  // Calculate daily revenue
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const dailyRevenue = orders
    .filter(o => new Date(o.created_at) >= startOfDay)
    .reduce((sum, o) => sum + parseFloat(o.grand_total), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-obsidian text-cream font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-charcoal-card border border-brass/10 p-8 rounded-3xl shadow-2xl space-y-6 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-obsidian text-cream border border-brass/15 flex items-center justify-center shadow-md">
            <Lock className="w-5 h-5 text-brass animate-pulse" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="font-serif text-xl font-bold text-cream">KDS Security Gate</h2>
            <p className="text-xs text-cream/50">Enter passcode to access the Production Station</p>
          </div>

          {/* Dots Code View */}
          <div className="flex space-x-4 my-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  pinError
                    ? 'border-red-500 bg-red-500 scale-95'
                    : i < pin.length
                    ? 'border-brass bg-brass scale-110'
                    : 'border-brass/20 bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* 3x4 Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
              <button
                key={val}
                onClick={() => handleKeypadPress(val)}
                className="py-3.5 rounded-xl border border-brass/10 bg-obsidian text-cream font-serif font-bold text-lg hover:bg-obsidian/60 transition-colors active:scale-95 cursor-pointer"
              >
                {val}
              </button>
            ))}
            {/* Backspace */}
            <button
              onClick={() => handleKeypadPress('back')}
              className="py-3.5 rounded-xl border border-brass/10 bg-obsidian text-cream flex items-center justify-center hover:bg-obsidian/60 transition-colors active:scale-95 cursor-pointer"
              aria-label="Delete"
            >
              <Delete className="w-5 h-5 text-brass" />
            </button>
            {/* 0 */}
            <button
              onClick={() => handleKeypadPress(0)}
              className="py-3.5 rounded-xl border border-brass/10 bg-obsidian text-cream font-serif font-bold text-lg hover:bg-obsidian/60 transition-colors active:scale-95 cursor-pointer"
            >
              0
            </button>
            {/* Enter */}
            <button
              onClick={() => handleKeypadPress('enter')}
              className="py-3.5 rounded-xl bg-brass text-obsidian font-serif font-bold text-xs uppercase tracking-wider hover:bg-brass/90 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            >
              Enter
            </button>
          </div>

          <div className="text-[9px] text-center text-cream/40 pt-2 leading-relaxed">
            Supports numeric keys 0-9, Backspace to delete, Enter to submit, Escape to clear. PIN: <span className="font-semibold text-brass font-mono">8850</span>.
          </div>
        </motion.div>
      </div>
    );
  }

  // Card Rendering Helper with Aging Border Warnings
  const renderOrderCard = (order) => {
    const elapsedMinutes = getMinutesElapsed(order.created_at);
    let borderClass = 'border border-brass/10';
    let labelColor = 'text-cream/40';

    if (order.status !== 'Ready') {
      if (elapsedMinutes >= 15) {
        borderClass = 'border-2 border-red-500 animate-pulse shadow-red-glow';
        labelColor = 'text-red-400 font-bold';
      } else if (elapsedMinutes >= 10) {
        borderClass = 'border-2 border-amber-500';
        labelColor = 'text-amber-400 font-semibold';
      }
    } else {
      borderClass = 'border border-emerald/20 shadow-emerald-glow';
    }

    return (
      <div
        key={order.order_id}
        className={`bg-obsidian rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all duration-300 ${borderClass}`}
      >
        <div className="space-y-3.5">
          {/* Header ID/Name */}
          <div className="flex justify-between items-start border-b border-brass/5 pb-2">
            <div>
              <span className="font-serif font-bold text-sm text-cream block">{order.customer_name}</span>
              <span className="text-[9px] font-mono text-cream/40 block mt-0.5">{order.order_id}</span>
            </div>
            <span className="bg-brass/10 text-brass border border-brass/25 font-serif font-bold text-[9px] py-0.5 px-2 rounded">
              {order.pickup_code}
            </span>
          </div>

          {/* Time and Ticker */}
          <div className="flex justify-between text-[9px] font-sans">
            <div className="text-cream/50">Pickup: <span className="font-semibold text-cream">{order.pickup_time}</span></div>
            <span className={labelColor}>Placed {elapsedMinutes}m ago</span>
          </div>

          {/* Items list */}
          <div className="space-y-1.5 pt-1 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-cream/80">
                <span className="font-medium">
                  {item.quantity} <span className="text-[9px] text-brass font-mono">x</span> {item.name}
                </span>
                <span className="text-[9px] bg-charcoal-card border border-brass/5 px-1.5 py-0.5 rounded text-brass/65 uppercase tracking-wider">{item.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button triggers status changes */}
        <div className="border-t border-brass/5 pt-3">
          {order.status === 'Pending' && (
            <button
              onClick={() => updateOrderStatus(order.order_id, 'Preparing')}
              className="w-full bg-brass hover:bg-brass/90 text-obsidian text-xs font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer uppercase tracking-wider"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Preparing</span>
            </button>
          )}

          {order.status === 'Preparing' && (
            <button
              onClick={() => updateOrderStatus(order.order_id, 'Ready')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer uppercase tracking-wider"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark as Ready</span>
            </button>
          )}

          {order.status === 'Ready' && (
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => updateOrderStatus(order.order_id, 'Served')}
                className="w-full bg-emerald hover:bg-emerald/90 text-obsidian text-xs font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer uppercase tracking-wider"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Serve / Hand Over</span>
              </button>
              
              <a
                href={getWhatsAppLink(order)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-colors uppercase tracking-wider"
              >
                <Share2 className="w-3 h-3" />
                <span>WhatsApp Notification</span>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="py-8 px-6 md:px-12 max-w-7xl mx-auto space-y-8 min-h-screen bg-obsidian text-cream">
      {/* Header and Logout */}
      <div className="flex items-center justify-between border-b border-brass/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-charcoal-card border border-brass/15 text-cream">
            <Coffee className="w-5 h-5 text-brass" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-cream">KDS Dashboard</h1>
            <p className="text-xs text-cream/50">The Emerald Roast Chinchwad Production Station</p>
          </div>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs border border-brass/20 text-brass hover:bg-charcoal-card py-2 px-4 rounded-xl transition-all cursor-pointer font-sans font-bold uppercase tracking-wider"
        >
          Lock Dashboard
        </button>
      </div>

      {/* Analytics Summary Header Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans text-xs">
        <div className="bg-charcoal-card border border-brass/10 p-4 rounded-2xl flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-brass/10 text-brass shrink-0 border border-brass/20">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-cream/40 font-bold uppercase block tracking-wider">Served Sales</span>
            <span className="font-mono text-base font-bold text-brass">₹{totalSales.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-charcoal-card border border-brass/10 p-4 rounded-2xl flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-brass/10 text-brass shrink-0 border border-brass/20">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-cream/40 font-bold uppercase block tracking-wider">Active Queue</span>
            <span className="font-mono text-base font-bold text-brass">{activeQueuedCount} Tickets</span>
          </div>
        </div>

        <div className="bg-charcoal-card border border-brass/10 p-4 rounded-2xl flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-brass/10 text-brass shrink-0 border border-brass/20">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-cream/40 font-bold uppercase block tracking-wider">Best Seller</span>
            <span className="font-serif text-sm font-bold text-cream truncate max-w-[130px] block leading-tight">{bestSeller}</span>
          </div>
        </div>

        <div className="bg-charcoal-card border border-brass/10 p-4 rounded-2xl flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-brass/10 text-brass shrink-0 border border-brass/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] text-cream/40 font-bold uppercase block tracking-wider">Today Revenue</span>
            <span className="font-mono text-base font-bold text-brass">₹{dailyRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDE-BY-SIDE 3-COLUMN LANES */}
      <div className="hidden md:grid grid-cols-3 gap-6 font-sans">
        {/* Pending Column */}
        <div className="space-y-4">
          <div className="p-3 bg-charcoal-card border border-brass/15 rounded-xl flex items-center justify-between">
            <span className="font-bold text-cream text-xs uppercase tracking-wider">New Orders</span>
            <span className="bg-brass text-obsidian text-xs font-bold px-2.5 py-0.5 rounded-full">
              {pendingOrders.length}
            </span>
          </div>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {pendingOrders.length === 0 ? (
              <div className="border border-dashed border-brass/10 p-10 text-center rounded-xl text-xs text-cream/35">
                No new pending tickets.
              </div>
            ) : (
              pendingOrders.map(renderOrderCard)
            )}
          </div>
        </div>

        {/* Preparing Column */}
        <div className="space-y-4">
          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center justify-between">
            <span className="font-bold text-amber-500 text-xs uppercase tracking-wider">Preparing</span>
            <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {preparingOrders.length}
            </span>
          </div>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {preparingOrders.length === 0 ? (
              <div className="border border-dashed border-amber-500/10 p-10 text-center rounded-xl text-xs text-cream/35">
                No tickets in preparation.
              </div>
            ) : (
              preparingOrders.map(renderOrderCard)
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className="space-y-4">
          <div className="p-3 bg-emerald/5 border border-emerald/20 rounded-xl flex items-center justify-between">
            <span className="font-bold text-emerald text-xs uppercase tracking-wider">Ready for Counter</span>
            <span className="bg-emerald text-obsidian text-xs font-bold px-2.5 py-0.5 rounded-full">
              {readyOrders.length}
            </span>
          </div>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {readyOrders.length === 0 ? (
              <div className="border border-dashed border-emerald/10 p-10 text-center rounded-xl text-xs text-cream/35">
                No tickets ready for pickup.
              </div>
            ) : (
              readyOrders.map(renderOrderCard)
            )}
          </div>
        </div>
      </div>

      {/* MOBILE COLUMN TAB SWITCHER BAR */}
      <div className="md:hidden flex flex-col space-y-4 font-sans">
        <div className="flex border border-brass/10 rounded-xl overflow-hidden p-1 bg-charcoal-card">
          <button
            onClick={() => setActiveMobileTab('Pending')}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-semibold relative transition-colors cursor-pointer ${
              activeMobileTab === 'Pending' ? 'bg-brass text-obsidian' : 'text-cream'
            }`}
          >
            <span>New ({pendingOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('Preparing')}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-semibold relative transition-colors cursor-pointer ${
              activeMobileTab === 'Preparing' ? 'bg-amber-600 text-white' : 'text-cream'
            }`}
          >
            <span>Preparing ({preparingOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('Ready')}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-semibold relative transition-colors cursor-pointer ${
              activeMobileTab === 'Ready' ? 'bg-emerald text-obsidian' : 'text-cream'
            }`}
          >
            <span>Ready ({readyOrders.length})</span>
          </button>
        </div>

        <div className="pt-2">
          {activeMobileTab === 'Pending' && (
            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <div className="border border-dashed border-brass/10 p-12 text-center rounded-2xl text-xs text-cream/35">
                  No new pending tickets.
                </div>
              ) : (
                pendingOrders.map(renderOrderCard)
              )}
            </div>
          )}

          {activeMobileTab === 'Preparing' && (
            <div className="space-y-4">
              {preparingOrders.length === 0 ? (
                <div className="border border-dashed border-amber-500/10 p-12 text-center rounded-2xl text-xs text-cream/35">
                  No tickets in preparation.
                </div>
              ) : (
                preparingOrders.map(renderOrderCard)
              )}
            </div>
          )}

          {activeMobileTab === 'Ready' && (
            <div className="space-y-4">
              {readyOrders.length === 0 ? (
                <div className="border border-dashed border-emerald/10 p-12 text-center rounded-2xl text-xs text-cream/35">
                  No tickets ready for pickup.
                </div>
              ) : (
                readyOrders.map(renderOrderCard)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;
