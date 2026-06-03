/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, TranslationSchema } from '../types';
import { ShoppingCart, Menu, X, Landmark, Globe, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  currentRoute: 'home' | 'products' | 'contact' | 'admin';
  setRoute: (route: 'home' | 'products' | 'contact' | 'admin') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  translations: TranslationSchema;
  cartCount: number;
  openCart: () => void;
  isAdmin?: boolean;
}

export default function Navbar({
  currentRoute,
  setRoute,
  lang,
  setLang,
  translations,
  cartCount,
  openCart,
  isAdmin = false
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { key: 'home' | 'products' | 'contact' | 'admin'; label: string }[] = [
    { key: 'home', label: translations.home },
    { key: 'products', label: translations.products },
    { key: 'contact', label: translations.contact },
    ...(isAdmin ? [{ key: 'admin' as const, label: translations.admin }] : [])
  ];

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ta' : 'en');
  };

  const handleNavClick = (key: 'home' | 'products' | 'contact' | 'admin') => {
    setRoute(key);
    setMobileMenuOpen(false);
    // Smooth scroll to top of viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(212,175,55,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Title */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group select-none"
            onClick={() => handleNavClick('admin')}
            id="brand-logo"
            title="Garudan Fireworks"
          >
            <div className="relative w-10 h-10 bg-gradient-to-tr from-[#D4AF37] to-[#FF8C00] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center font-black text-black group-hover:scale-105 transition-transform text-lg">
              {translations.brandName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="block font-sans font-black text-xl tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] to-[#D4AF37]">
                {translations.brandName}
              </span>
              <span className="block text-[9px] uppercase font-mono tracking-[0.2em] text-neutral-500">
                Sivakasi Premium • சிவகாசி
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em]">
            {navItems.map((item) => {
              const isActive = currentRoute === item.key;
              return (
                <button
                  key={item.key}
                  id={`nav-link-${item.key}`}
                  onClick={() => handleNavClick(item.key)}
                  className={`transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'text-[#D4AF37] border-b border-[#D4AF37] pb-1' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Widgets */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              id="lang-toggle-desktop"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-neutral-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all font-sans text-xs font-bold uppercase tracking-wider"
              title="Switch Language / தமிழ் மாற்று"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={openCart}
              id="cart-button-desktop"
              className="relative p-2.5 bg-neutral-900/50 border border-white/10 text-neutral-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all shadow-[0_0_15px_rgba(212,175,55,0.05)] group cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile shopping cart */}
            <button
              onClick={openCart}
              id="cart-button-mobile"
              className="relative p-2 rounded-full bg-neutral-900 border border-white/10 text-neutral-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Language switch */}
            <button
              onClick={toggleLanguage}
              id="lang-toggle-mobile"
              className="flex items-center gap-1 p-2 rounded-full border border-white/10 text-neutral-300 text-xs"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="hamburger-trigger"
              className="p-2 text-[#D4AF37] hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050505] border-t border-white/10 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = currentRoute === item.key;
            return (
              <button
                key={item.key}
                id={`nav-link-mobile-${item.key}`}
                onClick={() => handleNavClick(item.key)}
                className={`block w-full text-left px-4 py-3 rounded-none font-sans text-sm font-bold uppercase tracking-widest transition-colors ${
                  isActive 
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]' 
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
