/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, TranslationSchema } from '../types';
import { Sparkles, Flame, ShieldCheck, Truck, Award } from 'lucide-react';
import garudanLogo from '../assets/images/garudan_logo_1786048656432.jpg';

interface HeroProps {
  lang: Language;
  translations: TranslationSchema;
  onShopClick: () => void;
  onContactClick: () => void;
}

export default function Hero({ lang, translations, onShopClick, onContactClick }: HeroProps) {
  return (
    <header className="relative py-16 px-4 md:py-24 overflow-hidden flex flex-col items-center justify-center min-h-[88vh] text-center">
      {/* Vibrant Multi-Color Glow Background Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-600/20 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none z-0" />

      <div className="relative max-w-5xl mx-auto z-10 space-y-8 flex flex-col items-center">
        
        {/* Prominent Garudan Crackers Official Eagle Logo Badge */}
        <div className="relative group cursor-pointer" onClick={onShopClick}>
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-rose-500 via-purple-500 to-cyan-400 rounded-full blur-md opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-500 shadow-[0_0_50px_rgba(255,215,0,0.6)]">
            <img 
              src={garudanLogo} 
              alt="Best Crackers Shop Sivakasi - Garudan Crackers Online Shopping" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Festival SEO Badges */}
        <div className="inline-flex items-center gap-2 px-5 py-2 border border-amber-400/50 rounded-full text-xs uppercase tracking-widest text-amber-300 font-extrabold bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,200,0,0.25)]">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
          <span>{lang === 'en' ? 'Top 10 Crackers Shop • Buy Sivakasi Crackers Online 2026' : 'சிவகாசியின் சிறந்த பட்டாசு அங்காடி • 2026 ஆன்லைன் ஆர்டர்'}</span>
          <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
        </div>

        {/* Main Banner Heading */}
        <div className="space-y-4">
          <h1 className="text-[40px] sm:text-[64px] md:text-[84px] leading-[0.92] font-black uppercase tracking-tight select-none font-display">
            {lang === 'en' ? (
              <>
                <span className="text-white drop-shadow-lg">CELEBRATE DIWALI 2026 WITH</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 via-rose-400 to-cyan-300 drop-shadow-[0_4px_25px_rgba(255,180,0,0.5)]">
                  GARUDAN CRACKERS
                </span>
              </>
            ) : (
              <>
                <span className="text-white">சிவகாசி ஆன்லைன் பட்டாசுகள்</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 via-rose-400 to-cyan-300 drop-shadow-[0_4px_25px_rgba(255,180,0,0.5)]">
                  கருடன் பட்டாசுகள் 2026
                </span>
              </>
            )}
          </h1>

          <p className="max-w-3xl mx-auto text-neutral-200 font-medium leading-relaxed text-sm sm:text-base md:text-lg">
            {lang === 'en' 
              ? 'Enjoy hassle-free Crackers Online Shopping from the Best Crackers Shop Sivakasi. Browse our updated Online Crackers Price List 2026 & Buy Crackers Online with up to 80% direct factory discount!'
              : 'சிறந்த சிவகாசி பட்டாசு அங்காடியில் ஆன்லைனில் பட்டாசு வாங்கவும்! 2026 விலைப் பட்டியலுடன் 80% நேரடி தொழிற்சாலை தள்ளுபடியைப் பெறுங்கள்!'}
          </p>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-3 gap-3 max-w-xl w-full pt-2">
          <div className="p-3 rounded-xl bg-gradient-to-b from-amber-500/10 to-amber-500/5 border border-amber-500/20 flex flex-col items-center gap-1">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-black uppercase text-amber-200 tracking-wider">100% Original</span>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-b from-rose-500/10 to-rose-500/5 border border-rose-500/20 flex flex-col items-center gap-1">
            <Truck className="w-5 h-5 text-rose-400" />
            <span className="text-[10px] sm:text-xs font-black uppercase text-rose-200 tracking-wider">Express Delivery</span>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-b from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 flex flex-col items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] sm:text-xs font-black uppercase text-cyan-200 tracking-wider">Eco Safe Quality</span>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2 w-full max-w-md">
          <button
            onClick={onShopClick}
            id="hero-shop-cta"
            className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_35px_rgba(255,180,0,0.5)] cursor-pointer border border-amber-300"
          >
            {translations.shopNow}
          </button>

          <button
            onClick={onContactClick}
            id="hero-contact-cta"
            className="w-full py-4 px-8 rounded-xl bg-slate-900/80 border border-amber-400/40 text-amber-200 font-black uppercase tracking-widest text-xs hover:bg-amber-400/10 hover:border-amber-300 transition-all cursor-pointer shadow-lg"
          >
            {lang === 'en' ? 'Visit Store HQ' : 'அங்காடியை காண'}
          </button>
        </div>

      </div>
    </header>
  );
}
