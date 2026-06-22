import React from 'react';
import { Coffee, Award, BookOpen, Quote } from 'lucide-react';

const About = () => {
  return (
    <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-20 min-h-screen bg-obsidian text-cream">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-[10px] uppercase tracking-widest font-bold text-brass bg-brass/10 px-3.5 py-1 rounded-full inline-flex items-center space-x-1.5 border border-brass/15">
            <Award className="w-3.5 h-3.5" />
            <span>Our Journey</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Crafting Coffee with Precision & Art
          </h1>
          <p className="text-xs sm:text-sm text-cream/70 leading-relaxed font-light">
            Founded in 2024, The Emerald Roast began with a simple mission: to introduce Chinchwad to high-altitude single-origin micro-lots. We believe that coffee is a science of calibration and an art of expression.
          </p>
          <p className="text-xs sm:text-sm text-cream/70 leading-relaxed font-light">
            We source green beans from sustainable micro-lots in East Africa and South America. We then roast locally in Chinchwad in small batches, monitoring temperature profiles to highlight the floral, honey, and chocolate characteristics of each bean.
          </p>
        </div>

        {/* Barista Image Container */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video lg:aspect-square bg-charcoal-card border border-brass/15">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{ backgroundImage: `url('/assets/about_cafe.png')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/45 to-transparent" />
        </div>
      </section>

      {/* Sourcing Section */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-serif text-3xl font-bold">Bean Origins</h2>
          <p className="text-xs text-cream/50 max-w-sm mx-auto">
            We roast Grade 1 Arabica beans. Here are the core origins featured in our daily brews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sourcing Card 1 */}
          <div className="bg-charcoal-card border border-brass/10 p-8 rounded-2xl space-y-4 hover:border-brass/25 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-lg sm:text-xl text-cream">Sidama Micro-Lot</span>
              <span className="bg-brass/10 text-brass text-[9px] font-bold py-1 px-3.5 rounded-full uppercase tracking-wider border border-brass/15">Ethiopia</span>
            </div>
            <p className="text-xs text-cream/75 leading-relaxed font-light">
              Cultivated in the volcanic soils of southern Ethiopia. The natural sun-drying process yields a sweet, floral cup with distinct fruit tones.
            </p>
            <ul className="grid grid-cols-2 gap-4 text-xs pt-2 font-sans">
              <li className="space-y-1">
                <span className="text-[9px] font-bold text-brass/40 uppercase tracking-wider block">Altitude</span>
                <span className="font-medium text-cream">1,900m - 2,100m</span>
              </li>
              <li className="space-y-1">
                <span className="text-[9px] font-bold text-brass/40 uppercase tracking-wider block">Process</span>
                <span className="font-medium text-cream">Natural (Sun-dried)</span>
              </li>
              <li className="space-y-1 col-span-2">
                <span className="text-[9px] font-bold text-brass/40 uppercase tracking-wider block">Tasting Profile</span>
                <span className="font-medium text-brass">Bright jasmine floral, sweet nectarine, crisp black tea finish</span>
              </li>
            </ul>
          </div>

          {/* Sourcing Card 2 */}
          <div className="bg-charcoal-card border border-brass/10 p-8 rounded-2xl space-y-4 hover:border-brass/25 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-lg sm:text-xl text-cream">Tarrazú Volcanic Estate</span>
              <span className="bg-brass/10 text-brass text-[9px] font-bold py-1 px-3.5 rounded-full uppercase tracking-wider border border-brass/15">Costa Rica</span>
            </div>
            <p className="text-xs text-cream/75 leading-relaxed font-light">
              Grown in the volcanic central valley. Pulped honey processing retains natural mucilage sugar, lending a smooth body and honeyed sweetness.
            </p>
            <ul className="grid grid-cols-2 gap-4 text-xs pt-2 font-sans">
              <li className="space-y-1">
                <span className="text-[9px] font-bold text-brass/40 uppercase tracking-wider block">Altitude</span>
                <span className="font-medium text-cream">1,400m - 1,850m</span>
              </li>
              <li className="space-y-1">
                <span className="text-[9px] font-bold text-brass/40 uppercase tracking-wider block">Process</span>
                <span className="font-medium text-cream">Honey Processed</span>
              </li>
              <li className="space-y-1 col-span-2">
                <span className="text-[9px] font-bold text-brass/40 uppercase tracking-wider block">Tasting Profile</span>
                <span className="font-medium text-brass">Silky milk chocolate body, warm honey sweetness, green apple acidity</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Philosophy Table Section */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-widest font-bold text-brass bg-brass/10 px-3.5 py-1 rounded-full inline-flex items-center space-x-1.5 border border-brass/15">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Roaster Records</span>
          </span>
          <h2 className="font-serif text-3xl font-bold">Cupping Notes</h2>
          <p className="text-xs text-cream/50 max-w-sm mx-auto">
            Our custom cupping parameters mapped to roast configurations for single-origin extracts.
          </p>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-brass/15 shadow-md">
          <table className="w-full text-left border-collapse bg-charcoal-card font-sans text-xs sm:text-sm text-cream">
            <thead>
              <tr className="bg-charcoal-card text-brass border-b border-brass/15 font-serif">
                <th className="p-4 font-semibold tracking-wide">Roast Profile</th>
                <th className="p-4 font-semibold tracking-wide">Origin Blend</th>
                <th className="p-4 font-semibold tracking-wide">Acidity</th>
                <th className="p-4 font-semibold tracking-wide">Body</th>
                <th className="p-4 font-semibold tracking-wide">Dominant Tasting Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brass/5 font-sans">
              <tr className="hover:bg-obsidian/30 transition-colors">
                <td className="p-4 font-semibold text-brass">Light Roast</td>
                <td className="p-4">Ethiopian Sidama</td>
                <td className="p-4 text-brass font-medium">Bright & Floral</td>
                <td className="p-4">Medium-Light</td>
                <td className="p-4 text-cream/70">Jasmine floral, peach, Earl Grey tea</td>
              </tr>
              <tr className="hover:bg-obsidian/30 transition-colors">
                <td className="p-4 font-semibold text-brass">Medium Roast</td>
                <td className="p-4">Costa Rican Tarrazú</td>
                <td className="p-4 text-cream font-medium">Balanced & Honeyed</td>
                <td className="p-4">Velvety Full</td>
                <td className="p-4 text-cream/70">Warm honey, milk chocolate, green apple</td>
              </tr>
              <tr className="hover:bg-obsidian/30 transition-colors">
                <td className="p-4 font-semibold text-brass">Medium-Dark Roast</td>
                <td className="p-4">House Espresso Blend</td>
                <td className="p-4 text-cream/60">Low & Smooth</td>
                <td className="p-4 font-semibold text-cream">Creamy Thick</td>
                <td className="p-4 text-brass font-medium">Cocoa beans, roasted hazelnut, orange zest</td>
              </tr>
              <tr className="hover:bg-obsidian/30 transition-colors">
                <td className="p-4 font-semibold text-brass">Dark Roast</td>
                <td className="p-4">Cold Brew Blend</td>
                <td className="p-4 text-cream/40">Negligible</td>
                <td className="p-4">Bold & Heavy</td>
                <td className="p-4 text-cream/55">Belgian dark chocolate, smoky oak, molasses</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Co-founders Quote Block */}
      <section className="bg-charcoal-card text-cream py-16 px-8 rounded-3xl relative overflow-hidden shadow-xl border border-brass/10">
        <div className="absolute top-4 left-4 opacity-5 text-brass">
          <Quote className="w-48 h-48 -translate-x-10 -translate-y-10" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <Coffee className="w-8 h-8 text-brass fill-brass/15 mx-auto" />
          <blockquote className="font-serif text-lg sm:text-2xl italic leading-relaxed text-cream/90">
            "Coffee is more than just caffeine; it is a conversation, a sensory experience, and a much-needed moment of pause in our busy days. At The Emerald Roast, we strive to brew that perfect moment of pause for our Chinchwad community, one single cup at a time."
          </blockquote>
          <div className="space-y-1">
            <cite className="not-italic font-bold text-cream tracking-wide text-sm sm:text-base">Siddharth & Neha Patil</cite>
            <p className="text-[9px] text-brass uppercase tracking-widest font-bold">Co-Founders & Head Roasters, The Emerald Roast</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
