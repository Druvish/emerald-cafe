import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Coffee, Calendar, User, Clock, CheckCircle2, Volume2, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderTracker = () => {
  const { orderId } = useParams();
  
  // Try to load from localStorage first for instant display
  const [order, setOrder] = useState(() => {
    try {
      const cached = localStorage.getItem(`emerald_roast_order_${orderId}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(!order); // Show spinner only if no cache exists
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [fetchError, setFetchError] = useState(false);
  const prevStatusRef = useRef(null);

  // Web Audio API Synthesizers
  const playPreparingSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, startTime + duration);
        
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      const now = ctx.currentTime;
      playTone(330, now, 0.22); // E4
      playTone(466.16, now + 0.12, 0.28); // A#4 rising
    } catch (e) {
      console.warn('Audio Context block:', e);
    }
  };

  const playReadySound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      const now = ctx.currentTime;
      playTone(523.25, now, 0.12); // C5
      playTone(659.25, now + 0.08, 0.12); // E5
      playTone(783.99, now + 0.16, 0.24); // G5 sparkling triplet
    } catch (e) {
      console.warn('Audio Context block:', e);
    }
  };

  const playServedSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.75, startTime + duration); // downward sliding
        
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      const now = ctx.currentTime;
      playTone(392, now, 0.22); // G4
      playTone(261.63, now + 0.16, 0.32); // C4 downward resolution
    } catch (e) {
      console.warn('Audio Context block:', e);
    }
  };

  // Sound triggers on status changes
  useEffect(() => {
    if (order) {
      const prev = prevStatusRef.current;
      if (prev && prev !== order.status) {
        // Trigger chimes based on new status
        if (order.status === 'Preparing') {
          playPreparingSound();
        } else if (order.status === 'Ready') {
          playReadySound();
        } else if (order.status === 'Served') {
          playServedSound();
        }
      }
      prevStatusRef.current = order.status;
    }
  }, [order?.status]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId);

      if (error) {
        console.error('Error loading order tracker:', error);
        setFetchError(true);
      } else {
        setFetchError(false);
        if (data && data.length > 0) {
          setOrder(data[0]);
          try {
            localStorage.setItem(`emerald_roast_order_${orderId}`, JSON.stringify(data[0]));
          } catch (e) {}
          if (!prevStatusRef.current) {
            prevStatusRef.current = data[0].status;
          }
        } else {
          setOrder(null);
        }
      }
    } catch (err) {
      console.error('Unexpected error loading order tracker:', err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  // Load order & Subscribe
  useEffect(() => {
    fetchOrder();

    const handleOnline = () => {
      setIsOffline(false);
      fetchOrder();
    };
    const handleOffline = () => {
      setIsOffline(true);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchOrder();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Subscribe to updates for this orders table
    const trackingChannel = supabase
      .channel(`tracking:order-${orderId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        const { eventType, new: newRecord } = payload;
        if ((eventType === 'UPDATE' || eventType === 'insert' || eventType === 'INSERT' || eventType === 'update') && newRecord.order_id === orderId) {
          setOrder(newRecord);
          try {
            localStorage.setItem(`emerald_roast_order_${orderId}`, JSON.stringify(newRecord));
          } catch (e) {}
        }
      })
      .subscribe();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      trackingChannel.unsubscribe();
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-obsidian text-cream">
        <div className="w-12 h-12 rounded-full border-4 border-brass border-t-transparent animate-spin" />
        <p className="text-xs font-semibold tracking-wider uppercase text-cream/50 font-sans">Connecting to roastery live...</p>
      </div>
    );
  }

  if (!order) {
    if (fetchError || isOffline) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-6 bg-obsidian text-cream">
          <div className="w-16 h-16 rounded-full bg-brass/10 text-brass border border-brass/20 flex items-center justify-center animate-pulse">
            <Volume2 className="w-8 h-8 text-brass" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-cream">Connection Issue</h2>
            <p className="text-xs text-cream/50 max-w-xs mx-auto leading-relaxed">
              We couldn't connect to our live servers. Please check your network connection.
            </p>
          </div>
          <button
            onClick={fetchOrder}
            className="bg-brass text-obsidian font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl hover:bg-brass/90 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-6 bg-obsidian text-cream">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-cream">Order Not Found</h2>
          <p className="text-xs text-cream/50 max-w-xs mx-auto leading-relaxed">
            We could not locate an active order matching the ID: <span className="font-mono bg-charcoal-card px-2 py-0.5 rounded text-brass text-[11px] border border-brass/10">{orderId}</span>
          </p>
        </div>
        <Link
          to="/menu"
          className="bg-brass text-obsidian font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl hover:bg-brass/90 transition-colors cursor-pointer"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  // Stepper helper
  const statuses = ['Pending', 'Preparing', 'Ready', 'Served'];
  const statusLabels = [
    { key: 'Pending', title: 'Placed', desc: 'Received by roastery' },
    { key: 'Preparing', title: 'Preparing', desc: 'Crafting specialty items' },
    { key: 'Ready', title: 'Ready', desc: 'Awaiting counter pickup' },
    { key: 'Served', title: 'Served', desc: 'Handed over' }
  ];

  const activeIndex = statuses.indexOf(order.status);

  return (
    <div className="py-12 px-6 md:px-12 max-w-4xl mx-auto space-y-8 min-h-screen bg-obsidian text-cream">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brass/10 pb-4">
        <div className="flex items-center space-x-2">
          <Coffee className="w-6 h-6 text-brass" />
          <h1 className="font-serif text-2xl font-bold text-cream">Order Tracker</h1>
        </div>
        <div className="flex space-x-3 text-xs font-sans font-bold uppercase tracking-wider">
          <Link
            to="/menu"
            className="px-4 py-2 border border-brass/25 hover:bg-charcoal-card rounded-xl text-brass transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>Order More</span>
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-brass hover:bg-brass/90 text-obsidian rounded-xl transition-colors flex items-center space-x-1 cursor-pointer animate-pulse"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>

      {/* Offline/Connection Warning Banner */}
      {(isOffline || fetchError) && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-amber-400 text-xs font-sans">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Viewing offline/cached receipt status. Reconnecting to live updates...</span>
          </div>
          <button 
            onClick={fetchOrder} 
            className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-2 py-1 rounded transition-colors uppercase tracking-wider cursor-pointer"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Tracker Status Indicator Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status card */}
        <div className="md:col-span-2 bg-charcoal-card border border-brass/10 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-brass uppercase tracking-widest block">Live Status Notification</span>
            <div className="flex items-center space-x-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream">
                {order.status === 'Pending' && 'Queue Position Set'}
                {order.status === 'Preparing' && 'In Preparation'}
                {order.status === 'Ready' && 'Ready for Pickup!'}
                {order.status === 'Served' && 'Served & Handed Over'}
              </h2>
              {/* Sound chime demonstration trigger */}
              <button
                onClick={() => {
                  if (order.status === 'Preparing') playPreparingSound();
                  if (order.status === 'Ready') playReadySound();
                  if (order.status === 'Served') playServedSound();
                }}
                className="p-1.5 rounded-lg text-brass hover:bg-brass/10 transition-colors cursor-pointer"
                title="Replay Status Chime Sound"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-cream/50 leading-relaxed">
              {order.status === 'Pending' && 'Our kitchen team has queued your order. Check back in a minute for active preparation progress.'}
              {order.status === 'Preparing' && 'Baristas are pulling espresso shots and heating stone ovens. Your items are being crafted.'}
              {order.status === 'Ready' && 'Your order is hot and ready at the pick-up counter. Show your Pickup Code to collect!'}
              {order.status === 'Served' && 'Thank you for dining at The Emerald Roast Nigdi-Chinchwad. We hope to serve you again soon.'}
            </p>
          </div>

          {/* Large Pickup Code highlighted when Ready */}
          {order.status === 'Ready' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-brass text-obsidian p-6 rounded-2xl text-center space-y-1 border border-brass/25 shadow-md shadow-emerald-glow"
            >
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-75 block">Present Code to Barista</span>
              <span className="font-serif text-4xl sm:text-5xl font-extrabold tracking-wider block">{order.pickup_code}</span>
              <span className="text-[9px] font-semibold font-mono tracking-wider block opacity-80 mt-1">ID: {order.order_id.substring(4)}</span>
            </motion.div>
          )}

          {/* Stepper Timeline (Vertical on small screens, Horizontal on medium+) */}
          <div className="relative font-sans text-[11px] pt-4">
            <div className="hidden md:flex justify-between items-center relative">
              {/* Connector line */}
              <div className="absolute left-0 right-0 top-4.5 h-[1.5px] bg-brass/10 -z-10" />
              <div
                className="absolute left-0 top-4.5 h-[1.5px] bg-emerald -z-10 transition-all duration-500"
                style={{
                  width: `${
                    order.status === 'Ready' || order.status === 'Served'
                      ? 100
                      : (activeIndex / (statuses.length - 1)) * 100
                  }%`
                }}
              />

              {statusLabels.map((step, idx) => {
                const isCompleted = idx < activeIndex || order.status === 'Ready' || order.status === 'Served';
                const isCurrent = order.status !== 'Ready' && order.status !== 'Served' && idx === activeIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center text-center w-28 space-y-2.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald border-emerald text-obsidian font-bold'
                          : isCurrent
                          ? 'bg-brass border-brass text-obsidian font-bold ring-4 ring-brass/10'
                          : 'bg-obsidian border-brass/15 text-cream/35'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4.5 h-4.5" /> : <span>{idx + 1}</span>}
                    </div>
                    <div className="space-y-0.5">
                      <p className={`font-bold ${isCurrent ? 'text-brass' : 'text-cream/70'}`}>{step.title}</p>
                      <p className="text-[8px] text-cream/40 leading-tight">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vertical stepper for Mobile */}
            <div className="flex flex-col space-y-6 md:hidden pl-2">
              {statusLabels.map((step, idx) => {
                const isCompleted = idx < activeIndex || order.status === 'Ready' || order.status === 'Served';
                const isCurrent = order.status !== 'Ready' && order.status !== 'Served' && idx === activeIndex;
                return (
                  <div key={step.key} className="flex items-start space-x-4">
                    <div className="relative flex flex-col items-center shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all ${
                          isCompleted
                            ? 'bg-emerald border-emerald text-obsidian font-bold'
                            : isCurrent
                            ? 'bg-brass border-brass text-obsidian font-bold ring-4 ring-brass/10'
                            : 'bg-obsidian border-brass/15 text-cream/40'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span>{idx + 1}</span>}
                      </div>
                      {idx < statusLabels.length - 1 && (
                        <div
                          className={`w-0.5 h-12 -mb-6 mt-1 transition-all ${
                            isCompleted ? 'bg-emerald' : 'bg-brass/10'
                          }`}
                        />
                      )}
                    </div>
                    <div className="space-y-0.5 pt-0.5">
                      <p className={`font-bold text-xs uppercase tracking-wider ${isCurrent ? 'text-brass' : 'text-cream/80'}`}>{step.title}</p>
                      <p className="text-[10px] text-cream/55 leading-normal">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Invoice Summary sidebar */}
        <div className="bg-charcoal-card border border-brass/10 p-6 rounded-2xl shadow-sm text-xs font-mono space-y-4">
          <div className="text-center border-b border-dashed border-brass/15 pb-3 space-y-1">
            <h3 className="font-serif text-xs font-bold text-brass tracking-wider">THE EMERALD ROAST</h3>
            <p className="text-[9px] text-cream/40">Pickup ID: {order.pickup_code}</p>
          </div>

          <div className="space-y-2 pb-3 border-b border-dashed border-brass/15 text-cream/70 font-sans text-[11px]">
            <div className="flex items-center space-x-2"><span>Date:</span><span className="font-mono text-cream">{new Date(order.created_at).toLocaleDateString()}</span></div>
            <div className="flex items-center space-x-2"><span>Customer:</span><span className="font-serif font-semibold text-cream">{order.customer_name}</span></div>
            <div className="flex items-center space-x-2"><span>Pickup:</span><span className="font-mono text-cream">{order.pickup_time}</span></div>
          </div>

          <div className="space-y-2 pb-3 border-b border-dashed border-brass/15 font-mono text-[11px]">
            <div className="font-bold uppercase tracking-wider text-[9px] text-brass">Order Items</div>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="truncate max-w-[130px]">{item.name}</span>
                <span>{item.quantity} x ₹{item.price}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-right font-medium text-[11px]">
            <div className="flex justify-between"><span>Subtotal:</span><span>₹{parseFloat(order.subtotal).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>GST (5%):</span><span>₹{parseFloat(order.gst).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Pkg Fee:</span><span>₹{parseFloat(order.packaging_fee).toFixed(2)}</span></div>
            <div className="flex justify-between font-serif text-xs sm:text-sm font-bold text-cream pt-1 border-t border-dashed border-brass/15">
              <span>TOTAL PAID:</span>
              <span className="text-brass">₹{parseFloat(order.grand_total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;
