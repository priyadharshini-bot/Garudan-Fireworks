/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Fragment } from 'react';
import { Product, Category, Language, TranslationSchema } from '../types';
import CrackerVisual from './CrackerVisual';
import BrandLogosBar from './BrandLogosBar';
import { Search, Sparkles, ShoppingCart, Plus, Minus, Tag, Flame, LayoutGrid, List, MessageSquare, ShoppingBag } from 'lucide-react';

interface ProductSectionProps {
  products: Product[];
  lang: Language;
  translations: TranslationSchema;
  onAddToCart: (product: Product, quantity: number) => void;
  categories: Category[];
}

// Category Tamil translations for section headers
const getCategoryTaName = (cat: string) => {
  switch (cat) {
    case 'Sparklers': return 'கம்பி மத்தாப்பு';
    case 'Flower Pots': return 'பூச்சட்டி';
    case 'Rockets': return 'ராக்கெட்';
    case 'Atom Bombs': return 'ஆட்டம் பாம்';
    case 'Fancy Crackers': return 'ஃபேன்சி & தரைச்சக்கரம்';
    case 'Kids Special': return 'குழந்தைகள் சிறப்பு';
    case 'Gift Boxes': return 'கிஃப்ட் பாக்ஸ்';
    case 'Festival Combo Packs': return 'விழா சிறப்பு காம்போ';
    default: return cat;
  }
};

// Category color map for vibrant pills and borders
const getCategoryGradient = (cat: Category | 'All' | string) => {
  switch (cat) {
    case 'Sparklers':
      return 'from-amber-400 to-yellow-500 text-black';
    case 'Flower Pots':
      return 'from-rose-500 to-amber-500 text-white';
    case 'Rockets':
      return 'from-cyan-400 to-blue-500 text-black';
    case 'Atom Bombs':
      return 'from-red-600 to-rose-500 text-white';
    case 'Fancy Crackers':
      return 'from-purple-500 to-pink-500 text-white';
    case 'Kids Special':
      return 'from-emerald-400 to-teal-500 text-black';
    case 'Gift Boxes':
    case 'Festival Combo Packs':
      return 'from-amber-300 via-rose-500 to-purple-600 text-white';
    default:
      return 'from-amber-400 via-rose-500 to-cyan-400 text-black';
  }
};

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
  const [isCompactListView, setIsCompactListView] = useState(true);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameTa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descriptionTa.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group filtered products by category for organized section display
  const groupedProducts = categories.reduce((acc, cat) => {
    const items = filteredProducts.filter((p) => p.category === cat);
    if (items.length > 0) {
      acc.push({ category: cat, items });
    }
    return acc;
  }, [] as { category: Category; items: Product[] }[]);

  const categorizedIds = new Set(groupedProducts.flatMap((g) => g.items.map((p) => p.id)));
  const remainingItems = filteredProducts.filter((p) => !categorizedIds.has(p.id));
  if (remainingItems.length > 0) {
    groupedProducts.push({ category: 'Others' as Category, items: remainingItems });
  }

  const getProductQty = (pId: string) => quantities[pId] !== undefined ? quantities[pId] : 0;

  const handleQtyChange = (pId: string, delta: number) => {
    const current = getProductQty(pId);
    const updated = Math.max(0, current + delta);
    setQuantities({ ...quantities, [pId]: updated });
  };

  const generateProductWhatsAppUrl = (product: Product, quantity: number) => {
    const prodName = lang === 'en' ? product.nameEn : `${product.nameEn} (${product.nameTa})`;
    const totalPrice = (product.price * quantity).toLocaleString('en-IN');
    const message = `Hi Garudan Fireworks, I would like to place a direct order for:\n\n*Product:* ${prodName}\n*Category:* ${product.category}\n*Quantity:* ${quantity}\n*Total Price:* ₹${totalPrice}\n\nPlease confirm availability and ordering process!`;
    return `https://wa.me/919092268462?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="products-catalog-section" className="pt-2 sm:pt-4 pb-12 px-4 max-w-7xl mx-auto space-y-6 scroll-mt-20">
      
      {/* Auto Scrolling Brand Logos Marquee */}
      <BrandLogosBar />

      {/* Section Headings */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span>{lang === 'en' ? 'Online Crackers Price List 2026 • Sivakasi Crackers Online' : 'ஆன்லைன் பட்டாசு விலைப் பட்டியல் 2026'}</span>
          <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 font-display">
          {lang === 'en' ? 'Buy Sivakasi Crackers Online' : translations.all}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 mx-auto rounded-full" />
      </div>

      {/* Control Panel Header with View Mode Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left space-y-1">
          <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
            {lang === 'en' ? 'Sivakasi Direct Wholesale Rate' : 'சிவகாசி நேரடி மொத்த விலை'}
          </span>
          <p className="text-xs text-neutral-400">
            {lang === 'en' ? 'Showing ' : 'மொத்தம் '} <strong className="text-white">{filteredProducts.length}</strong> {lang === 'en' ? 'crackers available for instant booking' : 'பட்டாசுகள் கிடைக்கின்றன'}
          </p>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#130b20] border border-amber-500/30 shadow-inner">
          <button
            onClick={() => setIsCompactListView(false)}
            id="view-toggle-grid"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              !isCompactListView
                ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{lang === 'en' ? 'Grid Cards' : 'படங்கள்'}</span>
          </button>
          <button
            onClick={() => setIsCompactListView(true)}
            id="view-toggle-list"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              isCompactListView
                ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>{lang === 'en' ? 'Price List' : 'விலைப் பட்டியல்'}</span>
          </button>
        </div>
      </div>

      {/* Minimum Order Value Text */}
      <div className="text-center text-xs sm:text-sm font-semibold text-amber-300/90 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-1 w-full">
        <span className="font-bold text-amber-400 flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
          {lang === 'en' ? 'Minimum Order:' : 'குறைந்தபட்ச ஆர்டர்:'}
        </span>
        <span>
          {lang === 'en' ? 'Tamil Nadu' : 'தமிழ்நாடு'}: <strong className="text-amber-200 font-bold">Rs 3000</strong>
        </span>
        <span className="text-amber-500/60 hidden sm:inline">•</span>
        <span>
          {lang === 'en' ? 'Other States' : 'பிற மாநிலங்கள்'}: <strong className="text-amber-200 font-bold">Rs 5000</strong>
        </span>
      </div>

      {/* Control Panel: Search & Advanced Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#130d22]/90 p-4 rounded-2xl border border-amber-500/20 shadow-xl backdrop-blur-md">
        
        {/* Search Input bar */}
        <div className="lg:col-span-4 relative group">
          <input
            type="text"
            id="product-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1c1430] border border-amber-400/30 text-white font-mono text-xs placeholder-neutral-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-amber-400 group-focus-within:text-white transition-colors" />
        </div>

        {/* Categories Carousel / Horizontal scroll list */}
        <div className="lg:col-span-8 overflow-x-auto pb-2 flex gap-2 scrollbar-thin">
          
          {/* 'All' option pill */}
          <button
            onClick={() => setSelectedCategory('All')}
            id="cat-pill-all"
            className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer shadow-md border ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 text-black border-amber-300 shadow-[0_0_15px_rgba(255,200,0,0.4)] scale-105'
                : 'bg-[#1a122e] text-neutral-300 border-amber-500/20 hover:border-amber-400/60 hover:text-white'
            }`}
          >
            ✨ {lang === 'en' ? 'All Crackers' : 'அனைத்தும்'} ({products.length})
          </button>

          {/* Individual Category capsules */}
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const isSel = selectedCategory === cat;
            const gradientStyle = getCategoryGradient(cat);

            return (
              <button
                key={cat}
                id={`cat-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border shadow-md ${
                  isSel
                    ? `bg-gradient-to-r ${gradientStyle} border-white shadow-lg scale-105`
                    : 'bg-[#1a122e] text-neutral-300 border-amber-500/20 hover:border-amber-400/60 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid or Table Results */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#120c22]/80 rounded-2xl border border-amber-500/20">
          <p className="text-neutral-300 font-sans text-base">
            {lang === 'en' ? 'No items found. Refine your query or select another category!' : 'பட்டாசுகள் எதுவும் காணப்படவில்லை. வேறு பிரிவை தேர்வு செய்யவும்!'}
          </p>
        </div>
      ) : isCompactListView ? (
        /* Compact Price List View Grouped By Category */
        <>
          {/* Mobile View: Cards grouped by Category */}
          <div className="sm:hidden space-y-8">
            {groupedProducts.map((group) => (
              <div key={group.category} className="space-y-3">
                {/* Category Header Banner */}
                <div className="flex items-center gap-2.5 pt-2 pb-1 border-b border-amber-500/20 sticky top-[72px] z-10 bg-[#0a0518]/95 backdrop-blur-md py-2">
                  <span className={`px-3 py-1 rounded-xl bg-gradient-to-r ${getCategoryGradient(group.category)} text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5`}>
                    <Flame className="w-3.5 h-3.5" />
                    <span>{group.category}</span>
                  </span>
                  {lang === 'ta' && (
                    <span className="text-xs text-amber-300 font-bold">
                      {getCategoryTaName(group.category)}
                    </span>
                  )}
                  <span className="text-xs text-amber-300/70 font-mono font-bold">
                    ({group.items.length})
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-500/30 to-transparent" />
                </div>

                {/* Mobile Cards for this Category */}
                <div className="space-y-3">
                  {group.items.map((p) => {
                    const qty = getProductQty(p.id);
                    const inStock = p.stock > 0;
                    const hasDiscount = p.originalPrice ? p.originalPrice > p.price : false;

                    return (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl border border-amber-500/20 bg-[#130d22]/90 shadow-xl backdrop-blur-md flex flex-col gap-3"
                      >
                        {/* Top Row: Visual + Name & Category + Price */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-[#1e1538] border border-amber-500/20 flex items-center justify-center p-1.5 flex-shrink-0">
                              <CrackerVisual type={p.image} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-sans font-bold text-white text-sm leading-snug truncate">
                                {lang === 'en' ? p.nameEn : p.nameTa}
                              </h4>
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 mt-1">
                                {p.category}
                              </span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="font-mono font-black text-amber-300 text-base">₹{p.price}</div>
                            {hasDiscount && (
                              <div className="text-[10px] font-mono text-neutral-500 line-through">₹{p.originalPrice}</div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Row: Quantity + Add to Cart Button */}
                        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-amber-500/10">
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between bg-[#1a122e] rounded-xl p-1 border border-amber-500/20 w-28 flex-shrink-0">
                            <button
                              onClick={() => handleQtyChange(p.id, -1)}
                              disabled={!inStock || qty <= 0}
                              className="p-1 text-neutral-400 hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-mono font-bold text-white">
                              {inStock ? qty : 0}
                            </span>
                            <button
                              onClick={() => handleQtyChange(p.id, 1)}
                              disabled={!inStock || qty >= p.stock}
                              className="p-1 text-neutral-400 hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            disabled={!inStock}
                            onClick={() => {
                              const qtyToAdd = qty > 0 ? qty : 1;
                              onAddToCart(p, qtyToAdd);
                              setQuantities((prev) => ({ ...prev, [p.id]: 0 }));
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 flex-1 shadow-md ${
                              inStock
                                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-black active:scale-95'
                                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
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
              </div>
            ))}
          </div>

          {/* Desktop View: Table Grouped by Category */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-amber-500/20 bg-[#130d22]/90 shadow-2xl backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1b1230] border-b border-amber-500/20 text-amber-300 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Item Name / பொருள்</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Wholesale Price</th>
                  <th className="py-3.5 px-4 text-center">Qty</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10 text-xs">
                {groupedProducts.map((group) => (
                  <Fragment key={group.category}>
                    {/* Category Section Header Row */}
                    <tr className="bg-[#1c1233] border-y-2 border-amber-500/30">
                      <td colSpan={5} className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getCategoryGradient(group.category)} text-xs font-black uppercase tracking-wider shadow flex items-center gap-1.5`}>
                            <Flame className="w-3.5 h-3.5" />
                            <span>{group.category}</span>
                            {lang === 'ta' && (
                              <span className="font-normal opacity-90">({getCategoryTaName(group.category)})</span>
                            )}
                          </span>
                          <span className="text-xs font-mono text-amber-300/80 font-bold">
                            ({group.items.length} {lang === 'en' ? 'Items' : 'வகைகள்'})
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Category Items */}
                    {group.items.map((p) => {
                      const qty = getProductQty(p.id);
                      const inStock = p.stock > 0;
                      const hasDiscount = p.originalPrice ? p.originalPrice > p.price : false;

                      return (
                        <tr key={p.id} className="hover:bg-amber-500/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#1e1538] border border-amber-500/20 flex items-center justify-center p-1 flex-shrink-0">
                                <CrackerVisual type={p.image} className="w-full h-full object-contain" />
                              </div>
                              <div>
                                <span className="block font-sans font-bold text-white text-sm">
                                  {lang === 'en' ? p.nameEn : p.nameTa}
                                </span>
                                <span className="block text-[10px] text-neutral-400 sm:hidden">
                                  {p.category}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-mono font-black text-amber-300 text-sm">₹{p.price}</span>
                              {hasDiscount && (
                                <span className="text-[10px] font-mono text-neutral-500 line-through">₹{p.originalPrice}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5 bg-[#1a122e] rounded-lg p-1 border border-amber-500/20 w-24 mx-auto">
                              <button
                                onClick={() => handleQtyChange(p.id, -1)}
                                disabled={!inStock || qty <= 0}
                                className="p-1 text-neutral-400 hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-mono font-bold text-white">
                                {inStock ? qty : 0}
                              </span>
                              <button
                                onClick={() => handleQtyChange(p.id, 1)}
                                disabled={!inStock || qty >= p.stock}
                                className="p-1 text-neutral-400 hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              disabled={!inStock}
                              onClick={() => {
                                const qtyToAdd = qty > 0 ? qty : 1;
                                onAddToCart(p, qtyToAdd);
                                setQuantities((prev) => ({ ...prev, [p.id]: 0 }));
                              }}
                              className={`px-3.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md ${
                                inStock
                                  ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-black hover:scale-105 active:scale-95'
                                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                              }`}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{inStock ? translations.addToCart : translations.outOfStock}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Grid Layout Grouped by Category */
        <div className="space-y-10">
          {groupedProducts.map((group) => (
            <div key={group.category} className="space-y-5">
              {/* Category Header Banner */}
              <div className="flex items-center gap-3 pt-2 pb-2 border-b border-amber-500/20">
                <span className={`px-4 py-1.5 rounded-xl bg-gradient-to-r ${getCategoryGradient(group.category)} text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2`}>
                  <Flame className="w-4 h-4" />
                  <span>{group.category}</span>
                  {lang === 'ta' && (
                    <span className="font-normal opacity-90">({getCategoryTaName(group.category)})</span>
                  )}
                </span>
                <span className="text-xs font-mono font-bold text-amber-300/80">
                  ({group.items.length} {lang === 'en' ? 'Items' : 'வகைகள்'})
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-500/30 via-rose-500/20 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((p) => {
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
                      className="p-5 rounded-2xl bg-gradient-to-b from-[#18112b] to-[#110a20] border border-amber-500/20 hover:border-amber-400/80 hover:shadow-[0_0_30px_rgba(255,180,0,0.25)] transition-all duration-300 flex flex-col justify-between gap-4 group relative overflow-hidden"
                    >
                      {/* Accent colorful top stroke */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity" />

                      {/* Visual discount/featured badge */}
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                        {p.isFeatured && (
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-red-500 text-white text-[9px] uppercase font-mono font-black tracking-widest shadow-lg">
                            🔥 {lang === 'en' ? 'Bestseller' : 'சிறப்பு'}
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[9px] uppercase font-mono font-black tracking-widest flex items-center gap-1 shadow-lg">
                            <Tag className="w-2.5 h-2.5" />
                            {discountPct}% OFF
                          </span>
                        )}
                      </div>

                      {/* Vector Image Illustration Area */}
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#1f1638] border border-amber-500/10 relative flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-500/10 pointer-events-none" />
                        <CrackerVisual type={p.image} className="w-3/4 h-3/4 object-contain relative z-10" />
                        
                        {/* Backdrop stock indicator label */}
                        <div className="absolute bottom-3 right-3 z-10">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-bold ${
                            inStock 
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                              : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          }`}>
                            {inStock ? `Stock: ${p.stock}` : translations.outOfStock}
                          </span>
                        </div>
                      </div>

                      {/* Content Space */}
                      <div className="mt-2 space-y-2.5 flex-grow flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[9px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                            {p.category}
                          </span>
                          <h3 className="font-sans font-black uppercase text-base text-white group-hover:text-amber-300 transition-colors tracking-tight h-12 line-clamp-2">
                            {lang === 'en' ? p.nameEn : p.nameTa}
                          </h3>
                          <p className="text-xs text-neutral-300 line-clamp-2 h-8 font-sans leading-snug">
                            {lang === 'en' ? p.descriptionEn : p.descriptionTa}
                          </p>
                        </div>

                        {/* Price Row details */}
                        <div className="flex items-baseline gap-2 pt-2 border-t border-amber-500/20">
                          <span className="font-sans font-black text-xl text-amber-300 drop-shadow">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-neutral-400 line-through">
                              ₹{p.originalPrice?.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity + Add Cart Section */}
                      <div className="mt-2 pt-3 flex items-center justify-between gap-2 border-t border-amber-500/20">
                        
                        {/* Quantity adjustment logic */}
                        <div className="flex items-center rounded-xl bg-[#130b20] border border-amber-500/30 py-1.5 px-2">
                          <button
                            onClick={() => handleQtyChange(p.id, -1)}
                            disabled={!inStock || qty <= 0}
                            id={`pqty-dec-${p.id}`}
                            className="p-1 text-neutral-400 hover:text-amber-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
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
                            className="p-1 text-neutral-400 hover:text-amber-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Add action button */}
                        <button
                          disabled={!inStock}
                          onClick={() => {
                            const qtyToAdd = qty > 0 ? qty : 1;
                            onAddToCart(p, qtyToAdd);
                            setQuantities((prev) => ({ ...prev, [p.id]: 0 }));
                          }}
                          id={`pqty-add-${p.id}`}
                          className={`flex-grow flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                            inStock
                              ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:scale-[1.03] text-black font-extrabold shadow-[0_0_20px_rgba(255,180,0,0.3)] active:scale-[0.98]'
                              : 'bg-neutral-900 border border-neutral-800 text-neutral-500 cursor-not-allowed'
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
            </div>
          ))}
        </div>
      )}

    </section>
  );
}
