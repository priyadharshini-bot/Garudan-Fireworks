import React, { useEffect, useState } from 'react';
import { CartItem, Language } from '../types';
import { ShoppingCart, ArrowRight, Sparkles, Check } from 'lucide-react';

interface FloatingCartBarProps {
  cart: CartItem[];
  lang: Language;
  onOpenCart: () => void;
  lastAddedItem: { name: string; quantity: number } | null;
}

export default function FloatingCartBar({
  cart,
  lang,
  onOpenCart,
  lastAddedItem
}: FloatingCartBarProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [animatePulse, setAnimatePulse] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Trigger toast notification whenever lastAddedItem changes
  useEffect(() => {
    if (lastAddedItem) {
      const msg = lang === 'en'
        ? `Added ${lastAddedItem.quantity}x ${lastAddedItem.name} to cart!`
        : `${lastAddedItem.quantity}x ${lastAddedItem.name} சேர்க்கப்பட்டது!`;
      setToastMessage(msg);
      setAnimatePulse(true);

      const timer = setTimeout(() => {
        setToastMessage(null);
        setAnimatePulse(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, lang]);

  if (totalItems === 0 && !toastMessage) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-40 font-sans transition-all duration-300">
      
      {/* Toast popup notification banner when an item is added */}
      {toastMessage && (
        <div className="mb-2 p-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-xl border border-emerald-400/50 animate-bounce">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-full bg-white/20 shrink-0">
              <Check className="w-4 h-4 text-white" />
            </span>
            <span className="truncate">{toastMessage}</span>
          </div>
          <button
            onClick={onOpenCart}
            className="ml-2 px-2.5 py-1 bg-white text-emerald-950 rounded-lg text-xs font-black uppercase tracking-wider shrink-0 hover:bg-emerald-100 transition-colors"
          >
            {lang === 'en' ? 'View' : 'பார்க்க'}
          </button>
        </div>
      )}

      {/* Main Persistent Floating Cart Bar (if items in cart) */}
      {totalItems > 0 && (
        <div
          onClick={onOpenCart}
          className={`p-3 sm:p-3.5 rounded-2xl bg-[#18102b]/95 border-2 border-amber-400/80 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center justify-between gap-3 cursor-pointer hover:border-amber-300 hover:scale-[1.02] active:scale-[0.98] transition-all group ${
            animatePulse ? 'ring-4 ring-amber-400/50 shadow-[0_0_25px_rgba(255,191,0,0.6)]' : ''
          }`}
        >
          {/* Left: Cart Icon with Badge & Items */}
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-md shrink-0">
              <ShoppingCart className="w-5 h-5 font-black" />
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-rose-600 text-white text-[10px] font-black font-mono rounded-full flex items-center justify-center border-2 border-[#18102b] shadow">
                {totalItems}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-extrabold uppercase tracking-wider">
                <span>{lang === 'en' ? 'Cart Total' : 'கார்ட் மொத்தம்'}</span>
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
              </div>
              <div className="text-base sm:text-lg font-black font-mono text-white leading-none mt-0.5">
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Right: View Cart Action Button */}
          <div className="flex items-center gap-2">
            <button
              id="floating-view-cart-button"
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md group-hover:translate-x-0.5 transition-transform"
            >
              <span>{lang === 'en' ? 'View Cart' : 'கார்ட் பார்க்க'}</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
