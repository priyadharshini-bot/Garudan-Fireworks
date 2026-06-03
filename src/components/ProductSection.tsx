/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Product, Category, Language, TranslationSchema } from '../types';
import CrackerVisual from './CrackerVisual';
import { Search, Filter, Sparkles, SlidersHorizontal, ShoppingCart, Plus, Minus, Tag } from 'lucide-react';

interface ProductSectionProps {
  products: Product[];
  lang: Language;
  translations: TranslationSchema;
  onAddToCart: (product: Product, quantity: number) => void;
  categories: Category[];
}

export default function ProductSection({
  products,
  lang,
  translations,
  onAddToCart,
  categories
}: ProductSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Search and filter logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameTa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descriptionTa.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getProductQty = (pId: string) => quantities[pId] || 1;

  const handleQtyChange = (pId: string, delta: number) => {
    const current = getProductQty(pId);
    const updated = Math.max(1, current + delta);
    setQuantities({ ...quantities, [pId]: updated });
  };

  return (
    <section id="products-catalog-section" className="py-16 px-4 max-w-7xl mx-auto space-y-10 scroll-mt-24">
      
      {/* Section Headings */}
      <div className="text-center space-y-2">
        <span className="block text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
          {lang === 'en' ? 'SIVAKASI ROYAL CATALOG' : 'கருடன் சிவகாசி தயாரிப்புகள்'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-display">
          {translations.all}
        </h2>
        <div className="w-12 h-1 bg-[#D4AF37] mx-auto" />
      </div>

      {/* Control Panel: Search & Advanced Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* Search Input bar */}
        <div className="lg:col-span-4 relative group">
          <input
            type="text"
            id="product-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 rounded-none bg-[#111111] border border-white/10 text-white font-mono text-xs placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#D4AF37] group-focus-within:text-white transition-colors" />
        </div>

        {/* Categories Carousel / Horizontal scroll list */}
        <div className="lg:col-span-8 overflow-x-auto scrollbar-thin className pb-2 flex gap-2">
          
          {/* 'All' option pill */}
          <button
            onClick={() => setSelectedCategory('All')}
            id="cat-pill-all"
            className={`px-4 py-3 rounded-none text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                : 'bg-[#111111] text-neutral-400 border-white/5 hover:border-[#D4AF37]/50 hover:text-white'
            }`}
          >
            {lang === 'en' ? '✨ All Creations' : '✨ அனைத்தும்'} ({products.length})
          </button>

          {/* Individual Category capsules */}
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-3 rounded-none text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border cursor-pointer ${
                  isSel
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                    : 'bg-[#111111] text-neutral-400 border-white/5 hover:border-[#D4AF37]/50 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid of Results */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/40 rounded-2xl border border-neutral-800/60">
          <p className="text-neutral-400 font-sans text-base">
            {lang === 'en' ? 'No items found. Refine your query or select other category!' : 'திருப்பாடல்கள் எதுவும் காணப்படவில்லை. வேறு பிரிவை தேர்வு செய்யவும்!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const qty = getProductQty(p.id);
            const inStock = p.stock > 0;
            const hasDiscount = p.originalPrice ? p.originalPrice > p.price : false;
            const discountPct = hasDiscount 
              ? Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100) 
              : 0;

            return (
              <div
                key={p.id}
                id={`product-card-${p.id}`}
                className="p-5 bg-[#111111]/90 border border-white/5 hover:border-[#D4AF37]/50 hover:bg-[#111111] transition-all flex flex-col justify-between gap-4 group relative"
              >
                {/* Visual discount/featured badge */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                  {p.isFeatured && (
                    <span className="px-2.5 py-1 bg-red-600 text-white text-[9px] uppercase font-mono font-black tracking-widest">
                      {lang === 'en' ? 'Featured' : 'சிறப்பு'}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="px-2.5 py-1 bg-[#D4AF37] text-black text-[9px] uppercase font-mono font-black tracking-widest flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />
                      {discountPct}% OFF
                    </span>
                  )}
                </div>

                {/* Vector Image Illustration Area */}
                <div className="w-full aspect-square rounded-none overflow-hidden bg-[#1a1a1a] border border-white/5 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600 to-yellow-300 opacity-10 blur-2xl pointer-events-none" />
                  <CrackerVisual type={p.image} className="w-2/3 h-2/3 object-contain relative z-10" />
                  
                  {/* Backdrop stock indicator label */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-wider font-mono font-bold ${
                      inStock 
                        ? 'bg-green-950/40 text-green-400 border border-green-500/10' 
                        : 'bg-red-950/40 text-red-100 border border-red-500/10'
                    }`}>
                      {inStock ? `${translations.inStock}: ${p.stock}` : translations.outOfStock}
                    </span>
                  </div>
                </div>

                {/* Content Space */}
                <div className="mt-4 space-y-2.5 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                      {p.category}
                    </span>
                    <h3 className="font-sans font-black uppercase text-base text-white group-hover:text-[#D4AF37] transition-colors tracking-tight h-12 line-clamp-2">
                      {lang === 'en' ? p.nameEn : p.nameTa}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 h-8 font-sans leading-snug">
                      {lang === 'en' ? p.descriptionEn : p.descriptionTa}
                    </p>
                  </div>

                  {/* Price Row details */}
                  <div className="flex items-baseline gap-2 pt-2 border-t border-white/5">
                    <span className="font-sans font-black italic text-lg text-[#D4AF37]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-neutral-500 line-through">
                        ₹{p.originalPrice?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity + Add Cart Section */}
                <div className="mt-4 pt-3 flex items-center justify-between gap-2 border-t border-white/5">
                  
                  {/* Quantity adjustment logic */}
                  <div className="flex items-center rounded-none bg-black border border-white/10 py-1.5 px-2">
                    <button
                      onClick={() => handleQtyChange(p.id, -1)}
                      disabled={!inStock}
                      id={`pqty-dec-${p.id}`}
                      className="p-1 text-neutral-400 hover:text-[#D4AF37] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-black font-mono text-white">
                      {inStock ? qty : 0}
                    </span>
                    <button
                      onClick={() => handleQtyChange(p.id, 1)}
                      disabled={!inStock || qty >= p.stock}
                      id={`pqty-inc-${p.id}`}
                      className="p-1 text-neutral-400 hover:text-[#D4AF37] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add action button */}
                  <button
                    disabled={!inStock}
                    onClick={() => {
                      onAddToCart(p, qty);
                      // Reset local qty
                      setQuantities({ ...quantities, [p.id]: 1 });
                    }}
                    id={`pqty-add-${p.id}`}
                    className={`flex-grow flex items-center justify-center gap-1.5 py-3 px-3 rounded-none text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                      inStock
                        ? 'bg-[#D4AF37] hover:scale-[1.02] text-black shadow-[0_0_15px_rgba(212,175,55,0.15)] active:scale-[0.98]'
                        : 'bg-neutral-900 border border-white/5 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{inStock ? translations.addToCart : translations.outOfStock}</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
