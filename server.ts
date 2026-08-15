/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Establish relative paths and DB directories with resilient serverless /tmp fallbacks
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? path.join('/tmp', 'garudan_data') : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = isServerless ? path.join('/tmp', 'garudan_uploads') : path.join(process.cwd(), 'uploads');

// Ensure database and uploads folders exist safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('⚠️ DATA_DIR init notice:', e);
}

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('⚠️ UPLOADS_DIR init notice:', e);
}

// In-memory image buffer cache for ultra-resilient serving across serverless invocations
const memoryImages = new Map<string, { buffer: Buffer; mime: string }>();

// Helper to save base64 data URI to file on disk and return cache-busted URL
function saveImageIfDataUri(imageStr: string | undefined, prefix = 'prod'): string {
  if (!imageStr || typeof imageStr !== 'string') return imageStr || 'sparkler';
  const trimmed = imageStr.trim();
  const match = trimmed.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!match) return trimmed;

  try {
    const rawExt = match[1].toLowerCase();
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
    const mime = `image/${rawExt === 'jpg' ? 'jpeg' : rawExt}`;
    const buffer = Buffer.from(match[2], 'base64');
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 8);
    const filename = `${prefix}_${timestamp}_${randomHex}.${ext}`;

    // Always store in memory cache
    memoryImages.set(filename, { buffer, mime });

    // Also attempt disk write
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      const filePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`📸 [IMAGE SAVED]: Created ${filename} (${buffer.length} bytes) in /uploads`);
    } catch (diskErr) {
      console.warn(`⚠️ Disk write bypassed in serverless environment, retained in memory cache:`, diskErr);
    }

    return `/uploads/${filename}?v=${timestamp}`;
  } catch (err) {
    console.error('⚠️ [IMAGE SAVE ERROR]:', err);
    return trimmed;
  }
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

// In-memory cache for schema state
let memoryDB: Schema | null = null;

// Read DB from local disk or memory cache
function loadDB(): Schema {
  if (memoryDB) {
    return memoryDB;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const defaultData: Schema = {
        products: SEED_PRODUCTS,
        orders: [],
        offers: SEED_OFFERS
      };
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      } catch (writeErr) {
        console.warn('⚠️ Disk write seed notice (retained in memory):', writeErr);
      }
      memoryDB = defaultData;
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    memoryDB = JSON.parse(raw);
    return memoryDB!;
  } catch (err) {
    console.warn('Notice parsing db file, falling back to memory seed:', err);
    memoryDB = { products: [...SEED_PRODUCTS], orders: [], offers: [...SEED_OFFERS] };
    return memoryDB;
  }
}

// Write DB to disk and synchronize memory cache
function saveDB(data: Schema) {
  memoryDB = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (writeErr) {
    console.warn('⚠️ Disk save notice (retained in memory cache):', writeErr);
  }
}

// LAZY SMTP transporter setup to prevent startup crashes
let mailTransporter: any = null;
function getMailTransporter() {
  if (mailTransporter === null) {
    const smtpUser = (process.env.SMTP_USER || 'garudancrackers@gmail.com').trim();
    const rawPass = process.env.SMTP_PASS || 'efzkvotyzyjwcmxu';
    const smtpPass = rawPass.replace(/\s+/g, '').trim();

    if (smtpPass && smtpPass.length > 0) {
      console.log(`🔌 INITIALIZING NODEMAILER SMTP TRANSPORTER FOR SENDER ${smtpUser}...`);
      mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    } else {
      mailTransporter = false; // Flag to indicate SMTP password is missing
      console.log('📢 GMAIL SMTP_PASS UNCONFIGURED - FALLING BACK SAFELY TO DIRECT MAILTO & CONSOLE ORDER LOGGING');
    }
  }
  return mailTransporter;
}

// Trigger mail dispatcher
async function sendOrderMailNotification(order: APIOrder): Promise<{ emailSent: boolean; emailError: string | null }> {
  const transporter = getMailTransporter();
  const senderEmail = process.env.SMTP_USER || 'garudancrackers@gmail.com';
  const recipient = process.env.ADMIN_EMAIL_RECIPIENT || 'garudancrackers@gmail.com';
  const mailSubject = `🎆 Garudan Fireworks - New Order Invoice #${order.id}`;

  // Item list text builder
  const listItemsText = order.items.map(
    (it) => `• ${it.productNameEn} (${it.productNameTa}) x${it.quantity} @ ₹${it.price} = ₹${(it.price * it.quantity).toLocaleString('en-IN')}`
  ).join('\n');

  const listItemsHtml = order.items.map(
    (it) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px; color: #111827;"><strong>${it.productNameEn}</strong><br/><span style="color: #6b7280; font-size: 12px;">${it.productNameTa}</span></td>
        <td style="padding: 10px; text-align: center; color: #374151;">${it.quantity}</td>
        <td style="padding: 10px; text-align: right; color: #374151;">₹${it.price}</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; color: #111827;">₹${(it.price * it.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `
  ).join('');

  const textBody = `🎇 GARUDAN FIREWORKS OFFICIAL ORDER INVOICE 🎇\n\n` +
    `Hello Admin,\n` +
    `A new order has been submitted on Garudan Fireworks Storefront.\n\n` +
    `ORDER INVOICE ID: #${order.id}\n` +
    `Date: ${new Date(order.createdAt).toLocaleString()}\n\n` +
    `CUSTOMER DETAILS:\n` +
    `---------------------------\n` +
    `Name: ${order.customerName}\n` +
    `Mobile: ${order.mobile}\n` +
    `Address: ${order.address}\n` +
    `Special Notes: ${order.notes || 'None'}\n\n` +
    `ORDERED ITEMS:\n` +
    `---------------------------\n` +
    `${listItemsText}\n\n` +
    `GRAND TOTAL: ₹${order.totalAmount.toLocaleString('en-IN')}\n\n` +
    `Best regards,\n` +
    `Garudan Fireworks Order System\n`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #050505; color: #D4AF37; padding: 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase;">GARUDAN FIREWORKS</h1>
        <p style="margin: 6px 0 0; color: #d1d5db; font-size: 13px; tracking: 1px;">TAX INVOICE & ORDER CONFIRMATION</p>
      </div>

      <div style="padding: 20px 24px; background-color: #fffbe0; border-bottom: 1px solid #fef08a; display: flex; justify-content: space-between;">
        <div>
          <p style="margin: 0; font-size: 15px; font-weight: bold; color: #92400e;">Invoice No: <span style="color: #b45309;">#${order.id}</span></p>
          <p style="margin: 4px 0 0; font-size: 12px; color: #78350f;">Date: ${new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div style="padding: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #111827; padding-bottom: 6px;">Customer Details</h3>
        <table style="width: 100%; font-size: 13px; color: #374151; margin-bottom: 24px; border-spacing: 0;">
          <tr><td style="width: 130px; font-weight: bold; padding: 6px 0; color: #4b5563;">Name:</td><td style="font-weight: 600; color: #111827;">${order.customerName}</td></tr>
          <tr><td style="font-weight: bold; padding: 6px 0; color: #4b5563;">Mobile:</td><td style="font-weight: 600; color: #111827;"><a href="tel:${order.mobile}" style="color: #2563eb; text-decoration: none;">${order.mobile}</a></td></tr>
          <tr><td style="font-weight: bold; padding: 6px 0; color: #4b5563;">Delivery Address:</td><td style="color: #111827;">${order.address}</td></tr>
          <tr><td style="font-weight: bold; padding: 6px 0; color: #4b5563;">Notes:</td><td style="color: #111827;">${order.notes || 'None'}</td></tr>
        </table>

        <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #111827; padding-bottom: 6px;">Ordered Items</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
          <thead>
            <tr style="background-color: #f3f4f6; text-align: left; font-size: 11px; text-transform: uppercase; color: #4b5563;">
              <th style="padding: 10px; border-bottom: 2px solid #e5e7eb;">Product</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Unit Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${listItemsHtml}
          </tbody>
        </table>

        <div style="background-color: #fef3c7; border: 1px solid #fcd34d; padding: 16px; text-align: right; border-radius: 8px;">
          <span style="font-size: 14px; color: #92400e; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Grand Total: </span>
          <span style="font-size: 22px; color: #b45309; font-weight: 900; margin-left: 8px;">₹${order.totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-weight: 600;">Garudan Fireworks Storefront Automated System</p>
        <p style="margin: 4px 0 0; font-size: 11px; color: #9ca3af;">Delivered directly to ${recipient}</p>
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `Garudan Order Alert <${senderEmail}>`,
        to: recipient,
        subject: mailSubject,
        text: textBody,
        html: htmlBody
      });
      console.log(`✉️ ORDER INVOICE EMAIL SENT AUTOMATICALLY FROM ${senderEmail} TO ${recipient}`);
      return { emailSent: true, emailError: null };
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.warn(`⚠️ SMTP transmission issue (${errMsg}). Order logged to console:`);
      console.log(`=========================================\n`);
      console.log(`⚠️  [ORDER NOTIFICATION LOG - RECIPIENT: ${recipient}]\n`);
      console.log(`Subject: ${mailSubject}\n`);
      console.log(`Body:\n${textBody}`);
      console.log(`=========================================\n`);
      return { emailSent: false, emailError: errMsg };
    }
  } else {
    console.log(`=========================================\n`);
    console.log(`⚠️  [SIMULATED SMTP NOTIFICATION SENDOUT - RECIPIENT: ${recipient}]\n`);
    console.log(`Subject: ${mailSubject}\n`);
    console.log(`Body:\n${textBody}`);
    console.log(`=========================================\n`);
    return { emailSent: false, emailError: 'SMTP transporter not initialized (SMTP_PASS environment variable missing or empty)' };
  }
}

// Create and configure Express Application instance
export function createApp() {
  const app = express();

  // CORS and Headers Handling
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // JSON request parser with higher payload limit for image file data
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Detailed Request Logger for production visibility in Vercel Runtime Logs
  app.use((req, res, next) => {
    const start = Date.now();
    const origUrl = req.originalUrl || req.url;
    console.log(`📥 [API INCOMING]: ${req.method} ${origUrl} (url=${req.url})`);
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`📤 [API OUTGOING]: ${req.method} ${origUrl} -> Status ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // Serve static uploaded product images directly with cache headers
  app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '1h' }));

  // Direct Image retrieval handler with memory buffer fallback
  const handleGetImage = (req: express.Request, res: express.Response) => {
    const rawName = (req.params.filename || '').split('?')[0];
    const decodedName = decodeURIComponent(rawName);

    if (memoryImages.has(decodedName)) {
      const img = memoryImages.get(decodedName)!;
      res.setHeader('Content-Type', img.mime);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(img.buffer);
    }

    const diskPath = path.join(UPLOADS_DIR, decodedName);
    if (fs.existsSync(diskPath)) {
      return res.sendFile(diskPath);
    }

    const fallbackPath = path.join(process.cwd(), 'uploads', decodedName);
    if (fs.existsSync(fallbackPath)) {
      return res.sendFile(fallbackPath);
    }

    res.status(404).send('Image not found');
  };

  app.get('/uploads/:filename', handleGetImage);
  app.get('/api/uploads/:filename', handleGetImage);

  // ---------------------- ROUTER DEFINITION ----------------------
  const apiRouter = express.Router();

  // Direct Image Upload Endpoint
  apiRouter.post('/upload', (req, res) => {
    try {
      const { dataUrl } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'No image data supplied' });
      }
      const savedUrl = saveImageIfDataUri(dataUrl, 'upload');
      console.log(`📸 [API UPLOAD SUCCESS]: ${savedUrl}`);
      res.json({ success: true, url: savedUrl });
    } catch (err: any) {
      console.error('💥 [API UPLOAD FAILED]:', err);
      res.status(500).json({ error: 'Failed to process image upload', details: err?.message });
    }
  });

  // SMTP Configuration inspection endpoint
  apiRouter.get('/smtp-config', (req, res) => {
    const smtpUser = (process.env.SMTP_USER || 'garudancrackers@gmail.com').trim();
    const recipient = (process.env.ADMIN_EMAIL_RECIPIENT || 'garudancrackers@gmail.com').trim();
    const rawPass = process.env.SMTP_PASS || 'efzkvotyzyjwcmxu';
    const cleanPass = rawPass.replace(/\s+/g, '').trim();
    const maskedPass = cleanPass.length > 4 
      ? '*'.repeat(cleanPass.length - 4) + cleanPass.slice(-4) 
      : '****';

    res.json({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      senderUser: smtpUser,
      recipientEmail: recipient,
      maskedPassword: maskedPass,
      isConfigured: cleanPass.length > 0
    });
  });

  // ---------------------- PRODUCTS ENDPOINTS ----------------------
  
  // Get all products
  apiRouter.get('/products', (req, res) => {
    try {
      const db = loadDB();
      res.json(db.products);
    } catch (err: any) {
      console.error('💥 [GET /products ERROR]:', err);
      res.status(500).json({ error: 'Failed to retrieve products', details: err?.message });
    }
  });

  // Create product
  apiRouter.post('/products', (req, res) => {
    try {
      const db = loadDB();
      const processedImage = saveImageIfDataUri(req.body.image || 'sparkler', 'prod');
      const newProduct: APIProduct = {
        id: 'prod-' + Date.now().toString(),
        nameEn: req.body.nameEn || 'Unspecified Cracker',
        nameTa: req.body.nameTa || 'Unspecified Cracker',
        category: req.body.category || 'Sparklers',
        price: Number(req.body.price) >= 0 ? Number(req.body.price) : 100,
        originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
        descriptionEn: req.body.descriptionEn || '',
        descriptionTa: req.body.descriptionTa || '',
        image: processedImage,
        stock: Number(req.body.stock) >= 0 ? Number(req.body.stock) : 10,
        isFeatured: !!req.body.isFeatured
      };

      db.products.push(newProduct);
      saveDB(db);
      console.log(`✨ [PRODUCT CREATED]: ${newProduct.nameEn} (ID: ${newProduct.id}, Image: ${newProduct.image})`);
      res.status(201).json(newProduct);
    } catch (err: any) {
      console.error('💥 [POST /products ERROR]:', err);
      res.status(500).json({ error: 'Failed to register product', details: err?.message });
    }
  });

  // Edit product specifications (Supports PUT, PATCH, POST with flexible ID matching and upserting)
  const handleUpdateProduct = (req: express.Request, res: express.Response) => {
    try {
      const rawParamId = req.params.id || req.body?.id || '';
      const decodedId = decodeURIComponent(String(rawParamId)).trim();
      console.log(`📥 [HANDLE UPDATE PRODUCT]: Method=${req.method}, DecodedID="${decodedId}", Body:`, {
        nameEn: req.body?.nameEn,
        nameTa: req.body?.nameTa,
        category: req.body?.category,
        price: req.body?.price,
        originalPrice: req.body?.originalPrice,
        stock: req.body?.stock,
        isFeatured: req.body?.isFeatured,
        imageType: typeof req.body?.image
      });

      const db = loadDB();

      let pIdx = db.products.findIndex((p) => p.id === rawParamId || p.id === decodedId);
      if (pIdx === -1 && decodedId) {
        // Case-insensitive & trimmed match
        pIdx = db.products.findIndex(
          (p) => p.id.trim().toLowerCase() === decodedId.toLowerCase()
        );
      }

      if (pIdx === -1 && decodedId) {
        // If product exists in SEED_PRODUCTS, initialize it into db.products
        const seedMatch = SEED_PRODUCTS.find(
          (p) => p.id.trim().toLowerCase() === decodedId.toLowerCase() || p.id === rawParamId
        );
        if (seedMatch) {
          db.products.push({ ...seedMatch });
          pIdx = db.products.length - 1;
        }
      }

      // Process image update or preserve existing
      let updatedImage: string = 'sparkler';
      if (pIdx !== -1) {
        updatedImage = db.products[pIdx].image;
      }

      if (req.body?.image !== undefined && req.body?.image !== null && req.body?.image !== '') {
        // If a new data URI was sent, save it to disk/memory and get the cache-busted path
        if (typeof req.body.image === 'string' && req.body.image.startsWith('data:image/')) {
          updatedImage = saveImageIfDataUri(req.body.image, 'prod');
        } else {
          updatedImage = req.body.image;
        }
      }

      if (pIdx === -1) {
        // Upsert product so updates never fail with 404
        const newProd: APIProduct = {
          id: decodedId || ('prod-' + Date.now()),
          nameEn: req.body?.nameEn || 'Unspecified Cracker',
          nameTa: req.body?.nameTa || 'Unspecified Cracker',
          category: req.body?.category || 'Sparklers',
          price: req.body?.price !== undefined ? Number(req.body.price) : 100,
          originalPrice: req.body?.originalPrice !== undefined && req.body?.originalPrice !== '' ? Number(req.body.originalPrice) : undefined,
          descriptionEn: req.body?.descriptionEn || '',
          descriptionTa: req.body?.descriptionTa || '',
          image: updatedImage,
          stock: req.body?.stock !== undefined ? Number(req.body.stock) : 10,
          isFeatured: req.body?.isFeatured !== undefined ? !!req.body.isFeatured : false
        };
        db.products.push(newProd);
        saveDB(db);
        console.log(`✨ [PRODUCT UPSERTED SUCCESS]: ID ${newProd.id} - ${newProd.nameEn} (Price: ₹${newProd.price}, Image: ${newProd.image})`);
        return res.status(200).json(newProd);
      }

      const current = db.products[pIdx];

      db.products[pIdx] = {
        ...current,
        nameEn: req.body?.nameEn !== undefined ? req.body.nameEn : current.nameEn,
        nameTa: req.body?.nameTa !== undefined ? req.body.nameTa : current.nameTa,
        category: req.body?.category !== undefined ? req.body.category : current.category,
        price: req.body?.price !== undefined ? Number(req.body.price) : current.price,
        originalPrice: req.body?.originalPrice !== undefined && req.body?.originalPrice !== '' ? Number(req.body.originalPrice) : (req.body?.originalPrice === '' ? undefined : current.originalPrice),
        descriptionEn: req.body?.descriptionEn !== undefined ? req.body.descriptionEn : current.descriptionEn,
        descriptionTa: req.body?.descriptionTa !== undefined ? req.body.descriptionTa : current.descriptionTa,
        stock: req.body?.stock !== undefined ? Number(req.body.stock) : current.stock,
        image: updatedImage,
        isFeatured: req.body?.isFeatured !== undefined ? !!req.body.isFeatured : current.isFeatured
      };

      saveDB(db);
      console.log(`🔄 [PRODUCT UPDATED SUCCESS]: ID ${db.products[pIdx].id} - ${db.products[pIdx].nameEn} (Stock: ${db.products[pIdx].stock}, Image: ${db.products[pIdx].image})`);
      return res.status(200).json(db.products[pIdx]);
    } catch (err: any) {
      console.error('💥 [UPDATE PRODUCT FAILED]:', err);
      return res.status(500).json({ error: 'Failed to update product specifications', details: err?.message });
    }
  };

  // Attach all update route variations
  apiRouter.put('/products/:id', handleUpdateProduct);
  apiRouter.patch('/products/:id', handleUpdateProduct);
  apiRouter.post('/products/:id', handleUpdateProduct);
  apiRouter.post('/products/update/:id', handleUpdateProduct);
  apiRouter.put('/products', handleUpdateProduct);
  apiRouter.patch('/products', handleUpdateProduct);
  apiRouter.post('/products/update', handleUpdateProduct);
  apiRouter.put('/product/:id', handleUpdateProduct);
  apiRouter.patch('/product/:id', handleUpdateProduct);
  apiRouter.post('/product/:id', handleUpdateProduct);
  apiRouter.put('/product', handleUpdateProduct);
  apiRouter.patch('/product', handleUpdateProduct);

  // Delete product
  apiRouter.delete('/products/:id', (req, res) => {
    try {
      const db = loadDB();
      const rawParamId = req.params.id;
      const decodedId = decodeURIComponent(rawParamId).trim();

      const filtered = db.products.filter(
        (p) => p.id !== rawParamId && p.id !== decodedId && p.id.trim().toLowerCase() !== decodedId.toLowerCase()
      );
      db.products = filtered;
      saveDB(db);
      console.log(`🗑️ [PRODUCT DELETED]: ID ${decodedId}`);
      res.json({ success: true, message: 'Cracker removed successfully.' });
    } catch (err: any) {
      console.error('💥 [DELETE PRODUCT FAILED]:', err);
      res.status(500).json({ error: 'Failed to delete product', details: err?.message });
    }
  });

  // ---------------------- ORDERS ENDPOINTS ----------------------

  // Get orders list
  apiRouter.get('/orders', (req, res) => {
    try {
      const db = loadDB();
      res.json(db.orders);
    } catch (err: any) {
      console.error('💥 [GET /orders FAILED]:', err);
      res.status(500).json({ error: 'Failed to retrieve orders', details: err?.message });
    }
  });

  // Create Order with stock adjustment
  apiRouter.post('/orders', async (req, res) => {
    try {
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

      console.log(`📲 [ORDER RECORDED]: ID ${newOrder.id} for ${newOrder.customerName} (₹${newOrder.totalAmount}). WhatsApp order generated.`);

      res.status(201).json(newOrder);
    } catch (err: any) {
      console.error('💥 [POST /orders FAILED]:', err);
      res.status(500).json({ error: 'Failed to record order', details: err?.message });
    }
  });

  // Update order status (Pending -> Committed -> Delivered etc.)
  apiRouter.put('/orders/:id/status', (req, res) => {
    try {
      const db = loadDB();
      const oIdx = db.orders.findIndex((o) => o.id === req.params.id);
      if (oIdx === -1) {
        return res.status(404).json({ error: 'Order not found' });
      }

      db.orders[oIdx].status = req.body.status || db.orders[oIdx].status;
      saveDB(db);
      res.json(db.orders[oIdx]);
    } catch (err: any) {
      console.error('💥 [UPDATE ORDER STATUS FAILED]:', err);
      res.status(500).json({ error: 'Failed to update order status', details: err?.message });
    }
  });

  // Delete single order log
  apiRouter.delete('/orders/:id', (req, res) => {
    try {
      const db = loadDB();
      const filtered = db.orders.filter((o) => o.id !== req.params.id);
      db.orders = filtered;
      saveDB(db);
      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (err: any) {
      console.error('💥 [DELETE ORDER FAILED]:', err);
      res.status(500).json({ error: 'Failed to delete order', details: err?.message });
    }
  });

  // Clear all sales history orders
  apiRouter.delete('/orders', (req, res) => {
    try {
      const db = loadDB();
      db.orders = [];
      saveDB(db);
      res.json({ success: true, message: 'All sales history cleared' });
    } catch (err: any) {
      console.error('💥 [CLEAR ORDERS FAILED]:', err);
      res.status(500).json({ error: 'Failed to clear orders history', details: err?.message });
    }
  });

  // ---------------------- OFFERS ENDPOINTS ----------------------

  // Get offers list
  apiRouter.get('/offers', (req, res) => {
    try {
      const db = loadDB();
      res.json(db.offers);
    } catch (err: any) {
      console.error('💥 [GET /offers FAILED]:', err);
      res.status(500).json({ error: 'Failed to retrieve offers', details: err?.message });
    }
  });

  // Create offer coupon
  apiRouter.post('/offers', (req, res) => {
    try {
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
    } catch (err: any) {
      console.error('💥 [POST /offers FAILED]:', err);
      res.status(500).json({ error: 'Failed to create offer', details: err?.message });
    }
  });

  // Toggle active coupon status
  apiRouter.post('/offers/:id/toggle', (req, res) => {
    try {
      const db = loadDB();
      const oIdx = db.offers.findIndex((o) => o.id === req.params.id);
      if (oIdx === -1) {
        return res.status(404).json({ error: 'Promo coupon not found' });
      }

      db.offers[oIdx].active = !db.offers[oIdx].active;
      saveDB(db);
      res.json(db.offers[oIdx]);
    } catch (err: any) {
      console.error('💥 [TOGGLE OFFER FAILED]:', err);
      res.status(500).json({ error: 'Failed to toggle offer', details: err?.message });
    }
  });

  // Delete offer coupon
  apiRouter.delete('/offers/:id', (req, res) => {
    try {
      const db = loadDB();
      const filtered = db.offers.filter((o) => o.id !== req.params.id);
      db.offers = filtered;
      saveDB(db);
      res.json({ success: true, message: 'Promo coupon deleted successfully.' });
    } catch (err: any) {
      console.error('💥 [DELETE OFFER FAILED]:', err);
      res.status(500).json({ error: 'Failed to delete offer', details: err?.message });
    }
  });

  // Mount API router at both '/api' and '/' to guarantee matches regardless of serverless path rewriting
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  // ----------------------- SEO & CRAWLER ROUTES -----------------------

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://garudancrackers.com/sitemap.xml`);
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
  <url>
    <loc>https://garudancrackers.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://garudancrackers.com/#products</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://garudancrackers.com/#contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`);
  });

  // Global Error Catch Middleware for Express
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('💥 [EXPRESS GLOBAL ERROR HANDLER]:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: err?.message || String(err),
        details: err?.stack
      });
    }
  });

  return app;
}

// Boot Express Main application for container / standalone environment
export async function startServer() {
  const app = createApp();
  const PORT = 3000;

  // Development VS Production Asset Handlers
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
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

  return app;
}

if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer();
}
