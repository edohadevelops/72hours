export function money(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

// For contact-for-pricing tiers, order.total is null until staff confirm a
// price via WhatsApp — show that honestly instead of a misleading ₦0.
export function moneyOrPending(amount) {
  return amount == null ? 'Pricing pending' : money(amount);
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Hours remaining until the 72hr promise (or express deadline) is due.
export function hoursRemaining(expectedDeliveryIso) {
  const diffMs = new Date(expectedDeliveryIso).getTime() - Date.now();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
}

// WhatsApp deep link — works today with no backend, no API key.
// This is the "visible layer" that later swaps for the real WhatsApp
// Business Cloud API without changing how callers use it.
export function whatsappLink(phone, message) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
