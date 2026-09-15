// Seed/default data only. Pages never import this directly — everything
// flows through useContent(). This is what the admin edits.
// Preseeded with a realistic spread of orders across every status so the
// dashboard looks alive for a client demo, not empty.

export const defaultPricing = [
  { id: 'p1', name: 'Shirt', category: 'Clothing', price: 500, unit: 'item' },
  { id: 'p2', name: 'T-Shirt', category: 'Clothing', price: 500, unit: 'item' },
  { id: 'p3', name: 'Polo', category: 'Clothing', price: 500, unit: 'item' },
  { id: 'p4', name: 'Jeans', category: 'Clothing', price: 500, unit: 'item' },
  { id: 'p5', name: 'Trouser', category: 'Clothing', price: 500, unit: 'item' },
  { id: 'p6', name: 'Simple Gown', category: 'Clothing', price: 500, unit: 'item' },
  { id: 'p7', name: 'Abaya/Bubu', category: 'Native Wear', price: 800, unit: 'item' },
  { id: 'p8', name: 'Native (Up & Down)', category: 'Native Wear', price: 1000, unit: 'item' },
  { id: 'p9', name: 'Native (Gown)', category: 'Native Wear', price: 1000, unit: 'item' },
  { id: 'p10', name: 'Agbada', category: 'Native Wear', price: 2000, unit: 'item' },
  { id: 'p11', name: 'Towel', category: 'Household', price: 500, unit: 'item' },
  { id: 'p12', name: 'Duvet (Big)', category: 'Household', price: 3000, unit: 'item' },
  { id: 'p13', name: 'Duvet (Medium)', category: 'Household', price: 2500, unit: 'item' },
  { id: 'p14', name: 'Duvet (Small)', category: 'Household', price: 1500, unit: 'item' },
  { id: 'p15', name: 'Bedsheets', category: 'Household', price: 800, unit: 'item' },
  { id: 'p16', name: 'Pillow Cases', category: 'Household', price: 100, unit: 'item' },
  { id: 'p17', name: 'Blanket', category: 'Household', price: 800, unit: 'item' },
  { id: 'p18', name: 'Table Cover (Small)', category: 'Household', price: 500, unit: 'item' },
  { id: 'p19', name: 'Table Cover (Medium)', category: 'Household', price: 750, unit: 'item' },
  { id: 'p20', name: 'Table Cover (Big)', category: 'Household', price: 1000, unit: 'item' },
];
// Real price list from Kunzzyjoe's 72hrs Laundry (full-service Normal 72hr rate).
// Express Normal, Wash Only, and Express Wash are priced per-order via WhatsApp —
// the business has not set fixed multipliers for these yet (see SERVICE_TIERS).

export const defaultCustomers = [
  { id: 'c1', name: 'Tolu Adebayo', phone: '0803 123 4567', whatsapp: '2348031234567', addresses: ['Bodija, Ibadan'], walletBalance: 1500, loyaltyPoints: 180, joinedAt: '2026-06-01' },
  { id: 'c2', name: 'Chiamaka Obi', phone: '0807 654 3210', whatsapp: '2348076543210', addresses: ['Iyaganku GRA, Ibadan'], walletBalance: 5000, loyaltyPoints: 340, joinedAt: '2026-05-12' },
  { id: 'c3', name: 'David Chukwu', phone: '0812 456 7890', whatsapp: '2348124567890', addresses: ['Sango, Ibadan'], walletBalance: 0, loyaltyPoints: 40, joinedAt: '2026-08-10' },
  { id: 'c4', name: 'Amaka Nwosu', phone: '0705 998 8112', whatsapp: '2347059988112', addresses: ['Ring Road, Ibadan'], walletBalance: 2000, loyaltyPoints: 260, joinedAt: '2026-07-02' },
];

export const defaultOrders = [
  {
    id: 'ORD-1041', tagCode: '72HRS-1041', customerId: 'c2',
    items: [{ pricingId: 'p8', qty: 2 }, { pricingId: 'p15', qty: 1 }],
    tier: 'exp_norm', status: 'ready',
    pickupAddress: 'Iyaganku GRA, Ibadan', pickupLat: 7.3833, pickupLng: 3.8894,
    scheduledPickup: '2026-08-23T14:00:00', expectedDelivery: '2026-08-24T14:00:00',
    paymentMethod: 'paystack', paymentStatus: 'paid', total: 6300,
    createdAt: '2026-08-23T13:02:00',
    statusHistory: [
      { status: 'pickup_requested', at: '2026-08-23T13:02:00' },
      { status: 'picked_up', at: '2026-08-23T14:15:00' },
      { status: 'received', at: '2026-08-23T15:00:00' },
      { status: 'washing', at: '2026-08-23T16:00:00' },
      { status: 'ironing_folding', at: '2026-08-23T20:00:00' },
      { status: 'quality_check', at: '2026-08-24T08:00:00' },
      { status: 'ready', at: '2026-08-24T09:00:00' },
    ],
  },
  {
    id: 'ORD-1042', tagCode: '72HRS-1042', customerId: 'c1',
    items: [{ pricingId: 'p1', qty: 4 }, { pricingId: 'p5', qty: 3 }],
    tier: 'normal', status: 'washing',
    pickupAddress: 'Bodija, Ibadan', pickupLat: 7.4278, pickupLng: 3.9184,
    scheduledPickup: '2026-08-24T09:00:00', expectedDelivery: '2026-08-27T09:00:00',
    paymentMethod: 'cod', paymentStatus: 'unpaid', total: 3500,
    createdAt: '2026-08-24T08:12:00',
    statusHistory: [
      { status: 'pickup_requested', at: '2026-08-24T08:12:00' },
      { status: 'picked_up', at: '2026-08-24T09:20:00' },
      { status: 'received', at: '2026-08-24T10:05:00' },
      { status: 'washing', at: '2026-08-24T11:30:00' },
    ],
  },
  {
    id: 'ORD-1043', tagCode: '72HRS-1043', customerId: 'c3',
    items: [{ pricingId: 'p1', qty: 6 }, { pricingId: 'p11', qty: 2 }],
    tier: 'wash_only', status: 'pickup_requested',
    pickupAddress: 'Sango, Ibadan', pickupLat: 7.4139, pickupLng: 3.8930,
    scheduledPickup: '2026-08-25T10:00:00', expectedDelivery: '2026-08-28T10:00:00',
    paymentMethod: 'cod', paymentStatus: 'unpaid', total: 3200,
    createdAt: '2026-08-25T07:40:00',
    statusHistory: [{ status: 'pickup_requested', at: '2026-08-25T07:40:00' }],
  },
  {
    id: 'ORD-1044', tagCode: '72HRS-1044', customerId: 'c4',
    items: [{ pricingId: 'p10', qty: 1 }, { pricingId: 'p18', qty: 4 }],
    tier: 'exp_wash', status: 'out_for_delivery',
    pickupAddress: 'Ring Road, Ibadan', pickupLat: 7.3775, pickupLng: 3.8965,
    scheduledPickup: '2026-08-24T08:00:00', expectedDelivery: '2026-08-24T20:00:00',
    paymentMethod: 'flutterwave', paymentStatus: 'paid', total: 9500,
    createdAt: '2026-08-24T07:15:00',
    statusHistory: [
      { status: 'pickup_requested', at: '2026-08-24T07:15:00' },
      { status: 'picked_up', at: '2026-08-24T08:10:00' },
      { status: 'received', at: '2026-08-24T08:45:00' },
      { status: 'washing', at: '2026-08-24T09:30:00' },
      { status: 'ironing_folding', at: '2026-08-24T12:00:00' },
      { status: 'quality_check', at: '2026-08-24T14:00:00' },
      { status: 'ready', at: '2026-08-24T14:30:00' },
      { status: 'out_for_delivery', at: '2026-08-24T16:00:00' },
    ],
  },
  {
    id: 'ORD-1045', tagCode: '72HRS-1045', customerId: 'c1',
    items: [{ pricingId: 'p15', qty: 2 }, { pricingId: 'p13', qty: 1 }],
    tier: 'normal', status: 'delivered', rated: true,
    pickupAddress: 'Bodija, Ibadan', pickupLat: 7.4278, pickupLng: 3.9184,
    scheduledPickup: '2026-08-19T09:00:00', expectedDelivery: '2026-08-22T09:00:00',
    paymentMethod: 'paystack', paymentStatus: 'paid', total: 4100,
    createdAt: '2026-08-19T08:00:00',
    statusHistory: [
      { status: 'pickup_requested', at: '2026-08-19T08:00:00' },
      { status: 'picked_up', at: '2026-08-19T09:10:00' },
      { status: 'received', at: '2026-08-19T10:00:00' },
      { status: 'washing', at: '2026-08-19T11:00:00' },
      { status: 'ironing_folding', at: '2026-08-20T09:00:00' },
      { status: 'quality_check', at: '2026-08-21T09:00:00' },
      { status: 'ready', at: '2026-08-21T10:00:00' },
      { status: 'out_for_delivery', at: '2026-08-22T08:00:00' },
      { status: 'delivered', at: '2026-08-22T09:30:00' },
    ],
  },
  {
    id: 'ORD-1046', tagCode: '72HRS-1046', customerId: 'c2',
    items: [{ pricingId: 'p8', qty: 3 }],
    tier: 'exp_norm', status: 'quality_check',
    pickupAddress: 'Iyaganku GRA, Ibadan', pickupLat: 7.3833, pickupLng: 3.8894,
    scheduledPickup: '2026-08-24T15:00:00', expectedDelivery: '2026-08-25T15:00:00',
    paymentMethod: 'wallet', paymentStatus: 'paid', total: 4500,
    createdAt: '2026-08-24T14:20:00',
    statusHistory: [
      { status: 'pickup_requested', at: '2026-08-24T14:20:00' },
      { status: 'picked_up', at: '2026-08-24T15:10:00' },
      { status: 'received', at: '2026-08-24T15:50:00' },
      { status: 'washing', at: '2026-08-24T17:00:00' },
      { status: 'ironing_folding', at: '2026-08-24T21:00:00' },
      { status: 'quality_check', at: '2026-08-25T08:00:00' },
    ],
  },
];

export const defaultStaff = [
  { id: 's1', name: 'Ellud Kunle', role: 'Owner/Operator', phone: '0811 700 0015' },
  { id: 's2', name: 'Ngozi Bello', role: 'Front Desk', phone: '0809 111 2222' },
  { id: 's3', name: 'Femi Adisa', role: 'Rider', phone: '0812 333 4444' },
];

export const defaultSubscriptionPlans = [
  { id: 'sub_weekly', name: 'Weekly Pickup', frequency: 'weekly', discountPct: 10, description: 'A recurring pickup every week — set it and forget your laundry.' },
  { id: 'sub_biweekly', name: 'Biweekly Pickup', frequency: 'biweekly', discountPct: 7, description: 'Pickup every two weeks, same discount spirit, less frequent.' },
];

export const defaultHomepageCopy = {
  heroHeadline: "YOUR LAUNDRY SHOULDN'T TAKE OVER YOUR WEEKEND.",
  heroSubline: "We'll handle it. You enjoy your time.",
  heroTagline: 'Wash • Iron • Fold • Pickup & Delivery',
  heroPromise: 'Fresh. Clean. Reliable. Ready in 72 Hours.',
  city: 'Ibadan',
  whatsappNumber: '2348117000015',
};

export const defaultReviews = [
  { id: 'r1', customerName: 'Tolu A.', rating: 5, text: 'Picked up on time, clothes came back smelling amazing. Never going back to washing my own agbada.' },
  { id: 'r2', customerName: 'Chiamaka O.', rating: 5, text: 'The tracking actually works — I knew exactly when to expect my delivery.' },
  { id: 'r3', customerName: 'David C.', rating: 4, text: 'Good service, ironing was crisp. Would love faster same-day slots.' },
];

export const defaultGallery = [];

export const defaultExpenses = [
  { id: 'e1', label: 'Detergent & Supplies', amount: 15000, date: '2026-08-15', category: 'Supplies' },
  { id: 'e2', label: 'Fuel for Rider', amount: 5000, date: '2026-08-17', category: 'Logistics' },
];
