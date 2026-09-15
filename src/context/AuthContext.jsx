import { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ADMIN_ACCOUNTS } from '../utils/constants';

// Prototype-phase auth: local-only "session", no real password/backend yet
// for customers. Guest booking is fully supported (phone/WhatsApp only) —
// an account is optional and only needed for order history, rebooking and
// tracking across devices. Swap for real Supabase auth when the backend lands.
//
// Admin accounts (seeded from DEFAULT_ADMIN_ACCOUNTS, editable via the Team
// page) are demo-only credentials checked client-side — fine for a client
// walkthrough, not real security.

const AuthContext = createContext(null);
const SESSION_KEY = '72hrs_session_v1';
const ADMIN_ACCOUNTS_KEY = '72hrs_admin_accounts_v1';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [adminSession, setAdminSession] = useState(() => {
    try {
      return localStorage.getItem('72hrs_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const raw = localStorage.getItem('72hrs_admin_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [adminAccounts, setAdminAccounts] = useState(() => {
    try {
      const raw = localStorage.getItem(ADMIN_ACCOUNTS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_ADMIN_ACCOUNTS;
    } catch {
      return DEFAULT_ADMIN_ACCOUNTS;
    }
  });

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  useEffect(() => {
    localStorage.setItem('72hrs_admin_session', adminSession ? 'true' : 'false');
  }, [adminSession]);

  useEffect(() => {
    if (adminUser) localStorage.setItem('72hrs_admin_user', JSON.stringify(adminUser));
    else localStorage.removeItem('72hrs_admin_user');
  }, [adminUser]);

  useEffect(() => {
    localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(adminAccounts));
  }, [adminAccounts]);

  const signUp = ({ name, phone, whatsapp, customerId }) => {
    setSession({ name, phone, whatsapp, customerId, isGuest: false });
  };

  const continueAsGuest = ({ phone, whatsapp }) => {
    setSession({ phone, whatsapp, isGuest: true });
  };

  const attachCustomerId = (customerId) => {
    setSession((prev) => (prev ? { ...prev, customerId } : prev));
  };

  const signOut = () => setSession(null);

  // Named admin login — checks against the editable adminAccounts list.
  const adminSignIn = (username, password) => {
    const found = adminAccounts.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (found) {
      setAdminSession(true);
      setAdminUser({ username: found.username, name: found.name, role: found.role });
      return true;
    }
    return false;
  };

  const adminSignOut = () => {
    setAdminSession(false);
    setAdminUser(null);
  };

  // Team management (super_admin only — enforced at the page/UI level).
  const addAdminAccount = (account) => setAdminAccounts((prev) => [...prev, account]);
  const updateAdminAccount = (username, patch) =>
    setAdminAccounts((prev) => prev.map((a) => (a.username === username ? { ...a, ...patch } : a)));
  const removeAdminAccount = (username) =>
    setAdminAccounts((prev) => prev.filter((a) => a.username !== username));

  return (
    <AuthContext.Provider
      value={{
        session, signUp, continueAsGuest, signOut, attachCustomerId,
        adminSession, adminUser, adminSignIn, adminSignOut,
        adminAccounts, addAdminAccount, updateAdminAccount, removeAdminAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
