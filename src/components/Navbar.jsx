import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_CONFIG } from '../config/storeConfig';
import { Search, ShoppingBag, Truck, UserCheck, ShieldCheck, BookOpen, ChevronDown, Sparkles, X } from 'lucide-react';

export const Navbar = () => {
  const {
    books,
    cart,
    setIsCartOpen,
    setIsTrackerOpen,
    setIsAdminOpen,
    userRole,
    setUserRole,
    activeCategory,
    setActiveCategory,
    setSelectedBook
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Debounced Live Search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchTerm.toLowerCase();
    const matches = books.filter(b => 
      b.title.toLowerCase().includes(query) ||
      (b.title_urdu && b.title_urdu.includes(query)) ||
      b.author.toLowerCase().includes(query) ||
      b.isbn.includes(query)
    ).slice(0, 6);

    setSearchResults(matches);
  }, [searchTerm, books]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="main-header">
      {/* Top Announcement Marquee */}
      <div className="announcement-bar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="badge">OFFER</span>
          <span>🚚 Nationwide Cash on Delivery | <strong>FREE Delivery</strong> on orders over PKR 2,000</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
          <span><Truck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Trax & Leopards Delivery</span>
          <span>📞 Helpline: 0300-9876543</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="header-container">
        {/* Brand Logo */}
        <a href="#" className="brand-logo" onClick={() => setActiveCategory('All')}>
          <div className="brand-icon-wrapper">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="brand-title">{STORE_CONFIG.name}</div>
            <div className="brand-subtitle urdu-font">{STORE_CONFIG.nameUrdu}</div>
          </div>
        </a>

        {/* Dynamic Search Bar */}
        <div className="search-container" ref={searchRef}>
          <div className="search-input-wrapper">
            <Search size={18} color="var(--emerald-primary)" />
            <input
              type="text"
              className="search-input"
              placeholder="Search books by Title, Author, or ISBN-13..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim() && setIsSearching(true)}
            />
            {searchTerm && (
              <X
                size={16}
                style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearching && searchResults.length > 0 && (
            <div className="search-dropdown">
              <div style={{ padding: '8px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid #f1f5f9' }}>
                MATCHING BOOKS ({searchResults.length})
              </div>
              {searchResults.map((book) => (
                <div
                  key={book.book_id}
                  className="search-item"
                  onClick={() => {
                    setSelectedBook(book);
                    setIsSearching(false);
                    setSearchTerm('');
                  }}
                >
                  <img src={book.cover_image_url} alt={book.title} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{book.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>by {book.author}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--emerald-dark)', fontSize: '0.88rem' }}>PKR {book.price}</div>
                    <span style={{ fontSize: '0.7rem', color: book.stock_quantity > 0 ? 'var(--emerald-primary)' : 'var(--danger-red)' }}>
                      {book.stock_quantity > 0 ? `${book.stock_quantity} in stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User & Actions Controls */}
        <div className="header-actions">
          {/* Order Tracker Button */}
          <button className="btn-outline" onClick={() => setIsTrackerOpen(true)} title="Track Order">
            <Truck size={16} />
            <span style={{ display: 'none', mdDisplay: 'inline' }}>Track Order</span>
          </button>

          {/* Cart Drawer Trigger */}
          <button className="icon-btn" onClick={() => setIsCartOpen(true)} title="View Cart">
            <ShoppingBag size={20} />
            {cartItemCount > 0 && <span className="badge-count">{cartItemCount}</span>}
          </button>

          {/* Admin Switcher Menu */}
          <button
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              background: userRole === 'admin' ? 'var(--gold-accent)' : 'var(--emerald-dark)'
            }}
            onClick={() => {
              if (userRole === 'customer') {
                setUserRole('admin');
                setIsAdminOpen(true);
              } else {
                setUserRole('customer');
                setIsAdminOpen(false);
              }
            }}
          >
            {userRole === 'admin' ? <ShieldCheck size={16} /> : <UserCheck size={16} />}
            <span>{userRole === 'admin' ? 'Admin Portal' : 'Customer View'}</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="nav-categories">
        <div className="nav-container">
          {STORE_CONFIG.categories.map((cat) => (
            <a
              key={cat}
              className={`nav-link ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'Islamic' && <Sparkles size={14} color="var(--gold-accent)" />}
              {cat}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};
