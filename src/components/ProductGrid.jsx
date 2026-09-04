import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { BookOpen, Flame, Sparkles, Filter } from 'lucide-react';

export const ProductGrid = () => {
  const { books, activeCategory, setActiveCategory, loadingBooks } = useStore();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'bestsellers' | 'new'

  let filteredBooks = books;

  if (activeCategory !== 'All') {
    filteredBooks = filteredBooks.filter(b => b.genre.toLowerCase() === activeCategory.toLowerCase());
  }

  if (activeTab === 'bestsellers') {
    filteredBooks = filteredBooks.filter(b => b.bestseller || b.rating >= 4.8);
  } else if (activeTab === 'new') {
    filteredBooks = filteredBooks.filter(b => b.featured);
  }

  return (
    <section className="section-container">
      {/* Section Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">
            {activeCategory === 'All' ? 'Catalog & Featured Collection' : `${activeCategory} Collection`}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            {filteredBooks.length} physical books available for immediate delivery
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--parchment-card)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--parchment-border)' }}>
          <button
            className={`btn-outline ${activeTab === 'all' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              border: 'none',
              background: activeTab === 'all' ? 'var(--primary-navy)' : 'transparent',
              color: activeTab === 'all' ? '#fff' : 'var(--text-dark)'
            }}
            onClick={() => setActiveTab('all')}
          >
            All Books
          </button>

          <button
            className={`btn-outline ${activeTab === 'bestsellers' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              border: 'none',
              background: activeTab === 'bestsellers' ? 'var(--primary-navy)' : 'transparent',
              color: activeTab === 'bestsellers' ? '#fff' : 'var(--text-dark)'
            }}
            onClick={() => setActiveTab('bestsellers')}
          >
            <Flame size={14} color="var(--gold-accent)" />
            <span>Bestsellers</span>
          </button>

          <button
            className={`btn-outline ${activeTab === 'new' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              border: 'none',
              background: activeTab === 'new' ? 'var(--primary-navy)' : 'transparent',
              color: activeTab === 'new' ? '#fff' : 'var(--text-dark)'
            }}
            onClick={() => setActiveTab('new')}
          >
            <Sparkles size={14} color="var(--emerald-primary)" />
            <span>New Arrivals</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loadingBooks ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <BookOpen size={40} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <div>Loading Ibn-e-Abbas Books catalog...</div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--parchment-border)' }}>
          <Filter size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3>No books match your selection</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0 16px' }}>Try switching categories or clearing search filters.</p>
          <button className="btn-primary" onClick={() => setActiveCategory('All')}>
            Reset Category Filter
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredBooks.map((book) => (
            <ProductCard key={book.book_id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
};
