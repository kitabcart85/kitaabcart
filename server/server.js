import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.resolve(__dirname, 'data', 'db.json');
const UPLOADS_DIR = path.resolve(ROOT_DIR, 'uploads');
const ASSETS_DIR = path.resolve(ROOT_DIR, 'assets');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');

const ADMIN_SECRET_PASSWORD = "t@hir27742";

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Database helper functions
function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database:', err);
    return { users: [], books: [], orders: [], reviews: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

// Parse body helper
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

// Helper to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-password'
  });
  res.end(JSON.stringify(data));
}

// Helper to send CSV response
function sendCSV(res, csvString, filename = 'courier_export.csv') {
  res.writeHead(200, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Access-Control-Allow-Origin': '*'
  });
  res.end(csvString);
}

// Server handler
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-password'
    });
    return res.end();
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:5000'}`);
  const pathname = reqUrl.pathname;
  const method = req.method;

  console.log(`[${new Date().toLocaleTimeString()}] ${method} ${pathname}`);

  // -------------------------------------------------------------
  // API ENDPOINTS
  // -------------------------------------------------------------

  // 0. POST /api/admin/login (Admin Password Verification)
  if ((pathname === '/api/admin/login' || pathname.endsWith('/admin/login')) && method === 'POST') {
    const body = await getRequestBody(req);
    const providedPass = (body && body.password) ? String(body.password).trim() : '';
    if (providedPass === ADMIN_SECRET_PASSWORD) {
      return sendJSON(res, 200, { success: true, message: 'Owner authenticated successfully', token: 'sec_admin_token_2026' });
    }
    return sendJSON(res, 401, { success: false, message: 'Invalid Admin Password! Access Denied.' });
  }

  // 1. GET /api/books (with search, category, stock filters)
  if (pathname === '/api/books' && method === 'GET') {
    const db = readDB();
    let books = db.books || [];

    const search = reqUrl.searchParams.get('q')?.toLowerCase() || '';
    const genre = reqUrl.searchParams.get('genre') || '';
    const stockOnly = reqUrl.searchParams.get('inStock') === 'true';

    if (search) {
      books = books.filter(b => 
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search) ||
        b.isbn.includes(search) ||
        b.publisher.toLowerCase().includes(search)
      );
    }

    if (genre && genre !== 'All') {
      books = books.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
    }

    if (stockOnly) {
      books = books.filter(b => b.stock_quantity > 0);
    }

    return sendJSON(res, 200, { success: true, count: books.length, books });
  }

  // 2. GET /api/books/:id
  if (pathname.startsWith('/api/books/') && method === 'GET') {
    const bookId = pathname.replace('/api/books/', '');
    const db = readDB();
    const book = db.books.find(b => b.book_id === bookId);

    if (!book) {
      return sendJSON(res, 404, { success: false, message: 'Book not found' });
    }
    return sendJSON(res, 200, { success: true, book });
  }

  // 3. POST /api/books (Admin: Add book)
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
      featured: Boolean(body.featured),
      bestseller: Boolean(body.bestseller),
      description: body.description || 'No description provided.',
      sample_pages: body.sample_pages || ['Sample page excerpt from Kitab Cart catalog.']
    };

    db.books.unshift(newBook);
    writeDB(db);
    return sendJSON(res, 201, { success: true, message: 'Book created successfully', book: newBook });
  }

  // 4. PUT /api/books/:id (Admin: Edit book / stock)
  if (pathname.startsWith('/api/books/') && method === 'PUT') {
    const bookId = pathname.replace('/api/books/', '');
    const body = await getRequestBody(req);
    const db = readDB();
    const index = db.books.findIndex(b => b.book_id === bookId);

    if (index === -1) {
      return sendJSON(res, 404, { success: false, message: 'Book not found' });
    }

    db.books[index] = {
      ...db.books[index],
      ...body,
      price: body.price !== undefined ? Number(body.price) : db.books[index].price,
      cost_price: body.cost_price !== undefined ? Number(body.cost_price) : db.books[index].cost_price,
      stock_quantity: body.stock_quantity !== undefined ? Number(body.stock_quantity) : db.books[index].stock_quantity
    };

    writeDB(db);
    return sendJSON(res, 200, { success: true, message: 'Book updated successfully', book: db.books[index] });
  }

  // 5. DELETE /api/books/:id (Admin: Delete book)
  if (pathname.startsWith('/api/books/') && method === 'DELETE') {
    const bookId = pathname.replace('/api/books/', '');
    const db = readDB();
    const initialLen = db.books.length;
    db.books = db.books.filter(b => b.book_id !== bookId);

    if (db.books.length === initialLen) {
      return sendJSON(res, 404, { success: false, message: 'Book not found' });
    }

    writeDB(db);
    return sendJSON(res, 200, { success: true, message: 'Book deleted successfully' });
  }

  // 6. POST /api/orders (Create order, check stock, auto-decrement stock)
  if (pathname === '/api/orders' && method === 'POST') {
    const body = await getRequestBody(req);
    const { items, shipping_address, payment_method, payment_receipt_url } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendJSON(res, 400, { success: false, message: 'Cart items are required' });
    }
    if (!shipping_address || !shipping_address.full_name || !shipping_address.phone || !shipping_address.address || !shipping_address.city) {
      return sendJSON(res, 400, { success: false, message: 'Complete shipping address is required' });
    }

    const db = readDB();

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const book = db.books.find(b => b.book_id === item.book_id);
      if (!book) {
        return sendJSON(res, 404, { success: false, message: `Book ID ${item.book_id} not found in inventory` });
      }

      if (book.stock_quantity < item.quantity) {
        return sendJSON(res, 400, {
          success: false,
          message: `Insufficient stock for "${book.title}". Available: ${book.stock_quantity}, Requested: ${item.quantity}`
        });
      }

      book.stock_quantity -= item.quantity;
      const itemTotal = book.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        book_id: book.book_id,
        title: book.title,
        quantity: item.quantity,
        price: book.price
      });
    }

    const shipping_fee = subtotal >= 2000 ? 0 : 200;
    const total_amount = subtotal + shipping_fee;

    const newOrder = {
      order_id: `KTC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      user_id: body.user_id || 'usr_guest',
      items: validatedItems,
      subtotal,
      shipping_fee,
      total_amount,
      payment_method: payment_method || 'COD',
      payment_receipt_url: payment_receipt_url || null,
      payment_status: payment_method === 'COD' ? 'Pending' : (payment_receipt_url ? 'Pending Verification' : 'Awaiting Receipt'),
      order_status: 'Pending',
      shipping_address: {
        full_name: shipping_address.full_name,
        phone: shipping_address.phone,
        address: shipping_address.address,
        city: shipping_address.city,
        postal_code: shipping_address.postal_code || '00000'
      },
      courier_name: 'Pakistan Post',
      courier_tracking_id: null,
      created_at: new Date().toISOString()
    };

    db.orders.unshift(newOrder);
    writeDB(db);

    return sendJSON(res, 201, {
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });
  }

  // 7. GET /api/orders/track/:id
  if (pathname.startsWith('/api/orders/track/') && method === 'GET') {
    const orderId = pathname.replace('/api/orders/track/', '').toUpperCase();
    const db = readDB();
    const order = db.orders.find(o => o.order_id.toUpperCase() === orderId);

    if (!order) {
      return sendJSON(res, 404, { success: false, message: 'Order ID not found' });
    }

    const timeline = [
      { step: 'Placed', completed: true, timestamp: order.created_at },
      { step: 'Payment Status', completed: order.payment_status === 'Verified' || order.payment_method === 'COD', status: order.payment_status },
      { step: 'Processing', completed: order.order_status === 'Processing' || order.order_status === 'Shipped' || order.order_status === 'Delivered' },
      { step: 'Shipped', completed: order.order_status === 'Shipped' || order.order_status === 'Delivered', tracking_id: order.courier_tracking_id, courier: order.courier_name },
      { step: 'Delivered', completed: order.order_status === 'Delivered' }
    ];

    return sendJSON(res, 200, { success: true, order, timeline });
  }

  // 8. GET /api/orders (Admin list orders)
  if (pathname === '/api/orders' && method === 'GET') {
    const db = readDB();
    return sendJSON(res, 200, { success: true, count: db.orders.length, orders: db.orders });
  }

  // 9. PATCH /api/orders/:id/verify-payment (Admin: Verify receipt)
  if (pathname.match(/\/api\/orders\/[^/]+\/verify-payment/) && method === 'PATCH') {
    const parts = pathname.split('/');
    const orderId = parts[3];
    const body = await getRequestBody(req);
    const db = readDB();
    const order = db.orders.find(o => o.order_id === orderId);

    if (!order) {
      return sendJSON(res, 404, { success: false, message: 'Order not found' });
    }

    order.payment_status = body.status || 'Verified';
    if (body.status === 'Verified' && order.order_status === 'Pending') {
      order.order_status = 'Processing';
    }

    writeDB(db);
    return sendJSON(res, 200, { success: true, message: `Payment ${order.payment_status}`, order });
  }

  // 10. PATCH /api/orders/:id/status (Admin: Update status & tracking)
  if (pathname.match(/\/api\/orders\/[^/]+\/status/) && method === 'PATCH') {
    const parts = pathname.split('/');
    const orderId = parts[3];
    const body = await getRequestBody(req);
    const db = readDB();
    const order = db.orders.find(o => o.order_id === orderId);

    if (!order) {
      return sendJSON(res, 404, { success: false, message: 'Order not found' });
    }

    if (body.order_status) order.order_status = body.order_status;
    if (body.courier_name) order.courier_name = body.courier_name;
    if (body.courier_tracking_id) order.courier_tracking_id = body.courier_tracking_id;

    writeDB(db);
    return sendJSON(res, 200, { success: true, message: 'Order status updated', order });
  }

  // 11. GET /api/orders/export/courier (Download CSV)
  if (pathname === '/api/orders/export/courier' && method === 'GET') {
    const db = readDB();
    const orders = db.orders;

    let csv = 'Order_ID,Customer_Name,Phone,Address,City,Postal_Code,Items_Count,COD_Amount_PKR,Payment_Method,Payment_Status,Order_Status,Courier,Tracking_ID,Date\n';

    orders.forEach(o => {
      const codAmount = o.payment_method === 'COD' ? o.total_amount : 0;
      const cleanAddress = `"${(o.shipping_address.address || '').replace(/"/g, '""')}"`;
      const cleanName = `"${(o.shipping_address.full_name || '').replace(/"/g, '""')}"`;
      const itemsCount = o.items.reduce((acc, i) => acc + i.quantity, 0);

      csv += `${o.order_id},${cleanName},${o.shipping_address.phone},${cleanAddress},${o.shipping_address.city},${o.shipping_address.postal_code},${itemsCount},${codAmount},${o.payment_method},${o.payment_status},${o.order_status},Pakistan Post,${o.courier_tracking_id || ''},${o.created_at.split('T')[0]}\n`;
    });

    return sendCSV(res, csv, `Kitab_Cart_Courier_Booking_${new Date().toISOString().split('T')[0]}.csv`);
  }

  // 12. GET /api/analytics (Admin Store Metrics)
  if (pathname === '/api/analytics' && method === 'GET') {
    const db = readDB();
    const books = db.books;
    const orders = db.orders;

    const totalSales = orders
      .filter(o => o.order_status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.order_status === 'Pending').length;
    const outOfStockCount = books.filter(b => b.stock_quantity === 0).length;
    const lowStockCount = books.filter(b => b.stock_quantity > 0 && b.stock_quantity <= 5).length;

    const categoryStats = {};
    books.forEach(b => {
      categoryStats[b.genre] = (categoryStats[b.genre] || 0) + 1;
    });

    return sendJSON(res, 200, {
      success: true,
      analytics: {
        totalSalesPKR: totalSales,
        totalOrders,
        pendingOrders,
        outOfStockCount,
        lowStockCount,
        totalBooks: books.length,
        categoryStats,
        recentOrders: orders.slice(0, 5)
      }
    });
  }

  // 13. POST /api/reviews
  if (pathname === '/api/reviews' && method === 'POST') {
    const body = await getRequestBody(req);
    if (!body.book_id || !body.rating || !body.comment) {
      return sendJSON(res, 400, { success: false, message: 'Book ID, rating, and comment are required' });
    }

    const db = readDB();
    const newReview = {
      review_id: `rev_${Date.now()}`,
      book_id: body.book_id,
      user_id: body.user_id || 'usr_guest',
      user_name: body.user_name || 'Book Enthusiast',
      rating: Number(body.rating),
      comment: body.comment,
      created_at: new Date().toISOString()
    };

    db.reviews.unshift(newReview);

    const bookReviews = db.reviews.filter(r => r.book_id === body.book_id);
    const avgRating = (bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length).toFixed(1);
    const book = db.books.find(b => b.book_id === body.book_id);
    if (book) {
      book.rating = parseFloat(avgRating);
    }

    writeDB(db);
    return sendJSON(res, 201, { success: true, review: newReview, avgRating });
  }

  // 14. GET /api/reviews/:bookId
  if (pathname.startsWith('/api/reviews/') && method === 'GET') {
    const bookId = pathname.replace('/api/reviews/', '');
    const db = readDB();
    const reviews = db.reviews.filter(r => r.book_id === bookId);
    return sendJSON(res, 200, { success: true, count: reviews.length, reviews });
  }

  // 15. POST /api/upload
  if (pathname === '/api/upload' && method === 'POST') {
    const body = await getRequestBody(req);
    if (!body.image) {
      return sendJSON(res, 400, { success: false, message: 'Base64 image string required' });
    }

    const filename = `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
    const filePath = path.join(UPLOADS_DIR, filename);

    const base64Data = body.image.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const fileUrl = `/uploads/${filename}`;
    return sendJSON(res, 200, { success: true, url: fileUrl });
  }

  // 16. GET /api/settings
  if (pathname === '/api/settings' && method === 'GET') {
    const db = readDB();
    const settings = db.settings || {
      announcementBadge: 'OFFER',
      announcementText: '📦 Pakistan Post Delivery Nationwide | FREE Shipping over PKR 2,000',
      helpline: '+92 3241453947',
      whatsapp: '03241453947',
      email: 'kitabcart85@gmail.com',
      easypaisaNumber: '03443418044',
      easypaisaTitle: 'Kitab Cart (EasyPaisa Wallet)'
    };
    return sendJSON(res, 200, { success: true, settings });
  }

  // 17. POST /api/settings
  if (pathname === '/api/settings' && method === 'POST') {
    const body = await getRequestBody(req);
    const db = readDB();
    db.settings = {
      ...db.settings,
      ...body
    };
    writeDB(db);
    return sendJSON(res, 200, { success: true, message: 'Settings updated successfully', settings: db.settings });
  }

  // -------------------------------------------------------------
  // STATIC FILE SERVING
  // -------------------------------------------------------------

  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  if (pathname.startsWith('/uploads/') || pathname.startsWith('/assets/') || pathname.startsWith('/src/')) {
    filePath = path.join(ROOT_DIR, pathname);
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    return fs.createReadStream(filePath).pipe(res);
  }

  const spaIndex = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(spaIndex)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return fs.createReadStream(spaIndex).pipe(res);
  }

  sendJSON(res, 404, { success: false, message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  📚 Kitab Cart Server running on port ${PORT}`);
  console.log(`  API URL: http://localhost:${PORT}/api/books`);
  console.log(`====================================================`);
});
