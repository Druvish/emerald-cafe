import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { ShoppingBag, Menu, X, Coffee, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { cart, setIsCartOpen } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Roastery', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'KDS Dashboard', path: '/chef' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-obsidian text-cream font-sans">
      {/* Sticky Glassmorphic Navbar */}
      <nav className="sticky top-0 z-40 glass-nav py-4 px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-cream hover:opacity-90 transition-opacity">
          <Coffee className="w-8 h-8 text-brass fill-brass/10" />
          <span className="font-serif text-2xl font-bold tracking-tight">
            The Emerald <span className="text-brass">Roast</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 font-medium text-xs tracking-wider uppercase transition-colors duration-300 hover:text-brass ${
                  isActive ? 'text-brass font-semibold' : 'text-cream/70'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brass"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-charcoal-card text-cream border border-brass/10 hover:border-brass/35 hover:scale-105 transition-all duration-300 shadow-md group cursor-pointer"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5 group-hover:rotate-6 transition-transform" />
            {cartItemsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald text-obsidian text-[10px] font-bold flex items-center justify-center border border-obsidian"
              >
                {cartItemsCount}
              </motion.span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-cream hover:bg-charcoal-card transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-charcoal-card z-50 p-6 flex flex-col space-y-6 shadow-2xl md:hidden border-l border-brass/10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-brass/10">
                <span className="font-serif font-bold text-lg text-cream">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-cream hover:bg-obsidian transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2.5 px-4 rounded-xl text-sm font-semibold tracking-wide uppercase transition-colors ${
                        isActive
                          ? 'bg-brass text-obsidian font-bold'
                          : 'text-cream hover:bg-obsidian'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Pages Output */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Cart Drawer Component */}
      <CartDrawer />

      {/* Footer */}
      <footer className="bg-obsidian text-cream/70 border-t border-charcoal-card py-12 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-cream">
              <Coffee className="w-6 h-6 text-brass fill-brass/20" />
              <span className="font-serif text-xl font-bold tracking-wide">The Emerald Roast</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs text-cream/50">
              Chinchwad's premier late-night roastery. We handcraft artisanal micro-lots and serve fresh stone-oven pastries in an editorial atmosphere.
            </p>
          </div>

          {/* Operational Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-cream font-semibold text-base tracking-wide border-b border-charcoal-card pb-1">Hours of Ritual</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-brass" />
                <span>Monday - Friday</span>
              </li>
              <li className="pl-5.5 text-[11px] text-cream/45">8:00 AM - 10:30 PM</li>
              <li className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-brass" />
                <span>Saturday - Sunday</span>
              </li>
              <li className="pl-5.5 text-[11px] text-cream/45">8:00 AM - 11:30 PM</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-cream font-semibold text-base tracking-wide border-b border-charcoal-card pb-1">Roastery Contact</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brass shrink-0 mt-0.5" />
                <span className="text-cream/55 leading-relaxed">
                  Sec 21, Yamuna Nagar, Nigdi-Chinchwad Link Road, Chinchwad, Maharashtra 411019
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-brass" />
                <a href="tel:+919876543210" className="hover:text-brass transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-brass" />
                <a href="mailto:hello@emeraldroast.com" className="hover:text-brass transition-colors">hello@emeraldroast.com</a>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="space-y-4">
            <h4 className="font-serif text-cream font-semibold text-base tracking-wide border-b border-charcoal-card pb-1">Follow the Craft</h4>
            <div className="flex space-x-3">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9.5 h-9.5 rounded-xl bg-charcoal-card hover:bg-brass hover:text-obsidian transition-all duration-300 flex items-center justify-center text-cream border border-brass/10 shadow-md"
                aria-label="Instagram"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9.5 h-9.5 rounded-xl bg-charcoal-card hover:bg-brass hover:text-obsidian transition-all duration-300 flex items-center justify-center text-cream border border-brass/10 shadow-md"
                aria-label="Facebook"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9.5 h-9.5 rounded-xl bg-charcoal-card hover:bg-brass hover:text-obsidian transition-all duration-300 flex items-center justify-center text-cream border border-brass/10 shadow-md"
                aria-label="Twitter"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-charcoal-card mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-cream/35">
          <p>© {new Date().getFullYear()} The Emerald Roast. Crafted in Pimpri-Chinchwad, Maharashtra.</p>
          <div className="flex space-x-5 mt-4 md:mt-0">
            <Link to="/chef" className="hover:text-brass transition-colors">Kitchen Display System</Link>
            <span className="cursor-default">|</span>
            <span className="cursor-default">Dark Editorial Specialty Coffee</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
