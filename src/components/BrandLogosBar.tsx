import React from 'react';

export default function BrandLogosBar() {
  const brandLogos = [
    // 1. Asok Crackers
    (
      <div key="asok" className="w-32 sm:w-36 px-3 py-2 rounded-xl bg-white border border-amber-300/50 shadow-md hover:scale-105 transition-transform flex items-center justify-center shrink-0">
        <svg viewBox="0 0 120 95" className="w-full h-12" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
          {/* Yellow Badge */}
          <circle cx="60" cy="30" r="25" fill="#FFDC00" stroke="#E50914" strokeWidth="3" />
          {/* Ant Graphic */}
          <g fill="#111">
            <ellipse cx="51" cy="25" rx="3" ry="4" transform="rotate(-20 51 25)" />
            <circle cx="50" cy="24" r="0.8" fill="#FFF" />
            <path d="M 49 22 C 46 16 43 14 41 16" fill="none" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 51 22 C 49 15 47 13 45 14" fill="none" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx="57" cy="30" rx="3.5" ry="3" transform="rotate(-30 57 30)" />
            <ellipse cx="67" cy="34" rx="7" ry="5" transform="rotate(-25 67 34)" />
            <path d="M 55 31 L 51 40 M 57 31 L 55 42 M 59 32 L 63 42" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* "ant" text */}
          <text x="69" y="24" fontSize="10" fontFamily="sans-serif" fontWeight="900" fill="#E50914">ant</text>
          {/* "Asok" brush text */}
          <text x="60" y="85" fontSize="26" fontFamily="Trebuchet MS, Arial Black, sans-serif" fontWeight="900" fill="#111" textAnchor="middle">
            Asok
          </text>
        </svg>
      </div>
    ),

    // 2. Sri Vijai (Twin Kiwi)
    (
      <div key="sri-vijai" className="w-32 sm:w-36 px-3 py-2 rounded-xl bg-white/95 border border-amber-300/50 shadow-md hover:scale-105 transition-transform flex items-center justify-center shrink-0">
        <svg viewBox="0 0 120 95" className="w-full h-12">
          {/* Red Circle Badge */}
          <circle cx="60" cy="30" r="26" fill="#E50914" stroke="#111" strokeWidth="2" />
          <circle cx="60" cy="30" r="24" fill="none" stroke="#FFF" strokeWidth="1.5" />
          
          {/* White Kiwis */}
          <path d="M 55 31 C 50 31 46 28 46 23 C 46 16 55 14 64 14 C 73 14 77 20 75 27 C 73 32 65 31 55 31 Z" fill="#FFF" />
          <path d="M 48 20 C 40 20 32 24 28 27 C 34 26 42 24 48 23 Z" fill="#FFF" />
          <path d="M 44 30 C 41 30 38 28 38 25 C 38 21 44 20 49 20 C 54 20 56 23 55 27 Z" fill="#FFF" />
          <path d="M 40 23 C 34 23 29 26 27 28 C 31 27 36 26 40 25 Z" fill="#FFF" />
          
          {/* Yellow Banner TWIN KIWI */}
          <rect x="35" y="36" width="50" height="13" rx="1" fill="#FFDC00" stroke="#111" strokeWidth="0.8" />
          <text x="60" y="44" fontSize="6.5" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#E50914" textAnchor="middle">TWIN KIWI</text>
          <text x="60" y="48" fontSize="3" fontFamily="sans-serif" fontWeight="bold" fill="#111" textAnchor="middle">TRADE MARK</text>

          {/* "Sri Vijai" Script */}
          <text x="60" y="85" fontSize="24" fontFamily="Brush Script MT, cursive, Trebuchet MS" fontWeight="900" fill="#111" textAnchor="middle">
            Sri Vijai
          </text>
        </svg>
      </div>
    ),

    // 3. Ajanta Fireworks
    (
      <div key="ajanta" className="w-32 sm:w-36 px-3 py-2 rounded-xl bg-white/95 border border-amber-300/50 shadow-md hover:scale-105 transition-transform flex items-center justify-center shrink-0">
        <svg viewBox="0 0 120 95" className="w-full h-12">
          {/* Purple Star with Red/Gold Outlines */}
          <polygon points="60,2 74,28 104,28 80,47 88,76 60,58 32,76 40,47 16,28 46,28" fill="#E50914" />
          <polygon points="60,5 73,29 101,29 78,47 86,74 60,57 34,74 42,47 19,29 47,29" fill="#FFDC00" />
          <polygon points="60,8 71,30 97,30 76,46 83,71 60,55 37,71 44,46 23,30 49,30" fill="#301070" />

          {/* "Ajanta" angled text */}
          <g transform="rotate(-8 60 35)">
            <text x="58" y="38" fontSize="22" fontFamily="Brush Script MT, cursive, Arial Black" fontWeight="900" fill="#FFF" stroke="#200050" strokeWidth="0.8" textAnchor="middle">
              Ajanta
            </text>
          </g>

          {/* Red Banner FIREWORKS */}
          <g transform="rotate(-6 60 56)">
            <rect x="28" y="47" width="64" height="15" rx="3" fill="#E50914" stroke="#FFDC00" strokeWidth="1" />
            <text x="60" y="58" fontSize="8.5" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#FFF" textAnchor="middle" letterSpacing="1">
              FIREWORKS
            </text>
          </g>
        </svg>
      </div>
    ),

    // 4. Vanitha
    (
      <div key="vanitha" className="w-32 sm:w-36 px-3 py-2 rounded-xl bg-white/95 border border-amber-300/50 shadow-md hover:scale-105 transition-transform flex items-center justify-center shrink-0">
        <svg viewBox="0 0 120 95" className="w-full h-12">
          <defs>
            <linearGradient id="vanithaBgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#001C99" />
            </linearGradient>
          </defs>
          
          {/* Blue TV Container */}
          <rect x="26" y="4" width="68" height="52" rx="12" fill="#FFF" stroke="#111" strokeWidth="2" />
          <rect x="29" y="7" width="62" height="46" rx="9" fill="url(#vanithaBgGradient)" />

          {/* White V Graphic */}
          <polygon points="34,18 47,18 60,42 73,18 86,18 60,49" fill="#FFFFFF" />

          {/* Registered Symbol (R) */}
          <circle cx="88" cy="10" r="4.5" fill="#FFDC00" stroke="#111" strokeWidth="0.8" />
          <text x="88" y="12.5" fontSize="5" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#111" textAnchor="middle">R</text>

          {/* VANITHA Red Bold Text */}
          <text x="60" y="85" fontSize="23" fontFamily="Impact, Arial Black, sans-serif" fontWeight="900" fill="#E50914" stroke="#FFF" strokeWidth="0.5" textAnchor="middle" letterSpacing="0.5">
            VANITHA
          </text>
        </svg>
      </div>
    ),

    // 5. Ayyan's (Bunny Brand)
    (
      <div key="ayyans" className="w-32 sm:w-36 px-3 py-2 rounded-xl bg-white/95 border border-amber-300/50 shadow-md hover:scale-105 transition-transform flex items-center justify-center shrink-0">
        <svg viewBox="0 0 120 95" className="w-full h-12">
          {/* Outer Yellow Ring */}
          <circle cx="60" cy="30" r="28" fill="#FFC800" stroke="#111" strokeWidth="2" />
          <circle cx="60" cy="30" r="20" fill="#111111" />

          {/* Ring Curved Text */}
          <path id="bunnyTextTopArc" d="M 36,30 A 24,24 0 0,1 84,30" fill="none" />
          <text fontSize="4.5" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#111">
            <textPath href="#bunnyTextTopArc" startOffset="50%" textAnchor="middle">BUNNY BRAND</textPath>
          </text>
          
          <path id="bunnyTextBottomArc" d="M 84,30 A 24,24 0 0,1 36,30" fill="none" />
          <text fontSize="3.8" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#111">
            <textPath href="#bunnyTextBottomArc" startOffset="50%" textAnchor="middle">FANCY FIREWORKS</textPath>
          </text>

          {/* Stars */}
          <circle cx="35" cy="30" r="1.2" fill="#111" />
          <circle cx="85" cy="30" r="1.2" fill="#111" />

          {/* Bunny face */}
          <ellipse cx="55" cy="19" rx="3" ry="8" fill="#FFF" stroke="#111" strokeWidth="0.8" />
          <ellipse cx="55" cy="19" rx="1.5" ry="5" fill="#E50914" />
          <ellipse cx="65" cy="19" rx="3" ry="8" fill="#FFF" stroke="#111" strokeWidth="0.8" />
          <ellipse cx="65" cy="19" rx="1.5" ry="5" fill="#E50914" />
          <path d="M 50 34 Q 50 28 60 28 Q 70 28 70 34 Q 60 39 50 34 Z" fill="#FFF" />
          <circle cx="60" cy="30" r="1.5" fill="#E50914" />
          <ellipse cx="57" cy="27" rx="1.2" ry="2" fill="#FFF" stroke="#111" strokeWidth="0.5" />
          <ellipse cx="63" cy="27" rx="1.2" ry="2" fill="#FFF" stroke="#111" strokeWidth="0.5" />
          <circle cx="57" cy="27" r="0.6" fill="#E50914" />
          <circle cx="63" cy="27" r="0.6" fill="#E50914" />

          {/* "Ayyan's" Yellow & Red Text */}
          <text x="60" y="85" fontSize="24" fontFamily="Arial Black, Trebuchet MS, sans-serif" fontWeight="900" fill="#FFCC00" stroke="#E50914" strokeWidth="2" textAnchor="middle">
            Ayyan's
          </text>
        </svg>
      </div>
    ),

    // 6. Sony (Snail Brand)
    (
      <div key="sony" className="w-32 sm:w-36 px-3 py-2 rounded-xl bg-white/95 border border-amber-300/50 shadow-md hover:scale-105 transition-transform flex items-center justify-center shrink-0">
        <svg viewBox="0 0 120 95" className="w-full h-12">
          {/* Red Shield */}
          <path d="M 40 4 Q 60 2 80 4 Q 86 24 84 42 Q 60 46 36 42 Q 34 24 40 4 Z" fill="#E50914" />

          {/* Yellow Circle */}
          <circle cx="60" cy="23" r="15" fill="#FFDC00" stroke="#111" strokeWidth="1.2" />

          {/* Snail Graphic */}
          <g fill="#111">
            <circle cx="62" cy="22" r="6" fill="#111" />
            <circle cx="62" cy="22" r="4" fill="#FFDC00" />
            <circle cx="62" cy="22" r="2" fill="#111" />
            <path d="M 52 26 Q 50 20 48 18 Q 47 17 48 20 Q 52 28 67 27 Q 69 27 67 25 Q 58 25 52 26 Z" />
            <circle cx="48" cy="18" r="0.8" />
          </g>

          <text x="60" y="13" fontSize="3.2" fontFamily="sans-serif" fontWeight="900" fill="#111" textAnchor="middle">SNAIL BRAND</text>
          <text x="60" y="34" fontSize="2.8" fontFamily="sans-serif" fontWeight="bold" fill="#111" textAnchor="middle">TRADE MARK</text>

          {/* SONY Speed Text */}
          <g>
            <text x="60" y="85" fontSize="26" fontFamily="Impact, Arial Black, sans-serif" fontWeight="900" fontStyle="italic" fill="#E50914" stroke="#FFF" strokeWidth="1" textAnchor="middle" letterSpacing="1">
              SONY
            </text>
            <line x1="30" y1="69" x2="90" y2="69" stroke="#FFF" strokeWidth="1" />
            <line x1="32" y1="74" x2="88" y2="74" stroke="#FFF" strokeWidth="1" />
            <line x1="34" y1="79" x2="86" y2="79" stroke="#FFF" strokeWidth="1" />
          </g>
        </svg>
      </div>
    ),

    // 7. YES BRO Crackers
    (
      <div key="yesbro" className="w-32 sm:w-36 px-3 py-2 rounded-xl bg-white/95 border border-amber-300/50 shadow-md hover:scale-105 transition-transform flex items-center justify-center shrink-0">
        <svg viewBox="0 0 120 95" className="w-full h-12">
          {/* Yellow Circle Badge */}
          <circle cx="60" cy="30" r="28" fill="#FFDC00" stroke="#111" strokeWidth="2" />
          <circle cx="60" cy="30" r="20" fill="#FFF" stroke="#111" strokeWidth="1" />

          {/* Curved Text YES BRO */}
          <path id="yesbroArcTop" d="M 36,30 A 24,24 0 0,1 84,30" fill="none" />
          <text fontSize="5" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#E50914">
            <textPath href="#yesbroArcTop" startOffset="50%" textAnchor="middle">YES BRO</textPath>
          </text>

          {/* Curved Text CRACKERS */}
          <path id="yesbroArcBottom" d="M 84,30 A 24,24 0 0,1 36,30" fill="none" />
          <text fontSize="4.2" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#E50914">
            <textPath href="#yesbroArcBottom" startOffset="50%" textAnchor="middle">CRACKERS</textPath>
          </text>

          {/* Side Stars */}
          <polygon points="36,30 37.5,27 40,29 38,31 39,33" fill="#E50914" />
          <polygon points="84,30 82.5,27 80,29 82,31 81,33" fill="#E50914" />

          {/* Green Peacock Crest Emblem */}
          <g fill="#00A651">
            {/* Peacock head dots */}
            <circle cx="58" cy="18" r="1" />
            <circle cx="60" cy="17" r="1" />
            <circle cx="62" cy="18" r="1" />
            <path d="M 58 18 L 60 21 M 60 17 L 60 21 M 62 18 L 60 21" stroke="#00A651" strokeWidth="0.8" />
            {/* S-shaped peacock body */}
            <path d="M 60 21 Q 65 21 64 26 Q 62 30 57 30 Q 52 30 55 35 Q 58 40 65 38 C 60 43 50 43 48 37 Q 46 32 52 28 Q 57 25 56 22 Z" />
          </g>

          {/* Red Banner "YES BRO" */}
          <rect x="20" y="68" width="80" height="22" rx="3" fill="#E50914" stroke="#FFF" strokeWidth="1" />
          <text x="60" y="84" fontSize="15" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#FFF" textAnchor="middle" letterSpacing="1">
            YES BRO
          </text>
        </svg>
      </div>
    ),

    // 8. Robin Brand (Sri Ramesh Sparklers)
    (
      <div key="robin" className="w-32 sm:w-36 px-3 py-2 rounded-xl bg-white/95 border border-amber-300/50 shadow-md hover:scale-105 transition-transform flex items-center justify-center shrink-0">
        <svg viewBox="0 0 120 95" className="w-full h-12">
          {/* Yellow Circle Badge */}
          <circle cx="60" cy="30" r="28" fill="#FFDC00" stroke="#111" strokeWidth="2" />
          <circle cx="60" cy="30" r="20" fill="none" stroke="#111" strokeWidth="1.2" />

          {/* ROBIN Top Text */}
          <path id="robinArcTop" d="M 36,30 A 24,24 0 0,1 84,30" fill="none" />
          <text fontSize="7" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#111">
            <textPath href="#robinArcTop" startOffset="50%" textAnchor="middle">ROBIN</textPath>
          </text>

          {/* BRAND Bottom Text */}
          <path id="robinArcBottom" d="M 84,30 A 24,24 0 0,1 36,30" fill="none" />
          <text fontSize="6" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#111">
            <textPath href="#robinArcBottom" startOffset="50%" textAnchor="middle">BRAND</textPath>
          </text>

          {/* Side Black Stars */}
          <polygon points="36,30 37.5,27.5 40,29 38,31 39,33.5" fill="#111" />
          <polygon points="84,30 82.5,27.5 80,29 82,31 81,33.5" fill="#111" />

          {/* Robin Bird Center Icon */}
          <g fill="none" stroke="#111" strokeWidth="1.5">
            {/* Bird Head */}
            <circle cx="62" cy="22" r="4.5" fill="#FFDC00" />
            <circle cx="61" cy="21" r="1" fill="#111" />
            {/* Beak */}
            <path d="M 66 20 L 70 20 L 66 23 Z" fill="#111" stroke="none" />
            {/* Heart Body */}
            <path d="M 62 26 C 62 26 55 24 53 29 C 51 34 58 39 62 42 C 66 39 73 34 71 29 C 69 24 62 26 62 26 Z" fill="#FFDC00" />
            {/* Tail lines */}
            <line x1="53" y1="29" x2="40" y2="23" strokeWidth="1.5" />
            <line x1="52" y1="33" x2="39" y2="30" strokeWidth="1.5" />
            <line x1="53" y1="36" x2="40" y2="38" strokeWidth="1.5" />
            {/* Legs */}
            <line x1="60" y1="42" x2="60" y2="46" strokeWidth="1.5" />
            <line x1="64" y1="42" x2="64" y2="46" strokeWidth="1.5" />
            <line x1="58" y1="46" x2="66" y2="46" strokeWidth="1.5" />
          </g>

          {/* Sri Ramesh Sparklers Text */}
          <text x="60" y="82" fontSize="10" fontFamily="Trebuchet MS, Arial, sans-serif" fontWeight="bold" fill="#111" textAnchor="middle">
            Sri Ramesh Sparklers
          </text>
        </svg>
      </div>
    )
  ];

  return (
    <div className="w-full overflow-hidden py-2 bg-neutral-900/40 border-y border-amber-500/20 backdrop-blur-sm">
      <div className="animate-marquee flex items-center gap-5">
        {/* Set 1 */}
        {brandLogos.map((logo, idx) => (
          <React.Fragment key={`set1-${idx}`}>{logo}</React.Fragment>
        ))}
        {/* Set 2 (for continuous loop) */}
        {brandLogos.map((logo, idx) => (
          <React.Fragment key={`set2-${idx}`}>{logo}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
