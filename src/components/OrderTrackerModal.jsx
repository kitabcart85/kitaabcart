import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from 'lucide-react';

export const OrderTrackerModal = () => {
  const { isTrackerOpen, setIsTrackerOpen, addToast } = useStore();
  const [searchId, setSearchId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isTrackerOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setTrackingResult(null);

    try {
      const res = await fetch(`/api/orders/track/${searchId.trim()}`);
      const data = await res.json();

      if (data.success) {
        setTrackingResult(data);
      } else {
        setErrorMsg(data.message || 'Order tracking number not found');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to connect to tracking server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsTrackerOpen(false)}>
      <div className="modal-card" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setIsTrackerOpen(false)}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Truck size={26} color="var(--emerald-primary)" />
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', margin: 0 }}>
            Real-Time Order Tracking
          </h2>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Enter your unique Ibn-e-Abbas Order ID (e.g. <code>IBN-2026-1001</code>) to check shipment progress.
        </p>

        {/* Tracking Search Input */}
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Enter Order ID e.g. IBN-2026-1001"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--parchment-border)',
              fontSize: '0.95rem'
            }}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            <Search size={18} />
            <span>{loading ? 'Searching...' : 'Track Order'}</span>
          </button>
        </form>

        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tracking Timeline Output */}
        {trackingResult && (
          <div style={{ background: 'var(--parchment-card)', border: '1px solid var(--parchment-border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--parchment-border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-navy)' }}>
                  Order ID: {trackingResult.order.order_id}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Placed on: {new Date(trackingResult.order.created_at).toLocaleDateString()}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge-stock ${trackingResult.order.order_status === 'Delivered' ? 'in-stock' : 'out-stock'}`} style={{ fontSize: '0.8rem' }}>
                  {trackingResult.order.order_status}
                </span>
                <div style={{ fontSize: '0.78rem', color: 'var(--emerald-dark)', fontWeight: 700, marginTop: '4px' }}>
                  {trackingResult.order.courier_name}
                </div>
              </div>
            </div>

            {/* Courier Tracking Ref if available */}
            {trackingResult.order.courier_tracking_id && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem' }}>
                <strong>Courier Tracking Code:</strong> <code>{trackingResult.order.courier_tracking_id}</code> ({trackingResult.order.courier_name})
              </div>
            )}

            {/* Timeline Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {trackingResult.timeline.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: step.completed ? 'var(--emerald-primary)' : '#cbd5e1',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justify-content: 'center'
                  }}>
                    {step.completed ? <CheckCircle2 size={18} /> : <Clock size={16} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: step.completed ? 'var(--primary-navy)' : 'var(--text-muted)' }}>
                      {step.step}
                    </div>
                    {step.status && <div style={{ fontSize: '0.78rem', color: 'var(--emerald-dark)' }}>Payment: {step.status}</div>}
                    {step.tracking_id && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tracking ID: {step.tracking_id}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
