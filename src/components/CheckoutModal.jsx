import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_CONFIG } from '../config/storeConfig';
import { X, CheckCircle, Truck, Upload, Copy, ArrowRight, Smartphone } from 'lucide-react';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    subtotal,
    shippingFee,
    grandTotal,
    addToast,
    setRecentOrder,
    fetchBooks
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(STORE_CONFIG.cities[0]);
  const [postalCode, setPostalCode] = useState('54000');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'EasyPaisa'
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setReceiptPreview(base64);

      setUploadingReceipt(true);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });
        const data = await res.json();
        if (data.success) {
          setReceiptFile(data.url);
          addToast('EasyPaisa payment receipt screenshot uploaded!');
        }
      } catch (err) {
        console.error(err);
        addToast('Failed to upload receipt image', 'error');
      } finally {
        setUploadingReceipt(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !city) {
      addToast('Please complete shipping details', 'warning');
      return;
    }

    if (paymentMethod === 'EasyPaisa' && !receiptFile) {
      addToast('Please upload your EasyPaisa payment receipt screenshot', 'warning');
      return;
    }

    setSubmittingOrder(true);

    try {
      const orderPayload = {
        items: cart.map(i => ({ book_id: i.book_id, quantity: i.quantity })),
        shipping_address: {
          full_name: fullName,
          phone,
          address,
          city,
          postal_code: postalCode
        },
        payment_method: paymentMethod,
        payment_receipt_url: receiptFile
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!data.success) {
        addToast(data.message || 'Order failed to process', 'error');
        setSubmittingOrder(false);
        return;
      }

      setCompletedOrder(data.order);
      setRecentOrder(data.order);
      clearCart();
      fetchBooks();
      addToast(`Order ${data.order.order_id} placed successfully!`);
    } catch (err) {
      console.error(err);
      addToast('Network error while placing order', 'error');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => !completedOrder && setIsCheckoutOpen(false)}>
      <div className="modal-card" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={() => {
            setIsCheckoutOpen(false);
            setCompletedOrder(null);
          }}
        >
          <X size={20} />
        </button>

        {completedOrder ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: '#dcfce7',
              color: '#16a34a',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justify-content: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle size={44} />
            </div>

            <h2 style={{ fontSize: '2rem', color: 'var(--primary-navy)', margin: '0 0 8px' }}>
              JazakAllah! Order Placed Successfully
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '20px' }}>
              Your Islamic books order has been recorded. Tracking code:
            </p>

            <div style={{
              background: 'var(--parchment-card)',
              border: '2px dashed var(--emerald-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-dark)', letterSpacing: '1px' }}>
                {completedOrder.order_id}
              </span>
              <button
                className="icon-btn"
                onClick={() => {
                  navigator.clipboard.writeText(completedOrder.order_id);
                  addToast('Tracking ID copied to clipboard!');
                }}
                title="Copy Order ID"
              >
                <Copy size={16} />
              </button>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                setIsCheckoutOpen(false);
                setCompletedOrder(null);
              }}
            >
              Continue Browsing Islamic Books
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-navy)', marginBottom: '4px' }}>
              Checkout & Shipping Details
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Authentic printed Islamic books delivered nationwide across Pakistan.
            </p>

            <form onSubmit={handleSubmitOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--emerald-dark)', marginBottom: '12px' }}>
                    1. Shipping Information
                  </h4>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Ali"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--parchment-border)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Mobile Phone (for delivery SMS) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0324-1453947"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--parchment-border)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Complete Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House/Flat #, Street, Block, Area"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--parchment-border)' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                        City *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--parchment-border)' }}
                      >
                        {STORE_CONFIG.cities.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--parchment-border)' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--emerald-dark)', marginBottom: '12px' }}>
                    2. Payment Method Selector
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'COD' ? '2px solid var(--emerald-primary)' : '1px solid var(--parchment-border)',
                      background: paymentMethod === 'COD' ? '#f0fdf4' : '#fff',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                      />
                      <Truck size={22} color="var(--emerald-primary)" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Cash on Delivery (COD)</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay cash to rider upon book delivery</div>
                      </div>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'EasyPaisa' ? '2px solid var(--emerald-primary)' : '1px solid var(--parchment-border)',
                      background: paymentMethod === 'EasyPaisa' ? '#f0fdf4' : '#fff',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'EasyPaisa'}
                        onChange={() => setPaymentMethod('EasyPaisa')}
                      />
                      <Smartphone size={22} color="var(--gold-accent)" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>EasyPaisa Transfer</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Upload transfer receipt screenshot</div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'EasyPaisa' && (
                    <div style={{
                      background: 'var(--parchment-card)',
                      border: '1.5px solid var(--gold-accent)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      fontSize: '0.85rem',
                      marginBottom: '16px'
                    }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '6px' }}>
                        EasyPaisa Account Info:
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--emerald-dark)', marginBottom: '4px' }}>
                        📱 Number: 03443418044
                      </div>
                      <div style={{ color: 'var(--text-dark)', marginBottom: '10px' }}>
                        • Account Title: <strong>{STORE_CONFIG.paymentMethods.easypaisa.accountTitle}</strong>
                      </div>

                      <label style={{
                        display: 'block',
                        padding: '12px',
                        background: '#fff',
                        border: '2px dashed var(--emerald-primary)',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}>
                        <Upload size={20} color="var(--emerald-primary)" style={{ margin: '0 auto 4px' }} />
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--emerald-dark)' }}>
                          {uploadingReceipt ? 'Uploading Screenshot...' : 'Upload EasyPaisa Receipt Screenshot *'}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleReceiptChange}
                        />
                      </label>

                      {receiptPreview && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                          <img src={receiptPreview} alt="Receipt Preview" style={{ maxHeight: '100px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                          <div style={{ fontSize: '0.72rem', color: 'var(--success-green)', fontWeight: 600 }}>Screenshot Attached ✓</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--parchment-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span>Subtotal:</span>
                      <span>PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span>Shipping Fee:</span>
                      <span>{shippingFee === 0 ? 'FREE' : `PKR ${shippingFee}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: 'var(--emerald-dark)', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                      <span>Total Amount:</span>
                      <span>PKR {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '16px' }}
                    disabled={submittingOrder || uploadingReceipt}
                  >
                    <span>{submittingOrder ? 'Processing Order...' : 'Confirm & Place Order'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
