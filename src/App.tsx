/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, Offer, Language } from './types';
import { TRANSLATIONS, INITIAL_PRODUCTS, FESTIVAL_OFFERS, REVIEWS } from './data';
import FireworksCanvas from './components/FireworksCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductSection from './components/ProductSection';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import AdminLoginGate from './components/AdminLoginGate';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import FloatingCartBar from './components/FloatingCartBar';
import CrackerVisual from './components/CrackerVisual';
import { 
  Sparkles, ShieldCheck, Flame, MessageSquare, Award, 
  Trash2, Plus, Minus, ArrowRight, Star, ShoppingCart, Percent
} from 'lucide-react';

export default function App() {
  // Navigation & Language States
  const [lang, setLang] = useState<Language>('en');
  const [route, setRoute] = useState<'home' | 'products' | 'contact' | 'admin'>('products');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('garudan_admin_authenticated') === 'true';
  });

  // Dynamic Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>(FESTIVAL_OFFERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastAddedItem, setLastAddedItem] = useState<{ name: string; quantity: number } | null>(null);

  const t = TRANSLATIONS[lang];

  // Load Initial Data from our Fullstack Backend
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Load products
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData && prodData.length) setProducts(prodData);
        }

        // Load orders
        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData || []);
        }

        // Load offers
        const offRes = await fetch('/api/offers');
        if (offRes.ok) {
          const offData = await offRes.json();
          if (offData && offData.length) setOffers(offData);
        }
      } catch (err) {
        console.warn('Network endpoints offline, running with offline seed values as fallback.', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Recover Cart Items from localStorage (Offline Persistent support)
    const localCart = localStorage.getItem('garudan_cart_ledger');
    if (localCart) {
      try {
        setCart(JSON.parse(localCart));
      } catch (ex) {
        console.error('Error recovering cart from disk', ex);
      }
    }
  }, []);

  // Sync Cart with localStorage
  const syncCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('garudan_cart_ledger', JSON.stringify(updatedCart));
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product, quantity: number) => {
    const existing = cart.find(item => item.product.id === product.id);
    let updated: CartItem[];

    if (existing) {
      updated = cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
          : item
      );
    } else {
      updated = [...cart, { product, quantity }];
    }

    syncCart(updated);
    setLastAddedItem({
      name: lang === 'en' ? product.nameEn : product.nameTa,
      quantity
    });
  };

  // Update Cart Item quantity
  const handleUpdateCartQty = (pId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(pId);
      return;
    }

    const matchedP = products.find(p => p.id === pId);
    if (!matchedP) return;

    // Check if within bounds of actual stock level
    const maxQty = matchedP.stock;
    const safeQty = Math.min(maxQty, quantity);

    const updated = cart.map(item => 
      item.product.id === pId ? { ...item, quantity: safeQty } : item
    );
    syncCart(updated);
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (pId: string) => {
    const updated = cart.filter(item => item.product.id !== pId);
    syncCart(updated);
  };

  // Place Order checkout handler
  const handleSubmitOrder = async (details: {
    customerName: string;
    mobile: string;
    address: string;
    notes?: string;
    couponApplied?: string;
  }) => {
    // Collect order details
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    const rawSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    let discountPercent = 0;
    if (details.couponApplied) {
      const parsedOffer = offers.find(o => o.code === details.couponApplied && o.active);
      if (parsedOffer && rawSubtotal >= parsedOffer.minOrderValue) {
        discountPercent = parsedOffer.discountPercentage;
      }
    }
    const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
    const finalTotal = rawSubtotal - discountAmount;

    const payload = {
      customerName: details.customerName,
      mobile: details.mobile,
      address: details.address,
      notes: details.notes,
      items: orderItems,
      totalAmount: finalTotal
    };

    console.log('====================================================');
    console.log('📲 [PROCESSING WHATSAPP ORDER PAYLOAD]:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('====================================================');

    // Build URL-encoded WhatsApp message string with order details
    let waText = `*GARUDAN FIREWORKS - NEW ORDER*\n\n`;
    waText += `*Customer:* ${details.customerName}\n`;
    waText += `*Mobile:* ${details.mobile}\n`;
    waText += `*Delivery Address:* ${details.address}\n`;
    if (details.notes) {
      waText += `*Notes:* ${details.notes}\n`;
    }
    waText += `\n*ORDER ITEMS:*\n`;
    cart.forEach((item, index) => {
      waText += `${index + 1}. *${item.product.nameEn}* (${item.product.nameTa}) x ${item.quantity} = ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}\n`;
    });
    waText += `\n*SUMMARY:*\n`;
    waText += `Subtotal: ₹${rawSubtotal.toLocaleString('en-IN')}\n`;
    if (discountAmount > 0) {
      waText += `Discount (${details.couponApplied}): -₹${discountAmount.toLocaleString('en-IN')}\n`;
    }
    waText += `*Total Amount:* ₹${finalTotal.toLocaleString('en-IN')}\n\n`;
    waText += `🎇 Thank you for choosing Garudan Crackers!`;

    const waUrl = `https://wa.me/919092268462?text=${encodeURIComponent(waText)}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('📡 [handleSubmitOrder] API Response status:', res.status, res.statusText);

      if (res.ok) {
        const orderData = await res.json();
        console.log('✅ [handleSubmitOrder] Order registered successfully on backend:', orderData);
        
        // Clean cart locally
        syncCart([]);

        // Lower stock levels locally for responsive UI
        const updatedProducts = products.map(p => {
          const matchCart = cart.find(c => c.product.id === p.id);
          if (matchCart) {
            return { ...p, stock: Math.max(0, p.stock - matchCart.quantity) };
          }
          return p;
        });
        setProducts(updatedProducts);

        // Fetch refreshed orders set
        const updatedOrdRes = await fetch('/api/orders');
        if (updatedOrdRes.ok) {
          const ordList = await updatedOrdRes.json();
          setOrders(ordList);
        }

        return { success: true, orderId: orderData.id, waUrl };
      } else {
        const errorText = await res.text();
        console.error('❌ [handleSubmitOrder] API Error response:', res.status, errorText);
      }
    } catch (err) {
      console.error('❌ [handleSubmitOrder] Network error submitting order:', err);
    }

    return { success: false, waUrl };
  };

  // --- ADMINISTRATOR CARDINAL CONTROLS ---

  // Add Product to database
  const handleAdminAddProduct = async (prodPayload: Omit<Product, 'id'>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodPayload)
      });
      if (res.ok) {
        const returnedProd = await res.json();
        setProducts([...products, returnedProd]);
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  // Edit Product
  const handleAdminEditProduct = async (pId: string, updatedParams: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${pId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedParams)
      });
      if (res.ok) {
        const editedProd = await res.json();
        setProducts(products.map(p => p.id === editedProd.id ? editedProd : p));
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  // Delete Product
  const handleAdminDeleteProduct = async (pId: string) => {
    try {
      console.log(`🗑️ [handleAdminDeleteProduct] Deleting product ${pId}...`);
      const res = await fetch(`/api/products/${pId}`, { method: 'DELETE' });
      if (res.ok) {
        console.log(`✅ [handleAdminDeleteProduct] Product ${pId} deleted successfully from server.`);
        setProducts(prev => prev.filter(p => p.id !== pId));
      } else {
        console.error('❌ [handleAdminDeleteProduct] Server returned error status:', res.status);
      }
    } catch (ex) {
      console.error('❌ [handleAdminDeleteProduct] Network error during deletion:', ex);
    }
  };

  // Update Status order
  const handleAdminUpdateStatus = async (oId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${oId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const editedOrder = await res.json();
        setOrders(orders.map(o => o.id === editedOrder.id ? editedOrder : o));
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  // Delete single order
  const handleAdminDeleteOrder = async (oId: string) => {
    try {
      const res = await fetch(`/api/orders/${oId}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== oId));
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  // Clear all sales history orders
  const handleAdminClearAllOrders = async () => {
    try {
      const res = await fetch('/api/orders', { method: 'DELETE' });
      if (res.ok) {
        setOrders([]);
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  // Register Coupon
  const handleAdminAddOffer = async (offerPayload: Omit<Offer, 'id'>) => {
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerPayload)
      });
      if (res.ok) {
        const newOffer = await res.json();
        setOffers([...offers, newOffer]);
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  // Toggle Coupon Active Status
  const handleAdminToggleOffer = async (id: string) => {
    try {
      const res = await fetch(`/api/offers/${id}/toggle`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setOffers(offers.map(o => o.id === id ? data : o));
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  // Delete Coupon
  const handleAdminDeleteOffer = async (id: string) => {
    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOffers(offers.filter(o => o.id !== id));
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  // Collect categorizations list
  const activeCategories: Category[] = [
    'Sparklers', 'Flower Pots', 'Rockets', 'Atom Bombs', 
    'Fancy Crackers', 'Kids Special', 'Gift Boxes', 'Festival Combo Packs'
  ];

  const featuredProducts = products.filter(p => p.isFeatured && p.stock > 0).slice(0, 3);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Background Interactive Fireworks Layer */}
      <FireworksCanvas enabled={true} soundEnabled={false} />

      {/* Backdrop vignette filters */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        
        {/* Navigation panel */}
        <Navbar 
          currentRoute={route}
          setRoute={setRoute} 
          lang={lang} 
          setLang={setLang} 
          translations={t} 
          cartCount={totalCartCount}
          openCart={() => setIsCartOpen(true)}
          isAdmin={isAdmin}
        />

        {/* Major views Routing Container */}
        <main className="flex-grow">
          {route === 'home' && (
            <div className="space-y-24 pb-20">
              {/* Grand Introduction */}
              <Hero 
                lang={lang} 
                translations={t} 
                onShopClick={() => setRoute('products')}
                onContactClick={() => setRoute('contact')}
              />

              {/* Exclusive Festive Offers Carousel */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-2">
                  <span className="block text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
                    {lang === 'en' ? 'LIMITED SPECIAL SAVINGS' : 'மதிப்பீட்டு சலுகைகள்'}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-display">
                    {t.offers}
                  </h2>
                  <div className="w-12 h-1 bg-[#D4AF37] mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {offers.filter(o => o.active).map((off) => (
                    <div 
                      key={off.id}
                      className="p-6 rounded-none bg-[#111111]/90 border border-white/5 relative overflow-hidden flex flex-col justify-between gap-6 shadow-lg group hover:border-[#D4AF37]/50 transition-all"
                    >
                      <div className="absolute top-0 right-0 p-4 bg-[#D4AF37]/10 text-[#D4AF37]">
                        <Percent className="w-5 h-5" />
                      </div>
                      
                      <div className="space-y-4">
                        <span className="inline-block px-3 py-1 font-mono text-[10px] font-bold bg-[#D4AF37] text-black tracking-widest uppercase">
                          USE CODE: {off.code}
                        </span>
                        <h3 className="font-sans font-black uppercase text-lg text-white tracking-tight pt-1">
                          {lang === 'en' ? off.descriptionEn : off.descriptionTa}
                        </h3>
                        <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                          {lang === 'en' 
                            ? `Valid only on direct online orders exceeding standard ₹${off.minOrderValue} basket value.` 
                            : `குறைந்தபட்சம் ₹${off.minOrderValue} மதிப்புள்ள ஆர்டர்களுக்கு மட்டுமே பொருந்தும்.`}
                        </p>
                      </div>

                      <button
                        onClick={() => setRoute('products')}
                        className="w-full py-3 bg-transparent hover:bg-[#D4AF37] text-white hover:text-black font-sans font-black uppercase tracking-widest text-[10px] border border-white/10 hover:border-[#D4AF37] text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Activate to Cart</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Featured Showcase Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-2">
                  <span className="block text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
                    {lang === 'en' ? 'Sought-after Royal Masterpieces' : 'அனைவரும் விரும்பும் ரகங்கள்'}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-display">
                    {t.featuredProducts}
                  </h2>
                  <div className="w-12 h-1 bg-[#D4AF37] mx-auto" />
                </div>

                {loading ? (
                  <div className="text-center py-10 font-mono text-xs text-amber-500 animate-pulse">
                    {t.loading}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProducts.map((p) => {
                      const discountPct = p.originalPrice 
                        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) 
                        : 0;
                      return (
                        <div
                          key={p.id}
                          className="p-5 bg-[#111111]/90 border border-white/5 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between gap-4 group relative"
                        >
                          <div className="relative aspect-square w-full rounded-none bg-[#1a1a1a] p-4 border border-white/5 overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-600 to-yellow-300 opacity-10 blur-2xl pointer-events-none" />
                            <CrackerVisual type={p.image} className="w-2/3 h-2/3 object-contain relative z-10" />
                            
                            {discountPct > 0 && (
                              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#D4AF37] text-black font-mono text-[9px] font-black uppercase tracking-wider">
                                SAVE {discountPct}%
                              </span>
                            )}
                            <span className="absolute top-3 right-3 px-2 py-0.5 bg-green-950/40 text-green-400 font-mono text-[8px] uppercase tracking-wider border border-green-500/10">
                              IN STOCK
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-[#D4AF37] font-bold">{p.category}</span>
                            <h3 className="font-sans font-black uppercase text-base text-white group-hover:text-[#D4AF37] transition-colors tracking-tight h-12 line-clamp-2">
                              {lang === 'en' ? p.nameEn : p.nameTa}
                            </h3>
                            <p className="text-xs text-neutral-400 line-clamp-2 h-8 leading-snug font-sans">
                              {lang === 'en' ? p.descriptionEn : p.descriptionTa}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <span className="font-sans font-black italic text-lg text-[#D4AF37]">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>

                            <button
                              onClick={() => handleAddToCart(p, 1)}
                              className="text-[10px] font-black tracking-widest border border-white/20 px-4 py-2 uppercase hover:bg-white hover:text-black transition-colors cursor-pointer rounded-none"
                            >
                              Quick Reserve
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Customer Testimonials Spotlight */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-2">
                  <span className="block text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
                    {lang === 'en' ? 'PATRON VOICES FROM ALL OF INDIA' : 'வாடிக்கையாளர் கருத்துக்கள்'}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-display">
                    {t.reviews}
                  </h2>
                  <div className="w-12 h-1 bg-[#D4AF37] mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {REVIEWS.map((rev) => (
                    <div 
                      key={rev.id}
                      className="p-6 rounded-none bg-[#111111]/70 border border-white/5 space-y-4 hover:border-[#D4AF37]/30 transition-all font-sans"
                    >
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                        “{lang === 'en' ? rev.textEn : rev.textTa}”
                      </p>

                      <div className="border-t border-white/5 pt-3">
                        <span className="block text-xs font-bold text-neutral-100">{rev.author}</span>
                        <span className="block font-mono text-[9px] text-[#D4AF37] uppercase tracking-widest">{rev.city} • Verified Patron</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Direct Maps HQ & Inquiry Contacts overlay */}
              <ContactSection lang={lang} translations={t} />
            </div>
          )}

          {route === 'products' && (
            <ProductSection 
              products={products} 
              lang={lang} 
              translations={t} 
              onAddToCart={handleAddToCart} 
              categories={activeCategories}
            />
          )}

          {route === 'contact' && (
            <div className="pb-12">
              <ContactSection lang={lang} translations={t} />
            </div>
          )}

          {route === 'admin' && (
            isAdmin ? (
              <AdminPanel 
                products={products}
                orders={orders}
                offers={offers}
                categories={activeCategories}
                lang={lang}
                translations={t}
                onAddProduct={handleAdminAddProduct}
                onEditProduct={handleAdminEditProduct}
                onDeleteProduct={handleAdminDeleteProduct}
                onUpdateOrderStatus={handleAdminUpdateStatus}
                onDeleteOrder={handleAdminDeleteOrder}
                onClearAllOrders={handleAdminClearAllOrders}
                onAddOffer={handleAdminAddOffer}
                onToggleOffer={handleAdminToggleOffer}
                onDeleteOffer={handleAdminDeleteOffer}
                onLogout={() => {
                  setIsAdmin(false);
                  localStorage.removeItem('garudan_admin_authenticated');
                  setRoute('home');
                }}
              />
            ) : (
              <AdminLoginGate 
                lang={lang}
                onLoginSuccess={() => {
                  setIsAdmin(true);
                  localStorage.setItem('garudan_admin_authenticated', 'true');
                }}
                onCancel={() => setRoute('home')}
              />
            )
          )}
        </main>

        {/* Global Footer component */}
        <Footer lang={lang} onNavigate={(route) => setRoute(route)} isAdmin={isAdmin} />

        {/* Slide-over Shopping Cart ledger form drawer */}
        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          lang={lang}
          translations={t}
          offers={offers}
          onSubmitOrder={handleSubmitOrder}
        />

        {/* Global Floating WhatsApp Quick Action Button */}
        <FloatingWhatsApp lang={lang} />

        {/* Global Floating View Cart Bar & Toast Notification */}
        <FloatingCartBar 
          cart={cart}
          lang={lang}
          onOpenCart={() => setIsCartOpen(false) || setIsCartOpen(true)}
          lastAddedItem={lastAddedItem}
        />

      </div>
    </div>
  );
}
