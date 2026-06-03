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
        href="https://wa.me/919092268462?text=Hi%20Garudan%20Fireworks,%20I'd%20like%20to%20know%20more%20about%20your%20diwali%20cracker%20prices!"
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
                  <span className="block text-xs text-neutral-400 leading-relaxed mt-0.5">
                    Garudan Fireworks Plant Lane, Virudhunagar Main Road, Sivakasi Road, Virudhunagar - 626123, Tamil Nadu, India.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <span className="block font-bold text-neutral-200 text-sm">Direct Phone Hotline</span>
                  <span className="block text-xs text-mono text-[#D4AF37] mt-0.5">+91 90922 68462, +91 4562 254123</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <span className="block font-bold text-neutral-200 text-sm">Administrative Email</span>
                  <span className="block text-xs text-mono text-[#D4AF37] mt-0.5">sales@garudanfireworks.com, info@garudan.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div>
                  <span className="block font-bold text-neutral-200 text-sm">Showroom Dispatch Timings</span>
                  <span className="block text-xs text-neutral-400 mt-0.5">Mon - Sun: 08:00 AM - 09:00 PM IST (Open on Holidays)</span>
                </div>
              </div>
            </div>

            {/* Simulated Luxury Google Maps visual representation */}
            <div className="relative h-60 w-full rounded-none overflow-hidden border border-white/5 shadow-lg bg-[#111111] group">
              
              {/* Custom SVG styling for map */}
              <svg viewBox="0 0 400 200" className="w-full h-full opacity-80 group-hover:scale-105 transition-all duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Map Grid Roads */}
                <rect width="400" height="200" fill="#131313" />
                <path d="M 0 40 H 400 M 0 140 H 400 M 120 0 V 200 M 300 0 V 200" stroke="#252525" strokeWidth="6" />
                <path d="M 0 100 Q 200 80, 400 130" stroke="#332211" strokeWidth="8" /> {/* Main Highway */}
                {/* Parks */}
                <rect x="20" y="50" width="80" height="70" rx="4" fill="#1B2A1E" opacity="0.4" />
                <rect x="320" y="10" width="60" height="110" rx="4" fill="#1B2A1E" opacity="0.4" />
                {/* Showroom pinpoint */}
                <circle cx="210" cy="95" r="30" fill="rgba(212,175,55,0.15)" />
                <circle cx="210" cy="95" r="10" fill="rgba(231,76,60,0.3)" />
                <path d="M210 80 L 210 110 M195 95 L225 95" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="210" cy="95" r="4" fill="#E74C3C" />
                {/* Text markers */}
                <text x="210" y="75" fill="#D4AF37" fontSize="10px" fontWeight="bold" textAnchor="middle">GARUDAN PLANT & CO.</text>
                <text x="50" y="85" fill="#555" fontSize="8px" textAnchor="middle">Sivakasi Reserved Forest</text>
                <text x="250" y="155" fill="#AA4444" fontSize="8px">NH-744 bypass lane</text>
              </svg>

              {/* Pin Overlay card */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/95 p-3 rounded-none border border-white/10 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="block font-bold text-xs text-white">Garudan Flagship Factory</span>
                  <span className="block text-[10px] text-neutral-400 font-mono">GPS Code: 9.4532° N, 77.8015° E</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Sivakasi+Fireworks"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#D4AF37] hover:bg-white text-black font-black uppercase tracking-widest text-[9px] rounded-none transition-all cursor-pointer"
                >
                  {lang === 'en' ? 'Get Directions' : 'வழித்தடம்'}
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
