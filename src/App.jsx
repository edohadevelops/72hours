import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ContentProvider } from './lib/contentStore';
import { AuthProvider } from './context/AuthContext';
import PublicHeader from './components/layout/PublicHeader';
import PublicFooter from './components/layout/PublicFooter';
import InstallBanner from './components/layout/InstallBanner';

import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Pricing from './pages/public/Pricing';
import Book from './pages/public/Book';
import Track from './pages/public/Track';
import Login from './pages/public/Login';
import Account from './pages/public/Account';

import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import AdminPricing from './pages/admin/Pricing';
import Team from './pages/admin/Team';

function PublicLayout({ children }) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <div key={location.pathname} className="page-fade-in">
          {children}
        </div>
      </main>
      <PublicFooter />
      <InstallBanner />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
            <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
            <Route path="/book" element={<PublicLayout><Book /></PublicLayout>} />
            <Route path="/track" element={<PublicLayout><Track /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/account" element={<PublicLayout><Account /></PublicLayout>} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/pricing" element={<AdminPricing />} />
            <Route path="/admin/team" element={<Team />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ContentProvider>
  );
}
