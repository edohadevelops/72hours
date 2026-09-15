import { Link } from 'react-router-dom';
import { WashingMachine, Shirt, PackageCheck, Truck } from 'lucide-react';

const services = [
  { icon: WashingMachine, title: 'Washing', desc: 'Thorough cleaning and care of clothing and other suitable washable items.' },
  { icon: Shirt, title: 'Ironing', desc: 'Professional ironing for a neat and presentable finish.' },
  { icon: PackageCheck, title: 'Folding', desc: 'Neatly folded and prepared laundry, ready to put away.' },
  { icon: Truck, title: 'Pickup & Delivery', desc: 'Convenient collection and return of your laundry within our service areas in Ibadan.' },
];

export default function Services() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-royal font-semibold text-sm mb-2">What we do</p>
      <h1 className="font-display text-3xl font-semibold text-navy mb-4">Laundry without the stress.</h1>
      <p className="text-darktext/70 max-w-2xl mb-12">
        We provide professional washing, ironing, folding, pickup and delivery — so you can hand
        over your laundry and get it back fresh, clean and neatly prepared, without spending your
        weekend on it.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {services.map((s) => (
          <div key={s.title} className="p-6 rounded-2xl border border-[#E1EAF5] bg-lightbg/60">
            <s.icon size={28} className="text-royal mb-3" />
            <h3 className="font-semibold text-navy text-lg mb-1">{s.title}</h3>
            <p className="text-sm text-darktext/70">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-navy rounded-2xl px-8 py-10 text-center text-white">
        <h2 className="font-display text-2xl font-semibold mb-2">Ready in 72 hours. Or faster.</h2>
        <p className="text-white/70 mb-6">Need it sooner? Express Normal and Express Wash are available — final rate confirmed via WhatsApp.</p>
        <Link to="/book" className="inline-block btn-accent font-semibold px-6 py-3 rounded-full">
          Schedule a Pickup
        </Link>
      </div>
    </div>
  );
}
