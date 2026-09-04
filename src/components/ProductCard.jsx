import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Eye, BookOpen, Star } from 'lucide-react';

export const ProductCard = ({ book }) => {
  const { addToCart, setSelectedBook, setSampleBook } = useStore();

  const isOutOfStock = book.stock_quantity <= 0;
  const originalPrice = Math.round(book.price * 1.25);
  const discountPercent = 20;

  return (
    <div className="product-card">
      {/* Badge Container */}
      <div className="card-badge-container">
        <span className="badge-discount">-{discountPercent}% OFF</span>
        <span className={`badge-stock ${isOutOfStock ? 'out-stock' : 'in-stock'}`}>
          {isOutOfStock ? 'Out of Stock' : `In Stock (${book.stock_quantity})`}
        </span>
      </div>

      {/* Book Cover Image */}
      <div className="cover-wrapper" onClick={() => setSelectedBook(book)} style={{ cursor: 'pointer' }}>
        <img src={book.cover_image_url} alt={book.title} />
      </div>

      {/* Book Info */}
      <div className="product-info">
        <div className="book-genre">{book.genre} • {book.language}</div>
        <div className="book-title" onClick={() => setSelectedBook(book)} style={{ cursor: 'pointer' }}>
          {book.title}
        </div>
        {book.title_urdu && (
          <div className="urdu-font" style={{ fontSize: '0.85rem', color: 'var(--emerald-dark)', marginTop: '-4px' }}>
            {book.title_urdu}
          </div>
        )}
        <div className="book-author">by {book.author}</div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--gold-accent)', marginBottom: '8px' }}>
          <Star size={14} fill="var(--gold-accent)" />
          <span style={{ fontWeight: 600 }}>{book.rating || 5.0}</span>
          <span style={{ color: 'var(--text-muted)' }}>({book.binding || 'Paperback'})</span>
        </div>

        {/* Price Row */}
        <div className="price-row">
          <div>
            <div className="price-pkr">
              <span>PKR</span> {book.price.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              PKR {originalPrice.toLocaleString()}
            </div>
          </div>
          
          <button
            className="btn-outline"
            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
            onClick={() => setSampleBook(book)}
            title="Read Sample Excerpt"
          >
            <BookOpen size={13} />
            <span>Sample</span>
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          className="btn-add-cart"
          disabled={isOutOfStock}
          onClick={() => addToCart(book)}
        >
          <ShoppingCart size={16} />
          <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
