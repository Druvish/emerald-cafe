import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Award, Sparkles, Flame, Star, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Home = () => {
  const { addToCart } = useCart();

  // Typewriter effect headline
  const phrases = ["midnight rituals.", "custom roasts.", "exclusive blends."];
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 110;
  const deletingSpeed = 60;
  const delayBetweenPhrases = 2200;

  useEffect(() => {
    let timer;
    const currentFullText = phrases[currentPhraseIdx];

    if (!isDeleting) {
      if (displayText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.substring(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetweenPhrases);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.substring(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentPhraseIdx((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPhraseIdx]);

  // Featured items
  const featuredItems = [
    {
      id: 'hot-2',
      name: 'Rose Gold Latte',
      price: 240,
      description: 'Signature smooth espresso infused with organic rosewater and dusted with real edible gold flakes.',
      rating: 5,
      category: 'hotdrinks',
      image: '/assets/hero_cafe_bg.png'
    },
    {
      id: 'sweets-1',
      name: 'Signature Tiramisu',
      price: 290,
      description: 'Layered ladyfingers soaked in double-espresso, fresh mascarpone, and premium cocoa powder.',
      rating: 5,
      category: 'sweets',
      image: '/assets/signature_desserts.png'
    },
    {
      id: 'cold-2',
      name: 'Terracotta Tonic',
      price: 250,
      description: 'Ethiopian cold brew floated over chilled tonic water, dash of orange bitters, and a rosemary sprig.',
      rating: 5,
      category: 'coldbrews',
      image: '/assets/artisanal_roasts.png'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-obsidian text-cream">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Mask Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ backgroundImage: `url('/assets/hero_cafe_bg.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-brass/10 border border-brass/25 px-4 py-1.5 rounded-full text-[10px] font-bold text-brass tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chinchwad's Premier Late-Night Roastery</span>
          </motion.div>

          <h1 className="font-serif text-4.5xl sm:text-6xl md:text-7xl text-cream font-bold leading-tight select-none">
            Brewing the <br className="sm:hidden" />
            <span className="text-brass typewriter-cursor">{displayText}</span>
          </h1>

          <p className="text-sm sm:text-base text-cream/70 max-w-xl mx-auto font-light leading-relaxed">
            Welcome to The Emerald Roast. We source single-origin specialty coffee beans and roast them locally in small batches to preserve their unique profiles.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link
              to="/menu"
              className="w-full sm:w-auto bg-brass hover:bg-brass/90 text-obsidian font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:translate-y-[-2px] cursor-pointer"
            >
              <span>Explore The Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto border border-brass/20 text-brass font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl hover:bg-brass/10 transition-colors flex items-center justify-center cursor-pointer"
            >
              Our Philosophy
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="bg-charcoal-card text-cream border-y border-brass/15 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center">
          <div className="flex flex-col items-center space-y-2.5 p-4">
            <div className="w-12 h-12 rounded-xl bg-brass/10 text-brass flex items-center justify-center border border-brass/10">
              <Flame className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-serif font-bold text-base mt-2 text-cream">Single-Origin Roasts</h3>
            <p className="text-xs text-cream/55 max-w-xs leading-relaxed">
              Beans procured directly from volcanic micro-lots in Costa Rica and high-altitude fields of Ethiopia.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2.5 p-4 md:border-x md:border-brass/10">
            <div className="w-12 h-12 rounded-xl bg-brass/10 text-brass flex items-center justify-center border border-brass/10">
              <Award className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-serif font-bold text-base mt-2 text-cream">Artisanal Small Batches</h3>
            <p className="text-xs text-cream/55 max-w-xs leading-relaxed">
              Roasting locally in Chinchwad to unlock complex notes of cacao, jasmine, and orange zest.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2.5 p-4">
            <div className="w-12 h-12 rounded-xl bg-brass/10 text-brass flex items-center justify-center border border-brass/10">
              <Coffee className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-serif font-bold text-base mt-2 text-cream">Oven Fresh Pastries</h3>
            <p className="text-xs text-cream/55 max-w-xs leading-relaxed">
              Flaky, multi-layered butter croissants and specialty pastries baked daily by our head chef.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream">Featured Confections</h2>
          <p className="text-xs text-cream/50 max-w-md mx-auto leading-relaxed">
            A hand-curated selection of roaster specials, handcrafted with premium ingredients and calibrated brewing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-charcoal-card rounded-2xl overflow-hidden shadow-md border border-brass/10 flex flex-col group relative"
            >
              {/* Product Image */}
              <div className="h-56 overflow-hidden relative bg-obsidian">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <span className="absolute top-4 left-4 bg-brass text-obsidian font-sans text-[9px] font-bold py-1 px-3.5 rounded-full uppercase tracking-wider shadow-sm">
                  Chef's Roast
                </span>
              </div>

              {/* Product Details */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-cream leading-tight group-hover:text-brass transition-colors">{item.name}</h3>
                    <div className="flex items-center space-x-1 mt-1 text-brass">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <span className="font-mono text-sm sm:text-base font-bold text-brass shrink-0 ml-2">₹{item.price}</span>
                </div>

                <p className="text-xs text-cream/70 leading-relaxed flex-grow">{item.description}</p>

                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-brass hover:bg-brass/90 text-obsidian font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 text-brass font-bold text-xs uppercase tracking-widest hover:underline cursor-pointer group"
          >
            <span>View Complete Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brass" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
