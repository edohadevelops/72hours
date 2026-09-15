import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Tags, LogOut, X, UserCog } from 'lucide-react';
import logoMark from '../../assets/logo-mark.png';
import { adminColors, PERMISSIONS, ROLE_LABELS, hasPermission } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const ALL_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, permission: PERMISSIONS.DASHBOARD_VIEW },
  { to: '/admin/orders', label: 'Orders', icon: Package, permission: PERMISSIONS.ORDERS_VIEW },
  { to: '/admin/customers', label: 'Customers', icon: Users, permission: PERMISSIONS.CUSTOMERS_VIEW },
  { to: '/admin/pricing', label: 'Pricing', icon: Tags, permission: PERMISSIONS.PRICING_VIEW },
  { to: '/admin/team', label: 'Team & Roles', icon: UserCog, permission: PERMISSIONS.TEAM_MANAGE },
];

function SidebarContent({ onNavigate }) {
  const { adminSignOut, adminUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminSignOut();
    navigate('/admin/login');
  };

  const links = ALL_LINKS.filter((l) => hasPermission(adminUser?.role, l.permission));
  const roleLabel = adminUser?.role ? ROLE_LABELS[adminUser.role] : null;

  return (
    <>
      <div className="flex items-center gap-2 px-5 py-5" style={{ borderBottom: `1px solid ${adminColors.border}` }}>
        <img src={logoMark} alt="72hrs Laundry" className="w-8 h-8 object-contain" />
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">72hrs Laundry</p>
          <p className="text-[11px] leading-tight truncate" style={{ color: adminColors.textMuted }}>
            {adminUser?.name ? `${adminUser.name}` : 'Admin Console'}
          </p>
        </div>
      </div>

      {roleLabel && (
        <div className="px-5 pt-3 pb-1">
          <span
            className="inline-block text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{ background: adminColors.bgPanelAlt, color: adminColors.accent, border: `1px solid ${adminColors.border}` }}
          >
            {roleLabel}
          </span>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
            style={({ isActive }) => ({
              background: isActive ? adminColors.bgPanelAlt : 'transparent',
              color: isActive ? adminColors.primary : adminColors.textMuted,
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-5 py-4 text-sm font-medium"
        style={{ color: adminColors.textMuted, borderTop: `1px solid ${adminColors.border}` }}
      >
        <LogOut size={16} /> Log out
      </button>
    </>
  );
}

// Desktop: fixed sidebar, always visible.
export default function Sidebar() {
  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0"
      style={{ background: adminColors.bgPanel, borderRight: `1px solid ${adminColors.border}`, color: adminColors.text }}
    >
      <SidebarContent />
    </aside>
  );
}

// Mobile: slide-over drawer, triggered by hamburger in AdminLayout's mobile header.
export function MobileSidebarDrawer({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside
        className="absolute left-0 top-0 h-full w-72 max-w-[80vw] flex flex-col"
        style={{ background: adminColors.bgPanel, color: adminColors.text }}
      >
        <button onClick={onClose} className="absolute top-4 right-4" style={{ color: adminColors.textMuted }} aria-label="Close menu">
          <X size={20} />
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
