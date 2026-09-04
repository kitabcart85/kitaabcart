import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.resolve(ROOT_DIR, 'server', 'data', 'db.json');
const UPLOADS_DIR = path.resolve(ROOT_DIR, 'uploads');

const ADMIN_SECRET_PASSWORD = "t@hir27742";

// Embedded default database so Vercel Serverless ALWAYS serves books & settings
const DEFAULT_DB = {
  settings: {
    announcementBadge: "OFFER",
    announcementText: "📦 Pakistan Post Delivery Nationwide | FREE Shipping over PKR 2,000",
    helpline: "+92 3241453947",
    whatsapp: "03241453947",
    email: "kitabcart85@gmail.com",
    easypaisaNumber: "03443418044",
    easypaisaTitle: "Kitab Cart (EasyPaisa Wallet)"
  },
  books: [
    {
      book_id: "bk_001",
      title: "Seerat-un-Nabi (Biography of Prophet Muhammad PBUH - 7 Volumes)",
      author: "Allama Shibli Nomani & Syed Sulaiman Nadvi",
      publisher: "Dar-us-Salam Publications",
      genre: "Seerat-un-Nabi & Sahaba",
      price: 3850,
      cost_price: 2400,
      stock_quantity: 20,
      isbn: "978-9694260102",
      cover_image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      condition: "New",
      language: "English & Arabic",
      binding: "Hardcover Deluxe Set",
      pages: 1420,
      rating: 5,
      featured: true,
      bestseller: true,
      description: "The quintessential, masterfully written biography of Prophet Muhammad (PBUH) in comprehensive prose by Allama Shibli Nomani and completed by Syed Sulaiman Nadvi. Essential for every Muslim household.",
      sample_pages: [
        "Seerat-un-Nabi (PBUH) - Chapter 1: Arabia Before Islam\n\nThe Arabian Peninsula was famous for its vast deserts and tribal lineage. Prior to the birth of Prophet Muhammad (PBUH), the region was submerged in ignorance and tribal warfare.",
        "Chapter 2: The Blessed Birth & Childhood\n\nThe Year of the Elephant marked a milestone in Arabian history. In this blessed year in Makkah, the beacon of guidance was born, illuminating the entire world with truth."
      ]
    },
    {
      book_id: "bk_002",
      title: "Tafseer Ibn Kathir (Quranic Commentary - 5 Volumes)",
      author: "Imam Hafiz Ibn Kathir",
      publisher: "Darussalam Pakistan",
      genre: "Tafseer & Quran",
      price: 5400,
      cost_price: 3600,
      stock_quantity: 15,
      isbn: "978-9695810055",
      cover_image_url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
      condition: "New",
      language: "English",
      binding: "Hardcover 5-Volume Set",
      pages: 2450,
      rating: 4.95,
      featured: true,
      bestseller: true,
      description: "One of the most authentic and comprehensive explanations of the Holy Quran based on Quranic verses, Sahih Ahadith, and sayings of the Sahaba.",
      sample_pages: [
        "Tafseer Ibn Kathir - Surah Al-Fatiha Exegesis\n\nIn the Name of Allah, the Most Gracious, the Most Merciful: All praise is due to Allah, the Sustainer of all the worlds, the Most Compassionate, Master of the Day of Judgment.",
        "Exegesis of Alif-Lam-Meem: These are disjointed letters whose true hidden knowledge rests with Allah Almighty."
      ]
    },
    {
      book_id: "bk_003",
      title: "Sahih al-Bukhari (Authentic Hadith Collection - 3 Volumes)",
      author: "Imam Muhammad bin Ismail al-Bukhari",
      publisher: "Maktaba Quddusia",
      genre: "Hadith & Sunnah",
      price: 4200,
      cost_price: 2800,
      stock_quantity: 12,
      isbn: "978-9694160890",
      cover_image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      condition: "New",
      language: "English & Arabic",
      binding: "Hardcover Deluxe",
      pages: 1890,
      rating: 5,
      featured: true,
      bestseller: true,
      description: "The most authentic book of Hadith in Islam after the Holy Quran. Contains complete Arabic text with fluent English translation and explanatory footnotes.",
      sample_pages: [
        "Book of Revelation - Hadith 1\n\nNarrated Umar bin Al-Khattab (R.A): I heard the Messenger of Allah (PBUH) saying: 'The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.'"
      ]
    },
    {
      book_id: "bk_004",
      title: "Ar-Raheeq Al-Makhtum (The Sealed Nectar)",
      author: "Safiur Rahman Mubarakpuri",
      publisher: "Darussalam Lahore",
      genre: "Seerat-un-Nabi & Sahaba",
      price: 1650,
      cost_price: 1050,
      stock_quantity: 25,
      isbn: "978-9694260221",
      cover_image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      condition: "New",
      language: "English",
      binding: "Hardcover",
      pages: 580,
      rating: 4.95,
      featured: true,
      bestseller: true,
      description: "Award-winning biography of Prophet Muhammad (PBUH) which won First Prize in the Rabitat al-Alam al-Islami international Seerat competition in Makkah.",
      sample_pages: [
        "The Sealed Nectar - Preface\n\nThe biography of the Prophet (PBUH) is a boundless ocean whose every drop serves as life-giving water for humanity. This book chronicles the radiant journey from the valleys of Makkah to the luminous city of Madinah."
      ]
    },
    {
      book_id: "bk_005",
      title: "Tareekh Ibn Kathir (Al-Bidayah wan-Nihayah - 16 Volumes)",
      author: "Imam Hafiz Ibn Kathir",
      publisher: "Nafaes Publications",
      genre: "Islamic History",
      price: 12500,
      cost_price: 8500,
      stock_quantity: 6,
      isbn: "978-9693500888",
      cover_image_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
      condition: "New",
      language: "English",
      binding: "Hardcover Boxed Set",
      pages: 6400,
      rating: 4.9,
      featured: true,
      bestseller: true,
      description: "The landmark chronicle of world history from creation, Prophets, Khilafat-e-Rashida, Umayyad & Abbasid Dynasties to the events of Judgment Day.",
      sample_pages: [
        "Al-Bidayah wan-Nihayah - Creation of the Universe & Angels\n\nAllah Almighty created the Throne, the Chair, the Earth, the Heavens, and the Angels by His divine command. Chronicles of the world prior to human existence."
      ]
    },
    {
      book_id: "bk_006",
      title: "Riyad as-Salihin (Gardens of the Righteous)",
      author: "Imam Abu Zakariya Yahya An-Nawawi",
      publisher: "Dar-us-Salam",
      genre: "Hadith & Sunnah",
      price: 1950,
      cost_price: 1250,
      stock_quantity: 18,
      isbn: "978-9694160121",
      cover_image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      condition: "New",
      language: "English",
      binding: "Hardcover",
      pages: 720,
      rating: 4.88,
      featured: false,
      bestseller: true,
      description: "Gardens of the Righteous: A curated collection of Qur'anic verses and Hadith covering morality, worship, character, etiquette, and daily life.",
      sample_pages: [
        "Chapter on Sincerity & Pure Intention\n\nAllah Almighty says: 'And they were not commanded except to worship Allah, being sincere to Him in religion.'"
      ]
    },
    {
      book_id: "bk_007",
      title: "Kashf al-Mahjub (Unveiling the Veiled)",
      author: "Hazrat Ali bin Usman Hujwiri (Data Ganj Bakhsh)",
      publisher: "Zavia Publishers Lahore",
      genre: "Tasawwuf & Ethics",
      price: 1350,
      cost_price: 850,
      stock_quantity: 14,
      isbn: "978-9693500331",
      cover_image_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
      condition: "New",
      language: "English",
      binding: "Paperback",
      pages: 480,
      rating: 4.92,
      featured: false,
      bestseller: false,
      description: "The earliest classical treatise on Islamic spirituality and Sufism translated into English. Unveiling the veiled mysteries of spiritual purification and divine devotion.",
      sample_pages: [
        "Kashf al-Mahjub - Chapter on Sufism\n\nSufism is the purification of the inner self and absolute adherence to the Sunnah of the Prophet Muhammad (PBUH). A true Sufi is one whose heart is cleansed of worldly vanity."
      ]
    },
    {
      book_id: "bk_008",
      title: "Bahishti Zewar (Heavenly Ornaments - Complete 10 Parts)",
      author: "Maulana Ashraf Ali Thanvi",
      publisher: "Islami Kutub Khana",
      genre: "Fiqh & Islamic Law",
      price: 1850,
      cost_price: 1200,
      stock_quantity: 22,
      isbn: "978-9694260999",
      cover_image_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
      condition: "New",
      language: "English",
      binding: "Hardcover Deluxe",
      pages: 960,
      rating: 4.95,
      featured: true,
      bestseller: true,
      description: "Comprehensive handbook of Hanafi Islamic jurisprudence, daily rulings, purification, prayers, marriage, ethics, and household governance.",
      sample_pages: [
        "Bahishti Zewar - Part 1: Rulings on Purification & Prayer\n\nObligations of Ablution (Wudu): There are four obligatory acts in Wudu: washing the face, washing both arms up to the elbows, wiping a quarter of the head, and washing both feet up to the ankles."
      ]
    },
    {
      book_id: "bk_009",
      title: "Qisas al-Anbiya (Stories of the Prophets)",
      author: "Imam Hafiz Ibn Kathir",
      publisher: "Darussalam",
      genre: "Tafseer & Quran",
      price: 1750,
      cost_price: 1100,
      stock_quantity: 4,
      isbn: "978-9694260330",
      cover_image_url: "https://images.unsplash.com/photo-1474939557533-8968472506e0?auto=format&fit=crop&w=800&q=80",
      condition: "New",
      language: "English",
      binding: "Hardcover",
      pages: 620,
      rating: 4.9,
      featured: false,
      bestseller: true,
      description: "Authentic stories of the Prophets of Allah from Adam (A.S) to Isa (A.S) drawn strictly from the Holy Quran and authentic Hadith narrations.",
      sample_pages: [
        "The Story of Prophet Adam (A.S)\n\nWhen Allah Almighty declared to the angels: 'Indeed, I am going to place a vicegerent on earth...' Creation of Adam from clay and the divine command to prostrate."
      ]
    },
    {
      book_id: "bk_010",
      title: "Ma'ariful Quran (Qur'anic Commentary - 8 Volumes Complete)",
      author: "Mufti Muhammad Shafi",
      publisher: "Idara-e-Ma'arif Karachi",
      genre: "Tafseer & Quran",
      price: 8900,
      cost_price: 6000,
      stock_quantity: 10,
      isbn: "978-9694260777",
      cover_image_url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
      condition: "New",
      language: "English",
      binding: "Hardcover 8-Volume Complete Set",
      pages: 4200,
      rating: 5,
      featured: true,
      bestseller: true,
      description: "The world-renowned 8-volume commentary of the Holy Quran combining scholarly depth with simple, accessible explanation for contemporary issues.",
      sample_pages: [
        "Ma'ariful Quran - Volume 1: Commentary and wisdoms from Surah Al-Baqarah."
      ]
    }
  ],
  orders: [
    {
      order_id: "KTC-2026-1001",
      user_id: "usr_001",
      items: [
        {
          book_id: "bk_001",
          title: "Seerat-un-Nabi (Biography of Prophet Muhammad PBUH - 7 Volumes)",
          quantity: 1,
          price: 3850
        }
      ],
      subtotal: 3850,
      shipping_fee: 0,
      total_amount: 3850,
      payment_method: "COD",
      payment_receipt_url: null,
      payment_status: "Verified",
      order_status: "Delivered",
      shipping_address: {
        full_name: "Muhammad Ali",
        phone: "+92 3241453947",
        address: "House 42, Street 5, F-7/2",
        city: "Islamabad",
        postal_code: "44000"
      },
      courier_name: "Pakistan Post",
      courier_tracking_id: "TRX-9847120",
      created_at: "2026-09-01T10:30:00Z"
    }
  ],
  reviews: []
};

// Global in-memory DB for serverless instance lifetime
let inMemoryDB = null;

function readDB() {
  if (inMemoryDB) return inMemoryDB;
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const data = JSON.parse(raw);
      if (data && data.books && data.books.length > 0) {
        inMemoryDB = data;
        return inMemoryDB;
      }
    }
  } catch (err) {
    console.error('Reading file db error:', err);
  }
  inMemoryDB = JSON.parse(JSON.stringify(DEFAULT_DB));
  return inMemoryDB;
}

function writeDB(data) {
  inMemoryDB = data;
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Write DB file error (serverless read-only environment expected):', err);
  }
  return true;
}

function getRequestBody(req) {
  return new Promise((resolve) => {
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'object') return resolve(req.body);
      if (typeof req.body === 'string') {
        try { return resolve(JSON.parse(req.body)); } catch (err) { return resolve({}); }
      }
      if (Buffer.isBuffer(req.body)) {
        try { return resolve(JSON.parse(req.body.toString())); } catch (err) { return resolve({}); }
      }
    }

    if (req.readableEnded || req.complete) {
      return resolve({});
    }

    let body = '';
    let resolved = false;

    const onData = (chunk) => { body += chunk.toString(); };
    const onEnd = () => {
      if (resolved) return;
      resolved = true;
      try {
        if (!body) return resolve({});
        resolve(JSON.parse(body));
      } catch (err) { resolve({}); }
    };
    const onError = () => {
      if (resolved) return;
      resolved = true;
      resolve({});
    };

    req.on('data', onData);
    req.on('end', onEnd);
    req.on('error', onError);

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          resolve({});
        }
      }
    }, 500);
  });
}

function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');
  res.end(JSON.stringify(data));
}

function sendCSV(res, csvString, filename = 'courier_export.csv') {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(csvString);
}

// Vercel Serverless Function Export
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');
    return res.end();
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:5000'}`);
  const pathname = reqUrl.pathname;
  const method = req.method;

  // 0. POST /api/admin/login
  if ((pathname === '/api/admin/login' || pathname.endsWith('/admin/login')) && method === 'POST') {
    const body = await getRequestBody(req);
    const providedPass = (body && body.password) ? String(body.password).trim() : '';
    if (providedPass === ADMIN_SECRET_PASSWORD) {
      return sendJSON(res, 200, { success: true, message: 'Owner authenticated successfully', token: 'sec_admin_token_2026' });
    }
    return sendJSON(res, 401, { success: false, message: 'Invalid Admin Password! Access Denied.' });
  }

  // 1. GET /api/books
  if (pathname === '/api/books' && method === 'GET') {
    const db = readDB();
    let books = db.books || [];
    const search = reqUrl.searchParams.get('q')?.toLowerCase() || '';
    const genre = reqUrl.searchParams.get('genre') || '';

    if (search) {
      books = books.filter(b => 
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search) ||
        b.isbn.includes(search)
      );
    }
    if (genre && genre !== 'All') {
      books = books.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
    }

    return sendJSON(res, 200, { success: true, count: books.length, books });
  }

  // 2. GET /api/books/:id
  if (pathname.startsWith('/api/books/') && method === 'GET') {
    const bookId = pathname.replace('/api/books/', '');
    const db = readDB();
    const book = db.books.find(b => b.book_id === bookId);
    if (!book) return sendJSON(res, 404, { success: false, message: 'Book not found' });
    return sendJSON(res, 200, { success: true, book });
  }

  // 3. POST /api/books (Add book)
  if (pathname === '/api/books' && method === 'POST') {
    const body = await getRequestBody(req);
    if (!body.title || !body.author || !body.price) {
      return sendJSON(res, 400, { success: false, message: 'Title, Author, and Price are required' });
    }
    const db = readDB();
    const newBook = {
      book_id: `bk_${Date.now()}`,
      title: body.title,
      author: body.author,
      publisher: body.publisher || 'Kitab Cart',
      genre: body.genre || 'Tafseer & Quran',
      price: Number(body.price),
      cost_price: Number(body.cost_price || Math.round(body.price * 0.65)),
      stock_quantity: Number(body.stock_quantity ?? 10),
      isbn: body.isbn || `978-969-${Math.floor(100000 + Math.random() * 900000)}`,
      cover_image_url: body.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      condition: body.condition || 'New',
      language: body.language || 'English',
      binding: body.binding || 'Hardcover',
      pages: Number(body.pages || 250),
      rating: 5.0,
      description: body.description || 'No description provided.',
      sample_pages: body.sample_pages || ['Sample page excerpt from Kitab Cart catalog.']
    };
    db.books.unshift(newBook);
    writeDB(db);
    return sendJSON(res, 201, { success: true, message: 'Book created successfully', book: newBook });
  }

  // 4. PUT /api/books/:id (Edit book / stock)
  if (pathname.startsWith('/api/books/') && method === 'PUT') {
    const bookId = pathname.replace('/api/books/', '');
    const body = await getRequestBody(req);
    const db = readDB();
    const index = db.books.findIndex(b => b.book_id === bookId);
    if (index === -1) return sendJSON(res, 404, { success: false, message: 'Book not found' });
    db.books[index] = {
      ...db.books[index],
      ...body,
      price: body.price !== undefined ? Number(body.price) : db.books[index].price,
      stock_quantity: body.stock_quantity !== undefined ? Number(body.stock_quantity) : db.books[index].stock_quantity
    };
    writeDB(db);
    return sendJSON(res, 200, { success: true, message: 'Book updated successfully', book: db.books[index] });
  }

  // 5. DELETE /api/books/:id
  if (pathname.startsWith('/api/books/') && method === 'DELETE') {
    const bookId = pathname.replace('/api/books/', '');
    const db = readDB();
    db.books = db.books.filter(b => b.book_id !== bookId);
    writeDB(db);
    return sendJSON(res, 200, { success: true, message: 'Book deleted successfully' });
  }

  // 6. POST /api/orders
  if (pathname === '/api/orders' && method === 'POST') {
    const body = await getRequestBody(req);
    const { items, shipping_address, payment_method, payment_receipt_url } = body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendJSON(res, 400, { success: false, message: 'Cart items are required' });
    }
    const db = readDB();
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const book = db.books.find(b => b.book_id === item.book_id);
      if (book) {
        book.stock_quantity = Math.max(0, book.stock_quantity - item.quantity);
        subtotal += book.price * item.quantity;
        validatedItems.push({ book_id: book.book_id, title: book.title, quantity: item.quantity, price: book.price });
      }
    }

    const shipping_fee = subtotal >= 2000 ? 0 : 200;
    const newOrder = {
      order_id: `KTC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      user_id: body.user_id || 'usr_guest',
      items: validatedItems,
      subtotal,
      shipping_fee,
      total_amount: subtotal + shipping_fee,
      payment_method: payment_method || 'COD',
      payment_receipt_url: payment_receipt_url || null,
      payment_status: payment_method === 'COD' ? 'Pending' : 'Pending Verification',
      order_status: 'Pending',
      shipping_address,
      courier_name: 'Pakistan Post',
      courier_tracking_id: null,
      created_at: new Date().toISOString()
    };
    db.orders.unshift(newOrder);
    writeDB(db);
    return sendJSON(res, 201, { success: true, message: 'Order placed successfully', order: newOrder });
  }

  // 7. GET /api/orders/track/:id
  if (pathname.startsWith('/api/orders/track/') && method === 'GET') {
    const orderId = pathname.replace('/api/orders/track/', '').toUpperCase();
    const db = readDB();
    const order = db.orders.find(o => o.order_id.toUpperCase() === orderId);
    if (!order) return sendJSON(res, 404, { success: false, message: 'Order ID not found' });
    return sendJSON(res, 200, { success: true, order });
  }

  // 8. GET /api/orders
  if (pathname === '/api/orders' && method === 'GET') {
    const db = readDB();
    return sendJSON(res, 200, { success: true, count: db.orders.length, orders: db.orders });
  }

  // 9. PATCH /api/orders/:id/verify-payment
  if (pathname.match(/\/api\/orders\/[^/]+\/verify-payment/) && method === 'PATCH') {
    const parts = pathname.split('/');
    const orderId = parts[3];
    const body = await getRequestBody(req);
    const db = readDB();
    const order = db.orders.find(o => o.order_id === orderId);
    if (!order) return sendJSON(res, 404, { success: false, message: 'Order not found' });
    order.payment_status = body.status || 'Verified';
    if (body.status === 'Verified' && order.order_status === 'Pending') order.order_status = 'Processing';
    writeDB(db);
    return sendJSON(res, 200, { success: true, message: `Payment ${order.payment_status}`, order });
  }

  // 10. PATCH /api/orders/:id/status
  if (pathname.match(/\/api\/orders\/[^/]+\/status/) && method === 'PATCH') {
    const parts = pathname.split('/');
    const orderId = parts[3];
    const body = await getRequestBody(req);
    const db = readDB();
    const order = db.orders.find(o => o.order_id === orderId);
    if (!order) return sendJSON(res, 404, { success: false, message: 'Order not found' });
    if (body.order_status) order.order_status = body.order_status;
    if (body.courier_tracking_id) order.courier_tracking_id = body.courier_tracking_id;
    writeDB(db);
    return sendJSON(res, 200, { success: true, message: 'Order status updated', order });
  }

  // 11. GET /api/orders/export/courier
  if (pathname === '/api/orders/export/courier' && method === 'GET') {
    const db = readDB();
    let csv = 'Order_ID,Customer_Name,Phone,Address,City,Postal_Code,Items_Count,COD_Amount_PKR,Payment_Method,Payment_Status,Order_Status,Courier,Tracking_ID,Date\n';
    db.orders.forEach(o => {
      const codAmount = o.payment_method === 'COD' ? o.total_amount : 0;
      csv += `${o.order_id},"${o.shipping_address.full_name}",${o.shipping_address.phone},"${o.shipping_address.address}",${o.shipping_address.city},${o.shipping_address.postal_code},${o.items.length},${codAmount},${o.payment_method},${o.payment_status},${o.order_status},Pakistan Post,${o.courier_tracking_id || ''},${o.created_at.split('T')[0]}\n`;
    });
    return sendCSV(res, csv, `Kitab_Cart_Courier_Booking_${new Date().toISOString().split('T')[0]}.csv`);
  }

  // 12. GET /api/analytics
  if (pathname === '/api/analytics' && method === 'GET') {
    const db = readDB();
    const books = db.books;
    const orders = db.orders;
    const totalSales = orders.filter(o => o.order_status !== 'Cancelled').reduce((sum, o) => sum + o.total_amount, 0);
    const categoryStats = {};
    books.forEach(b => { categoryStats[b.genre] = (categoryStats[b.genre] || 0) + 1; });

    return sendJSON(res, 200, {
      success: true,
      analytics: {
        totalSalesPKR: totalSales,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.order_status === 'Pending').length,
        outOfStockCount: books.filter(b => b.stock_quantity === 0).length,
        lowStockCount: books.filter(b => b.stock_quantity > 0 && b.stock_quantity <= 5).length,
        totalBooks: books.length,
        categoryStats,
        recentOrders: orders.slice(0, 5)
      }
    });
  }

  // 13. GET /api/settings
  if (pathname === '/api/settings' && method === 'GET') {
    const db = readDB();
    return sendJSON(res, 200, { success: true, settings: db.settings });
  }

  // 14. POST /api/settings
  if (pathname === '/api/settings' && method === 'POST') {
    const body = await getRequestBody(req);
    const db = readDB();
    db.settings = { ...db.settings, ...body };
    writeDB(db);
    return sendJSON(res, 200, { success: true, message: 'Settings updated successfully', settings: db.settings });
  }

  return sendJSON(res, 404, { success: false, message: 'Endpoint not found' });
}
