import { Link } from 'react-router-dom';
import { useContent } from '../../lib/contentStore';
import { money } from '../../utils/format';
import { SERVICE_TIERS } from '../../utils/constants';

export default function Pricing() {
  const { pricing } = useContent();
  const categories = [...new Set(pricing.map((p) => p.category))];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-royal font-semibold text-sm mb-2">Simple, transparent</p>
      <h1 className="font-display text-3xl font-semibold text-navy mb-4">Pricing</h1>
      <p className="text-darktext/70 max-w-2xl mb-10">
        Prices below are per item for our Normal (72hrs) full-service rate — wash, iron and fold.
        Express Normal, Wash Only, and Express Wash are available too; those are priced per order
        based on volume, so our team confirms the exact rate with you on WhatsApp.
      </p>

      <div className="grid sm:grid-cols-2 gap-8 mb-12">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="font-semibold text-navy mb-3">{cat}</h3>
            <div className="rounded-xl border border-[#E1EAF5] divide-y divide-[#E1EAF5] overflow-hidden">
              {pricing.filter((p) => p.category === cat).map((p) => (
                <div key={p.id} className="flex justify-between px-4 py-3 text-sm bg-white">
                  <span className="text-darktext">{p.name}</span>
                  <span className="font-semibold text-navy">{money(p.price)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-lightbg p-6 mb-10">
        <h3 className="font-semibold text-navy mb-3">Our 4 service tiers</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICE_TIERS.map((t) => (
            <div key={t.key} className="bg-white rounded-lg p-4 border border-[#E1EAF5]">
              <p className="font-semibold text-navy text-sm">{t.label}</p>
              <p className="text-xs text-darktext/60 mt-1">
                {t.contactForPricing ? 'Price confirmed via WhatsApp' : 'Fixed item pricing (above)'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-darktext/50 mb-8">
        Prices shown are for Normal (72hrs) full-service. Final pricing for other tiers is
        confirmed by our team based on volume and item condition.
      </p>

      <Link to="/book" className="inline-block btn-accent font-semibold px-6 py-3 rounded-full">
        Schedule a Pickup
      </Link>
    </div>
  );
}
