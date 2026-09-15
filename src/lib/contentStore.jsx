import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  defaultPricing, defaultOrders, defaultCustomers, defaultStaff,
  defaultSubscriptionPlans, defaultHomepageCopy, defaultReviews,
  defaultGallery, defaultExpenses,
} from '../data/fakeData';

// --- persistence helpers -----------------------------------------------
const STORAGE_KEY = '72hrs_content_v1';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load stored content, falling back to seed data', e);
  }
  return {
    pricing: defaultPricing,
    orders: defaultOrders,
    customers: defaultCustomers,
    staff: defaultStaff,
    subscriptionPlans: defaultSubscriptionPlans,
    homepageCopy: defaultHomepageCopy,
    reviews: defaultReviews,
    gallery: defaultGallery,
    expenses: defaultExpenses,
    orderCounter: 1047,
  };
}

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [state, setState] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist content', e);
    }
  }, [state]);

  // Generic collection helpers -------------------------------------------
  const addItem = useCallback((collection, item) => {
    setState((prev) => ({
      ...prev,
      [collection]: [...prev[collection], item],
    }));
  }, []);

  const updateItem = useCallback((collection, id, patch) => {
    setState((prev) => ({
      ...prev,
      [collection]: prev[collection].map((it) =>
        it.id === id ? { ...it, ...patch } : it
      ),
    }));
  }, []);

  const removeItem = useCallback((collection, id) => {
    setState((prev) => ({
      ...prev,
      [collection]: prev[collection].filter((it) => it.id !== id),
    }));
  }, []);

  const updateHomepageCopy = useCallback((patch) => {
    setState((prev) => ({
      ...prev,
      homepageCopy: { ...prev.homepageCopy, ...patch },
    }));
  }, []);

  // Order-specific helpers -------------------------------------------------
  const nextOrderId = useCallback(() => {
    const n = state.orderCounter;
    return { id: `ORD-${n}`, tagCode: `72HRS-${n}` };
  }, [state.orderCounter]);

  const createOrder = useCallback((order) => {
    setState((prev) => {
      const n = prev.orderCounter;
      const fullOrder = {
        ...order,
        id: `ORD-${n}`,
        tagCode: `72HRS-${n}`,
        createdAt: new Date().toISOString(),
        statusHistory: [{ status: 'pickup_requested', at: new Date().toISOString() }],
        status: 'pickup_requested',
      };
      return {
        ...prev,
        orders: [...prev.orders, fullOrder],
        orderCounter: n + 1,
      };
    });
  }, []);

  const advanceOrderStatus = useCallback((orderId, newStatus) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              statusHistory: [...o.statusHistory, { status: newStatus, at: new Date().toISOString() }],
            }
          : o
      ),
    }));
  }, []);

  const findOrderByTag = useCallback(
    (tagCode) => state.orders.find((o) => o.tagCode === tagCode),
    [state.orders]
  );

  const value = {
    ...state,
    addItem,
    updateItem,
    removeItem,
    updateHomepageCopy,
    createOrder,
    advanceOrderStatus,
    findOrderByTag,
    nextOrderId,
    resetToSeed: () => setState(loadInitial()),
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within a ContentProvider');
  return ctx;
}
