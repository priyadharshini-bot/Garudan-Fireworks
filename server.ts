/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

// Establish relative paths and DB directories
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure database folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Interfaces replicating types.ts
interface APIProduct {
  id: string;
  nameEn: string;
  nameTa: string;
  category: string;
  price: number;
  originalPrice?: number;
  descriptionEn: string;
  descriptionTa: string;
  image: string;
  stock: number;
  isFeatured?: boolean;
}

interface APIOrder {
  id: string;
  customerName: string;
  mobile: string;
  address: string;
  notes?: string;
  items: Array<{
    productId: string;
    productNameEn: string;
    productNameTa: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'Pending' | 'Committed' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

interface APIOffer {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
  minOrderValue: number;
  descriptionEn: string;
  descriptionTa: string;
}

interface Schema {
  products: APIProduct[];
  orders: APIOrder[];
  offers: APIOffer[];
}

// Standard initial catalog to seed database on first run
const SEED_PRODUCTS: APIProduct[] = [
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
    descriptionTa: 'அடரிக்கப்பட்ட உச்சபட்ச ஒலி அளவு கொண்ட மெகா குண்டு. அதிர்வை ஏற்படுத்தும் பேரொலி.',
    image: 'bomb_red',
    stock: 80,
    isFeatured: true
  },
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
  }
];

const SEED_OFFERS: APIOffer[] = [
  {
    id: 'off-1',
    code: 'DIWALI2026',
    discountPercentage: 15,
    active: true,
    minOrderValue: 2000,
    descriptionEn: 'Unlock 15% EXTRA Discount on orders above ₹2,000! Apply on Checkout.',
    descriptionTa: '₹2,000க்கு மேல் வாங்கும் ஆர்டர்களுக்கு கூடுதலாக 15% வரை தள்ளுபடி!'
  },
  {
    id: 'off-2',
    code: 'GARUDANPREMIUM',
    discountPercentage: 25,
    active: true,
    minOrderValue: 5000,
    descriptionEn: 'Mega Festive Splurge: Flat 25% off for royal orders over ₹5,000!',
    descriptionTa: '₹5,000க்கு மேலான ஆர்டர்களுக்கு 25% வரை அதிரடி தள்ளுபடி!'
  }
];

// Read DB from local disk
function loadDB(): Schema {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData: Schema = {
      products: SEED_PRODUCTS,
      orders: [],
      offers: SEED_OFFERS
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error parsing db file, resetting', err);
    return { products: SEED_PRODUCTS, orders: [], offers: SEED_OFFERS };
  }
}

// Write DB to disk
function saveDB(data: Schema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// LAZY SMTP transporter setup to prevent startup crashes
let mailTransporter: any = null;
function getMailTransporter() {
  if (mailTransporter === null) {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      console.log('🔌 INITIALIZING NODEMAILER SMTP TRANSPORTER USING GMAIL DIRECTIVITY...');
      mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    } else {
      mailTransporter = false; // Flag to indicate SMTP parameters are missing
      console.log('📢 GMAIL SMTP OR EMAIL NOTIFICATIONS UNCONFIGURED - WILL FALLBACK SAFEI-LY TO LOGGING SYSTEM ORDERS TO STORAGE CONSOLE');
    }
  }
  return mailTransporter;
}

// Trigger mail dispatcher
async function sendOrderMailNotification(order: APIOrder) {
  const transporter = getMailTransporter();
  
  const recipient = process.env.ADMIN_EMAIL_RECIPIENT || 'krishnapriya5267@gmail.com';
  const mailSubject = `🎆 GARUDAN FIREWORKS NEW ORDER RESIDUES FOR CONFIRMATION [ID: ${order.id}]`;

  // Item list text builder
  const listItemsText = order.items.map(
    (it) => `• ${it.productNameEn} (Qty: ${it.quantity}) - ₹${(it.price * it.quantity).toLocaleString('en-IN')}`
  ).join('\n');

  const textBody = `🎇 GARUDAN FIREWORKS SALES LEDGER 🎇\n\n` +
    `Hello Admin,\nA new order has been submitted on the Garudan Fireworks eCommerce storefront.\n\n` +
    `CUSTOMER DETAILS:\n` +
    `---------------------------\n` +
    `Name: ${order.customerName}\n` +
    `Mobile: ${order.mobile}\n` +
    `Address: ${order.address}\n` +
    `Instructions: ${order.notes || 'None'}\n\n` +
    `ORDERED MANIFEST:\n` +
    `---------------------------\n` +
    `${listItemsText}\n\n` +
    `Total Amount Collected: ₹${order.totalAmount.toLocaleString('en-IN')}\n` +
    `Status: ${order.status}\n` +
    `Timestamp: ${new Date(order.createdAt).toLocaleString()}\n\n` +
    `Please coordinate with the delivery hub or contact the customer immediately.\n\n` +
    `Best regards,\n` +
    `Garudan Express Automated Order Engine\n`;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `Garudan Order Alert <${process.env.SMTP_USER}>`,
        to: recipient,
        subject: mailSubject,
        text: textBody
      });
      console.log(`✉️ ORDER EMAIL SENT SUCCESS-LY TO ${recipient}`);
    } catch (err) {
      console.error('❌ FAIL TO TRANSMIT ORDER MAIL NOTIFICATION:', err);
    }
  } else {
    console.log(`=========================================\n`);
    console.log(`⚠️  [SIMULATED SMTP NOTIFICATION SENDOUT]\n`);
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${mailSubject}`);
    console.log(`Body:\n${textBody}`);
    console.log(`=========================================\n`);
  }
}

// Boot Express Main application
async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request parser
  app.use(express.json());

  // ---------------------- PRODUCTS ENDPOINTS ----------------------
  
  // Get all products
  app.get('/api/products', (req, res) => {
    const db = loadDB();
    res.json(db.products);
  });

  // Create product
  app.post('/api/products', (req, res) => {
    const db = loadDB();
    const newProduct: APIProduct = {
      id: 'prod-' + Date.now().toString(),
      nameEn: req.body.nameEn || 'Unspecified Cracker',
      nameTa: req.body.nameTa || 'Unspecified Cracker',
      category: req.body.category || 'Sparklers',
      price: Number(req.body.price) || 100,
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
      descriptionEn: req.body.descriptionEn || '',
      descriptionTa: req.body.descriptionTa || '',
      image: req.body.image || 'sparkler',
      stock: Number(req.body.stock) || 10,
      isFeatured: !!req.body.isFeatured
    };

    db.products.push(newProduct);
    saveDB(db);
    res.status(201).json(newProduct);
  });

  // Edit product specs
  app.put('/api/products/:id', (req, res) => {
    const db = loadDB();
    const pIdx = db.products.findIndex((p) => p.id === req.params.id);
    if (pIdx === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const current = db.products[pIdx];
    db.products[pIdx] = {
      ...current,
      nameEn: req.body.nameEn !== undefined ? req.body.nameEn : current.nameEn,
      nameTa: req.body.nameTa !== undefined ? req.body.nameTa : current.nameTa,
      category: req.body.category !== undefined ? req.body.category : current.category,
      price: req.body.price !== undefined ? Number(req.body.price) : current.price,
      originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : current.originalPrice,
      descriptionEn: req.body.descriptionEn !== undefined ? req.body.descriptionEn : current.descriptionEn,
      descriptionTa: req.body.descriptionTa !== undefined ? req.body.descriptionTa : current.descriptionTa,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : current.stock,
      image: req.body.image !== undefined ? req.body.image : current.image,
      isFeatured: req.body.isFeatured !== undefined ? !!req.body.isFeatured : current.isFeatured
    };

    saveDB(db);
    res.json(db.products[pIdx]);
  });

  // Delete product
  app.delete('/api/products/:id', (req, res) => {
    const db = loadDB();
    const filtered = db.products.filter((p) => p.id !== req.params.id);
    db.products = filtered;
    saveDB(db);
    res.json({ success: true, message: 'Cracker removed successfully.' });
  });

  // ---------------------- ORDERS ENDPOINTS ----------------------

  // Get orders list
  app.get('/api/orders', (req, res) => {
    const db = loadDB();
    res.json(db.orders);
  });

  // Create Order with stock adjustment
  app.post('/api/orders', async (req, res) => {
    const db = loadDB();
    const { customerName, mobile, address, items, totalAmount, notes } = req.body;

    if (!customerName || !mobile || !address || !items || !items.length) {
      return res.status(400).json({ error: 'Incomplete client coordinates or vacant items' });
    }

    // Process and subtract inventory levels
    const orderItems: APIOrder['items'] = [];
    let computedSum = 0;

    for (const it of items) {
      const matchP = db.products.find((p) => p.id === it.productId);
      if (matchP) {
        // Subtract stock level
        const originalStock = matchP.stock;
        matchP.stock = Math.max(0, originalStock - it.quantity);
        
        orderItems.push({
          productId: matchP.id,
          productNameEn: matchP.nameEn,
          productNameTa: matchP.nameTa,
          price: matchP.price,
          quantity: it.quantity
        });

        computedSum += matchP.price * it.quantity;
      }
    }

    // Compute final discounted settlement
    const finalVal = totalAmount !== undefined ? Number(totalAmount) : computedSum;

    const newOrder: APIOrder = {
      id: 'GRD-' + Math.floor(100000 + Math.random() * 900000).toString(),
      customerName,
      mobile,
      address,
      notes,
      items: orderItems,
      totalAmount: finalVal,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);
    saveDB(db);

    // Call mail dispatcher
    await sendOrderMailNotification(newOrder);

    res.status(201).json(newOrder);
  });

  // Update order status (Pending -> Committed -> Delivered etc.)
  app.put('/api/orders/:id/status', (req, res) => {
    const db = loadDB();
    const oIdx = db.orders.findIndex((o) => o.id === req.params.id);
    if (oIdx === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    db.orders[oIdx].status = req.body.status || db.orders[oIdx].status;
    saveDB(db);
    res.json(db.orders[oIdx]);
  });

  // ---------------------- OFFERS ENDPOINTS ----------------------

  // Get offers list
  app.get('/api/offers', (req, res) => {
    const db = loadDB();
    res.json(db.offers);
  });

  // Create offer coupon
  app.post('/api/offers', (req, res) => {
    const db = loadDB();
    const newOffer: APIOffer = {
      id: 'off-' + Date.now().toString(),
      code: (req.body.code || 'SALE').toUpperCase(),
      discountPercentage: Number(req.body.discountPercentage) || 10,
      active: true,
      minOrderValue: Number(req.body.minOrderValue) || 1000,
      descriptionEn: req.body.descriptionEn || '',
      descriptionTa: req.body.descriptionTa || ''
    };

    db.offers.push(newOffer);
    saveDB(db);
    res.status(201).json(newOffer);
  });

  // Toggle active coupon status
  app.post('/api/offers/:id/toggle', (req, res) => {
    const db = loadDB();
    const oIdx = db.offers.findIndex((o) => o.id === req.params.id);
    if (oIdx === -1) {
      return res.status(404).json({ error: 'Promo coupon not found' });
    }

    db.offers[oIdx].active = !db.offers[oIdx].active;
    saveDB(db);
    res.json(db.offers[oIdx]);
  });

  // Delete offer coupon
  app.delete('/api/offers/:id', (req, res) => {
    const db = loadDB();
    const filtered = db.offers.filter((o) => o.id !== req.params.id);
    db.offers = filtered;
    saveDB(db);
    res.json({ success: true, message: 'Promo coupon deleted successfully.' });
  });

  // ----------------------- FRAMEWORK BOOTSTRAPER -----------------------

  // Development VS Production Asset Handlers
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to host 0.0.0.0 and Port 3000 as strictly hardcoded
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GARUDAN SERVER RUNNING SECURELY ON HTTP://localhost:${PORT}`);
  });
}

startServer();
