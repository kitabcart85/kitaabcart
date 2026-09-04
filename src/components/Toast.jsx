import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useStore();

  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '360px'
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: t.type === 'error' ? '#ef4444' : t.type === 'warning' ? '#f59e0b' : '#047857',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.88rem',
            fontWeight: 500,
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {t.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <div style={{ flex: 1 }}>{t.message}</div>
        </div>
      ))}
    </div>
  );
};
