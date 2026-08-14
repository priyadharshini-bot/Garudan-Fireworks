/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import { Language } from '../types';

interface AdminLoginGateProps {
  lang: Language;
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLoginGate({ lang, onLoginSuccess, onCancel }: AdminLoginGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Valid admin passcodes
    const validCodes = ['GarudanAdmin2026', 'Garudan@1994', 'admin123', '19942026'];
    
    if (validCodes.includes(password.trim())) {
      onLoginSuccess();
    } else {
      setError(
        lang === 'en'
          ? 'SECURE VERIFICATION FAILED: Invalid Administrator Passphrase.'
          : 'பாதுகாப்பு சரிபார்ப்பு தோல்வி: தவறான கடவுச்சொல்.'
      );
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 font-sans py-12">
      <div className="w-full max-w-md p-8 bg-[#111111] border border-white/10 shadow-2xl relative space-y-6">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#D4AF37]" />
        
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-[#D4AF37]/10 rounded-none border border-[#D4AF37]/20 text-[#D4AF37] mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <span className="block text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
            {lang === 'en' ? 'RESTRICTED HQ AREA' : 'பாதுகாக்கப்பட்ட பகுதி'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-display">
            {lang === 'en' ? 'Administrative Access' : 'நிர்வாகி உள்நுழைவு'}
          </h2>
          <p className="text-xs text-neutral-400 font-sans max-w-xs mx-auto">
            {lang === 'en' 
              ? 'This console requires authorization. Please input your secure merchant passcode below.' 
              : 'இப்பகுதிக்குள் நுழைய தகுந்த கடவுச்சொல்லை உள்ளிடவும்.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[9px] uppercase font-mono tracking-widest text-[#D4AF37] font-bold">
              {lang === 'en' ? 'Passcode Coordinate' : 'கடவுச்சொல்'}
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-none bg-black border border-white/10 text-[#D4AF37] font-mono text-xs placeholder-neutral-700 focus:outline-none focus:border-[#D4AF37] tracking-widest"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/20 text-red-400 font-mono text-[10px] uppercase border border-red-500/20 text-center tracking-wider">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/3 py-3 bg-transparent text-neutral-400 font-bold uppercase tracking-widest text-[9px] border border-white/10 hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'Back' : 'பின்செல்'}
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>{lang === 'en' ? 'Authorize Session' : 'உள்நுழைக'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="border-t border-white/5 pt-4 text-center space-y-1">
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
            {lang === 'en' ? 'Authorized administrators only.' : 'அங்கீகரிக்கப்பட்ட நிர்வாகிகளுக்கு மட்டுமே.'}
          </p>
          <p className="text-[9px] text-neutral-500 font-sans">
            {lang === 'en' ? 'Enter your secure admin passcode to continue.' : 'தொடர உங்கள் நிர்வாக கடவுச்சொல்லை உள்ளிடவும்.'}
          </p>
        </div>
      </div>
    </div>
  );
}
