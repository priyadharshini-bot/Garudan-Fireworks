/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, TranslationSchema } from '../types';
import { ShoppingCart, Menu, X, Globe, Sparkles, Flame } from 'lucide-react';
import { useState } from 'react';
import garudanLogo from '../assets/images/garudan_logo_1786048656432.jpg';

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Vibrant Festival Banner Announcement Ribbon */}
      <div className="bg-gradient-to-r from-rose-600 via-amber-500 via-purple-600 to-cyan-500 text-white font-mono text-[10px] sm:text-xs py-1.5 px-4 text-center font-black uppercase tracking-widest shadow-md flex items-center justify-center gap-2 overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 animate-bounce text-yellow-200 flex-shrink-0" />
        <span className="truncate">
          {lang === 'en' 
            ? '✨ DIWALI MEGA OFFER 2026: UP TO 80% WHOLESALE DISCOUNT • DIRECT FROM SIVAKASI ✨' 
            : '✨ தீபாவளி மெகா தள்ளுபடி 2026: 80% வரை நேரடி தள்ளுபடி • சிவகாசி நேரடி விற்பனை ✨'}
        </span>
        <Flame className="w-3.5 h-3.5 animate-pulse text-amber-300 flex-shrink-0" />
      </div>

      <nav className="bg-[#0a0812]/95 backdrop-blur-md border-b border-amber-500/20 shadow-[0_4px_25px_rgba(255,180,0,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Brand Title with uploaded Garudan Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group select-none"
              onClick={() => handleNavClick('admin')}
              id="brand-logo"
              title="Garudan Crackers - Admin Console"
            >
              <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-500 shadow-[0_0_20px_rgba(255,215,0,0.5)] group-hover:scale-105 transition-transform flex-shrink-0">
                <img 
                  src={garudanLogo} 
                  alt="Garudan Crackers Official Logo" 
                  className="w-full h-full object-cover rounded-full" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="block font-sans font-black text-lg sm:text-xl tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 via-rose-300 to-amber-400 drop-shadow-[0_2px_10px_rgba(255,200,0,0.3)]">
                  {translations.brandName}
                </span>
                <span className="block text-[9px] uppercase font-mono tracking-[0.2em] text-emerald-400 font-bold">
                  ⚡ Sivakasi Majestic Pride • சிவகாசி
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-[0.2em]">
              {navItems.map((item) => {
                const isActive = currentRoute === item.key;
                return (
                  <button
                    key={item.key}
                    id={`nav-link-${item.key}`}
                    onClick={() => handleNavClick(item.key)}
                    className={`transition-all duration-300 cursor-pointer py-1 relative ${
                      isActive 
                        ? 'text-amber-300 font-extrabold' 
                        : 'text-neutral-300 hover:text-amber-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 shadow-[0_0_10px_rgba(255,200,0,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Action Widgets */}
            <div className="hidden md:flex items-center gap-3">
              
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                id="lang-toggle-desktop"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-400/30 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-400 transition-all font-sans text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(255,200,0,0.15)] cursor-pointer"
                title="Switch Language / தமிழ் மாற்று"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              {/* Shopping Cart button */}
              <button
                onClick={openCart}
                id="cart-button-desktop"
                className="relative p-2.5 rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-purple-600 text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] group cursor-pointer ml-1"
              >
                <ShoppingCart className="w-5 h-5 text-white group-hover:rotate-6 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black font-black text-[11px] w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-black animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile hamburger menu trigger */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={openCart}
                id="cart-button-mobile"
                className="relative p-2 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-black">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleLanguage}
                id="lang-toggle-mobile"
                className="flex items-center gap-1 p-2 rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-300 text-xs"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                id="hamburger-trigger"
                className="p-2 text-amber-400 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Navigation overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0d0918] border-t border-amber-500/20 px-4 py-4 space-y-3">
            {navItems.map((item) => {
              const isActive = currentRoute === item.key;
              return (
                <button
                  key={item.key}
                  id={`nav-link-mobile-${item.key}`}
                  onClick={() => handleNavClick(item.key)}
                  className={`block w-full text-left px-4 py-3 font-sans text-sm font-black uppercase tracking-widest rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border-l-4 border-amber-400' 
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
