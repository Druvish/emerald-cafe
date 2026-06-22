import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }
    // Simulate contact form submission
    setSubmitted(true);
  };

  return (
    <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-16 min-h-screen bg-obsidian text-cream">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream">Contact the Roastery</h1>
        <p className="text-xs text-cream/50 max-w-sm mx-auto leading-relaxed">
          Have questions about our single-origin sourcing, private cupping events, or pre-orders? Send us a message or visit us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact details & Form */}
        <div className="space-y-8 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-charcoal-card border border-brass/10 p-5 rounded-2xl flex items-start space-x-3.5">
              <MapPin className="w-5 h-5 text-brass shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-cream">Locate Us</h4>
                <p className="text-cream/70 leading-relaxed font-light">
                  Sec 21, Yamuna Nagar,<br />
                  Nigdi-Chinchwad Link Road,<br />
                  Chinchwad, Pune - 411019
                </p>
              </div>
            </div>

            <div className="bg-charcoal-card border border-brass/10 p-5 rounded-2xl flex items-start space-x-3.5">
              <Clock className="w-5 h-5 text-brass shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-cream">Roastery Hours</h4>
                <p className="text-cream/70">Mon - Fri: 8 AM - 10:30 PM</p>
                <p className="text-cream/70">Sat - Sun: 8 AM - 11:30 PM</p>
                <p className="text-brass font-medium mt-1">Roasters active until 9 PM</p>
              </div>
            </div>

            <div className="bg-charcoal-card border border-brass/10 p-5 rounded-2xl flex items-start space-x-3.5">
              <Phone className="w-5 h-5 text-brass shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-cream">Call Details</h4>
                <p className="text-cream/70">Phone: +91 98765 43210</p>
                <p className="text-cream/70">Mobile: +91 90112 23344</p>
                <p className="text-cream/70">Roastery Desk: Ext 201</p>
              </div>
            </div>

            <div className="bg-charcoal-card border border-brass/10 p-5 rounded-2xl flex items-start space-x-3.5">
              <Mail className="w-5 h-5 text-brass shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-cream">Write to Us</h4>
                <p className="text-cream/70 hover:text-brass transition-colors">
                  <a href="mailto:hello@emeraldroast.com">hello@emeraldroast.com</a>
                </p>
                <p className="text-cream/70 hover:text-brass transition-colors">
                  <a href="mailto:wholesale@emeraldroast.com">wholesale@emeraldroast.com</a>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-charcoal-card border border-brass/10 p-6 rounded-2xl shadow-sm flex-grow mt-6">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4 font-sans text-xs sm:text-sm text-cream"
                >
                  <h3 className="font-serif text-base sm:text-lg font-bold text-brass mb-4">Send a Message</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-brass uppercase tracking-wider block">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-obsidian border border-brass/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brass text-cream font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-brass uppercase tracking-wider block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-obsidian border border-brass/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brass text-cream font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-brass uppercase tracking-wider block">Inquiry Type</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-obsidian border border-brass/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brass text-cream font-medium cursor-pointer"
                    >
                      <option>General Feedback</option>
                      <option>Wholesale Coffee Beans</option>
                      <option>Roastery Cupping Events</option>
                      <option>Careers</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-brass uppercase tracking-wider block">Message</label>
                    <textarea
                      required
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message details here..."
                      className="w-full bg-obsidian border border-brass/15 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brass text-cream font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brass hover:bg-brass/90 text-obsidian font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-sm active:scale-95"
                  >
                    <span>Submit Enquiry</span>
                    <Send className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-brass/10 text-brass flex items-center justify-center mx-auto border border-brass/25">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-cream">Enquiry Logged!</h3>
                  <p className="text-xs text-cream/55 max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-cream">{name}</span>. We have logged your enquiry regarding "{subject}". Our team will reply back at <span className="font-semibold text-brass">{email}</span> within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="bg-brass text-obsidian text-xs font-bold py-2 px-5 rounded-full hover:bg-brass/90 transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dark Editorial SVG Map of Chinchwad */}
        <div className="bg-charcoal-card border border-brass/10 rounded-3xl p-6 flex flex-col justify-between h-[500px] sm:h-auto shadow-inner">
          <div className="pb-4 space-y-1">
            <h3 className="font-serif text-base sm:text-lg font-bold text-cream">Chinchwad Landmark Map</h3>
            <p className="text-xs text-cream/45">Spine Road and Nigdi-Chinchwad intersection detail.</p>
          </div>
          
          <div className="flex-grow relative bg-obsidian rounded-2xl border border-brass/15 overflow-hidden min-h-[300px]">
            {/* Elegant Vector SVG Map in Dark Theme */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(176, 160, 136, 0.02)" strokeWidth="1" />
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Waterway (Pavana River flowing under night/dark styling) */}
              <path d="M -50,320 C 150,310 250,370 650,340" fill="none" stroke="#1d2e37" strokeWidth="24" strokeLinecap="round" opacity="0.6" />
              <path d="M -50,320 C 150,310 250,370 650,340" fill="none" stroke="#253c48" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
              <text x="140" y="360" fill="#426b80" className="font-mono text-[9px] font-bold tracking-widest uppercase rotate-2">Pavana River</text>

              {/* Highway System (Old Mumbai-Pune highway route) */}
              <path d="M -20,200 L 620,120" fill="none" stroke="#211f1d" strokeWidth="20" strokeLinecap="round" />
              <path d="M -20,200 L 620,120" fill="none" stroke="#b0a088" strokeWidth="1" strokeDasharray="5,5" strokeLinecap="round" opacity="0.15" />
              <text x="440" y="115" fill="#e7e1de" opacity="0.25" className="font-sans text-[8px] font-bold uppercase rotate-[-8deg] tracking-wider">Old Pune-Mumbai Highway</text>

              {/* Spine Road */}
              <path d="M 300,-50 L 300,450" fill="none" stroke="#211f1d" strokeWidth="14" />
              <path d="M 300,-50 L 300,450" fill="none" stroke="#b0a088" strokeWidth="1" strokeDasharray="3,3" opacity="0.1" />
              <text x="312" y="50" fill="#e7e1de" opacity="0.25" className="font-sans text-[8px] font-bold uppercase rotate-90 tracking-wider">Spine Road</text>

              {/* Nigdi-Chinchwad Link Road */}
              <path d="M -50,80 C 200,80 350,190 650,220" fill="none" stroke="#211f1d" strokeWidth="14" strokeLinecap="round" />
              <text x="80" y="74" fill="#e7e1de" opacity="0.3" className="font-sans text-[8px] font-bold uppercase tracking-wider">Nigdi-Chinchwad Link Rd</text>

              {/* Secondary Intersection Streets */}
              <line x1="120" y1="80" x2="120" y2="280" stroke="#211f1d" strokeWidth="8" />
              <line x1="450" y1="140" x2="450" y2="350" stroke="#211f1d" strokeWidth="8" />

              {/* Landmarks */}
              <g transform="translate(120, 180)">
                <circle r="5" fill="#b0a088" opacity="0.1" />
                <text x="8" y="3" fill="#e7e1de" opacity="0.3" className="font-sans text-[8px] font-bold">Nigdi Sector 21</text>
              </g>
              <g transform="translate(450, 260)">
                <circle r="5" fill="#b0a088" opacity="0.1" />
                <text x="8" y="3" fill="#e7e1de" opacity="0.3" className="font-sans text-[8px] font-bold">Chinchwad Station</text>
              </g>
              <g transform="translate(260, 20)">
                <circle r="5" fill="#b0a088" opacity="0.1" />
                <text x="-70" y="3" fill="#e7e1de" opacity="0.3" className="font-sans text-[8px] font-bold">Akurdi Chowk</text>
              </g>

              {/* The Emerald Roast Pin Highlight */}
              <g transform="translate(300, 150)">
                {/* Pin shadow */}
                <ellipse cx="0" cy="8" rx="7" ry="3" fill="rgba(0,0,0,0.4)" />
                {/* Ping animation rings - styled emerald green */}
                <circle cx="0" cy="0" r="16" fill="none" stroke="#88d982" strokeWidth="1.5" opacity="0.5" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="0" cy="0" r="24" fill="none" stroke="#88d982" strokeWidth="0.5" opacity="0.2" className="animate-ping" style={{ animationDuration: '3.5s' }} />
                
                {/* Coffee Pin Marker - styled in Brass */}
                <path d="M 0,-14 C -7,-14 -12,-9 -12,-2 C -12,5 -2,13 0,16 C 2,13 12,5 12,-2 C 12,-9 7,-14 0,-14 Z" fill="#b0a088" filter="url(#glow)" />
                {/* Inside circle */}
                <circle cx="0" cy="-3" r="4.5" fill="#151311" />
                <circle cx="0" cy="-3" r="2" fill="#88d982" />
                
                {/* Glow label box */}
                <rect x="18" y="-16" width="94" height="28" rx="6" fill="#151311" stroke="#b0a088" strokeWidth="1" />
                <text x="24" y="-3" fill="#e7e1de" className="font-serif text-[10px] font-bold">The Emerald</text>
                <text x="24" y="7" fill="#88d982" className="font-sans text-[7px] font-bold tracking-widest uppercase">Open Late</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
