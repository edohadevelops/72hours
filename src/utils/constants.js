// 72hrs Laundry — Admin (dashboard) dark theme
// Same brand family as publicTheme.js, different mood: an operator staring
// at this all day needs less glare and clearer data hierarchy than a
// customer browsing a showroom.

export const adminColors = {
  bg: '#0A1830',           // deep navy-black base
  bgPanel: '#0F2149',      // card/panel surface
  bgPanelAlt: '#132A5C',   // hover/alt surface
  border: '#1E3A6E',
  text: '#F2F8FC',
  textMuted: '#8CA3C9',
  primary: '#13A9E5',      // cyan reads better than deep navy on a dark bg
  primaryHover: '#3CC0F5',
  accent: '#F5B400',
  accentHover: '#FFC933',
  danger: '#F0554A',
  success: '#2ECC8F',
  warning: '#F5B400',
};

// Shared order status -> colour + label map (admin + public both import this)
export const ORDER_STATUSES = [
  { key: 'pickup_requested', label: 'Pickup Requested', color: '#94A3B8' },
  { key: 'picked_up', label: 'Picked Up', color: '#0878D1' },
  { key: 'received', label: 'Received', color: '#0878D1' },
  { key: 'washing', label: 'Washing/Processing', color: '#13A9E5' },
  { key: 'ironing_folding', label: 'Ironing/Folding', color: '#13A9E5' },
  { key: 'quality_check', label: 'Quality Check', color: '#F5B400' },
  { key: 'ready', label: 'Ready', color: '#F5B400' },
  { key: 'out_for_delivery', label: 'Out for Delivery', color: '#0878D1' },
  { key: 'delivered', label: 'Delivered', color: '#2ECC8F' },
];

// Real service tiers from the client. Only "Normal" has a fixed price list —
// the other three are priced per-order via WhatsApp based on volume/condition,
// so they carry no multiplier and the booking flow shows "price to be confirmed"
// instead of fabricating a rate the business hasn't set.
export const SERVICE_TIERS = [
  { key: 'normal', label: 'Normal (72hrs)', shortLabel: 'Normal', duration: '72 hrs', multiplier: 1, contactForPricing: false },
  { key: 'exp_norm', label: 'Express Normal (Exp. Norm)', shortLabel: 'Exp. Normal', duration: 'Express', multiplier: null, contactForPricing: true },
  { key: 'wash_only', label: 'Wash Only (72hrs)', shortLabel: 'Wash Only', duration: '72 hrs', multiplier: null, contactForPricing: true },
  { key: 'exp_wash', label: 'Express Wash (Exp. Wash)', shortLabel: 'Exp. Wash', duration: 'Express', multiplier: null, contactForPricing: true },
];

export const PAYMENT_METHODS = [
  { key: 'paystack', label: 'Pay Online (Paystack)' },
  { key: 'flutterwave', label: 'Pay Online (Flutterwave)' },
  { key: 'wallet', label: '72hrs Wallet' },
  { key: 'cod', label: 'Cash / Transfer on Delivery' },
];

// Permission system. Each role gets an explicit list of permission strings —
// explicit rather than "manage implies view" to avoid implication bugs.
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard:view',
  ORDERS_VIEW: 'orders:view',
  ORDERS_MANAGE: 'orders:manage',
  CUSTOMERS_VIEW: 'customers:view',
  PRICING_VIEW: 'pricing:view',
  PRICING_MANAGE: 'pricing:manage',
  TEAM_MANAGE: 'team:manage',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  manager: 'Manager',
  customer_service: 'Customer Service',
  marketing: 'Marketing',
};

export const ROLE_PERMISSIONS = {
  super_admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.CUSTOMERS_VIEW, PERMISSIONS.PRICING_VIEW, PERMISSIONS.PRICING_MANAGE,
  ],
  customer_service: [
    PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.CUSTOMERS_VIEW,
  ],
  marketing: [
    PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.CUSTOMERS_VIEW,
  ],
};

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// Demo-only seed admin accounts. Client-side only — visible to anyone who opens
// devtools, so this is NOT real security. Real staff auth (hashed passwords,
// server-side checks) arrives with the Supabase migration. Editable afterward
// via the Team page (super_admin only) — stored in the browser, not this file.
export const DEFAULT_ADMIN_ACCOUNTS = [
  { username: 'dami', password: '12345678', name: 'Dami', role: 'super_admin' },
  { username: 'amen', password: '12345678', name: 'Amen', role: 'super_admin' },
];
