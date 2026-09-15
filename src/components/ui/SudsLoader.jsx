// Signature loading animation: bubbles bobbling up out of a laundry basket.
// Uses currentColor so it adapts to whatever surface drops it in (button,
// full-page, card) — same principle as LoadingButton.

export default function SudsLoader({ size = 'md', label }) {
  const dims = { sm: 32, md: 56, lg: 108 }[size] || 56;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: 'currentColor', overflow: 'visible' }}
      >
        {/* bobbling bubbles rising out of the basket */}
        <circle className="basket-bubble bb-1" cx="42" cy="58" r="6" fill="currentColor" opacity="0.75" />
        <circle className="basket-bubble bb-2" cx="60" cy="52" r="4.5" fill="currentColor" opacity="0.6" />
        <circle className="basket-bubble bb-3" cx="76" cy="60" r="5.5" fill="currentColor" opacity="0.7" />
        <circle className="basket-bubble bb-4" cx="52" cy="64" r="3.5" fill="currentColor" opacity="0.5" />
        <circle className="basket-bubble bb-5" cx="68" cy="56" r="3" fill="currentColor" opacity="0.55" />

        {/* basket */}
        <path d="M26 68 L94 68 L84 104 Q60 111 36 104 Z" fill="none" stroke="currentColor" strokeWidth="3.5" opacity="0.95" strokeLinejoin="round" />
        <path d="M26 68 Q60 77 94 68" fill="none" stroke="currentColor" strokeWidth="3.5" opacity="0.95" strokeLinejoin="round" />
        <path d="M31 77 H89 M33.5 87 H86.5 M37 97 H83" stroke="currentColor" strokeWidth="1.75" opacity="0.35" />
        <path d="M40 68 V60 Q40 55 45 55 M80 68 V60 Q80 55 75 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </svg>
      {label && <span style={{ fontSize: 13, opacity: 0.75 }}>{label}</span>}
    </div>
  );
}
