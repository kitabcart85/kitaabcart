import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, BookOpen, Star, ShieldCheck, Truck, MessageSquare, CheckCircle } from 'lucide-react';

export const ProductDetailModal = () => {
  const { selectedBook, setSelectedBook, setSampleBook, addToCart, books } = useStore();
  const [activeTab, setActiveTab] = useState('synopsis'); // 'synopsis' | 'reviews'
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (selectedBook) {
      // Fetch reviews for selected book
      fetch(`/api/reviews/${selectedBook.book_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setReviews(data.reviews);
        })
        .catch(err => console.error(err));
    }
  }, [selectedBook]);

  if (!selectedBook) return null;

  const isOutOfStock = selectedBook.stock_quantity <= 0;
  const relatedBooks = books
    .filter(b => b.genre === selectedBook.genre && b.book_id !== selectedBook.book_id)
    .slice(0, 3);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: selectedBook.book_id,
          user_name: userName.trim() || 'Verified Reader',
          rating: newRating,
          comment: newComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setSelectedBook(null)}>
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '30px' }}>
          {/* Left Column: Image & Quick Specs */}
          <div>
            <div style={{
              background: '#fff',
              border: '1px solid var(--parchment-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <img
                src={selectedBook.cover_image_url}
                alt={selectedBook.title}
                style={{ maxHeight: '340px', maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <button
                className="btn-gold"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setSampleBook(selectedBook)}
              >
                <BookOpen size={18} />
                <span>Read Sample Pages</span>
              </button>
            </div>
          </div>

          {/* Right Column: Detailed Overview */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--emerald-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              {selectedBook.genre} • {selectedBook.language}
            </div>

            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', margin: '4px 0' }}>
              {selectedBook.title}
            </h2>

            {selectedBook.title_urdu && (
              <div className="urdu-font" style={{ fontSize: '1.2rem', color: 'var(--emerald-dark)' }}>
                {selectedBook.title_urdu}
              </div>
            )}

            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Author: <strong style={{ color: 'var(--text-dark)' }}>{selectedBook.author}</strong> | Publisher: <strong>{selectedBook.publisher}</strong>
            </div>

            {/* Price Banner */}
            <div style={{
              background: 'var(--parchment-card)',
              border: '1px solid var(--parchment-border)',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justify-content: 'space-between',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--emerald-dark)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>PKR</span> {selectedBook.price.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--success-green)', fontWeight: 600 }}>
                  Inclusive of all taxes • Instant Dispatch
                </div>
              </div>

              <button
                className="btn-primary"
                disabled={isOutOfStock}
                onClick={() => {
                  addToCart(selectedBook);
                  setSelectedBook(null);
                }}
              >
                <ShoppingBag size={18} />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>

            {/* BOOK SPECS BOX */}
            <div className="specs-box">
              <div className="spec-item">
                <span className="spec-label">Binding Type</span>
                <span className="spec-value">{selectedBook.binding}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Page Count</span>
                <span className="spec-value">{selectedBook.pages} Pages</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">ISBN-13</span>
                <span className="spec-value">{selectedBook.isbn}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Condition</span>
                <span className="spec-value">{selectedBook.condition} (Pristine Print)</span>
              </div>
            </div>

            {/* Synopsis & Reviews Tabs */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid var(--parchment-border)', marginBottom: '14px' }}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'synopsis' ? '3px solid var(--emerald-primary)' : '3px solid transparent',
                    padding: '8px 12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: activeTab === 'synopsis' ? 'var(--emerald-dark)' : 'var(--text-muted)'
                  }}
                  onClick={() => setActiveTab('synopsis')}
                >
                  Synopsis & Overview
                </button>

                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'reviews' ? '3px solid var(--emerald-primary)' : '3px solid transparent',
                    padding: '8px 12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: activeTab === 'reviews' ? 'var(--emerald-dark)' : 'var(--text-muted)'
                  }}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              {activeTab === 'synopsis' ? (
                <p style={{ color: 'var(--text-dark)', fontSize: '0.92rem', lineHeight: '1.7' }}>
                  {selectedBook.description}
                </p>
              ) : (
                <div>
                  {/* Reviews List */}
                  <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                    {reviews.length === 0 ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No reviews yet. Be the first to review this book!</div>
                    ) : (
                      reviews.map((r) => (
                        <div key={r.review_id} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <strong>{r.user_name}</strong>
                            <div style={{ color: 'var(--gold-accent)' }}>{'★'.repeat(r.rating)}</div>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Submit Review Form */}
                  <form onSubmit={handleReviewSubmit} style={{ background: 'var(--parchment-card)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>Write a Customer Review</div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--parchment-border)' }}
                      />
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--parchment-border)' }}
                      >
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★☆</option>
                        <option value={3}>3 Stars ★★★☆☆</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Share your thoughts on this book..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--parchment-border)', marginBottom: '8px' }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} disabled={submittingReview}>
                      Submit Review
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Related Books Slider */}
            {relatedBooks.length > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--parchment-border)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px', color: 'var(--primary-navy)' }}>
                  Related Books in {selectedBook.genre}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {relatedBooks.map(rb => (
                    <div
                      key={rb.book_id}
                      style={{
                        flex: 1,
                        background: 'var(--parchment-card)',
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--parchment-border)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                      }}
                      onClick={() => setSelectedBook(rb)}
                    >
                      <img src={rb.cover_image_url} alt={rb.title} style={{ width: '36px', height: '48px', objectFit: 'cover' }} />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rb.title}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--emerald-dark)', fontWeight: 700 }}>PKR {rb.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
