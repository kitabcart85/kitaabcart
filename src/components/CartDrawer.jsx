import React from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_CONFIG } from '../config/storeConfig';
import { X, Trash2, Plus, Minus, ArrowRight, Truck, ShoppingBag } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    grandTotal,
    setIsCheckoutOpen
  } = useStore();

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, STORE_CONFIG.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / STORE_CONFIG.freeShippingThreshold) * 100);

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Your Shopping Cart ({cart.length})</h3>
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ background: '#f8fafc', padding: '14px 20px', borderBottom: '1px solid var(--parchment-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={16} color="var(--emerald-primary)" />
              {remainingForFreeShipping === 0 ? (
                <span style={{ color: 'var(--emerald-primary)' }}>🎉 Congratulations! You unlocked FREE Delivery!</span>
              ) : (
                <span>Add <strong>PKR {remainingForFreeShipping.toLocaleString()}</strong> more for FREE Delivery</span>
              )}
            </div>
          </div>
          <div style={{ background: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--emerald-primary)', height: '100%', width: `${freeShippingProgress}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 14px', opacity: 0.4 }} />
              <h4>Your cart is empty</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Browse our Urdu & Islamic books collection to start adding items.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.book_id} className="cart-item">
                <img src={item.cover_image_url} alt={item.title} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--primary-navy)' }}>{item.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>by {item.author}</div>
                  <div style={{ fontWeight: 700, color: 'var(--emerald-dark)', margin: '4px 0', fontSize: '0.9rem' }}>
                    PKR {item.price.toLocaleString()}
                  </div>

                  {/* Quantity Modifier */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <button
                      className="icon-btn"
                      style={{ padding: '4px', width: '26px', height: '26px' }}
                      onClick={() => updateCartQuantity(item.book_id, item.quantity - 1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.quantity}</span>
                    <button
                      className="icon-btn"
                      style={{ padding: '4px', width: '26px', height: '26px' }}
                      onClick={() => updateCartQuantity(item.book_id, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <button
                  style={{ background: 'none', border: 'none', color: 'var(--danger-red)', cursor: 'pointer' }}
                  onClick={() => removeFromCart(item.book_id)}
                  title="Remove Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer Summary */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
              <span>Subtotal:</span>
              <strong style={{ color: 'var(--text-dark)' }}>PKR {subtotal.toLocaleString()}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '12px' }}>
              <span>Shipping Fee:</span>
              <strong style={{ color: shippingFee === 0 ? 'var(--emerald-primary)' : 'var(--text-dark)' }}>
                {shippingFee === 0 ? 'FREE' : `PKR ${shippingFee}`}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, borderTop: '1px solid var(--parchment-border)', paddingTop: '10px', marginBottom: '16px' }}>
              <span>Total PKR:</span>
              <span style={{ color: 'var(--emerald-dark)' }}>PKR {grandTotal.toLocaleString()}</span>
            </div>

            <button
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
