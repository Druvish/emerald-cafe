import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, CreditCard, QrCode, Lock, Printer, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    gst,
    packagingFee,
    grandTotal,
    addOrder,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  // Wizard Steps: 1 (Review), 2 (Details), 3 (Payment), 4 (OTP), 5 (Invoice)
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupTime, setPickupTime] = useState('As soon as possible (10-15 mins)');

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalOrder, setFinalOrder] = useState(null);

  // Form validations
  const validateDetails = () => {
    if (!customerName.trim()) return 'Name is required';
    if (customerPhone.replace(/\D/g, '').length !== 10) return 'Please enter a valid 10-digit phone number';
    if (!customerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email address';
    return null;
  };

  const validateCard = () => {
    if (paymentMethod === 'card') {
      const cleanCardNum = cardNumber.replace(/\s/g, '');
      if (cleanCardNum.length !== 16) return 'Enter a valid 16-digit card number';
      if (!cardExpiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) return 'Enter expiry as MM/YY';
      if (cardCvv.length !== 3) return 'Enter a valid 3-digit CVV';
    }
    return null;
  };

  // Step Navigations
  const handleNextStep = () => {
    if (step === 2) {
      const err = validateDetails();
      if (err) {
        alert(err);
        return;
      }
    }
    if (step === 3) {
      if (paymentMethod === 'card') {
        const err = validateCard();
        if (err) {
          alert(err);
          return;
        }
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setStep(prev => prev - 1);
  };

  // Submit OTP Verification & Add Order
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpCode !== '7724') {
      setOtpError('Invalid OTP code. Enter 7724 to verify.');
      return;
    }

    setOtpError('');
    setIsSubmitting(true);

    try {
      const orderId = 'ord_' + Math.random().toString(36).substring(2, 8);
      const pickupCode = 'EMERALD-' + Math.floor(10 + Math.random() * 90);

      const newOrder = {
        order_id: orderId,
        pickup_code: pickupCode,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        pickup_time: pickupTime,
        items: cart,
        subtotal: subtotal,
        gst: gst,
        packaging_fee: packagingFee,
        grand_total: grandTotal,
        payment_method: paymentMethod === 'upi' ? 'UPI QR Code' : 'Simulated Card',
        status: 'Pending',
        created_at: new Date().toISOString()
      };

      // Push to Supabase database / Simulator
      await addOrder(newOrder);
      setFinalOrder(newOrder);
      setStep(5);
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackAndClose = () => {
    if (finalOrder) {
      const trackId = finalOrder.order_id;
      // Reset checkout states
      setStep(1);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setOtpCode('');
      setFinalOrder(null);
      clearCart();
      setIsCartOpen(false);
      navigate(`/track/${trackId}`);
    }
  };

  const handleCloseDrawer = () => {
    if (step === 5) {
      // If invoice step is reached, close triggers cart clearing
      clearCart();
      setStep(1);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setOtpCode('');
    }
    setIsCartOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseDrawer}
            className="fixed inset-0 bg-black/70 z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:max-w-lg bg-obsidian z-50 shadow-2xl flex flex-col border-l border-brass/10 text-cream"
          >
            {/* Header */}
            <div className="p-5 border-b border-brass/10 flex items-center justify-between bg-charcoal-card text-cream">
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-xl">
                  {step === 5 ? 'Invoice Receipt' : 'Your Order'}
                </span>
                {step < 5 && (
                  <span className="text-[10px] bg-brass text-obsidian px-2.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider">
                    Step {step} of 4
                  </span>
                )}
              </div>
              <button
                onClick={handleCloseDrawer}
                className="p-1 rounded-full text-cream/70 hover:text-white hover:bg-obsidian transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Container */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* STEP 1: REVIEW CART ITEMS */}
              {step === 1 && (
                <div className="flex flex-col h-full space-y-4">
                  {cart.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 py-20">
                      <div className="w-14 h-14 rounded-full bg-charcoal-card border border-brass/10 flex items-center justify-center text-brass">
                        <Trash2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-cream">Your cart is empty</h3>
                        <p className="text-xs text-cream/50 mt-1">Browse our menu to add specialty roasts & bites.</p>
                      </div>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="bg-brass text-obsidian font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl hover:bg-brass/90 transition-colors cursor-pointer"
                      >
                        Browse Menu
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3.5 bg-charcoal-card rounded-xl border border-brass/5 hover:border-brass/15 transition-colors">
                            <div className="flex-grow pr-4">
                              <h4 className="font-serif text-sm font-semibold text-cream leading-tight">{item.name}</h4>
                              <p className="text-xs text-brass font-mono font-medium mt-0.5">₹{item.price}</p>
                            </div>
                            <div className="flex items-center space-x-2.5 shrink-0">
                              <div className="flex items-center border border-brass/10 bg-obsidian rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="p-1.5 text-cream hover:bg-charcoal-card rounded-l-lg transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 text-center text-xs font-mono font-semibold text-brass">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="p-1.5 text-cream hover:bg-charcoal-card rounded-r-lg transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-cream/40 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                                aria-label="Remove Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals Summary */}
                      <div className="border-t border-brass/10 pt-4 space-y-2.5 text-xs font-sans">
                        <div className="flex justify-between text-cream/60">
                          <span>Subtotal</span>
                          <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-cream/60">
                          <span>GST (5%)</span>
                          <span className="font-mono">₹{gst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-cream/60">
                          <span>Packaging & Service Fee</span>
                          <span className="font-mono">₹{packagingFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-brass/10 pt-3 flex justify-between font-serif text-base font-bold text-cream">
                          <span>Grand Total</span>
                          <span className="text-brass font-mono">₹{grandTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleNextStep}
                        className="w-full bg-brass hover:bg-brass/90 text-obsidian font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all mt-4 cursor-pointer"
                      >
                        <span>Provide Pickup Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* STEP 2: PICKUP DETAILS FORM */}
              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="font-serif text-base font-bold text-brass border-b border-brass/10 pb-2">Pickup Details</h3>
                  
                  <div className="space-y-4 font-sans text-xs sm:text-sm">
                    <div>
                      <label className="block text-[10px] font-bold text-brass uppercase tracking-wider mb-1.5">Customer Name</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full bg-charcoal-card border border-brass/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all text-cream font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brass uppercase tracking-wider mb-1.5">Phone Number (10-Digit)</label>
                      <input
                        type="tel"
                        maxLength="10"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-charcoal-card border border-brass/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all text-cream font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brass uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. name@domain.com"
                        className="w-full bg-charcoal-card border border-brass/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all text-cream font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-brass uppercase tracking-wider mb-1.5">Preferred Pickup Time</label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-charcoal-card border border-brass/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all text-cream font-medium cursor-pointer"
                      >
                        <option>As soon as possible (10-15 mins)</option>
                        <option>Within 30 mins</option>
                        <option>Within 45 mins</option>
                        <option>In 1 hour</option>
                        <option>Later today</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t border-brass/10">
                    <button
                      onClick={handleBackStep}
                      className="w-1/3 border border-brass/20 text-brass font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-charcoal-card transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="w-2/3 bg-brass hover:bg-brass/90 text-obsidian font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT PORTAL */}
              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="font-serif text-base font-bold text-brass border-b border-brass/10 pb-2">Payment Portal</h3>
                  
                  {/* Payment Tabs */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'border-brass bg-brass/5 text-brass font-semibold'
                          : 'border-brass/10 bg-obsidian text-cream/70 hover:bg-charcoal-card'
                      }`}
                    >
                      <QrCode className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">UPI QR Scan</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-brass bg-brass/5 text-brass font-semibold'
                          : 'border-brass/10 bg-obsidian text-cream/70 hover:bg-charcoal-card'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Simulated Card</span>
                    </button>
                  </div>

                  {paymentMethod === 'upi' ? (
                    /* UPI QR Panel */
                    <div className="bg-charcoal-card border border-brass/5 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4">
                      <div className="p-3 bg-cream rounded-xl shadow-md border border-brass/20">
                        {/* Elegant Brass styled QR Code vector */}
                        <svg className="w-36 h-36" viewBox="0 0 100 100">
                          <rect x="0" y="0" width="22" height="22" fill="none" stroke="#151311" strokeWidth="4" />
                          <rect x="5" y="5" width="12" height="12" fill="#b0a088" />
                          
                          <rect x="78" y="0" width="22" height="22" fill="none" stroke="#151311" strokeWidth="4" />
                          <rect x="83" y="5" width="12" height="12" fill="#b0a088" />

                          <rect x="0" y="78" width="22" height="22" fill="none" stroke="#151311" strokeWidth="4" />
                          <rect x="5" y="83" width="12" height="12" fill="#b0a088" />

                          {/* Dummy QR bits */}
                          <path d="M 30,10 H 45 V 20 H 30 Z" fill="#151311" />
                          <path d="M 55,5 H 70 V 15 H 55 Z" fill="#151311" />
                          <path d="M 35,30 H 65 V 40 H 35 Z" fill="#151311" />
                          <path d="M 10,35 H 25 V 55 H 10 Z" fill="#151311" />
                          <path d="M 75,35 H 90 V 65 H 75 Z" fill="#151311" />
                          <path d="M 30,50 H 50 V 60 H 30 Z" fill="#151311" />
                          <path d="M 55,50 H 70 V 70 H 55 Z" fill="#151311" />
                          <path d="M 30,70 H 40 V 90 H 30 Z" fill="#151311" />
                          <path d="M 45,80 H 70 V 90 H 45 Z" fill="#151311" />
                          <path d="M 80,75 H 95 V 90 H 80 Z" fill="#151311" />
                          {/* Logo center dot */}
                          <rect x="44" y="44" width="12" height="12" rx="2" fill="#b0a088" />
                        </svg>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="font-serif font-bold text-sm text-cream">The Emerald Roast Gateway</p>
                        <p className="text-xs text-cream/50 leading-relaxed max-w-xs">
                          Scan the QR code with any UPI app to authorize payment of <span className="font-semibold text-brass font-mono">₹{grandTotal.toFixed(2)}</span>
                        </p>
                      </div>
                      <button
                        onClick={handleNextStep}
                        className="bg-brass hover:bg-brass/90 text-obsidian font-bold text-xs py-2.5 px-4 rounded-full transition-all cursor-pointer shadow-sm"
                      >
                        Simulate Payment Authorized ✓
                      </button>
                    </div>
                  ) : (
                    /* Simulated Credit Card Panel */
                    <div className="space-y-4 font-sans bg-charcoal-card border border-brass/5 p-5 rounded-2xl">
                      <div>
                        <label className="block text-[10px] font-bold text-brass uppercase tracking-wider mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength="19"
                          value={cardNumber}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                            setCardNumber(formatted.substring(0, 19));
                          }}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-obsidian border border-brass/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brass text-cream font-medium font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-brass uppercase tracking-wider mb-1">Expiry Date</label>
                          <input
                            type="text"
                            maxLength="5"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length >= 2) {
                                val = val.substring(0, 2) + '/' + val.substring(2, 4);
                              }
                              setCardExpiry(val);
                            }}
                            className="w-full bg-obsidian border border-brass/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brass text-cream font-medium font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-brass uppercase tracking-wider mb-1">CVV Code</label>
                          <input
                            type="password"
                            maxLength="3"
                            placeholder="***"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-obsidian border border-brass/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brass text-cream font-medium font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-cream/40">
                        <Lock className="w-3.5 h-3.5 text-emerald" />
                        <span>Secure checkout active. Payment simulates sandbox credentials.</span>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4 border-t border-brass/10">
                    <button
                      onClick={handleBackStep}
                      className="w-1/3 border border-brass/20 text-brass font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-charcoal-card transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="w-2/3 bg-brass hover:bg-brass/90 text-obsidian font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <span>Proceed to Verify</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: 3D SECURE SMS OTP */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="text-center space-y-2 py-4">
                    <div className="w-14 h-14 rounded-full bg-brass/10 text-brass flex items-center justify-center mx-auto border border-brass/20">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-cream">3D Secure OTP Approval</h3>
                    <p className="text-xs text-cream/50 max-w-sm mx-auto leading-relaxed">
                      A simulated verification code was sent to +91 {customerPhone.substring(0, 3)}****{customerPhone.substring(7, 10)}. Input code below to complete order.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-4 font-sans text-xs sm:text-sm">
                    <div className="max-w-xs mx-auto">
                      <label className="block text-xs font-semibold text-center text-brass uppercase tracking-wider mb-2">
                        Enter Code (Accepts <span className="text-brass font-mono font-bold">7724</span>)
                      </label>
                      <input
                        type="text"
                        maxLength="6"
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="******"
                        className="w-full text-center bg-charcoal-card border border-brass/15 rounded-xl px-4 py-3 text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all text-brass"
                      />
                      {otpError && (
                        <p className="text-xs text-red-400 text-center font-medium mt-2">{otpError}</p>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-6 border-t border-brass/10">
                      <button
                        type="button"
                        onClick={handleBackStep}
                        className="w-1/3 border border-brass/20 text-brass font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-charcoal-card transition-colors cursor-pointer"
                        disabled={isSubmitting}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-2/3 bg-brass hover:bg-brass/90 text-obsidian font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>Verifying Payment...</span>
                        ) : (
                          <>
                            <span>Confirm Payment</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 5: PRINTABLE INVOICE RECEIPT */}
              {step === 5 && finalOrder && (
                <div className="space-y-6">
                  {/* Success Alert */}
                  <div className="p-4 bg-emerald/10 border border-emerald/20 rounded-xl flex items-center space-x-3 text-emerald text-xs sm:text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald shrink-0" />
                    <div>
                      <p className="font-semibold text-cream">Order Placed Successfully!</p>
                      <p className="text-cream/55 mt-0.5">Your ticket has been sent to the roastery. Prepare sound triggered.</p>
                    </div>
                  </div>

                  {/* Printable Dark Receipt Card */}
                  <div id="printable-receipt-area" className="bg-charcoal-card border border-brass/15 p-6 rounded-2xl font-mono text-[11px] space-y-4 text-cream shadow-md">
                    <div className="text-center space-y-1 pb-4 border-b border-dashed border-brass/20">
                      <h2 className="font-serif text-base font-bold text-brass tracking-wider">THE EMERALD ROAST</h2>
                      <p className="text-[9px] text-cream/45">Sec 21, Yamuna Nagar, Nigdi-Chinchwad Link Rd,</p>
                      <p className="text-[9px] text-cream/45">Chinchwad, Pune, Maharashtra 411019</p>
                      <p className="text-[9px] text-cream/45">GSTIN: 27AACFC5049B1ZO</p>
                    </div>

                    <div className="space-y-1 pb-3 border-b border-dashed border-brass/20">
                      <div className="flex justify-between">
                        <span>Invoice ID:</span>
                        <span className="font-semibold text-brass">{finalOrder.order_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pickup Code:</span>
                        <span className="font-bold text-emerald bg-emerald/10 px-1.5 py-0.5 rounded text-[11px]">
                          {finalOrder.pickup_code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{new Date(finalOrder.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time Slot:</span>
                        <span className="font-medium text-brass">{finalOrder.pickup_time}</span>
                      </div>
                    </div>

                    <div className="space-y-1 pb-3 border-b border-dashed border-brass/20">
                      <div className="font-bold text-brass uppercase tracking-wider text-[9px] pb-1">Customer Info</div>
                      <div>Name: {finalOrder.customer_name}</div>
                      <div>Phone: +91 {finalOrder.customer_phone}</div>
                      <div>Email: {finalOrder.customer_email}</div>
                    </div>

                    {/* Items table */}
                    <div className="space-y-2 pb-3 border-b border-dashed border-brass/20">
                      <div className="font-bold text-brass uppercase tracking-wider text-[9px] pb-1 flex justify-between">
                        <span>Items</span>
                        <span>Qty x Price</span>
                      </div>
                      {finalOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="truncate max-w-[200px]">{item.name}</span>
                          <span>{item.quantity} x ₹{item.price}</span>
                        </div>
                      ))}
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1.5 text-right font-medium">
                      <div className="flex justify-between text-cream/55">
                        <span>Subtotal:</span>
                        <span>₹{finalOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-cream/55">
                        <span>GST (5%):</span>
                        <span>₹{finalOrder.gst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-cream/55">
                        <span>Pkg Fee:</span>
                        <span>₹{finalOrder.packaging_fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-serif text-xs sm:text-sm font-bold text-cream pt-1 border-t border-dashed border-brass/15">
                        <span>TOTAL AMOUNT:</span>
                        <span className="text-brass">₹{finalOrder.grand_total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-center text-[9px] text-cream/35 pt-2 font-sans border-t border-dashed border-brass/20">
                      Paid via {finalOrder.payment_method}. Thank you for visiting The Emerald Roast!
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 font-sans pt-2">
                    <button
                      onClick={trackId => handleTrackAndClose()}
                      className="w-full bg-brass hover:bg-brass/90 text-obsidian font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer text-xs uppercase tracking-wider"
                    >
                      <span>Track Live Order</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={handlePrint}
                      className="w-full border border-brass/20 text-brass font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl hover:bg-charcoal-card flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
