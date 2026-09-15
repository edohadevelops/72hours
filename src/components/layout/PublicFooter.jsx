import { Link } from 'react-router-dom';
import { useContent } from '../../lib/contentStore';
import logoMark from '../../assets/logo-mark.png';

export default function PublicFooter() {
  const { homepageCopy } = useContent();
  return (
    <footer className="text-white mt-20" style={{ background: 'linear-gradient(160deg, #0A3A8A 0%, #062A67 55%, #041D4D 100%)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src={logoMark} alt="72hrs Laundry" className="h-8 w-8 object-contain" />
            <p className="font-display text-lg font-semibold">Kunzzyjoe's 72hrs Laundry</p>
          </div>
          <p className="text-sm text-white/70">Fresh • Clean • Reliable</p>
          <p className="text-sm text-white/70 mt-1">{homepageCopy.city}, Nigeria</p>
        </div>
        <div>
          <p className="font-semibold mb-2 text-sm uppercase tracking-wide text-gold">Quick Links</p>
          <div className="flex flex-col gap-1 text-sm text-white/70">
            <Link to="/services" className="hover:text-white">Services</Link>
            <Link to="/pricing" className="hover:text-white">Pricing</Link>
            <Link to="/track" className="hover:text-white">Track an Order</Link>
            <Link to="/book" className="hover:text-white">Schedule a Pickup</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold mb-2 text-sm uppercase tracking-wide text-gold">Contact</p>
          <a
            href={`https://wa.me/${homepageCopy.whatsappNumber}`}
            target="_blank" rel="noreferrer"
            className="text-sm text-white/70 hover:text-white block"
          >
            WhatsApp: 0811 700 0015
          </a>
          <p className="text-sm text-white/70 mt-1">Ready in 72 Hours</p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-white/50 py-4">
        © {new Date().getFullYear()} Kunzzyjoe Sparkling Cleaning Services. All rights reserved.
      </div>
    </footer>
  );
}
