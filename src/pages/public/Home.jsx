import { Link } from 'react-router-dom';
import { PackageCheck, Sparkles, Truck, Star } from 'lucide-react';
import { useContent } from '../../lib/contentStore';
import SudsLoader from '../../components/ui/SudsLoader';

const steps = [
  { icon: PackageCheck, label: 'Book & schedule', desc: 'Pick your items, drop a pin, choose a time.' },
  { icon: Sparkles, label: 'We wash & care', desc: 'Tracked from pickup through quality check.' },
  { icon: Truck, label: 'Delivered fresh', desc: 'Ready in 72 hours — or faster with Express.' },
];

export default function Home() {
  const { homepageCopy, reviews } = useContent();
  return (
    <div>
      <section className="bg-gradient-to-b from-lightbg to-white">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <p className="text-royal font-semibold tracking-wide text-sm mb-3">{homepageCopy.city} · Fresh • Clean • Reliable</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-semibold text-navy leading-[1.15] mb-4">
              {homepageCopy.heroHeadline}
            </h1>
            <p className="text-lg text-darktext/80 mb-2">{homepageCopy.heroSubline}</p>
            <p className="text-sm text-royal font-medium mb-1">{homepageCopy.heroTagline}</p>
            <p className="text-sm text-cyan font-medium mb-6">{homepageCopy.heroPromise}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/book" className="btn-accent font-semibold px-6 py-3 rounded-full transition-colors">
                Schedule a Pickup
              </Link>
              <a
                href={`https://wa.me/${homepageCopy.whatsappNumber}`}
                target="_blank" rel="noreferrer"
                className="btn-outline font-semibold px-6 py-3 rounded-full hover:bg-navy hover:text-white transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          <div className="card-glossy rounded-3xl p-6 sm:p-8">
            <div className="flex justify-center text-royal mb-6">
              <SudsLoader size="lg" />
            </div>
            <div className="flex flex-col gap-5">
              {steps.map((s, i) => (
                <div key={s.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-lightbg flex items-center justify-center shrink-0">
                    <s.icon size={18} className="text-royal" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{i + 1}. {s.label}</p>
                    <p className="text-xs text-darktext/60 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-royal font-semibold text-sm mb-2 text-center">What customers say</p>
          <h2 className="font-display text-2xl font-semibold text-navy mb-10 text-center">Trusted across {homepageCopy.city}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="border border-[#E1EAF5] rounded-2xl p-6 bg-lightbg/40">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < r.rating ? 'text-gold fill-gold' : 'text-[#E1EAF5]'} />
                  ))}
                </div>
                {r.text && <p className="text-sm text-darktext/80 mb-3">"{r.text}"</p>}
                <p className="text-xs font-semibold text-navy">{r.customerName}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
