/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Product, Category, Order, Offer, Language, TranslationSchema } from '../types';
import CrackerVisual from './CrackerVisual';
import { 
  Package, ShoppingBag, Receipt, Tag, Plus, Edit, Trash2, 
  Download, RefreshCw, Layers, TrendingUp, CheckCircle, AlertCircle, X, Check 
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  offers: Offer[];
  categories: Category[];
  lang: Language;
  translations: TranslationSchema;
  onAddProduct: (prod: Omit<Product, 'id'>) => Promise<void>;
  onEditProduct: (pId: string, updated: Partial<Product>) => Promise<void>;
  onDeleteProduct: (pId: string) => Promise<void>;
  onUpdateOrderStatus: (oId: string, status: Order['status']) => Promise<void>;
  onAddOffer: (off: Omit<Offer, 'id'>) => Promise<void>;
  onToggleOffer: (id: string) => Promise<void>;
  onDeleteOffer: (id: string) => Promise<void>;
  onLogout?: () => void;
}

export default function AdminPanel({
  products,
  orders,
  offers,
  categories,
  lang,
  translations,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddOffer,
  onToggleOffer,
  onDeleteOffer,
  onLogout
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'catalog' | 'orders' | 'coupons'>('stats');
  
  // Local CRUD form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  
  // Product Form states
  const [nameEn, setNameEn] = useState('');
  const [nameTa, setNameTa] = useState('');
  const [category, setCategory] = useState<Category>('Sparklers');
  const [price, setPrice] = useState(100);
  const [origPrice, setOrigPrice] = useState(150);
  const [descEn, setDescEn] = useState('');
  const [descTa, setDescTa] = useState('');
  const [stock, setStock] = useState(100);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageType, setImageType] = useState('sparkler');
  const [useCustomImage, setUseCustomImage] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Coupon form states
  const [couponCode, setCouponCode] = useState('');
  const [couponOffset, setCouponOffset] = useState(15);
  const [minVal, setMinVal] = useState(1500);
  const [descOfferEn, setDescOfferEn] = useState('');
  const [descOfferTa, setDescOfferTa] = useState('');

  // Handle product save (Add or edit)
  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    const prodPayload = {
      nameEn,
      nameTa,
      category,
      price: Number(price),
      originalPrice: Number(origPrice) || undefined,
      descriptionEn: descEn,
      descriptionTa: descTa,
      stock: Number(stock),
      isFeatured,
      image: useCustomImage ? customImageUrl.trim() : imageType
    };

    try {
      if (editingProdId) {
        await onEditProduct(editingProdId, prodPayload);
        setEditingProdId(null);
      } else {
        await onAddProduct(prodPayload);
        setShowAddForm(false);
      }
      resetForm();
    } catch (err) {
      alert('Error updating catalog. Please try again.');
    }
  };

  const handleEditClick = (p: Product) => {
    setEditingProdId(p.id);
    setNameEn(p.nameEn);
    setNameTa(p.nameTa);
    setCategory(p.category);
    setPrice(p.price);
    setOrigPrice(p.originalPrice || p.price + 50);
    setDescEn(p.descriptionEn);
    setDescTa(p.descriptionTa);
    setStock(p.stock);
    setIsFeatured(!!p.isFeatured);
    
    const presets = [
      'sparkler', 'sparkler_multi', 'flowerpot_gold', 'flowerpot_color',
      'rocket_whistle', 'rocket_pack', 'bomb_green', 'bomb_red',
      'fancy_cake12', 'fancy_cake30', 'giftbox_silver', 'giftbox_gold',
      'kids_snake', 'kids_wheel', 'combo_double'
    ];
    if (p.image && (p.image.startsWith('http://') || p.image.startsWith('https://') || p.image.startsWith('/') || p.image.startsWith('data:') || !presets.includes(p.image))) {
      setImageType('sparkler');
      setCustomImageUrl(p.image);
      setUseCustomImage(true);
    } else {
      setImageType(p.image || 'sparkler');
      setCustomImageUrl('');
      setUseCustomImage(false);
    }
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNameEn('');
    setNameTa('');
    setCategory('Sparklers');
    setPrice(100);
    setOrigPrice(150);
    setDescEn('');
    setDescTa('');
    setStock(100);
    setIsFeatured(false);
    setImageType('sparkler');
    setUseCustomImage(false);
    setCustomImageUrl('');
  };

  // Add Promo Code
  const handleCreateCoupon = async (e: FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    try {
      await onAddOffer({
        code: couponCode.toUpperCase().replace(/\s+/g, ''),
        discountPercentage: Number(couponOffset),
        minOrderValue: Number(minVal),
        active: true,
        descriptionEn: descOfferEn || `${couponOffset}% off on orders above ₹${minVal}`,
        descriptionTa: descOfferTa || `₹${minVal}க்கு மேல் வாங்கும் ஆர்டர்களுக்கு ${couponOffset}% தள்ளுபடி`
      });
      setCouponCode('');
      setDescOfferEn('');
      setDescOfferTa('');
    } catch (err) {
      alert('Error adding coupon.');
    }
  };

  // Excel / CSV Export Logic
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    // Build CSV header matching pristine spreadsheets
    csvContent += "Order ID,Order Date,Customer Name,Mobile,Shipping Address,Discount Details,Items Breakdown,Total Revenue (INR),Status\r\n";

    orders.forEach((o) => {
      const itemsString = o.items.map(i => `${i.productNameEn || i.productId} (x${i.quantity})`).join(' | ');
      const formattedDate = new Date(o.createdAt).toLocaleString('en-IN');
      const safeAddress = o.address.replace(/"/g, '""').replace(/[\r\n]+/g, ' ');
      
      const row = [
        o.id,
        `"${formattedDate}"`,
        `"${o.customerName}"`,
        `"${o.mobile}"`,
        `"${safeAddress}"`,
        o.notes ? `"${o.notes}"` : '"None"',
        `"${itemsString}"`,
        o.totalAmount,
        o.status
      ].join(',');

      csvContent += row + "\r\n";
    });

    // Create virtual download element
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Garudan_Crackers_Orders_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Advanced Stats Calculation
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const dispatchCount = orders.filter(o => o.status === 'Delivered').length;
  const lowStockProds = products.filter(p => p.stock <= 20);

  return (
    <div className="py-12 bg-neutral-950 text-white min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold font-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              {lang === 'en' ? 'Administrative Operations Panel' : 'நிர்வாக கட்டுப்பாட்டு மையம்'}
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              Garudan Core Control Base • Active Session Secure Access
            </p>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === 'orders' && (
              <button
                onClick={handleExportCSV}
                id="export-orders-btn"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold font-sans text-xs rounded-xl shadow-[0_4px_15px_rgba(39,174,96,0.3)] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Orders to Excel</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                id="admin-logout-btn"
                className="px-4 py-2 bg-red-950/40 text-red-400 hover:bg-red-650 hover:text-neutral-950 text-xs font-bold font-sans rounded-xl border border-red-500/20 transition-all cursor-pointer"
              >
                {lang === 'en' ? 'Terminate Session' : 'வெளியேறு'}
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Bars */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-900 pb-2">
          {[
            { id: 'stats', label: lang === 'en' ? 'Business Overview' : 'புள்ளியியல்', icon: TrendingUp },
            { id: 'catalog', label: lang === 'en' ? 'Edit Products' : 'கையிருப்பு திருத்தம்', icon: Package },
            { id: 'orders', label: lang === 'en' ? `Customer Orders (${orders.length})` : `ஆர்டர்கள் (${orders.length})`, icon: ShoppingBag },
            { id: 'coupons', label: lang === 'en' ? 'Manage Offers' : 'சலுகைகள்', icon: Tag }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setShowAddForm(false);
                  setEditingProdId(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold font-sans transition-all ${
                  isSel
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================== STATS OVERVIEW ==================== */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-850">
                <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Total Sales Cashflow</span>
                <span className="block text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 mt-2">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
                <span className="block text-[10px] text-emerald-400 mt-1">From active ledger</span>
              </div>

              <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-850">
                <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Incoming Orders count</span>
                <span className="block text-3xl font-extrabold text-white mt-2">{orders.length}</span>
                <span className="block text-[10px] text-amber-500 mt-1">{pendingOrdersCount} pending dispatch</span>
              </div>

              <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-850">
                <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Fulfilled Shipments</span>
                <span className="block text-3xl font-extrabold text-emerald-400 mt-2">{dispatchCount}</span>
                <span className="block text-[10px] text-neutral-500 mt-1">Safely home-delivered</span>
              </div>

              <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-850">
                <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Low Stock Alerts</span>
                <span className="block text-3xl font-extrabold text-red-500 mt-2">{lowStockProds.length}</span>
                <span className="block text-[10px] text-red-400/80 mt-1">Needs urgent topup</span>
              </div>

            </div>

            {/* Warn Panel */}
            {lowStockProds.length > 0 && (
              <div className="p-4 bg-red-950/40 rounded-xl border border-red-950 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block font-sans font-bold text-sm text-red-200">Reorder Stock Warning</span>
                  <div className="text-xs text-neutral-400 flex flex-wrap gap-2">
                    {lowStockProds.map(p => (
                      <span key={p.id} className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-850">
                        {p.nameEn} ({p.stock} left)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== CATALOG MANAGEMENT ==================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Header with trigger */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold font-sans text-neutral-200">
                {editingProdId ? 'Modify Product Specifications' : 'Garudan Product Vault'}
              </h2>
              <button
                onClick={() => {
                  setEditingProdId(null);
                  resetForm();
                  setShowAddForm(!showAddForm);
                }}
                id="admin-catalog-add-trigger"
                className="flex items-center gap-1 px-4 py-2 bg-amber-500 text-neutral-950 font-bold font-sans text-xs rounded-xl hover:bg-amber-400 transition-all"
              >
                {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{showAddForm ? 'Cancel Form' : 'Register New Cracker'}</span>
              </button>
            </div>

            {/* Interactive Add/Edit Form Overlay wrapper */}
            {showAddForm && (
              <form onSubmit={handleSaveProduct} className="p-6 bg-neutral-900 rounded-2xl border border-amber-500/10 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                
                <div>
                  <label className="block text-xs text-neutral-400 mb-1 font-semibold">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Mega Electric FlowerPot"
                    className="w-full px-3 py-2 text-sm rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1 font-semibold">Product Name (Tamil / தமிழ்) *</label>
                  <input
                    type="text"
                    required
                    value={nameTa}
                    onChange={(e) => setNameTa(e.target.value)}
                    placeholder="பெரிய மின்சார பூந்தொட்டி"
                    className="w-full px-3 py-2 text-sm rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1 font-semibold">Category Type *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 text-sm rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 p-4 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <span className="block text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">Product Image / Visual Specification</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="image_source_option"
                          checked={!useCustomImage}
                          onChange={() => setUseCustomImage(false)}
                          className="w-3.5 h-3.5 accent-[#D4AF37]"
                        />
                        <span>Vector Motif Preset</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="image_source_option"
                          checked={useCustomImage}
                          onChange={() => setUseCustomImage(true)}
                          className="w-3.5 h-3.5 accent-[#D4AF37]"
                        />
                        <span>Custom Image URL</span>
                      </label>
                    </div>
                  </div>

                  {!useCustomImage ? (
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-1 font-mono uppercase tracking-widest">Select Graphic Motif Preset *</label>
                      <select
                        value={imageType}
                        onChange={(e) => setImageType(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                      >
                        {[
                          { val: 'sparkler', lbl: 'Golden Sparkler Wire' },
                          { val: 'sparkler_multi', lbl: 'Tri-Colour Premium Sparkler' },
                          { val: 'flowerpot_gold', lbl: 'Large Golden Clay Cone' },
                          { val: 'flowerpot_color', lbl: 'Deluxe Color Fountain Pot' },
                          { val: 'rocket_whistle', lbl: 'Whistling High Flyer Rocket' },
                          { val: 'rocket_pack', lbl: 'Multi Sky Circular Chaser Pack' },
                          { val: 'bomb_green', lbl: 'Green-Threaded Hydro Bomb' },
                          { val: 'bomb_red', lbl: 'Red Ground King Kong Bomb' },
                          { val: 'fancy_cake12', lbl: '12-Shot Luxury Aerial Cake' },
                          { val: 'fancy_cake30', lbl: '30-Shot Golden Willow Cake' },
                          { val: 'giftbox_silver', lbl: 'Silver Starter Treasure Chest' },
                          { val: 'giftbox_gold', lbl: 'Royal Empress Golden Gift chest' },
                          { val: 'kids_snake', lbl: 'Noiseless Carbon Serpents Pellets' },
                          { val: 'kids_wheel', lbl: 'Spit-Fire Concentric Spinning Wheel' },
                          { val: 'combo_double', lbl: 'Super Mega Combo' },
                        ].map(opt => (
                          <option key={opt.val} value={opt.val}>{opt.lbl}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-1 font-mono uppercase tracking-widest">Custom Product Image Link (HTTP URL / base64 string) *</label>
                      <input
                        type="text"
                        required
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="e.g. https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500"
                        className="w-full px-3 py-2 text-sm rounded bg-neutral-900 border border-neutral-800 text-[#D4AF37] font-mono focus:outline-none focus:border-amber-500 placeholder-neutral-700"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1 font-semibold">Offer Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1 font-semibold">Original Price / MRP (₹ INR)</label>
                  <input
                    type="number"
                    value={origPrice}
                    onChange={(e) => setOrigPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1 font-semibold">Current Stock count *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                  />
                </div>

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="isFeaturedToggle"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 bg-neutral-950 border border-neutral-800 rounded checked:bg-amber-500 checked:border-amber-500"
                  />
                  <label htmlFor="isFeaturedToggle" className="text-xs text-neutral-400 ml-2 select-none">
                    Feature on Home page Highlights carousel
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-neutral-400 mb-1 font-semibold">Detailed Description (English)</label>
                  <textarea
                    rows={2}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-neutral-400 mb-1 font-semibold">Detailed Description (Tamil / தமிழ்)</label>
                  <textarea
                    rows={2}
                    value={descTa}
                    onChange={(e) => setDescTa(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProdId(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-500 text-neutral-950 font-bold font-sans text-xs rounded-xl hover:bg-amber-400 cursor-pointer"
                  >
                    {editingProdId ? 'Update Specifications' : 'Commit New Cracker'}
                  </button>
                </div>

              </form>
            )}

            {/* Catalog Grid list */}
            <div className="overflow-x-auto bg-neutral-900 rounded-xl border border-neutral-850">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-neutral-950/80 text-[10px] uppercase font-mono tracking-wider text-amber-500 border-b border-neutral-850">
                  <tr>
                    <th className="p-4">Visual Motif</th>
                    <th className="p-4">English Name</th>
                    <th className="p-4">Tamil Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-950 font-sans">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-850/40 transition-colors">
                      <td className="p-4">
                        <div className="w-10 h-10 rounded bg-neutral-950 p-0.5 border border-neutral-800">
                          <CrackerVisual type={p.image} />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-neutral-100">{p.nameEn}</td>
                      <td className="p-4 text-neutral-300">{p.nameTa}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-neutral-950 text-[10px] uppercase font-mono text-neutral-400 rounded-full border border-neutral-800">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-amber-400">₹{p.price}</td>
                      <td className="p-4">
                        <span className={`font-mono text-xs font-bold ${p.stock <= 20 ? 'text-red-500 font-extrabold' : 'text-neutral-300'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditClick(p)}
                            id={`edit-item-${p.id}`}
                            className="p-1 px-2.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-neutral-950 text-xs font-medium transition-all flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              if (confirm(`Confirm permanent erasure of ${p.nameEn}?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            id={`delete-item-${p.id}`}
                            className="p-1 px-2.5 rounded bg-red-950/45 text-red-400 hover:bg-red-650 hover:text-neutral-950 text-xs font-medium transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ==================== CUSTOMER ORDERS ==================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-bold font-sans text-neutral-200">
                Dispatch & Order Fulfillment System
              </h2>
              <span className="text-xs text-neutral-500 font-mono">
                Total Logs: {orders.length}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-850">
                <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3 animate-bounce" />
                <p className="text-sm text-neutral-400">No customer orders have been logged yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => {
                  const safeDate = new Date(o.createdAt).toLocaleString('en-IN');
                  return (
                    <div
                      key={o.id}
                      id={`order-log-${o.id}`}
                      className="p-5 rounded-2xl bg-neutral-900 border border-neutral-850 hover:border-neutral-800 transition-all font-sans space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-850 pb-3">
                        <div className="space-y-0.5">
                          <span className="block font-mono text-amber-500 text-xs font-bold uppercase">
                            Order Block #{o.id}
                          </span>
                          <span className="block text-[11px] text-neutral-500">
                            Registered: {safeDate}
                          </span>
                        </div>

                        {/* Status Select actionizer */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400 font-semibold uppercase font-mono">Fulfillment Status:</span>
                          <select
                            value={o.status}
                            id={`status-select-${o.id}`}
                            onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg focus:outline-none cursor-pointer ${
                              o.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                              o.status === 'Committed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                              o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            <option value="Pending" className="bg-neutral-950 text-amber-400">Pending Alert</option>
                            <option value="Committed" className="bg-neutral-950 text-blue-400 font-bold">Committed (Paid)</option>
                            <option value="Delivered" className="bg-neutral-950 text-emerald-400">Delivered</option>
                            <option value="Cancelled" className="bg-neutral-950 text-red-400">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Details specs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        
                        {/* Customer billing address */}
                        <div className="space-y-1">
                          <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">Consignee Coordinates</span>
                          <div className="text-sm space-y-1">
                            <span className="block font-bold text-neutral-200">{o.customerName}</span>
                            <span className="block text-amber-400 font-mono text-xs">{o.mobile}</span>
                            <span className="block text-xs text-neutral-400 leading-relaxed max-w-xs">{o.address}</span>
                          </div>
                        </div>

                        {/* Item list */}
                        <div className="space-y-1 md:col-span-2">
                          <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">Reserves Itemsized Manifest</span>
                          <div className="space-y-1.5 pt-1.5">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs text-neutral-300">
                                <span>• {item.productNameEn || item.productId} <span className="text-neutral-500 text-[10px]">x{item.quantity}</span></span>
                                <span className="font-mono text-neutral-400">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                            {o.notes && (
                              <div className="mt-2 p-2 bg-neutral-950 rounded text-[11px] text-amber-300/80 border border-neutral-850">
                                <span className="font-bold block">Consignees courier notes:</span> {o.notes}
                              </div>
                            )}
                            <div className="border-t border-neutral-800/80 pt-2 flex justify-between items-center text-sm">
                              <span className="font-bold text-white">Grand settlement value</span>
                              <span className="font-mono font-extrabold text-amber-400">₹{o.totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== COUPONS & DISCOUNTS ==================== */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Create Coupon form */}
            <form onSubmit={handleCreateCoupon} className="lg:col-span-4 p-5 bg-neutral-900 rounded-2xl border border-neutral-850 space-y-4 h-fit">
              <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-amber-500">
                Register Coupon Code
              </h2>

              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-semibold">Promotion Code Name *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. SIVAKASI50"
                  className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-semibold">Discount Percentage (%) *</label>
                <input
                  type="number"
                  required
                  value={couponOffset}
                  onChange={(e) => setCouponOffset(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-semibold">Minimum Purchase Value (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={minVal}
                  onChange={(e) => setMinVal(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-semibold">Description En *</label>
                <input
                  type="text"
                  required
                  value={descOfferEn}
                  onChange={(e) => setDescOfferEn(e.target.value)}
                  placeholder="Flat 15% discount savings"
                  className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-semibold">Description Ta *</label>
                <input
                  type="text"
                  required
                  value={descOfferTa}
                  onChange={(e) => setDescOfferTa(e.target.value)}
                  placeholder="15% அதிரடி தள்ளுபடி"
                  className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-550"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-sans font-bold text-xs rounded-lg transition-all"
              >
                Assemble Promotional Code
              </button>
            </form>

            {/* Coupons list */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-neutral-400">
                Active Campaign Coupons
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((off) => (
                  <div
                    key={off.id}
                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-850 flex flex-col justify-between space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 bg-amber-500/10 text-amber-400 font-mono text-xs font-bold rounded border border-amber-500/20">
                          {off.code}
                        </span>
                        <span className="block text-xs text-neutral-300 font-medium">
                          Min value: ₹{off.minOrderValue}
                        </span>
                      </div>

                      {/* Active Status pill */}
                      <button
                        onClick={() => onToggleOffer(off.id)}
                        className={`p-1 px-2 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                          off.active
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-950/80 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {off.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{off.active ? 'ACTIVE' : 'INACTIVE'}</span>
                      </button>
                    </div>

                    <div className="space-y-0.5 text-xs text-neutral-400 border-t border-neutral-850 pt-2">
                      <span className="block italic">“{off.descriptionEn}”</span>
                      <span className="block font-sans text-[11px] text-neutral-500">“{off.descriptionTa}”</span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="font-sans font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">
                        {off.discountPercentage}% OFF
                      </span>

                      <button
                        onClick={() => onDeleteOffer(off.id)}
                        id={`delete-offer-${off.id}`}
                        className="p-1 px-2.5 rounded bg-red-950/40 text-red-400 hover:bg-neutral-800 transition-all text-xs"
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
