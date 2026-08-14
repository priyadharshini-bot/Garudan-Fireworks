/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

interface CrackerVisualProps {
  type: string;
  className?: string;
}

const PRESET_KEYS = [
  'sparkler', 'sparkler_multi', 'flowerpot_gold', 'flowerpot_color',
  'rocket_whistle', 'rocket_pack', 'bomb_green', 'bomb_red',
  'fancy_cake12', 'fancy_cake30', 'kids_snake', 'kids_wheel',
  'giftbox_silver', 'giftbox_gold', 'combo_double'
];

export default function CrackerVisual({ type, className = "w-full h-full" }: CrackerVisualProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state immediately whenever the image source prop changes
  useEffect(() => {
    setHasError(false);
  }, [type]);

  const cleanType = (type || '').trim();

  // If cleanType is a data URI, URL, path, blob, or custom image string (not a preset key)
  const isImageSource = 
    Boolean(cleanType) && (
      cleanType.startsWith('data:') ||
      cleanType.startsWith('http://') ||
      cleanType.startsWith('https://') ||
      cleanType.startsWith('/') ||
      cleanType.startsWith('./') ||
      cleanType.startsWith('blob:') ||
      cleanType.startsWith('assets/') ||
      cleanType.startsWith('images/') ||
      cleanType.startsWith('uploads/') ||
      !PRESET_KEYS.includes(cleanType)
    );

  if (isImageSource && !hasError) {
    return (
      <img 
        key={cleanType}
        src={cleanType} 
        alt="Product Visual" 
        className={`${className} object-contain`} 
        onError={() => setHasError(true)}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    );
  }

  // Return glowing vector illustrations based on the product type key
  switch (cleanType) {
    case 'sparkler':
    case 'sparkler_multi':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="16" fill="url(#bg-gradient)" />
          {/* Sparkler Wire stick */}
          <line x1="50" y1="45" x2="50" y2="90" stroke="#7E7E7E" strokeWidth="3" strokeLinecap="round" />
          {/* Sparkler element wrapper */}
          <rect x="47" y="25" width="6" height="25" rx="3" fill="#D4AF37" filter="url(#gold-glow)" />
          {/* Spark emission lines */}
          <circle cx="50" cy="25" r="3" fill="#FFF" filter="url(#white-glow)" />
          <path d="M50 25 L30 10 M50 25 L70 10 M50 25 L25 25 M50 25 L75 25 M50 25 L35 40 M50 25 L65 40 M50 25 L50 5" stroke="#F1C40F" strokeWidth="2" strokeLinecap="round" filter="url(#gold-glow)" />
          <path d="M50 25 L40 18 M50 25 L60 18 M50 25 L35 30 M50 25 L65 30 M50 25 L45 35 M50 25 L55 35" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="30" cy="10" r="1.5" fill="#FFF" />
          <circle cx="70" cy="10" r="1.5" fill="#FFF" />
          <circle cx="25" cy="25" r="1.5" fill="#FFF" />
          <circle cx="75" cy="25" r="1.5" fill="#FFF" />
          
          <defs>
            <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E130C" />
              <stop offset="100%" stopColor="#0B0604" />
            </radialGradient>
            <filter id="gold-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="white-glow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      );

    case 'flowerpot_gold':
    case 'flowerpot_color':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="16" fill="url(#bg-gradient)" />
          {/* Flowerpot Clay Cone */}
          <path d="M50 30 L30 80 H70 Z" fill="#C0392B" stroke="#D4AF37" strokeWidth="1.5" />
          {/* Elegant gold design bands */}
          <path d="M42 50 L38 60 H62 L58 50 Z" fill="#D4AF37" opacity="0.8" />
          <path d="M34 70 H66 V76 H34 Z" fill="#D4AF37" opacity="0.9" />
          {/* Fountain Sprout */}
          <path d="M47 30 H53 V25 H47 Z" fill="#E67E22" />
          {/* Fountain Spray arcs */}
          <path d="M50 25 C40 5, 20 20, 15 45" stroke="#F1C40F" strokeWidth="2.5" strokeDasharray="2 2" filter="url(#gold-glow)" />
          <path d="M50 25 C60 5, 80 20, 85 45" stroke="#F1C40F" strokeWidth="2.5" strokeDasharray="2 2" filter="url(#gold-glow)" />
          <path d="M50 25 C45 0, 30 10, 25 35" stroke="#E67E22" strokeWidth="2" strokeDasharray="1 1" />
          <path d="M50 25 C55 0, 70 10, 75 35" stroke="#E67E22" strokeWidth="2" strokeDasharray="1 1" />
          <path d="M50 25 C50 -5, 50 -10, 50 15" stroke="#FFF" strokeWidth="3" filter="url(#white-glow)" />
          <circle cx="50" cy="23" r="4" fill="#E67E22" />
          {/* Spark nodes */}
          <circle cx="15" cy="45" r="2" fill="#E74C3C" />
          <circle cx="85" cy="45" r="2" fill="#2ECC71" />
          <circle cx="25" cy="35" r="2.5" fill="#F1C40F" />
          <circle cx="75" cy="35" r="2.5" fill="#9B59B6" />

          <defs>
            <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1A0D00" />
              <stop offset="100%" stopColor="#080400" />
            </radialGradient>
            <filter id="gold-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="white-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      );

    case 'rocket_whistle':
    case 'rocket_pack':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="16" fill="url(#bg-gradient)" />
          {/* Supporting stick */}
          <line x1="38" y1="45" x2="68" y2="90" stroke="#8E8E8E" strokeWidth="1.5" />
          {/* Rocket Cylinder body */}
          <g transform="rotate(-30 50 50)">
            <rect x="42" y="30" width="16" height="40" rx="2" fill="#3498DB" stroke="#D4AF37" strokeWidth="1.5" />
            {/* Cone cap */}
            <path d="M42 30 L50 12 L58 30 Z" fill="#E74C3C" stroke="#D4AF37" strokeWidth="1" />
            {/* Bottom exhaust details */}
            <rect x="44" y="70" width="12" height="4" fill="#34495E" />
            {/* Golden Ribbon fuse */}
            <path d="M50 74 C50 82, 53 84, 52 90" stroke="#F1C40F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Exhaust fire */}
            <path d="M46 74 L50 92 L54 74 Z" fill="#E67E22" opacity="0.9" filter="url(#fire-glow)" />
            <path d="M48 74 L50 86 L52 74 Z" fill="#F1C40F" />
          </g>

          <defs>
            <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0B131A" />
              <stop offset="100%" stopColor="#030609" />
            </radialGradient>
            <filter id="fire-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      );

    case 'bomb_green':
    case 'bomb_red':
      const isGreen = type === 'bomb_green';
      const bombColor = isGreen ? '#27AE60' : '#C0392B';
      const fuseGlow = isGreen ? '#2ECC71' : '#E74C3C';
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="16" fill="url(#bg-gradient)" />
          {/* Round Threaded Bomb sphere */}
          <circle cx="50" cy="55" r="26" fill={bombColor} stroke="#E67E22" strokeWidth="2" filter="url(#bomb-shadow)" />
          {/* Thread textures */}
          <path d="M26 44 C 40 40, 60 40, 74 44" stroke="#FFF" strokeWidth="1.2" opacity="0.5" strokeDasharray="3 3"/>
          <path d="M24 55 H76" stroke="#FFF" strokeWidth="1.2" opacity="0.5" strokeDasharray="3 3"/>
          <path d="M26 66 C 40 70, 60 70, 74 66" stroke="#FFF" strokeWidth="1.2" opacity="0.5" strokeDasharray="3 3"/>
          <path d="M50 29 V81" stroke="#D4AF37" strokeWidth="2.5" opacity="0.8"/>
          <path d="M35 35 L65 75" stroke="#D4AF37" strokeWidth="1" opacity="0.4"/>
          {/* Top Brass neck */}
          <rect x="44" y="24" width="12" height="6" rx="1" fill="#D4AF37" />
          {/* Winding burning fuse */}
          <path d="M50 24 C 50 12, 60 16, 58 6" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 24 C 50 12, 60 16, 58 6" stroke="#E67E22" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 1" />
          {/* Burning Spark */}
          <circle cx="58" cy="6" r="3.5" fill="#FFF" filter="url(#spark-glow)" />
          <path d="M58 6 L52 0 M58 6 L64 0 M58 6 L53 12 M58 6 L63 12" stroke="#F1C40F" strokeWidth="1" />

          <defs>
            <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isGreen ? "#081F10" : "#1F0808"} />
              <stop offset="100%" stopColor="#050303" />
            </radialGradient>
            <filter id="bomb-shadow">
              <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#000" floodOpacity="0.8" />
            </filter>
            <filter id="spark-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      );

    case 'fancy_cake12':
    case 'fancy_cake30':
      const isLarge = type === 'fancy_cake30';
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="16" fill="url(#bg-gradient)" />
          {/* Multishot shell container box */}
          <rect x="22" y="38" width="56" height="46" rx="4" fill="#1C1C1C" stroke="#D4AF37" strokeWidth="2" />
          {/* Luxury design sticker */}
          <rect x="26" y="42" width="48" height="38" rx="2" fill="#7B1FA2" opacity="0.9" />
          {/* Brand star icon in central sticker */}
          <polygon points="50,48 53,55 60,55 55,59 57,66 50,62 43,66 45,59 40,55 47,55" fill="#F1C40F" />
          {/* Core launcher tubes */}
          <rect x="26" y="24" width="8" height="14" rx="1" fill="#D4AF37" opacity="0.8" />
          <rect x="38" y="24" width="8" height="14" rx="1" fill="#D4AF37" opacity="0.8" />
          <rect x="50" y="24" width="8" height="14" rx="1" fill="#D4AF37" opacity="0.8" />
          <rect x="62" y="24" width="8" height="14" rx="1" fill="#D4AF37" opacity="0.8" />
          {/* Firing spark */}
          <path d="M54 20 L54 10" stroke="#FFF" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="54" cy="10" r="2.5" fill="#F1C40F" filter="url(#gold-glow)" />

          <text x="50" y="74" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
            {isLarge ? "30 SHOTS" : "12 SHOTS"}
          </text>
          <text x="50" y="79" fill="#F1C40F" fontSize="4" textAnchor="middle" opacity="0.7">
            AERIAL MULTICOLOUR
          </text>

          <defs>
            <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E0E2C" />
              <stop offset="100%" stopColor="#060309" />
            </radialGradient>
            <filter id="gold-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      );

    case 'kids_snake':
    case 'kids_wheel':
      const isWheel = type === 'kids_wheel';
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="16" fill="url(#bg-gradient)" />
          {isWheel ? (
            /* Ground spinner wheel */
            <g transform="translate(50 50)">
              <circle cx="0" cy="0" r="32" fill="#D84315" stroke="#F1C40F" strokeWidth="2" />
              <circle cx="0" cy="0" r="22" fill="#FFEB3B" opacity="0.9" />
              <path d="M0 -32 A 32 32 0 0 1 32 0 L 0 0 Z" fill="#9E9D24" opacity="0.5" />
              <path d="M0 32 A 32 32 0 0 1 -32 0 L 0 0 Z" fill="#2E7D32" opacity="0.5" />
              <circle cx="0" cy="0" r="6" fill="#D32F2F" />
              {/* Spinning energy swooshes */}
              <path d="M0 -34 C 20 -34, 38 -20, 38 0" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" filter="url(#gold-glow)" />
              <path d="M0 34 C -20 34, -38 20, -38 0" stroke="#F1C40F" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </g>
          ) : (
            /* Magical serpents snake box */
            <g>
              <rect x="25" y="28" width="50" height="50" rx="3" fill="#0D5330" stroke="#D4AF37" strokeWidth="1.5" />
              {/* Golden snake vector logo on packet */}
              <path d="M35 48 C35 40, 42 40, 45 48 C48 56, 55 56, 55 48 C55 42, 62 44, 60 36" stroke="#F1C40F" strokeWidth="3" strokeLinecap="round" />
              <circle cx="60" cy="36" r="2.5" fill="#E74C3C" />
              <text x="50" y="70" fill="#FFF" fontSize="6px" fontWeight="bold" textAnchor="middle">MAGIC SNAKES</text>
            </g>
          )}

          <defs>
            <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0B130E" />
              <stop offset="100%" stopColor="#030604" />
            </radialGradient>
            <filter id="gold-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      );

    case 'giftbox_silver':
    case 'giftbox_gold':
      const isImperial = type === 'giftbox_gold';
      const chestColor1 = isImperial ? '#7A1C1C' : '#2C3E50';
      const chestColor2 = isImperial ? '#A31F1F' : '#34495E';
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="16" fill="url(#bg-gradient)" />
          {/* Royal Gift Box Container */}
          <rect x="18" y="32" width="64" height="48" rx="5" fill={chestColor1} stroke="#D4AF37" strokeWidth="2" filter="url(#box-shadow)" />
          {/* Glowing lid lid line */}
          <rect x="15" y="26" width="70" height="12" rx="3" fill={chestColor2} stroke="#D4AF37" strokeWidth="1.5" />
          {/* Satin ribbon vertical */}
          <rect x="45" y="26" width="10" height="54" fill="#D4AF37" />
          {/* Satin ribbon horizontal */}
          <rect x="18" y="50" width="64" height="8" fill="#D4AF37" />
          {/* Magnificent Gold Bow Ribbon tying */}
          <path d="M40 26 C30 14, 48 10, 50 26 C52 10, 70 14, 60 26 Z" fill="#F1C40F" stroke="#D4AF37" strokeWidth="1" filter="url(#gold-glow)" />
          <circle cx="50" cy="26" r="4.5" fill="#E67E22" stroke="#FFF" strokeWidth="1" />
          {/* Sparkles radiating */}
          <circle cx="28" cy="20" r="1.5" fill="#FFF" />
          <polyline points="28,15 28,25" stroke="#F1C40F" strokeWidth="0.8" />
          <polyline points="23,20 33,20" stroke="#F1C40F" strokeWidth="0.8" />
          
          <circle cx="72" cy="20" r="1.5" fill="#FFF" />
          <polyline points="72,15 72,25" stroke="#F1C40F" strokeWidth="0.8" />
          <polyline points="67,20 77,20" stroke="#F1C40F" strokeWidth="0.8" />

          {/* Premium emblem */}
          <polygon points="50,56 52,61 57,61 53,64 55,69 50,66 45,69 47,64 43,61 48,61" fill="#FFF" />

          <defs>
            <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isImperial ? "#2A0D0D" : "#0F1A24"} />
              <stop offset="100%" stopColor="#050303" />
            </radialGradient>
            <filter id="box-shadow">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.8" />
            </filter>
            <filter id="gold-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      );

    case 'combo_double':
    default:
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="16" fill="url(#bg-gradient)" />
          {/* Super Mega combo illustration showing multiple products bundled */}
          {/* Red star pack behind */}
          <rect x="22" y="24" width="28" height="34" rx="2" fill="#E74C3C" stroke="#F1C40F" strokeWidth="1" transform="rotate(-15 36 41)" />
          {/* Blue rocket sticking out */}
          <rect x="52" y="15" width="12" height="30" rx="1" fill="#3498DB" stroke="#D4AF37" strokeWidth="1" transform="rotate(20 58 30)" />
          <path d="M52 15 L58 -2 L64 15 Z" fill="#F1C40F" transform="rotate(20 58 30)" />
          {/* Yellow flower pot on front */}
          <path d="M54 44 L40 76 H68 Z" fill="#F1C40F" stroke="#E67E22" strokeWidth="1.2" />
          {/* Big ribbon banner wrapper */}
          <path d="M12 66 H88 V76 H12 Z" fill="#D4AF37" filter="url(#gold-glow)" />
          <text x="50" y="73" fill="#000" fontSize="7px" fontWeight="bold" textAnchor="middle">SUPER COMBO</text>

          <defs>
            <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E1705" />
              <stop offset="100%" stopColor="#080601" />
            </radialGradient>
            <filter id="gold-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      );
  }
}
