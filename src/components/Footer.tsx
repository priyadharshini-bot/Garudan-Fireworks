/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';
import { ShieldAlert, Award, ShieldCheck, HelpCircle, Sparkles, Tag, Phone } from 'lucide-react';
import garudanLogo from '../assets/images/garudan_logo_1786048656432.jpg';

interface FooterProps {
  lang: Language;
  onNavigate: (route: 'home' | 'products' | 'contact' | 'admin') => void;
  isAdmin?: boolean;
}

export default function Footer({ lang, onNavigate, isAdmin = false }: FooterProps) {
  return (
    <footer className="bg-[#080512] text-neutral-300 font-sans border-t border-amber-500/20 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow blurs */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Core grids */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand col with Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-500 shadow-[0_0_20px_rgba(255,200,0,0.4)] flex-shrink-0">
                <img 
                  src={garudanLogo} 
                  alt="Garudan Crackers Logo" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="block font-sans font-black uppercase text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 font-display">
                  {lang === 'en' ? 'GARUDAN CRACKERS' : 'கருடன் பட்டாசு நிறுவனம்'}
                </span>
                <span className="block text-[10px] text-amber-400 font-mono tracking-wider font-bold">
                  Sivakasi Premium • சிவகாசி
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {lang === 'en'
                ? 'Sivakasi’s elite manufacturers of certified luxury sparklers, aerial ground cakes, and premium assortment gift boxes since 1994.'
                : '1994 முதல் விண்வெளி மற்றும் தரைவகை உயர்தர பட்டாசுகளின் அங்கீகரிக்கப்பட்ட சிவகாசி உற்பத்தியாளர்கள்.'}
            </p>
            <span className="block text-[10px] font-mono text-amber-400/80 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
              EXPLOSIVES LICENSE NO: 1065/2025
            </span>
          </div>

          {/* Quick shortcuts */}
          <div className="space-y-4">
            <span className="block text-xs uppercase font-mono tracking-[0.25em] text-amber-300 font-black">Quick Navigation</span>
            <ul className="space-y-2.5 text-xs font-mono uppercase tracking-wider">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-300 transition-colors cursor-pointer text-left flex items-center gap-1.5">
                  <span className="text-rose-400">⚡</span> {lang === 'en' ? 'Home Portal' : 'முகப்பு பகுதி'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-amber-300 transition-colors cursor-pointer text-left flex items-center gap-1.5">
                  <span className="text-amber-400">✨</span> {lang === 'en' ? 'Our Store Products' : 'பட்டாசு வகைகள்'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-300 transition-colors cursor-pointer text-left flex items-center gap-1.5">
                  <span className="text-cyan-400">📍</span> {lang === 'en' ? 'Contact Coordinate HQ' : 'தொடர்பு விவரங்கள்'}
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button onClick={() => onNavigate('admin')} className="hover:text-amber-300 transition-colors cursor-pointer text-left flex items-center gap-1.5">
                    <span className="text-purple-400">🔐</span> {lang === 'en' ? 'Merchant Console' : 'நிர்வாக பகுதி'}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Safety rules & guidelines */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-pulse" />
              <span className="text-xs uppercase font-mono tracking-[0.2em] font-black">
                {lang === 'en' ? 'CELEBRATION SAFETY DIRECTIVES' : 'பாதுகாப்பு வழிமுறைகள்'}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-neutral-300 list-disc pl-4 leading-relaxed font-sans">
              <li>{lang === 'en' ? 'Always light fireworks strictly outdoors in open ground areas.' : 'எப்போதும் திறந்தவெளியில் மட்டுமே பட்டாசுகளை பற்றவைக்கவும்.'}</li>
              <li>{lang === 'en' ? 'Maintain at least 5 meters distance from rockets and aerial shots.' : 'ஏரியல் பட்டாசுகளிடம் இருந்து குறைந்தபட்சம் 5 மீட்டர் இடைவெளி விடவும்.'}</li>
              <li>{lang === 'en' ? 'Keep a bucket of clean water or dry sand nearby for emergencies.' : 'முன்னெச்சரிக்கையாக நீர் அல்லது மணல் நிரம்பிய வாளியை அருகில் வைக்கவும்.'}</li>
              <li>{lang === 'en' ? 'Never attempt to relight a dud or failed cracker. Soak in water.' : 'வெடிக்காத பட்டாசுகளை மீண்டும் பற்றவைக்க முயற்சிக்க வேண்டாம்.'}</li>
            </ul>
          </div>

        </div>

        {/* Quality Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#130b22]/90 border border-amber-500/30 text-center shadow-xl">
          <div className="flex flex-col items-center justify-center p-2">
            <Award className="w-6 h-6 text-amber-300 mb-1" />
            <span className="block text-xs font-bold text-white">100% Eco-Friendly</span>
            <span className="block text-[10px] text-neutral-400">Low Emission Formula</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
            <span className="block text-xs font-bold text-white">CSIR-NEERI Approved</span>
            <span className="block text-[10px] text-neutral-400">Certified Green Crackers</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <HelpCircle className="w-6 h-6 text-cyan-400 mb-1" />
            <span className="block text-xs font-bold text-white">Sivakasi Packaged</span>
            <span className="block text-[10px] text-neutral-400">100% Licensed Handcrafted</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <Sparkles className="w-6 h-6 text-rose-400 mb-1 animate-spin-slow" />
            <span className="block text-xs font-bold text-white">WhatsApp Direct Desk</span>
            <span className="block text-[10px] text-neutral-400">+91 90922 68462</span>
          </div>
        </div>

        {/* SEO Keywords & Tags Section */}
        <div className="pt-6 border-t border-amber-500/20 text-left space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs uppercase font-mono tracking-[0.2em] font-black text-amber-300">
              {lang === 'en' ? 'POPULAR SEARCH TAGS & SEO CATEGORIES' : 'பிரபலமான தேடல் குறிச்சொற்கள்'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-sans">
            {[
              'Online Crackers Sivakasi',
              'Top 10 Crackers Shop',
              'Buy Sivakasi Crackers Online',
              'Sivakasi Crackers Online',
              'Online Crackers 2026',
              'Online Crackers Price List 2026',
              'Crackers Online Shopping',
              'Buy Crackers Online',
              'Best Crackers Shop Sivakasi'
            ].map((seoTag, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('products')}
                className="px-3 py-1 rounded-full bg-[#170e28] hover:bg-amber-500/20 text-amber-200/90 border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer shadow-sm hover:scale-105"
                title={`Explore ${seoTag}`}
              >
                #{seoTag}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans pt-1">
            Garudan Crackers is rated among the <strong className="text-amber-200">Top 10 Crackers Shop in Sivakasi</strong>, offering seamless <strong className="text-amber-200">Crackers Online Shopping</strong> with direct factory wholesale prices. Access the complete <strong className="text-amber-200">Online Crackers Price List 2026</strong> and <strong className="text-amber-200">Buy Sivakasi Crackers Online</strong> with 100% safety certified green fireworks.
          </p>
        </div>

        {/* Legal disclosures & copyrights */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-amber-500/20 text-xs text-neutral-400 font-mono">
          <span 
            className="cursor-pointer select-none hover:text-amber-300 transition-colors"
            onDoubleClick={() => onNavigate('admin')}
            title="Double-click for administrative portal"
          >
            © Garudan Fireworks Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-center text-neutral-300">
            <span className="font-semibold text-amber-300">Velgenix Technology</span>
            <span className="text-amber-500 font-bold">•</span>
            <a 
              href="tel:+971558903732" 
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+971 55 890 3732</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
