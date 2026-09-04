import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SampleReaderModal } from './components/SampleReaderModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ToastContainer } from './components/Toast';
import { BookOpen, ShieldCheck, Heart, Truck, PhoneCall, Mail } from 'lucide-react';

function AppContent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <HeroCarousel />
        <ProductGrid />
      </main>

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <SampleReaderModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <AdminDashboard />
      <ToastContainer />

      {/* Footer */}
      <footer style={{
        background: 'var(--primary-navy)',
        color: '#f8fafc',
        padding: '50px 24px 24px',
        marginTop: '60px',
        borderTop: '4px solid var(--gold-accent)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <BookOpen size={24} color="var(--emerald-light)" />
              <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Ibn-e-Abbas Books</h3>
            </div>
            <div className="urdu-font" style={{ fontSize: '1.1rem', color: 'var(--gold-accent)', marginBottom: '10px' }}>
              ابنِ عباس کتب خانہ - پاکستان کی معتبر ترین آن لائن کتابوں کی دکان
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Promoting authentic Islamic knowledge, classic Urdu literature, academic excellence, and personal growth novels with nationwide Cash on Delivery.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '14px', borderBottom: '2px solid var(--emerald-primary)', paddingBottom: '6px', display: 'inline-block' }}>
              Store Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px', color: '#cbd5e1' }}>
              <li>• Islamic & Tafseer Books</li>
              <li>• Classic Urdu Literature & Poetry</li>
              <li>• Modern Urdu Novels (Umera Ahmed, Bano Qudsia)</li>
              <li>• CSS & PMS Exam Prep Guides</li>
              <li>• History of Subcontinent & Ottoman Empire</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '14px', borderBottom: '2px solid var(--emerald-primary)', paddingBottom: '6px', display: 'inline-block' }}>
              Courier Logistics & Payments
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.7' }}>
              <div>🚚 <strong>Trax Express & Leopards Courier</strong></div>
              <div>💳 <strong>Cash on Delivery (COD)</strong></div>
              <div>🏦 <strong>Bank Transfer, JazzCash & EasyPaisa</strong></div>
              <div style={{ marginTop: '10px', fontSize: '0.78rem', color: '#94a3b8' }}>
                Daily automatic Courier Booking CSV exports enabled for fulfillment centers.
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '14px', borderBottom: '2px solid var(--emerald-primary)', paddingBottom: '6px', display: 'inline-block' }}>
              Help & Support
            </h4>
            <div style={{ fontSize: '0.88rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={16} color="var(--gold-accent)" />
                <span>+92 300 9876543 / +92 321 1234567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--emerald-light)" />
                <span>orders@ibneabbas.pk</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
                Store Hours: Mon - Sat (9:00 AM - 9:00 PM PKT)
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid #334155', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem', color: '#94a3b8' }}>
          <div>© 2026 Ibn-e-Abbas Books (ابنِ عباس کتب خانہ). All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Built with care for book lovers in Pakistan</span>
            <Heart size={14} color="var(--danger-red)" fill="var(--danger-red)" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
