/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Language, TranslationSchema, Offer } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // Sparklers
  {
    id: 'spk-1',
    nameEn: 'Electric Sparklers (10cm)',
    nameTa: 'மின்சார கம்பி மத்தாப்பு',
    category: 'Sparklers',
    price: 120,
    originalPrice: 180,
    descriptionEn: 'Golden sparkling wires that burn with high-density bright golden sparks. Completely safe for kids under supervision.',
    descriptionTa: 'அடர்ந்த தங்க நிற பொறிகளுடன் எரியும் பாதுகாப்பான மின்சார கம்பி மத்தாப்பு. குழந்தைகள் பயன்படுத்த உகந்தது.',
    image: 'sparkler',
    stock: 150,
    isFeatured: true
  },
  {
    id: 'spk-2',
    nameEn: 'Tri-Colour Fireworks Sparklers (30cm)',
    nameTa: 'மும்வண்ண கம்பி மத்தாப்பு',
    category: 'Sparklers',
    price: 240,
    originalPrice: 350,
    descriptionEn: 'Extra-long sparklers that change colors sequentially from Red to Green, and finally dazzling Silver.',
    descriptionTa: 'சிவப்பு, பச்சை மற்றும் வெள்ளி நிறமாக மாறி எரியும் கூடுதல் நீளமான மும்வண்ண கம்பி மத்தாப்பு.',
    image: 'sparkler_multi',
    stock: 120,
    isFeatured: false
  },

  // Flower Pots
  {
    id: 'flp-1',
    nameEn: 'Golden Fountain Flower Pots',
    nameTa: 'தங்க பூந்தொட்டி (பெரியது)',
    category: 'Flower Pots',
    price: 180,
    originalPrice: 280,
    descriptionEn: 'Produces an incredibly tall fountain of golden sparks resembling a beautiful, gleaming tree.',
    descriptionTa: 'மிக உயரமான தங்க நிற ஒளிரும் பூந்தொட்டி ஊற்று. பார்ப்பதற்கு மரம் போல் பிரம்மாண்டமாக இருக்கும்.',
    image: 'flowerpot_gold',
    stock: 90,
    isFeatured: true
  },
  {
    id: 'flp-2',
    nameEn: 'Color Changing Deluxe Pots',
    nameTa: 'நிறம் மாறும் டீலக்ஸ் பூந்தொட்டி',
    category: 'Flower Pots',
    price: 320,
    originalPrice: 450,
    descriptionEn: 'Fountain shoots bright firework sparks that shift colors three times: Violet, Crimson, and Emerald.',
    descriptionTa: 'ஊதா, சிவப்பு மற்றும் மரகத பச்சை என மும்முறை வர்ணங்கள் மாறும் சிறப்பு பூந்தொட்டி.',
    image: 'flowerpot_color',
    stock: 75,
    isFeatured: false
  },

  // Rockets
  {
    id: 'rkt-1',
    nameEn: 'Sky-Screaming Whistle Rockets',
    nameTa: 'விசில் சப்த வான ராக்கெட்',
    category: 'Rockets',
    price: 250,
    originalPrice: 380,
    descriptionEn: 'Sails high into the darkness with a sharp whistling sound, exploding into a beautiful silver crackling cloud.',
    descriptionTa: 'விசில் சப்தத்துடன் வானில் உயர்ந்து சென்று வெள்ளி நிற பூக்களாக வெடிக்கும் அதிநவீன ராக்கெட்.',
    image: 'rocket_whistle',
    stock: 110,
    isFeatured: true
  },
  {
    id: 'rkt-2',
    nameEn: 'Luminous Chaser Rockets',
    nameTa: 'வண்ண ஒளிரும் சேஸர் ராக்கெட்',
    category: 'Rockets',
    price: 450,
    originalPrice: 600,
    descriptionEn: 'A pack of 5 elite rockets shooting extremely high and creating giant multi-colored rings in the sky.',
    descriptionTa: 'விண்வெளியில் பெரிய வண்ணமயமான வட்டங்களை உருவாக்கும் 5 பிரீமியம் ராக்கெட்டுகள் அடங்கிய தொகுப்பு.',
    image: 'rocket_pack',
    stock: 60,
    isFeatured: true
  },

  // Atom Bombs
  {
    id: 'bom-1',
    nameEn: 'Hydro-Power Atom Bomb (Pack of 5)',
    nameTa: 'ஹைட்ரோ பவர் ஆட்டம் பாம்',
    category: 'Atom Bombs',
    price: 150,
    originalPrice: 250,
    descriptionEn: 'The pride of South India. Traditional green-threaded bomb with a thunderous ear-splitting explosion.',
    descriptionTa: 'தென்னிந்தியாவின் பெருமை மிகு பாரம்பரிய நூல் பாம். காதுகளை அதிர வைக்கும் இடி போன்ற பேரொலி கொண்டது.',
    image: 'bomb_green',
    stock: 200,
    isFeatured: false
  },
  {
    id: 'bom-2',
    nameEn: 'Classic King Kong Mega Bomb',
    nameTa: 'கிங் காங் மெகா பாம்',
    category: 'Atom Bombs',
    price: 290,
    originalPrice: 420,
    descriptionEn: 'Maximum explosive permissible force. Handcrafted for a deep, rumbling echo that vibrates the ground.',
    descriptionTa: 'அனுமதிக்கப்பட்ட உச்சபட்ச ஒலி அளவு கொண்ட மெகா குண்டு. அதிர்வை ஏற்படுத்தும் பேரொலி.',
    image: 'bomb_red',
    stock: 80,
    isFeatured: true
  },

  // Fancy Crackers
  {
    id: 'fcy-1',
    nameEn: '12-Shot Sky Chandelier Cake',
    nameTa: '12 ஷாட்ஸ் ஸ்கை சாண்டிலியர்',
    category: 'Fancy Crackers',
    price: 590,
    originalPrice: 900,
    descriptionEn: 'A compact cake that fires 12 consecutive shots of luxurious golden palm trees and glitter into the clouds.',
    descriptionTa: 'தொடர்ச்சியாக 12 முறை வானில் சென்று தங்க நிற பனைமர இலை வடிவங்களில் வெடிக்கும் சாண்டிலியர்.',
    image: 'fancy_cake12',
    stock: 45,
    isFeatured: true
  },
  {
    id: 'fcy-2',
    nameEn: '30-Shot Golden Willow Aerial Show',
    nameTa: '30 ஷாட்ஸ் கோல்டன் வில்லோ',
    category: 'Fancy Crackers',
    price: 1250,
    originalPrice: 1950,
    descriptionEn: 'Professional-grade luxury aerial fireworks showing 30 stunning willow cascades in synchronized fire intervals.',
    descriptionTa: 'அதிநவீன ஏரியல் ஷோ. 30 முறைகள் தொடர்ந்து வெடித்து தங்க நிற சிதறல்களை வாரி வழங்கும் வானவேடிக்கை.',
    image: 'fancy_cake30',
    stock: 25,
    isFeatured: true
  },

  // Kids Special
  {
    id: 'kds-1',
    nameEn: 'Magic Color Serpents / Snake Eggs',
    nameTa: 'வண்ண மாஜிக் பாம்பு வெடி',
    category: 'Kids Special',
    price: 60,
    originalPrice: 100,
    descriptionEn: 'Noiseless pellets that grow into long, winding colorful ash cylinders. Pure magical amusement for children.',
    descriptionTa: 'சத்தமில்லாத மாஜிக் மாத்திரைகள். பற்றவைத்தால் நீண்ட வளைந்து நெளியும் வண்ண சாம்பல் பாம்புகளாக வளரும்.',
    image: 'kids_snake',
    stock: 300,
    isFeatured: false
  },
  {
    id: 'kds-2',
    nameEn: 'Speeding Butterfly Ground Spinners',
    nameTa: 'வண்ண தரைச்சக்கரம் (பெருசு)',
    category: 'Kids Special',
    price: 130,
    originalPrice: 200,
    descriptionEn: 'Fast spinning discs forming glowing concentric rings of red, yellow, and vibrant green light on the floor.',
    descriptionTa: 'தரையில் அதிவேகமாக சுழன்று சிவப்பு, மஞ்சள் மற்றும் பச்சை வளையங்களை தோற்றுவிக்கும் தரைச்சக்கரம்.',
    image: 'kids_wheel',
    stock: 160,
    isFeatured: false
  },

  // Gift Boxes
  {
    id: 'gft-1',
    nameEn: 'Garudan Standard Royal Box (25 Items)',
    nameTa: 'கருடன் ஸ்டாண்டர்ட் ராயல் பாக்ஸ்',
    category: 'Gift Boxes',
    price: 1499,
    originalPrice: 2499,
    descriptionEn: 'The perfect starter assortment box. Includes ground wheels, flower pots, rockets, and mixed sparklers.',
    descriptionTa: '25 வகையான வெடிகள் அடங்கிய குடும்ப ஸ்டார்டர் பேக். தரைச்சக்கரம், கம்பிகள், பூந்தொட்டி, ராக்கெட்டுகள் அடங்கியது.',
    image: 'giftbox_silver',
    stock: 40,
    isFeatured: true
  },
  {
    id: 'gft-2',
    nameEn: 'Garudan Imperial Luxury Gift Box (50 Items)',
    nameTa: 'கருடன் இம்பீரியல் சொகுசு கிப்ட் பாக்ஸ்',
    category: 'Gift Boxes',
    price: 2999,
    originalPrice: 4999,
    descriptionEn: 'An elite curated chest featuring our finest multi shot fireworks, heavy atom bombs, flower pots, and premium novelty sparklers.',
    descriptionTa: '50 வகையான உயர்தர வெடிகள் கொண்ட ஆடம்பர பெட்டி. பிரீமியம் ஏரியல் ஷாட்கள், கனரக வெடிகள் அடங்கிய பிரம்மாண்ட பெட்டி.',
    image: 'giftbox_gold',
    stock: 20,
    isFeatured: true
  },

  // Festival Combo Packs
  {
    id: 'cmb-1',
    nameEn: 'Double Dhamaka Festival Combo',
    nameTa: 'டபுள் धमाக்கா திருவிழா காம்போ',
    category: 'Festival Combo Packs',
    price: 4499,
    originalPrice: 7500,
    descriptionEn: 'Engineered for grand celebrations. Holds everything needed to keep the sky lit for over 30 minutes including fancy multi-shots.',
    descriptionTa: 'பெரிய கொண்டாட்டங்களுக்கான சிறப்பு காம்போ. 30 நிமிடங்களுக்கு மேல் வானத்தை ஒளிரச்செய்யும் அனைத்து வெடிகளும் அடங்கியது.',
    image: 'combo_double',
    stock: 15,
    isFeatured: true
  }
];

export const FESTIVAL_OFFERS: Offer[] = [
  {
    id: 'off-1',
    code: 'DIWALI2026',
    discountPercentage: 15,
    active: true,
    minOrderValue: 2000,
    descriptionEn: 'Unlock 15% EXTRA Discount on orders above ₹2,000! Apply on Checkout.',
    descriptionTa: '₹2,000க்கு மேல் வாங்கும் ஆர்டர்களுக்கு கூடுதலாக 15% வரை தள்ளுபடி! செக்அவுட்டில் பயன்படுத்தவும்.'
  },
  {
    id: 'off-2',
    code: 'GARUDANPREMIUM',
    discountPercentage: 25,
    active: true,
    minOrderValue: 5000,
    descriptionEn: 'Mega Festive Splurge: Flat 25% off for royal orders over ₹5,000!',
    descriptionTa: 'மெகா பண்டிகை சலுகை: ₹5,000க்கு மேலான ஆர்டர்களுக்கு 25% வரை அதிரடி தள்ளுபடி!'
  }
];

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  en: {
    brandName: 'Garudan Fireworks',
    tagline: 'Light Up Every Celebration',
    home: 'Home',
    products: 'Products',
    contact: 'Contact Us',
    admin: 'Admin Console',
    cart: 'My Cart',
    shopNow: 'Shop Elite Crackers',
    featuredProducts: 'Featured Celebrations',
    offers: 'Exclusive Festive Offers',
    reviews: 'Patron Spotlights',
    quickOrder: 'Quick Order Form',
    addToCart: 'Reserve to Cart',
    outOfStock: 'Sold Out',
    inStock: 'In Stock',
    total: 'Grand Total',
    checkout: 'Proceed to Dispatch',
    name: 'Customer Name',
    phone: 'WhatsApp / Mobile Number',
    address: 'Delivery Address (With Pincode)',
    notes: 'Special Courier Instructions',
    placeOrder: 'Confirm Order & Send Mail',
    orderSuccess: '🎇 Celebration Initiated! Your order has been registered and emailed. Check WhatsApp info below to speed up shipping.',
    emptyCart: 'Your luxury cart is empty. Add select crackers below!',
    searchPlaceholder: 'Search gold fountains, mega shots, rockets...',
    all: 'All Sparklers & Crackers',
    whatsappOrder: 'Submit Order via WhatsApp',
    loading: 'Loading Luxury Catalog...'
  },
  ta: {
    brandName: 'கருடன் பட்டாசு நிறுவனம்',
    tagline: 'ஒவ்வொரு கொண்டாட்டத்தையும் பிரகாசமாக்குங்கள்',
    home: 'முகப்பு',
    products: 'பட்டாசுகள்',
    contact: 'தொடர்பு கொள்ள',
    admin: 'நிர்வாக பகுதி',
    cart: 'எனது கூடை',
    shopNow: 'பட்டாசுகளை வாங்குக',
    featuredProducts: 'பிரபலமான கொண்டாட்டங்கள்',
    offers: 'பிரத்தியேக திருவிழா சலுகைகள்',
    reviews: 'வாடிக்கையாளர் சான்றுகள்',
    quickOrder: 'விரைவு ஆர்டர் படிவம்',
    addToCart: 'கூடையில் சேர்க்கவும்',
    outOfStock: 'விற்றுவிட்டது',
    inStock: 'கையிருப்பில் உள்ளது',
    total: 'மொத்த தொகை',
    checkout: 'ஆர்டர் செய்ய தொடரவும்',
    name: 'வாடிக்கையாளர் பெயர்',
    phone: 'வாட்ஸ்அப் / கைபேசி எண்',
    address: 'டெலிவரி முகவரி (பின்கோடுடன்)',
    notes: 'கூடுதல் விநியோக குறிப்புகள்',
    placeOrder: 'ஆர்டரை உறுதிசெய்து மின்னஞ்சல் அனுப்பவும்',
    orderSuccess: '🎇 கொண்டாட்டம் தொடங்கியது! உங்கள் ஆர்டர் பதிவு செய்யப்பட்டு மின்னஞ்சல் அனுப்பப்பட்டுள்ளது. விரைவான விநியோகத்திற்கு வாட்ஸ்அப்பில் பகிரவும்.',
    emptyCart: 'உங்கள் கூடை காலியாக உள்ளது. பிரீமியம் ரகங்களை கீழே தேர்வு செய்யவும்!',
    searchPlaceholder: 'பூந்தொட்டி, சாட்ஸ், ராக்கெட், கம்பி மத்தாப்புகளை தேடுக...',
    all: 'அனைத்து பட்டாசுகளும்',
    whatsappOrder: 'வாட்ஸ்அப் மூலம் ஆர்டர் செய்க',
    loading: 'ஆரம்பிக்கிறது...'
  }
};

export const REVIEWS = [
  {
    id: 'rev-1',
    author: 'Sundaramurthy K.',
    city: 'Chennai',
    rating: 5,
    textEn: 'Outstanding quality and brilliant lighting duration! The 30-Shot Golden Willow was spectacular. Ordering via WhatsApp took less than a minute and delivery was incredibly neat.',
    textTa: 'மிகச்சிறந்த தரம் மற்றும் நீண்ட நேரம் எரியும் தன்மை! 30-ஷாட்ஸ் கோல்டன் வில்லோ மிகவும் பிரமாதமாக இருந்தது. வாட்ஸ்அப் மூலம் ஆர்டர் செய்வது மிகவும் சுலபமாக இருந்தது.'
  },
  {
    id: 'rev-2',
    author: 'Priyanka Sen',
    city: 'Bengaluru',
    rating: 5,
    textEn: 'Very impressed by the safe and kid-friendly electric sparklers. The Imperial Gift Box was the highlight of our Diwali. Truly premium service and luxury design.',
    textTa: 'குழந்தைகளுக்கு பாதுகாப்பான மின்சார கம்பி மத்தாப்பு மிகவும் கவர்ந்தது. எங்களது தீபாவளியை பிரகாசமாக்கியது கருடன் இம்பீரியல் கிப்ட் பாக்ஸ். உண்மையான ஆடம்பர சேவை.'
  },
  {
    id: 'rev-3',
    author: 'Rathakrishnan Moorthy',
    city: 'Sivakasi',
    rating: 5,
    textEn: 'Hailing from the capital of fireworks, yet I order Garudan for my relatives elsewhere because of their state-of-the-art packaging, lightning-fast courier network, and intense colors.',
    textTa: 'பட்டாசு தலைநகரில் இருந்தே நான் ஆர்டர் செய்கிறேன்! அருமையான பேக்கேஜிங், அதிவேக டெலிவரி மற்றும் மின்னும் வண்ணங்கள். கருடன் பட்டாசுகள் சிறந்த தரம் வாய்ந்தது.'
  }
];
