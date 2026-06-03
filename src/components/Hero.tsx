/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Language, TranslationSchema } from '../types';
import { Flame, Sparkles, Clock, Compass, ArrowRight } from 'lucide-react';

interface HeroProps {
  lang: Language;
  translations: TranslationSchema;
  onShopClick: () => void;
  onContactClick: () => void;
}

export default function Hero({ lang, translations, onShopClick, onContactClick }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate countdown to Diwali 2026 (November 8, 2026)
  useEffect(() => {
    const targetDate = new Date('2026-11-08T00:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative py-20 px-4 md:py-32 overflow-hidden flex flex-col items-center justify-center min-h-[85vh] text-center">
      {/* Golden Vignette glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 rounded-full bg-red-600/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative max-w-4xl mx-auto z-10 space-y-10 flex flex-col items-center">
        
        {/* Superior Quality Badging */}
        <div className="inline-block px-4 py-1.5 border border-[#D4AF37]/45 rounded-full text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold bg-[#D4AF37]/5">
          {lang === 'en' ? 'Sivakasi’s Majestic Pride • Premium 2026' : 'சிவகாரியின் உன்னத தயாரிப்பு • 2026'}
        </div>

        {/* Brand Name with Glowing Golden Serif / Sans Grotesk Look */}
        <div className="space-y-6">
          <h1 className="text-[48px] sm:text-[76px] md:text-[100px] leading-[0.85] font-black uppercase tracking-tighter select-none font-display text-white">
            {lang === 'en' ? (
              <>
                Light Up <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] to-[#D4AF37]">
                  Every Day.
                </span>
              </>
            ) : (
              <>
                ஒளிரச் செய்வோம் <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] to-[#D4AF37]">
                  ஒவ்வொரு நாளும்.
                </span>
              </>
            )}
          </h1>

          {/* Tagline */}
          <p className="max-w-2xl mx-auto text-neutral-400 font-light leading-relaxed italic text-xs sm:text-sm md:text-base">
            {lang === 'en' 
              ? 'Premium handcrafted crackers with vibrant colors and minimal smoke. Experience the majesty of the sky with Garudan.'
              : 'துடிப்பான வண்ணங்கள் மற்றும் குறைந்த புகையுடன் கைவினை முறையில் தயாரிக்கப்பட்ட பிரீமியம் பட்டாசுகள். கருடன் உடன் வானத்தின் கம்பீரத்தை அனுபவியுங்கள்.'}
          </p>
        </div>

        {/* Interactive Diwali Countdown Timer */}
        <div className="relative p-6 sm:p-8 rounded-none bg-[#111111]/90 backdrop-blur-md border border-white/5 max-w-sm w-full shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent" />
          
          <div className="flex items-center justify-center gap-2 text-[#D4AF37] font-mono text-[10px] uppercase tracking-[0.2em] mb-4">
            <Clock className="w-4 h-4 text-[#D4AF37] animate-spin-slow" />
            <span>{lang === 'en' ? 'Diwali 2026 Countdown' : 'தீபாவளி 2026 கவுண்ட்டவுன்'}</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-black p-3.5 rounded-none border border-white/5">
              <span className="block font-sans text-xl sm:text-2xl font-black text-white">{timeLeft.days}</span>
              <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-wider">{lang === 'en' ? 'Days' : 'நாட்கள்'}</span>
            </div>
            <div className="bg-black p-3.5 rounded-none border border-white/5">
              <span className="block font-sans text-xl sm:text-2xl font-black text-[#D4AF37]">{timeLeft.hours}</span>
              <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-wider">{lang === 'en' ? 'Hours' : 'மணி'}</span>
            </div>
            <div className="bg-black p-3.5 rounded-none border border-white/5">
              <span className="block font-sans text-xl sm:text-2xl font-black text-[#D4AF37]">{timeLeft.minutes}</span>
              <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-wider">{lang === 'en' ? 'Mins' : 'நிமி'}</span>
            </div>
            <div className="bg-black p-3.5 rounded-none border border-white/5">
              <span className="block font-sans text-xl sm:text-2xl font-black text-red-500">{timeLeft.seconds}</span>
              <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-wider">{lang === 'en' ? 'Secs' : 'வினாடி'}</span>
            </div>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 w-full">
          <button
            onClick={onShopClick}
            id="hero-shop-cta"
            className="w-full sm:w-auto px-10 py-4 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] cursor-pointer"
          >
            {translations.shopNow}
          </button>

          <button
            onClick={onContactClick}
            id="hero-contact-cta"
            className="w-full sm:w-auto px-10 py-4 border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Visit Store' : 'அங்காடியை காண'}
          </button>
        </div>

      </div>
    </header>
  );
}
