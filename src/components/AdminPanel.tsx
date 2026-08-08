/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, ChangeEvent, DragEvent } from 'react';
import { Product, Category, Order, Offer, Language, TranslationSchema } from '../types';
import CrackerVisual from './CrackerVisual';
import { 
  Package, ShoppingBag, Receipt, Tag, Plus, Edit, Trash2, 
  Download, RefreshCw, Layers, TrendingUp, CheckCircle, AlertCircle, X, Check,
  Upload, UploadCloud, Image as ImageIcon, Link as LinkIcon, FileImage, Sparkles
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
  onDeleteOrder?: (oId: string) => Promise<void>;
  onClearAllOrders?: () => Promise<void>;
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
  onDeleteOrder,
  onClearAllOrders,
  onAddOffer,
  onToggleOffer,
  onDeleteOffer,
  onLogout
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'catalog' | 'orders' | 'coupons'>('stats');
  
  // Local CRUD form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);

  // Deletion confirmation dialog states
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProd, setIsDeletingProd] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [isDeletingOffer, setIsDeletingOffer] = useState(false);
  
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
  const [useCustomImage, setUseCustomImage] = useState(true);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageSourceMode, setImageSourceMode] = useState<'file' | 'preset' | 'url'>('file');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Helper to read local image file and compress into base64 data URL
  const compressAndReadImageFile = (file: File): Promise<{ dataUrl: string; fileName: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!file.type.startsWith('image/')) {
          resolve({ dataUrl: result, fileName: file.name });
          return;
        }

        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 900;
          let width = img.width;
          let height = img.height;

          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.88);
            resolve({ dataUrl: compressed, fileName: file.name });
          } else {
            resolve({ dataUrl: result, fileName: file.name });
          }
        };
        img.onerror = () => resolve({ dataUrl: result, fileName: file.name });
        img.src = result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileSelect = async (file: File | undefined) => {
    if (!file) return;
    setIsProcessingImage(true);
    try {
      const res = await compressAndReadImageFile(file);
      setCustomImageUrl(res.dataUrl);
      setUploadedFileName(res.fileName);
      setUseCustomImage(true);
      setImageSourceMode('file');
    } catch (err) {
      console.error('Failed reading image file:', err);
      alert('Could not process selected image file. Please try another picture.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Coupon form states
  const [couponCode, setCouponCode] = useState('');
  const [couponOffset, setCouponOffset] = useState(15);
  const [minVal, setMinVal] = useState(1500);
  const [descOfferEn, setDescOfferEn] = useState('');
  const [descOfferTa, setDescOfferTa] = useState('');

  // Handle product save (Add or edit)
  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (useCustomImage && !customImageUrl.trim()) {
      alert('Please upload or select an image file for this product.');
      return;
    }

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
      if (p.image.startsWith('data:')) {
        setImageSourceMode('file');
        setUploadedFileName('Uploaded Product Image');
      } else if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
        setImageSourceMode('url');
        setUploadedFileName('');
      } else {
        setImageSourceMode('file');
        setUploadedFileName('Product Image File');
      }
    } else {
      setImageType(p.image || 'sparkler');
      setCustomImageUrl('');
      setUseCustomImage(false);
      setImageSourceMode('preset');
      setUploadedFileName('');
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
    setUseCustomImage(true);
    setImageSourceMode('file');
    setCustomImageUrl('');
    setUploadedFileName('');
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
              <>
                <button
                  onClick={handleExportCSV}
                  id="export-orders-btn"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold font-sans text-xs rounded-xl shadow-[0_4px_15px_rgba(39,174,96,0.3)] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Orders to Excel</span>
                </button>

                {onClearAllOrders && orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm(lang === 'en' ? 'Are you sure you want to clear all sales history orders?' : 'அனைத்து ஆர்டர் பதிவுகளையும் நீக்க விரும்புகிறீர்களா?')) {
                        onClearAllOrders();
                      }
                    }}
                    id="clear-all-orders-btn"
                    className="flex items-center gap-2 px-4 py-2 bg-rose-900/60 hover:bg-rose-600 text-rose-200 hover:text-white font-bold font-sans text-xs rounded-xl border border-rose-500/30 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Clear Sales History' : 'விற்பனை வரலாற்றை நீக்கு'}</span>
                  </button>
                )}
              </>
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

                <div className="md:col-span-2 p-4 bg-neutral-950 rounded-xl border border-neutral-800/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                    <span className="block text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Product Image Source</span>
                    </span>
                    <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                      <button
                        type="button"
                        onClick={() => {
                          setImageSourceMode('file');
                          setUseCustomImage(true);
                        }}
                        className={`px-3 py-1 rounded text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                          imageSourceMode === 'file' && useCustomImage
                            ? 'bg-amber-500 text-neutral-950 shadow-md'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>My Device Files</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setImageSourceMode('url');
                          setUseCustomImage(true);
                        }}
                        className={`px-3 py-1 rounded text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                          imageSourceMode === 'url' && useCustomImage
                            ? 'bg-amber-500 text-neutral-950 shadow-md'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Web URL</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setImageSourceMode('preset');
                          setUseCustomImage(false);
                        }}
                        className={`px-3 py-1 rounded text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                          !useCustomImage
                            ? 'bg-amber-500 text-neutral-950 shadow-md'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Preset Motif</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: Import from Device Files */}
                  {imageSourceMode === 'file' && useCustomImage && (
                    <div className="space-y-3">
                      {customImageUrl && customImageUrl.startsWith('data:') ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-neutral-900/90 rounded-xl border border-amber-500/30">
                          <div className="w-24 h-24 rounded-lg bg-black border border-neutral-700 overflow-hidden flex items-center justify-center p-1 shrink-0 relative group">
                            <img 
                              src={customImageUrl} 
                              alt="Product Preview" 
                              className="w-full h-full object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 space-y-1 text-center sm:text-left min-w-0">
                            <div className="flex items-center gap-2 justify-center sm:justify-start text-emerald-400 text-xs font-bold font-mono">
                              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>Image File Loaded Successfully</span>
                            </div>
                            <p className="text-xs text-white font-semibold truncate">
                              {uploadedFileName || 'Custom Local File'}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-mono">
                              Stored directly in product catalog
                            </p>
                            <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                              <label 
                                htmlFor="product-file-upload-replace"
                                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 hover:text-white rounded-lg text-xs font-bold cursor-pointer transition-all border border-neutral-700 flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Choose Different File</span>
                              </label>
                              <input
                                type="file"
                                id="product-file-upload-replace"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageFileSelect(e.target.files?.[0])}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomImageUrl('');
                                  setUploadedFileName('');
                                }}
                                className="px-2.5 py-1.5 text-red-400 hover:text-red-300 text-xs font-bold hover:bg-red-950/40 rounded-lg transition-all"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                          onDrop={(e: DragEvent<HTMLDivElement>) => {
                            e.preventDefault();
                            handleImageFileSelect(e.dataTransfer.files?.[0]);
                          }}
                          className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-neutral-900/60 hover:bg-neutral-900 rounded-2xl p-6 text-center transition-all group cursor-pointer"
                          onClick={() => {
                            document.getElementById('product-file-upload-main')?.click();
                          }}
                        >
                          <input
                            type="file"
                            id="product-file-upload-main"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageFileSelect(e.target.files?.[0])}
                          />

                          <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-amber-500/10 rounded-full text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                              <UploadCloud className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-white">
                                {isProcessingImage ? 'Processing image file...' : 'Click or Drag & Drop Product Photo Here'}
                              </p>
                              <p className="text-xs text-neutral-400 font-sans">
                                Import images directly from your computer, phone, or local files (.PNG, .JPG, .WEBP)
                              </p>
                            </div>
                            <button
                              type="button"
                              disabled={isProcessingImage}
                              className="mt-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <FileImage className="w-4 h-4" />
                              <span>Browse Files from Device</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode 2: Custom Online Web URL */}
                  {imageSourceMode === 'url' && useCustomImage && (
                    <div className="space-y-2">
                      <label className="block text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                        Custom Online Image Link (HTTPS Image URL) *
                      </label>
                      <input
                        type="text"
                        required={imageSourceMode === 'url'}
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="e.g. https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500"
                        className="w-full px-3 py-2 text-sm rounded bg-neutral-900 border border-neutral-800 text-[#D4AF37] font-mono focus:outline-none focus:border-amber-500 placeholder-neutral-700"
                      />
                      {customImageUrl && (
                        <div className="flex items-center gap-3 pt-2">
                          <div className="w-12 h-12 rounded bg-black border border-neutral-700 overflow-hidden shrink-0">
                            <img src={customImageUrl} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-xs text-emerald-400 font-mono font-bold">Image URL linked</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode 3: Vector Motif Preset */}
                  {!useCustomImage && (
                    <div className="space-y-2">
                      <label className="block text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                        Select Graphic Motif Preset *
                      </label>
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

                <div className="md:col-span-2 flex items-center justify-between pt-3 border-t border-neutral-800">
                  {editingProdId ? (
                    <button
                      type="button"
                      id="edit-form-delete-btn"
                      onClick={() => {
                        const match = products.find(p => p.id === editingProdId);
                        if (match) setProductToDelete(match);
                      }}
                      className="px-4 py-2 bg-red-950/60 hover:bg-red-600 text-red-400 hover:text-white font-bold font-sans text-xs rounded-xl border border-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-red-950/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Product</span>
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingProdId(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
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
                            className="p-1 px-2.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-neutral-950 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => setProductToDelete(p)}
                            id={`delete-item-${p.id}`}
                            className="p-1 px-2.5 rounded bg-red-950/60 text-red-400 hover:bg-red-600 hover:text-white text-xs font-medium transition-all flex items-center gap-1 cursor-pointer border border-red-500/30"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
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

                        {/* Status Select actionizer & Delete button */}
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

                          {onDeleteOrder && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete order ${o.id}?`)) {
                                  onDeleteOrder(o.id);
                                }
                              }}
                              title="Delete Order Log"
                              className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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
                        onClick={() => setOfferToDelete(off)}
                        id={`delete-offer-${off.id}`}
                        className="p-1 px-2.5 rounded bg-red-950/60 text-red-400 hover:bg-red-600 hover:text-white transition-all text-xs font-bold cursor-pointer border border-red-500/30"
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

      {/* ==================== CONFIRM PRODUCT DELETION MODAL ==================== */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl shadow-red-950/70">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-950/80 rounded-full border border-red-500/40">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-white">Delete Product</h3>
                <p className="text-xs text-neutral-400 font-mono">Irreversible Catalog Removal</p>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <p className="text-sm font-semibold text-neutral-200">
                Are you sure you want to delete this product?
              </p>
              <p className="text-xs font-bold text-amber-400">
                “{productToDelete.nameEn} ({productToDelete.nameTa})”
              </p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                This item will be permanently deleted from your database, home showcase, and store catalog.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingProd}
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold font-sans transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-product-delete-btn"
                disabled={isDeletingProd}
                onClick={async () => {
                  setIsDeletingProd(true);
                  try {
                    await onDeleteProduct(productToDelete.id);
                    if (editingProdId === productToDelete.id) {
                      setShowAddForm(false);
                      setEditingProdId(null);
                      resetForm();
                    }
                  } catch (err) {
                    console.error('Error during product deletion:', err);
                  } finally {
                    setIsDeletingProd(false);
                    setProductToDelete(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider font-sans transition-all cursor-pointer border border-red-400/40 shadow-lg shadow-red-950/60 flex items-center gap-1.5"
              >
                {isDeletingProd ? 'Deleting...' : 'Yes, Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CONFIRM OFFER DELETION MODAL ==================== */}
      {offerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl shadow-red-950/70">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-950/80 rounded-full border border-red-500/40">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-white">Delete Offer Code</h3>
                <p className="text-xs text-neutral-400 font-mono">Irreversible Coupon Removal</p>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <p className="text-sm font-semibold text-neutral-200">
                Are you sure you want to delete this promo coupon?
              </p>
              <p className="text-xs font-bold text-amber-400">
                Code: “{offerToDelete.code}” ({offerToDelete.discountPercentage}% OFF)
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingOffer}
                onClick={() => setOfferToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold font-sans transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-offer-delete-btn"
                disabled={isDeletingOffer}
                onClick={async () => {
                  setIsDeletingOffer(true);
                  try {
                    await onDeleteOffer(offerToDelete.id);
                  } catch (err) {
                    console.error('Error during offer deletion:', err);
                  } finally {
                    setIsDeletingOffer(false);
                    setOfferToDelete(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider font-sans transition-all cursor-pointer border border-red-400/40 shadow-lg shadow-red-950/60 flex items-center gap-1.5"
              >
                {isDeletingOffer ? 'Deleting...' : 'Yes, Delete Offer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
