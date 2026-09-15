import { useState } from 'react';
import { Menu, ShieldAlert } from 'lucide-react';
import Sidebar, { MobileSidebarDrawer } from './Sidebar';
import { adminColors, hasPermission, ROLE_LABELS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import logoMark from '../../assets/logo-mark.png';

// Guard against the Eli's Autos bug: min-h-screen on the outer container lets
// the whole page (sidebar included) scroll together on long admin screens.
// Instead: h-screen + overflow-hidden on the outer shell, independently
// scrollable content area, so the sidebar stays visually fixed.
export default function AdminLayout({ children, title, requiredPermission }) {
  const { adminSession, adminUser } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  if (!adminSession) return <Navigate to="/admin/login" replace />;

  const authorized = !requiredPermission || hasPermission(adminUser?.role, requiredPermission);

  return (
    <div className="h-screen overflow-hidden flex bg-silk-admin" style={{ color: adminColors.text }}>
      <Sidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 h-screen overflow-y-auto min-w-0">
        <header
          className="sticky top-0 z-10 px-4 sm:px-6 py-4 backdrop-blur flex items-center gap-3"
          style={{ background: `${adminColors.bg}E6`, borderBottom: `1px solid ${adminColors.border}` }}
        >
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden shrink-0"
            style={{ color: adminColors.text }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <img src={logoMark} alt="72hrs Laundry" className="w-6 h-6 object-contain md:hidden shrink-0" />
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </header>
        <div key={title} className="p-4 sm:p-6 page-fade-in">
          {authorized ? children : (
            <div
              className="flex flex-col items-center text-center gap-3 py-20 rounded-2xl"
              style={{ background: adminColors.bgPanel, border: `1px solid ${adminColors.border}` }}
            >
              <ShieldAlert size={32} style={{ color: adminColors.warning }} />
              <p className="font-semibold">You don't have access to this section</p>
              <p className="text-sm max-w-sm" style={{ color: adminColors.textMuted }}>
                Your role ({adminUser?.role ? ROLE_LABELS[adminUser.role] : 'unknown'}) doesn't include this permission. Ask a Super Admin if you need access.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
