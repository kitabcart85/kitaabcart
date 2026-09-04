import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_CONFIG } from '../config/storeConfig';
import { X, DollarSign, Package, AlertTriangle, Download, Plus, Edit2, Trash2, CheckCircle, Eye, Truck, RefreshCw } from 'lucide-react';

export const AdminDashboard = () => {
  const { isAdminOpen, setIsAdminOpen, books, fetchBooks, addToast } = useStore();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'books' | 'orders'
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [showAddBook, setShowAddBook] = useState(false);

  // New Book Form state
  const [newBook, setNewBook] = useState({
    title: '',
    title_urdu: '',
    author: '',
    publisher: 'Ibn-e-Abbas Publications',
    genre: 'Islamic',
    price: 1500,
    cost_price: 950,
    stock_quantity: 15,
    isbn: '978-969-426010',
    cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    binding: 'Hardcover',
    language: 'Urdu'
  });

  const loadAdminData = () => {
    // Load analytics
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAnalytics(data.analytics);
      });

    // Load orders
    setLoadingOrders(true);
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders);
      })
      .finally(() => setLoadingOrders(false));
  };

  useEffect(() => {
    if (isAdminOpen) {
      loadAdminData();
    }
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  // Verify manual JazzCash / Bank payment receipt
  const handleVerifyPayment = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/verify-payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Payment marked as ${newStatus} for ${orderId}`);
        setSelectedReceipt(null);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update payment status', 'error');
    }
  };

  // Dispatch / Update order status
  const handleUpdateOrderStatus = async (orderId, order_status, courier_name, courier_tracking_id) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status, courier_name, courier_tracking_id })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Order ${orderId} updated to ${order_status}`);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Book
  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Book "${data.book.title}" added to inventory!`);
        setShowAddBook(false);
        fetchBooks();
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Book
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast('Book removed from inventory');
        fetchBooks();
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAdminOpen(false)}>
      <div className="modal-card" style={{ maxWidth: '1080px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        {/* Admin Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--parchment-border)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', margin: 0 }}>
              Admin Management Portal
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Ibn-e-Abbas Books • Store Management, Verification & Courier Logistics
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href="/api/orders/export/courier"
              className="btn-gold"
              style={{ fontSize: '0.85rem', padding: '8px 14px', textDecoration: 'none' }}
              title="Download Trax/Leopards Courier CSV"
            >
              <Download size={16} />
              <span>Export Courier CSV</span>
            </a>

            <button className="close-btn" onClick={() => setIsAdminOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--parchment-border)' }}>
          <button
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'analytics' ? '3px solid var(--emerald-primary)' : '3px solid transparent',
              color: activeTab === 'analytics' ? 'var(--emerald-dark)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics Overview
          </button>

          <button
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'books' ? '3px solid var(--emerald-primary)' : '3px solid transparent',
              color: activeTab === 'books' ? 'var(--emerald-dark)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('books')}
          >
            Book Inventory ({books.length})
          </button>

          <button
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'orders' ? '3px solid var(--emerald-primary)' : '3px solid transparent',
              color: activeTab === 'orders' ? 'var(--emerald-dark)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('orders')}
          >
            Order Fulfillment ({orders.length})
          </button>
        </div>

        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === 'analytics' && analytics && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-dark)', marginTop: '4px' }}>
                  PKR {analytics.totalSalesPKR.toLocaleString()}
                </div>
              </div>

              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase' }}>Total Orders</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
                  {analytics.totalOrders} Orders
                </div>
              </div>

              <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: '#c2410c', fontWeight: 700, textTransform: 'uppercase' }}>Out-of-Stock Items</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ea580c', marginTop: '4px' }}>
                  {analytics.outOfStockCount} Books
                </div>
              </div>

              <div style={{ background: '#fdf4ff', border: '1px solid #f5d0fe', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: '#a21caf', fontWeight: 700, textTransform: 'uppercase' }}>Total Catalog</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c026d3', marginTop: '4px' }}>
                  {analytics.totalBooks} Titles
                </div>
              </div>
            </div>

            {/* Recent Orders List */}
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', marginBottom: '12px' }}>
              Recent Orders Summary
            </h4>
            <div style={{ background: '#fff', border: '1px solid var(--parchment-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ background: 'var(--parchment-card)', borderBottom: '1px solid var(--parchment-border)' }}>
                  <tr>
                    <th style={{ padding: '10px 14px' }}>Order ID</th>
                    <th style={{ padding: '10px 14px' }}>Customer</th>
                    <th style={{ padding: '10px 14px' }}>City</th>
                    <th style={{ padding: '10px 14px' }}>Method</th>
                    <th style={{ padding: '10px 14px' }}>Amount PKR</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentOrders.map(o => (
                    <tr key={o.order_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>{o.order_id}</td>
                      <td style={{ padding: '10px 14px' }}>{o.shipping_address.full_name}</td>
                      <td style={{ padding: '10px 14px' }}>{o.shipping_address.city}</td>
                      <td style={{ padding: '10px 14px' }}>{o.payment_method}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--emerald-dark)' }}>PKR {o.total_amount}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="badge-stock in-stock">{o.order_status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BOOK INVENTORY CRUD */}
        {activeTab === 'books' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Inventory Catalog Controls</h4>
              <button className="btn-primary" onClick={() => setShowAddBook(true)}>
                <Plus size={16} />
                <span>Add New Book</span>
              </button>
            </div>

            {/* Add Book Form Modal/Box */}
            {showAddBook && (
              <form onSubmit={handleCreateBook} style={{ background: 'var(--parchment-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--parchment-border)', marginBottom: '20px' }}>
                <div style={{ fontWeight: 700, marginBottom: '12px' }}>Add New Printed Book to Store</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                  <input type="text" placeholder="Title *" required value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <input type="text" placeholder="Urdu Title (Optional)" value={newBook.title_urdu} onChange={e => setNewBook({ ...newBook, title_urdu: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <input type="text" placeholder="Author *" required value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <input type="text" placeholder="Publisher" value={newBook.publisher} onChange={e => setNewBook({ ...newBook, publisher: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <select value={newBook.genre} onChange={e => setNewBook({ ...newBook, genre: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                    {STORE_CONFIG.categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="number" placeholder="Price PKR *" required value={newBook.price} onChange={e => setNewBook({ ...newBook, price: Number(e.target.value) })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <input type="number" placeholder="Stock Quantity *" required value={newBook.stock_quantity} onChange={e => setNewBook({ ...newBook, stock_quantity: Number(e.target.value) })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <input type="text" placeholder="ISBN-13" value={newBook.isbn} onChange={e => setNewBook({ ...newBook, isbn: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <input type="text" placeholder="Cover Image URL" value={newBook.cover_image_url} onChange={e => setNewBook({ ...newBook, cover_image_url: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Save Book</button>
                  <button type="button" className="btn-outline" onClick={() => setShowAddBook(false)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Cancel</button>
                </div>
              </form>
            )}

            {/* Inventory Table */}
            <div style={{ background: '#fff', border: '1px solid var(--parchment-border)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ background: 'var(--parchment-card)', borderBottom: '1px solid var(--parchment-border)' }}>
                  <tr>
                    <th style={{ padding: '10px 14px' }}>Book Title</th>
                    <th style={{ padding: '10px 14px' }}>Author</th>
                    <th style={{ padding: '10px 14px' }}>Genre</th>
                    <th style={{ padding: '10px 14px' }}>Price (PKR)</th>
                    <th style={{ padding: '10px 14px' }}>Stock Count</th>
                    <th style={{ padding: '10px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(b => (
                    <tr key={b.book_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{b.title}</td>
                      <td style={{ padding: '10px 14px' }}>{b.author}</td>
                      <td style={{ padding: '10px 14px' }}>{b.genre}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--emerald-dark)' }}>PKR {b.price}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className={`badge-stock ${b.stock_quantity > 0 ? 'in-stock' : 'out-stock'}`}>
                          {b.stock_quantity > 0 ? `${b.stock_quantity} units` : 'Out of Stock'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--danger-red)', cursor: 'pointer' }} onClick={() => handleDeleteBook(b.book_id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER FULFILLMENT & PAYMENT RECEIPT VERIFICATION */}
        {activeTab === 'orders' && (
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Order Fulfillment & Payment Proofs</h4>
            <div style={{ background: '#fff', border: '1px solid var(--parchment-border)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ background: 'var(--parchment-card)', borderBottom: '1px solid var(--parchment-border)' }}>
                  <tr>
                    <th style={{ padding: '10px 14px' }}>Order Ref</th>
                    <th style={{ padding: '10px 14px' }}>Customer & Phone</th>
                    <th style={{ padding: '10px 14px' }}>City & Address</th>
                    <th style={{ padding: '10px 14px' }}>Payment Method</th>
                    <th style={{ padding: '10px 14px' }}>Payment Status</th>
                    <th style={{ padding: '10px 14px' }}>Fulfillment Status</th>
                    <th style={{ padding: '10px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.order_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>{o.order_id}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div>{o.shipping_address.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.shipping_address.phone}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div>{o.shipping_address.city}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.shipping_address.address}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>{o.payment_method}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className={`badge-stock ${o.payment_status === 'Verified' ? 'in-stock' : 'out-stock'}`}>
                          {o.payment_status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <select
                          value={o.order_status}
                          onChange={(e) => handleUpdateOrderStatus(o.order_id, e.target.value, o.courier_name, o.courier_tracking_id)}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--parchment-border)', fontSize: '0.8rem' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {o.payment_receipt_url && (
                          <button
                            className="btn-outline"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => setSelectedReceipt(o)}
                          >
                            <Eye size={14} />
                            <span>View Receipt</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* View Payment Receipt Screenshot Modal */}
            {selectedReceipt && (
              <div className="modal-overlay" onClick={() => setSelectedReceipt(null)}>
                <div className="modal-card" style={{ maxWidth: '500px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                  <button className="close-btn" onClick={() => setSelectedReceipt(null)}><X size={18} /></button>
                  <h3>Payment Receipt Verification</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Uploaded for Order #{selectedReceipt.order_id} ({selectedReceipt.payment_method})
                  </p>
                  <img
                    src={selectedReceipt.payment_receipt_url}
                    alt="Receipt Screenshot"
                    style={{ maxHeight: '350px', maxWidth: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', marginBottom: '16px' }}
                  />
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      className="btn-primary"
                      onClick={() => handleVerifyPayment(selectedReceipt.order_id, 'Verified')}
                    >
                      <CheckCircle size={16} />
                      <span>Approve & Verify</span>
                    </button>
                    <button
                      className="btn-outline"
                      style={{ color: 'var(--danger-red)', borderColor: 'var(--danger-red)' }}
                      onClick={() => handleVerifyPayment(selectedReceipt.order_id, 'Rejected')}
                    >
                      Reject Payment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
