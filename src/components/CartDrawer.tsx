/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { CartItem, Language, TranslationSchema, Offer } from '../types';
import CrackerVisual from './CrackerVisual';
import { X, Trash2, Tag, Send, AlertTriangle, ArrowRight, MessageSquare, CheckCircle, Mail } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (pId: string, quantity: number) => void;
  onRemoveItem: (pId: string) => void;
  lang: Language;
  translations: TranslationSchema;
  offers: Offer[];
  onSubmitOrder: (details: {
    customerName: string;
    mobile: string;
    address: string;
    notes?: string;
    couponApplied?: string;
  }) => Promise<{ success: boolean; orderId?: string }>;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  lang,
  translations,
  offers,
  onSubmitOrder
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Lock body & document scrolling when the cart drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate prices
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Handle coupon apply
  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) return;

    const offer = offers.find(o => o.code.toUpperCase() === couponCode.trim().toUpperCase() && o.active);
    if (!offer) {
      setCouponError(lang === 'en' ? 'Invalid or inactive promo code.' : 'செல்லாத விளம்பரக் குறியீடு.');
      setAppliedOffer(null);
      return;
    }

    if (subtotal < offer.minOrderValue) {
      const needed = offer.minOrderValue - subtotal;
      setCouponError(
        lang === 'en'
          ? `Cart total must be at least ₹${offer.minOrderValue} (Add ₹${needed} more).`
          : `ஆர்டர் மதிப்பு ₹${offer.minOrderValue} இருக்க வேண்டும் (மேலும் ₹${needed} சேர்க்கவும்)`
      );
      setAppliedOffer(null);
      return;
    }

    setAppliedOffer(offer);
  };

  const discountAmount = appliedOffer ? Math.round((subtotal * appliedOffer.discountPercentage) / 100) : 0;
  const finalTotal = subtotal - discountAmount;

  // Build formatted text for WhatsApp
  const generateWhatsAppUrl = () => {
    let text = `*🚨 NEW CELEBRATION ORDER - GARUDAN CRACKERS* 🎇\n\n`;
    text += `*Customer Details:*\n`;
    text += `• Name: ${customerName}\n`;
    text += `• Phone: ${mobile}\n`;
    text += `• Address: ${address}\n`;
    if (notes) text += `• Instructions: ${notes}\n`;
    text += `\n*Itemized Cart:*\n`;
    
    cartItems.forEach((item, index) => {
      const name = lang === 'en' ? item.product.nameEn : `${item.product.nameEn} (${item.product.nameTa})`;
      text += `${index + 1}. ${name} [Qty: ${item.quantity}] = ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}\n`;
    });

    text += `\n*Financial Summary:*\n`;
    text += `• Subtotal: ₹${subtotal.toLocaleString('en-IN')}\n`;
    if (appliedOffer) {
      text += `• Promo Coupon (${appliedOffer.code}): -₹${discountAmount.toLocaleString('en-IN')}\n`;
    }
    text += `*• GRAND TOTAL: ₹${finalTotal.toLocaleString('en-IN')}*\n\n`;
    text += `🎇 _Thank you for choosing Garudan Crackers to light up your skies! Please verify this order list._`;

    return `https://wa.me/919092268462?text=${encodeURIComponent(text)}`;
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!customerName.trim() || !mobile.trim() || !address.trim()) {
      alert(lang === 'en' ? 'Please complete all required fields (Name, Mobile Number, Address).' : 'தேவையான அனைத்து விவரங்களையும் நிரப்பவும் (பெயர், தொலைபேசி, முகவரி).');
      return;
    }

    setIsSubmitting(true);
    const waUrl = generateWhatsAppUrl();

    // Directly open business WhatsApp immediately on click to prevent popup blockers
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('window.open failed, redirecting location:', err);
      window.location.href = waUrl;
    }

    try {
      const result = await onSubmitOrder({
        customerName,
        mobile,
        address,
        notes,
        couponApplied: appliedOffer?.code
      });

      if (result.success && result.orderId) {
        setCreatedOrderId(result.orderId);
      }
      setOrderSuccess(true);
    } catch (err) {
      console.error('Error processing order submission:', err);
      setOrderSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden overscroll-none" id="cart-drawer-overlay">
      
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity touch-none"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 h-full">
        <div className="w-screen max-w-md bg-[#050505] border-l border-white/10 flex flex-col justify-between shadow-2xl relative h-full max-h-screen overscroll-contain">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white font-display">
              {translations.cart}
            </h2>
            <button
              onClick={onClose}
              id="close-cart-drawer"
              className="p-1 text-neutral-400 hover:text-[#D4AF37] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Contents */}
          <div 
            className="flex-1 overflow-y-auto overscroll-contain touch-pan-y px-6 py-4 space-y-6"
            onScroll={(e) => e.stopPropagation()}
          >
            {orderSuccess ? (
              // Order placement Success screen
              <div className="text-center py-10 space-y-6 flex flex-col items-center justify-center h-full">
                <div className="p-4 bg-emerald-950/40 rounded-none border border-emerald-500/30 text-emerald-400">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="font-sans font-black uppercase tracking-tight text-white text-xl">
                  {lang === 'en' ? 'Order Sent to WhatsApp!' : 'ஆர்டர் வாட்ஸ்அப்பில் அனுப்பப்பட்டது!'}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-xs font-sans">
                  {translations.orderSuccess}
                </p>
                {createdOrderId && (
                  <span className="block font-mono text-[9px] px-3 py-1 bg-[#111] rounded-none border border-white/10 text-[#D4AF37] uppercase tracking-widest">
                    Order ID: {createdOrderId}
                  </span>
                )}

                <div className="w-full p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-left space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>{lang === 'en' ? 'Direct WhatsApp Dispatch (+91 90922 68462)' : 'வாட்ஸ்அப் நேரடி விற்பனை (+91 90922 68462)'}</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-snug">
                    {lang === 'en'
                      ? 'Your order list, customer contact, and delivery address were prepared and launched in WhatsApp for instant business processing.'
                      : 'உங்கள் ஆர்டர் பட்டியல் மற்றும் விபரங்கள் கருடன் பட்டாசு வாட்ஸ்அப் எண்ணிற்கு உடனடியாக அனுப்பப்பட்டுள்ளது.'}
                  </p>
                </div>

                <div className="w-full pt-2 space-y-3">
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noreferrer"
                    id="whatsapp-success-trigger"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-none shadow-lg transition-all cursor-pointer border border-emerald-400/40"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Open WhatsApp Chat Again' : 'வாட்ஸ்அப் சேட்டை மீண்டும் திறக்க'}</span>
                  </a>

                  <button
                    onClick={() => {
                      setOrderSuccess(false);
                      setCustomerName('');
                      setMobile('');
                      setAddress('');
                      setNotes('');
                      setAppliedOffer(null);
                      setCouponCode('');
                      onClose();
                    }}
                    className="w-full py-2.5 text-xs text-neutral-400 hover:text-white underline font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {lang === 'en' ? 'Continue Browsing Sparklers' : 'விற்பனையை தொடர'}
                  </button>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              // Empty cart state
              <div className="text-center py-24 space-y-4 flex flex-col items-center justify-center h-full">
                <p className="text-neutral-500 font-sans text-sm">
                  {translations.emptyCart}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-none border border-white/25 text-[#D4AF37] hover:border-[#D4AF37] text-[10px] font-black uppercase tracking-widest cursor-pointer"
                >
                  {translations.shopNow}
                </button>
              </div>
            ) : (
              // Standard checkout list Flow
              <div className="space-y-6">
                
                {/* List items */}
                <div className="divide-y divide-white/5">
                  {cartItems.map((item) => {
                    const name = lang === 'en' ? item.product.nameEn : item.product.nameTa;
                    return (
                      <div key={item.product.id} className="py-4 flex gap-4 items-center justify-between">
                        <div className="w-12 h-12 rounded-none bg-[#111111] border border-white/5 p-1 flex-shrink-0">
                          <CrackerVisual type={item.product.image} className="w-full h-full object-contain" />
                        </div>

                        <div className="flex-grow">
                          <span className="block font-sans font-black uppercase text-xs text-neutral-200 line-clamp-1">{name}</span>
                          <span className="block font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider">₹{item.product.price.toLocaleString('en-IN')} each</span>
                        </div>

                        {/* Qty Adjustment inside checkout */}
                        <div className="flex items-center gap-1 bg-black rounded-none p-1 border border-white/10">
                          <button
                            onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-neutral-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-bold font-mono text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-neutral-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove item */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 text-neutral-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Offer Coupon Form */}
                <div className="p-4 bg-[#111111]/90 rounded-none border border-white/5 space-y-3">
                  <span className="block text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] font-bold">
                    {lang === 'en' ? 'Festive Offers & Coupon' : 'திருவிழா சலுகை குறியீடு'}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. DIWALI2026"
                      className="flex-grow px-3 py-2 text-xs rounded-none bg-black border border-white/10 text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#D4AF37] text-black font-black font-sans text-[10px] uppercase tracking-widest rounded-none hover:bg-white transition-all cursor-pointer"
                    >
                      {lang === 'en' ? 'Apply' : 'பயன்படுத்து'}
                    </button>
                  </div>
                  {couponError && <span className="block text-[11px] text-red-500 font-medium">{couponError}</span>}
                  {appliedOffer && (
                    <div className="bg-emerald-950/20 p-2 rounded-none border border-emerald-500/20 text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                      ✓ Promo Applied: {appliedOffer.code} (Saved {appliedOffer.discountPercentage}%)
                    </div>
                  )}
                </div>

                {/* Pricing Breakdown Card (Subtotal & Total - Right after Products & Coupon) */}
                <div className="p-4 bg-[#111111]/90 rounded-none space-y-2 border border-amber-500/30">
                  <div className="flex justify-between text-xs uppercase tracking-wider text-neutral-300">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {appliedOffer && (
                    <div className="flex justify-between text-xs uppercase tracking-wider text-emerald-400 font-bold">
                      <span>Festive Savings ({appliedOffer.discountPercentage}%)</span>
                      <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black uppercase tracking-wider text-white pt-2.5 border-t border-white/10">
                    <span>{translations.total}</span>
                    <span className="font-mono text-[#D4AF37] text-base font-extrabold">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Order Form (Customer Details) */}
                <form onSubmit={handlePlaceOrder} className="space-y-4 pt-4 border-t border-white/5">
                  <span className="block text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400 font-bold">
                    {translations.quickOrder}
                  </span>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] uppercase font-mono tracking-widest text-neutral-400 font-bold mb-1.5">{translations.name} *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Sundar Raman"
                        className="w-full px-3.5 py-2.5 rounded-none bg-black border border-white/10 text-white font-mono text-xs placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-mono tracking-widest text-neutral-400 font-bold mb-1.5">{translations.phone} *</label>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="e.g. 9845012345"
                        className="w-full px-3.5 py-2.5 rounded-none bg-black border border-white/10 text-white font-mono text-xs placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-mono tracking-widest text-neutral-400 font-bold mb-1.5">{translations.address} *</label>
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="12, Royal Palace Road, Alwarpet, Chennai - 600018"
                        className="w-full px-3.5 py-2.5 rounded-none bg-black border border-white/10 text-white font-mono text-xs placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-mono tracking-widest text-neutral-400 font-bold mb-1.5">{translations.notes} (Optional)</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Deliver safely. Leave near main latch gate."
                        className="w-full px-3.5 py-2.5 rounded-none bg-black border border-white/10 text-white font-mono text-xs placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* Submission button: Confirm Order */}
                  <div className="space-y-2.5 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between px-1 text-xs font-mono">
                      <span className="text-neutral-400 uppercase tracking-wider">{translations.total}:</span>
                      <span className="text-[#D4AF37] font-extrabold text-sm">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || cartItems.length === 0}
                      id="confirm-order-submit"
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-black uppercase tracking-wider text-xs rounded-none transition-all flex items-center justify-center gap-2 disabled:opacity-40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg shadow-amber-950/50"
                    >
                      <CheckCircle className="w-4 h-4 text-black" />
                      <span>{isSubmitting ? translations.loading : (lang === 'en' ? 'Confirm Order' : 'ஆர்டரை உறுதி செய்க')}</span>
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
