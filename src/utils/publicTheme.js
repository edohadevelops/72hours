// 72hrs Laundry — Public (customer-facing) theme
// Sourced directly from the Business & Brand Overview.
// Dominant: white + navy. Blue + gold as accents only.

export const publicTheme = {
  navy: '#062A67',        // Primary brand colour — headings, buttons, footer
  royalBlue: '#0878D1',   // Secondary buttons, highlights, icons
  cyan: '#13A9E5',        // Water/drop accents, secondary highlights
  gold: '#F5B400',        // CTAs, highlights, accents — never dominant
  white: '#FFFFFF',
  lightBg: '#F2F8FC',     // Alternative section backgrounds
  darkText: '#071B3F',    // Body text where navy tone is required

  // Semantic aliases used across components
  bg: '#FFFFFF',
  bgAlt: '#F2F8FC',
  text: '#071B3F',
  textMuted: '#4A5A78',
  primary: '#062A67',
  primaryHover: '#0A3A8A',
  accent: '#F5B400',
  accentHover: '#D99C00',
  highlight: '#0878D1',
  border: '#E1EAF5',

  // Order status track colours (Pickup Requested -> Delivered)
  statusPending: '#94A3B8',
  statusActive: '#0878D1',
  statusDone: '#13A9E5',
  statusReady: '#F5B400',
  statusDelivered: '#0F9D58',
};

export const statusFlow = [
  { key: 'pickup_requested', label: 'Pickup Requested' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'received', label: 'Received' },
  { key: 'washing', label: 'Washing/Processing' },
  { key: 'ironing_folding', label: 'Ironing/Folding' },
  { key: 'quality_check', label: 'Quality Check' },
  { key: 'ready', label: 'Ready' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];
