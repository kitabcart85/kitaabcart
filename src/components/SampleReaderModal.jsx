import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export const SampleReaderModal = () => {
  const { sampleBook, setSampleBook } = useStore();
  const [currentPage, setCurrentPage] = useState(0);

  if (!sampleBook) return null;

  const pages = sampleBook.sample_pages || [
    `Sample Excerpt: "${sampleBook.title}" by ${sampleBook.author}.\n\nPublished by ${sampleBook.publisher}. ISBN: ${sampleBook.isbn}.\n\nThis book is printed on premium cream paper with high contrast typography for comfortable reading.`,
    `Chapter 1 Excerpt:\n\nIn the realm of classic literature, every sentence resonates with eternal wisdom. Ibn-e-Abbas Books guarantees authentic publisher releases.`
  ];

  return (
    <div className="modal-overlay" onClick={() => setSampleBook(null)}>
      <div
        className="modal-card"
        style={{ maxWidth: '700px', background: '#fdfbf7', border: '2px solid var(--parchment-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={() => setSampleBook(null)}>
          <X size={20} />
        </button>

        {/* Reader Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--parchment-border)', paddingBottom: '14px', marginBottom: '20px' }}>
          <BookOpen size={24} color="var(--emerald-primary)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-navy)' }}>
              Read Sample Pages: {sampleBook.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page {currentPage + 1} of {pages.length} Excerpts
            </div>
          </div>
        </div>

        {/* Book Page Frame */}
        <div style={{
          background: '#fff',
          border: '1px solid var(--parchment-border)',
          borderRadius: 'var(--radius-md)',
          padding: '30px',
          minHeight: '280px',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)',
          position: 'relative'
        }}>
          <pre style={{
            fontFamily: sampleBook.language === 'Urdu' ? 'var(--font-urdu)' : 'var(--font-serif)',
            fontSize: sampleBook.language === 'Urdu' ? '1.15rem' : '1rem',
            lineHeight: '2.1',
            whiteSpace: 'pre-wrap',
            color: 'var(--text-dark)'
          }}>
            {pages[currentPage]}
          </pre>
        </div>

        {/* Navigation Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
          <button
            className="btn-outline"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          >
            <ChevronLeft size={18} />
            <span>Previous Page</span>
          </button>

          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Ibn-e-Abbas Books Sample Preview
          </span>

          <button
            className="btn-outline"
            disabled={currentPage === pages.length - 1}
            onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))}
          >
            <span>Next Page</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
