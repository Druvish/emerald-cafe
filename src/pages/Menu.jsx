import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Coffee, Plus, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const menuData = {
  hotdrinks: [
    {
      id: 'hot-1',
      name: 'Espresso Romano',
      price: 180,
      description: 'Double shot of dark roasted espresso with a twist of fresh candied lemon peel to balance acidity.',
      rating: 5,
      image: '/assets/hero_cafe_bg.png'
    },
    {
      id: 'hot-2',
      name: 'Rose Gold Latte',
      price: 240,
      description: 'Signature smooth espresso infused with organic rosewater, steamed milk, and real edible gold dust.',
      rating: 5,
      image: '/assets/hero_cafe_bg.png'
    },
    {
      id: 'hot-3',
      name: 'Hazelnut Mocha',
      price: 210,
      description: 'Rich espresso, steamed velvet milk, organic dark Belgian chocolate, and roasted hazelnut reduction.',
      rating: 4,
      image: '/assets/hero_cafe_bg.png'
    },
    {
      id: 'hot-4',
      name: 'Spiced Cinnamon Cortado',
      price: 190,
      description: 'Equal parts balanced espresso and warm milk dusted with fresh, hand-ground Ceylon cinnamon.',
      rating: 4,
      image: '/assets/hero_cafe_bg.png'
    }
  ],
  coldbrews: [
    {
      id: 'cold-1',
      name: 'Classic Cold Brew',
      price: 210,
      description: '16-hour slow steeped single-origin Ethiopian coffee beans served over custom crystal block ice.',
      rating: 4,
      image: '/assets/artisanal_roasts.png'
    },
    {
      id: 'cold-2',
      name: 'Terracotta Tonic',
      price: 250,
      description: 'Slow-drip cold brew floated over artisanal tonic water, dash of orange bitters, and fresh rosemary.',
      rating: 5,
      image: '/assets/artisanal_roasts.png'
    },
    {
      id: 'cold-3',
      name: 'Salted Caramel Foam Brew',
      price: 230,
      description: 'Cozy cold brew topped with a thick, velvety layer of hand-whipped salted caramel sea salt cream.',
      rating: 5,
      image: '/assets/artisanal_roasts.png'
    },
    {
      id: 'cold-4',
      name: 'Coconut Shakerato',
      price: 220,
      description: 'Double espresso shaken with chilled organic coconut nectar and heavy ice until frothy.',
      rating: 4,
      image: '/assets/artisanal_roasts.png'
    }
  ],
  bites: [
    {
      id: 'bites-1',
      name: 'Artisanal Croissant',
      price: 190,
      description: 'Flaky, buttery, multi-layered croissant baked fresh in our stone ovens every morning.',
      rating: 5,
      image: '/assets/fresh_pastries.png'
    },
    {
      id: 'bites-2',
      name: 'Wild Mushroom Sourdough',
      price: 280,
      description: 'Pan-seared forest mushrooms, garlic confit, and truffle oil over a toasted slice of local sourdough.',
      rating: 5,
      image: '/assets/fresh_pastries.png'
    },
    {
      id: 'bites-3',
      name: 'Pesto Caprese Panini',
      price: 260,
      description: 'Heirloom tomatoes, fresh buffalo mozzarella, and basil pesto pressed on a warm artisan ciabatta.',
      rating: 4,
      image: '/assets/fresh_pastries.png'
    },
    {
      id: 'bites-4',
      name: 'Jalapeno Cheese Scone',
      price: 170,
      description: 'Savory buttermilk scone packed with sharp white cheddar cheese and fresh sliced jalapeno peppers.',
      rating: 4,
      image: '/assets/fresh_pastries.png'
    }
  ],
  sweets: [
    {
      id: 'sweets-1',
      name: 'Signature Tiramisu',
      price: 290,
      description: 'Espresso-soaked ladyfingers, rich mascarpone cream, dust of premium Dutch cocoa, and coffee liqueur.',
      rating: 5,
      image: '/assets/signature_desserts.png'
    },
    {
      id: 'sweets-2',
      name: 'Dark Chocolate Espresso Tart',
      price: 260,
      description: 'Lustrous Belgian dark chocolate ganache in a crisp cocoa shell, infused with our house espresso roast.',
      rating: 5,
      image: '/assets/signature_desserts.png'
    },
    {
      id: 'sweets-3',
      name: 'Pistachio Cardamom Loaf',
      price: 220,
      description: 'Warm tea loaf cake infused with green cardamom pods and topped with a roasted pistachio glaze.',
      rating: 4,
      image: '/assets/signature_desserts.png'
    },
    {
      id: 'sweets-4',
      name: 'Warm Apple Galette',
      price: 240,
      description: 'Oven-roasted spiced apples in a flaky open-face tart shell, served with a sweet vanilla bean glaze.',
      rating: 4,
      image: '/assets/signature_desserts.png'
    }
  ]
};

const Menu = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'hotdrinks';

  const categories = [
    { id: 'hotdrinks', label: 'Hot Drinks' },
    { id: 'coldbrews', label: 'Cold Brews' },
    { id: 'bites', label: 'Bites & Savories' },
    { id: 'sweets', label: 'Sweets & Desserts' }
  ];

  const handleCategoryChange = (categoryId) => {
    setSearchParams({ category: categoryId });
  };

  const currentItems = menuData[activeCategory] || [];

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto space-y-12 min-h-screen bg-obsidian text-cream">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-widest font-bold text-brass bg-brass/10 px-3.5 py-1 rounded-full inline-flex items-center space-x-1.5 border border-brass/15">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Artisanal Excellence</span>
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream">Signature Concoctions</h1>
        <p className="text-xs text-cream/50 max-w-md mx-auto leading-relaxed">
          Every cup is ground, tamped, and brewed to order. Every bite is baked fresh with natural ingredients. Discover the aroma.
        </p>
      </div>

      {/* Categories Tab Switches */}
      <div className="flex justify-center border-b border-brass/10 pb-2">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                  isActive
                    ? 'text-obsidian'
                    : 'text-cream/70 hover:text-cream hover:bg-charcoal-card'
                }`}
              >
                {/* Active Backdrop */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 bg-brass rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of items */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4"
      >
        <AnimatePresence mode="popLayout">
          {currentItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-charcoal-card rounded-2xl overflow-hidden shadow-sm border border-brass/10 flex flex-col group h-full"
            >
              {/* Image Header */}
              <div className="h-44 bg-obsidian relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent" />
              </div>

              {/* Card Details */}
              <div className="p-5 flex flex-col flex-grow space-y-3.5">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-base font-bold text-cream leading-snug group-hover:text-brass transition-colors">
                    {item.name}
                  </h3>
                  <span className="font-mono text-sm font-bold text-brass shrink-0 ml-2">₹{item.price}</span>
                </div>

                <p className="text-xs text-cream/70 leading-relaxed flex-grow">
                  {item.description}
                </p>

                {/* Rating & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-brass/10">
                  {/* Premium Coffee Cup Ratings */}
                  <div className="flex items-center space-x-0.5 text-brass" title={`Rating: ${item.rating}/5`}>
                    {[...Array(5)].map((_, i) => (
                      <Coffee
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating
                            ? 'fill-current'
                            : 'text-cream/15'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="p-2 rounded-xl bg-brass hover:bg-brass/90 text-obsidian transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                    aria-label={`Add ${item.name} to Cart`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Menu;
