export function Card({ children, className = '', colors, style, ...props }) {
  const isDark = !!colors;
  const bg = isDark
    ? `linear-gradient(160deg, ${colors.bgPanelAlt} 0%, ${colors.bgPanel} 100%)`
    : 'linear-gradient(160deg, #ffffff 0%, #F7FBFE 100%)';
  const border = colors?.border ?? '#E1EAF5';
  const shadow = isDark
    ? '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
    : '0 2px 6px rgba(6,42,103,0.06), 0 14px 28px -12px rgba(6,42,103,0.14)';
  return (
    <div
      className={className}
      style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, boxShadow: shadow, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ children, color = '#0878D1', bg }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: 999,
        color: bg ? color : '#fff',
        background: bg || color,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />
      {children}
    </span>
  );
}

import { createPortal } from 'react-dom';

export function Modal({ open, onClose, title, children, colors }) {
  if (!open) return null;
  const isDark = !!colors;
  const bg = isDark
    ? `linear-gradient(160deg, ${colors.bgPanelAlt} 0%, ${colors.bgPanel} 100%)`
    : 'linear-gradient(160deg, #ffffff 0%, #F7FBFE 100%)';
  const text = colors?.text ?? '#071B3F';
  const border = colors?.border ?? '#E1EAF5';
  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(6,42,103,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: bg, color: text, border: `1px solid ${border}`,
          borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '88vh',
          overflowY: 'auto', padding: 24,
          boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.4)' : '0 12px 32px rgba(6,42,103,0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18 }}>{title}</h3>
          <button onClick={onClose} aria-label="Close" style={{ fontSize: 20, lineHeight: 1, opacity: 0.6 }}>×</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
