/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';
import { ShieldAlert, Award, ShieldCheck, HelpCircle } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigate: (route: 'home' | 'products' | 'contact' | 'admin') => void;
  isAdmin?: boolean;
}

export default function Footer({ lang, onNavigate, isAdmin = false }: FooterProps) {
  return (
    <footer className="bg-[#050505] text-neutral-400 font-sans border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Core grids */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand col */}
          <div className="space-y-4">
            <span className="block font-sans font-black uppercase tracking-[0.05em] text-white text-lg font-display">
              {lang === 'en' ? 'GARUDAN FIREWORKS' : 'கருடன் பட்டாசு நிறுவனம்'}
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {lang === 'en'
                ? 'Sivakasi’s elite manufacturers of certified luxury sparklers, aerial ground cakes, and premium assortment gift boxes since 1994.'
                : '1994 முதல் விண்வெளி மற்றும் தரைவகை உயர்தர பட்டாசுகளின் அங்கீகரிக்கப்பட்ட சிவகாசி உற்பத்தியாளர்கள்.'}
            </p>
            <span className="block text-[10px] font-mono text-neutral-600">
              EXPLOSIVES LICENSE: EXP/TN/12/2026-A
            </span>
          </div>

          {/* Quick shortcuts */}
          <div className="space-y-4">
            <span className="block text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">Quick Navigation</span>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left">
                  {lang === 'en' ? 'Home Portal' : 'முகப்பு பகுதி'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left">
                  {lang === 'en' ? 'Our Store Products' : 'பட்டாசு வகைகள்'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left">
                  {lang === 'en' ? 'Contact Coordinate HQ' : 'தொடர்பு விவரங்கள்'}
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button onClick={() => onNavigate('admin')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left">
                    {lang === 'en' ? 'Merchant Console' : 'நிர்வாக பகுதி'}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Safety rules & guidelines */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-red-500">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-black">
                {lang === 'en' ? 'CELEBRATION SAFETY DIRECTIVES' : 'பாதுகாப்பு வழிமுறைகள்'}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-neutral-500 list-disc pl-4 leading-relaxed font-sans">
              <li>{lang === 'en' ? 'Always light fireworks strictly outdoors in open ground areas.' : 'எப்போதும் திறந்தவெளியில் மட்டுமே பட்டாசுகளை பற்றவைக்கவும்.'}</li>
              <li>{lang === 'en' ? 'Maintain at least 5 meters distance from rockets and aerial shots.' : 'ஏரியல் பட்டாசுகளிடம் இருந்து குறைந்தபட்சம் 5 மீட்டர் இடைவெளி விடவும்.'}</li>
              <li>{lang === 'en' ? 'Keep a bucket of clean water or dry sand nearby for emergencies.' : 'முன்னெச்சரிக்கையாக நீர் அல்லது மணல் நிரம்பிய வாளியை அருகில் வைக்கவும்.'}</li>
              <li>{lang === 'en' ? 'Never attempt to relight a dud or failed cracker. Soak in water.' : 'வெடிக்காத பட்டாசுகளை மீண்டும் பற்றவைக்க முயற்சிக்க வேண்டாம்.'}</li>
            </ul>
          </div>

        </div>

        {/* Quality Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-none bg-[#111111]/60 border border-white/5 text-center">
          <div className="flex flex-col items-center justify-center p-2">
            <Award className="w-5 h-5 text-[#D4AF37] mb-1" />
            <span className="block text-[11px] font-bold text-neutral-200">100% Eco-Friendly</span>
            <span className="block text-[9px] text-neutral-500">Low Emission Formula</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] mb-1" />
            <span className="block text-[11px] font-bold text-neutral-200">CSIR-NEERI Approved</span>
            <span className="block text-[9px] text-neutral-500">Certified Green Crackers</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <HelpCircle className="w-5 h-5 text-[#D4AF37] mb-1" />
            <span className="block text-[11px] font-bold text-neutral-200">Sivakasi Packaged</span>
            <span className="block text-[9px] text-neutral-500">100% Licensed Handcrafted</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#D4AF37] mb-1 inline">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
            </svg>
            <span className="block text-[11px] font-bold text-neutral-200">WhatsApp Support</span>
            <span className="block text-[9px] text-neutral-500">Instant Billing Desk</span>
          </div>
        </div>

        {/* Legal disclosures & copyrights */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-[10px] text-neutral-600 font-mono">
          <span 
            className="cursor-pointer select-none hover:text-[#D4AF37] transition-colors"
            onDoubleClick={() => onNavigate('admin')}
            title="Double-click for administrative portal"
          >
            © 1994-2026 Garudan Fireworks Inc. All rights reserved.
          </span>
          <span>Designed with premium dark accents and real-time particle dynamics.</span>
        </div>

      </div>
    </footer>
  );
}
