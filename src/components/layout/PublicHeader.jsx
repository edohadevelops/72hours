import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../../lib/contentStore';
import { useAuth } from '../../context/AuthContext';
import logoMark from '../../assets/logo-mark.png';

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { homepageCopy } = useContent();
  const { session } = useAuth();

  const links = [
    { to: '/services', label: 'Services' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/track', label: 'Track Order' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E1EAF5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-navy text-lg">
          <img src={logoMark} alt="Kunzzyjoe's 72hrs Laundry" className="h-9 w-9 object-contain shrink-0" />
          <span className="hidden lg:inline">Kunzzyjoe's 72hrs Laundry</span>
          <span className="lg:hidden">72hrs Laundry</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-darktext">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'text-royal' : 'hover:text-royal transition-colors'}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to={session ? '/account' : '/login'} className="text-sm font-medium text-navy hover:text-royal">
            {session ? (session.name || 'My Account') : 'Sign In'}
          </Link>
          <Link to="/book" className="btn-accent font-semibold text-sm px-4 py-2 rounded-full transition-colors">
            Schedule a Pickup
          </Link>
        </div>

        <button className="md:hidden text-navy" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#E1EAF5] px-4 pb-4 flex flex-col gap-3 bg-white">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 text-darktext">
              {l.label}
            </NavLink>
          ))}
          <Link to={session ? '/account' : '/login'} onClick={() => setOpen(false)} className="py-2 text-navy font-medium">
            {session ? 'My Account' : 'Sign In'}
          </Link>
          <Link to="/book" onClick={() => setOpen(false)} className="btn-accent font-semibold text-center py-2.5 rounded-full">
            Schedule a Pickup
          </Link>
        </div>
      )}
    </header>
  );
}
