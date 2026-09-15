export default function LoadingButton({
  loading,
  children,
  className = '',
  disabled,
  style,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap ${className}`}
      style={{ position: 'relative', ...style }}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'suds-spin 0.9s linear infinite' }}>
            <circle
              cx="8" cy="8" r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="28"
              strokeDashoffset="10"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
          Working…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
