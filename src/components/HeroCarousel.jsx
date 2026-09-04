import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, BookOpen, Shield, Award, Truck } from 'lucide-react';

export const HeroCarousel = () => {
  const { setActiveCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Discover Masterpieces of Urdu & Islamic Literature",
      subtitle: "Authentic printed editions of Seerat-un-Nabi, Allama Iqbal's poetry, Pir-e-Kamil, and classic historical works.",
      cta: "Explore Islamic Collection",
      category: "Islamic",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      badge: "BESTSELLER COLLECTION"
    },
    {
      title: "CSS & Academic Preparation Books",
      subtitle: "Comprehensive FPCS CSS, PMS, and university guides with instant nationwide shipping.",
      cta: "Browse Academic Books",
      category: "Academic",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
      badge: "EXAM SPECIAL 2026"
    },
    {
      title: "Self-Help & Personal Growth Novels",
      subtitle: "Atomic Habits, Forty Rules of Love, and classic motivational reads in Urdu & English.",
      cta: "View Non-Fiction",
      category: "Non-Fiction",
      image: "/assets/success_mindset_book_1788429573702.png",
      badge: "NEW ARRIVALS"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="hero-slider">
      <div className="hero-banner">
        <div className="hero-content">
          <div style={{
            display: 'inline-block',
            background: 'var(--gold-accent)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '14px',
            letterSpacing: '1px'
          }}>
            {slide.badge}
          </div>
          <h2>{slide.title}</h2>
          <p>{slide.subtitle}</p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              className="btn-gold"
              onClick={() => setActiveCategory(slide.category)}
            >
              <span>{slide.cta}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={slide.image}
            alt={slide.title}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
              transform: 'rotate(-2deg)'
            }}
          />
        </div>
      </div>

      {/* Hero Features Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginTop: '20px'
      }}>
        <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--parchment-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Truck size={28} color="var(--emerald-primary)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Nationwide COD</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Karachi to Gilgit delivery</div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--parchment-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={28} color="var(--gold-accent)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>100% Authentic</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Genuine publisher prints</div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--parchment-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Award size={28} color="var(--emerald-dark)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Secure Checkout</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>COD & JazzCash supported</div>
          </div>
        </div>
      </div>
    </section>
  );
};
