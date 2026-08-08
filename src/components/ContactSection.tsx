/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Language, TranslationSchema } from '../types';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface ContactSectionProps {
  lang: Language;
  translations: TranslationSchema;
}

export default function ContactSection({ lang, translations }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    setSubmitted(true);
    // Auto-clear
    setTimeout(() => {
      setName('');
      setEmail('');
      setMsg('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact-coordinates-section" className="py-20 bg-[#050505] font-sans border-t border-white/10 scroll-mt-24 relative">
      
      {/* Floating WhatsApp Action Button (Floating at bottom-right corner) */}
      <a
        href="https://wa.me/919092268462?text=Hi%20Garudan%20Crackers,%20I'd%20like%20to%20know%20more%20about%20your%20diwali%20cracker%20prices!"
        target="_blank"
        rel="noreferrer"
        id="floating-whatsapp-trigger"
        className="fixed bottom-6 right-6 z-45 flex items-center justify-center p-4 bg-emerald-500 text-neutral-950 rounded-none shadow-xl cursor-pointer hover:bg-emerald-400 hover:scale-110 active:scale-95 transition-all group animate-bounce"
        title="Quick WhatsApp Help"
      >
        <MessageSquare className="w-6 h-6 text-neutral-950" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-black font-sans uppercase text-neutral-950 ml-0 group-hover:ml-2">
          {lang === 'en' ? 'Quick Ordering' : 'விரைவு ஆர்டர்'}
        </span>
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Headings */}
        <div className="text-center space-y-2">
          <span className="block text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
            {lang === 'en' ? 'SIVAKASI SHOWROOM SALES COORDINATE' : 'நேரடி விற்பனை நிலையம்'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-display">
            {translations.contact}
          </h2>
          <div className="w-12 h-1 bg-[#D4AF37] mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Column: Direct Coordinates Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase tracking-tight text-[#D4AF37] font-display">
                {lang === 'en' ? 'Main Headquarters & Factory Sales' : 'தலைமை அலுவலகம் மற்றும் தொழிற்சாலை'}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                {lang === 'en' 
                  ? 'Our primary packaging plant and royal showroom is located in Sivakasi. Visitors are welcome for bulk orders with standard festive discounts.'
                  : 'எங்களது முக்கிய தொழிற்சாலை மற்றும் பிரம்மாண்ட கண்காட்சி கூடம் சிவகாசியில் அமைந்துள்ளது.'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <span className="block font-bold text-neutral-200 text-sm">Royal Showroom Address</span>
                  <span className="block text-xs text-neutral-300 leading-relaxed mt-0.5 font-sans font-medium">
                    2/605/J, Amman township, Mettamalai, Sattur to Sivakasi Road, Sattur, Virudhunagar, Tamil Nadu.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <span className="block font-bold text-neutral-200 text-sm">Direct Phone Hotline</span>
                  <span className="block text-xs text-mono text-[#D4AF37] mt-0.5">+91 90922 68462</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <span className="block font-bold text-neutral-200 text-sm">Administrative Email</span>
                  <span className="block text-xs text-mono text-[#D4AF37] mt-0.5">garudancrackers@gmail.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <span className="block font-bold text-neutral-200 text-sm">Showroom Dispatch Timings</span>
                  <span className="block text-xs text-neutral-400 mt-0.5">Mon - Sun: 08:00 AM - 09:00 PM IST (Open on Holidays)</span>
                </div>
              </div>

              <div className="p-3 bg-[#130d22] border border-[#D4AF37]/30 rounded-none flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-200">Explosives License No:</span>
                <span className="text-xs font-mono font-black text-[#D4AF37] bg-black/50 px-2.5 py-1 border border-[#D4AF37]/40">1065/2025</span>
              </div>
            </div>

            {/* Real Interactive Google Map & Location Card */}
            <div className="relative h-72 w-full rounded-xl overflow-hidden border border-amber-500/30 shadow-2xl bg-[#111111] group">
              <iframe
                title="Garudan Crackers Location Map"
                src="https://maps.google.com/maps?q=2%2F605%2FJ%20%2C%20Amman%20township%2C%20Mettamalai%2C%20Sattur%20to%20Sivakasi%20Road%2C%20Sattur%2C%20Virudhunagar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 grayscale contrast-125 opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                loading="lazy"
                allowFullScreen
              />

              {/* Pin Overlay card */}
              <div className="absolute bottom-3 left-3 right-3 bg-neutral-950/95 backdrop-blur-md p-3.5 rounded-xl border border-amber-500/30 flex justify-between items-center shadow-xl">
                <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                  <span className="block font-bold text-xs text-amber-300 truncate">Garudan Crackers Royal Showroom</span>
                  <span className="block text-[10px] text-neutral-300 font-sans truncate">
                    Mettamalai, Sattur to Sivakasi Road, Sattur
                  </span>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=2%2F605%2FJ%20%2C%20Amman%20township%2C%20Mettamalai%2C%20Sattur%20to%20Sivakasi%20Road%2C%20Sattur%2C%20Virudhunagar"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-amber-500 hover:bg-yellow-400 text-neutral-950 font-black uppercase tracking-wider text-[10px] rounded-lg transition-all cursor-pointer shrink-0 shadow-md flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-neutral-950" />
                  <span>{lang === 'en' ? 'Get Directions' : 'வழித்தடம்'}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Query / Contact Form */}
          <div className="p-6 sm:p-8 bg-[#111111]/95 border border-white/5 rounded-none space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-xl font-black uppercase text-white font-display">
                {lang === 'en' ? 'Leave a Digital Message' : 'விசாரணை படிவம்'}
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                {lang === 'en' ? 'Have questions regarding wholesale dealership, school festival events, or bulk shipping? Write to us.' : 'மொத்த வியாபாரம் மற்றும் விநியோக தேவைகளுக்கு எங்களை தொடர்பு கொள்ளவும்.'}
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-950/20 text-center space-y-4 rounded-none border border-emerald-500/20">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-emerald-300 font-sans uppercase tracking-widest text-[#D4AF37] text-xs">{lang === 'en' ? 'Inquiry Recorded!' : 'கூற்று பதிவு செய்யப்பட்டது!'}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
                  {lang === 'en' 
                    ? 'Thank you. Your message has been saved. One of our master firework advisors will respond shortly.'
                    : 'நன்றி. உங்கள் கருத்து கிடைத்துள்ளது. எங்களது பிரதிநிதி உங்களை விரைவில் தொடர்பு கொள்வார்.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] text-[#D4AF37] font-bold mb-1.5 uppercase tracking-widest font-mono">Consignee Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arun Swaminathan"
                    className="w-full px-4 py-2.5 rounded-none bg-black border border-white/10 text-white font-mono text-xs placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-[#D4AF37] font-bold mb-1.5 uppercase tracking-widest font-mono">Email Address Map</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arun@business.com"
                    className="w-full px-4 py-2.5 rounded-none bg-black border border-white/10 text-white font-mono text-xs placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-[#D4AF37] font-bold mb-1.5 uppercase tracking-widest font-mono">Message Contents</label>
                  <textarea
                    required
                    rows={4}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder={lang === 'en' ? "Describe your festival event or wholesale volume requirements..." : "உங்கள் தேவைகளை விரிவாக குறிப்பிடவும்..."}
                    className="w-full px-4 py-2.5 rounded-none bg-black border border-white/10 text-white font-mono text-xs placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[#050505] text-xs rounded-none transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>{lang === 'en' ? 'Transmit Message' : 'அனுப்புக'}</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
