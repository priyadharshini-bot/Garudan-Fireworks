import React from 'react';
import { Language } from '../types';

interface FloatingWhatsAppProps {
  lang: Language;
}

export default function FloatingWhatsApp({ lang }: FloatingWhatsAppProps) {
  const whatsappUrl = "https://wa.me/919092268462?text=hi%20can%20i%20get%20crackers%20price%20list";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      id="global-floating-whatsapp-trigger"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-105 active:scale-95 transition-all group duration-300 border-2 border-white/20"
      title={lang === 'en' ? 'Get Crackers Price List on WhatsApp' : 'வாட்ஸ்அப்பில் விலைப்பட்டியல் பெற'}
    >
      {/* Outer Pulse Ring Effect */}
      <span className="absolute -inset-1 rounded-full bg-[#25D366]/50 animate-ping -z-10 pointer-events-none" />

      {/* Official WhatsApp SVG Logo */}
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 fill-white shrink-0 drop-shadow-sm"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.67-1.622-.918-2.214-.242-.577-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>

      {/* Expandable Pill Text on Hover / Always visible badge on desktop */}
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs sm:text-sm font-extrabold tracking-wide text-white ml-0 group-hover:ml-2.5">
        {lang === 'en' ? 'Get Price List' : 'விலைப்பட்டியல் கேட்க'}
      </span>
    </a>
  );
}

