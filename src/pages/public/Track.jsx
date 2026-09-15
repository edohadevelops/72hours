import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { useContent } from '../../lib/contentStore';
import { ORDER_STATUSES } from '../../utils/constants';
import { money, moneyOrPending, whatsappLink } from '../../utils/format';
import StatusTrack from '../../components/ui/StatusTrack';
import SudsLoader from '../../components/ui/SudsLoader';

export default function Track() {
  const { findOrderByTag, pricing, customers, homepageCopy, addItem, updateItem } = useContent();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('tag') || '');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const runSearch = (value) => {
    const found = findOrderByTag(value.trim().toUpperCase()) || findOrderByTag(value.trim());
    setOrder(found || null);
    setSearched(true);
  };

  useEffect(() => {
    if (params.get('tag')) runSearch(params.get('tag'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customer = order && customers.find((c) => c.id === order.customerId);
  const currentStatusLabel = order && ORDER_STATUSES.find((s) => s.key === order.status)?.label;

  const submitRating = (stars) => {
    if (!order) return;
    addItem('reviews', {
      id: `r${Date.now()}`,
      customerName: customer?.name || 'Customer',
      rating: stars,
      text: '',
      orderId: order.id,
    });
    updateItem('orders', order.id, { rated: true });
    setRatingSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-navy mb-2">Track Your Order</h1>
      <p className="text-sm text-darktext/60 mb-6">Enter your tag code (e.g. 72HRS-1042) or order ID.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); runSearch(query); }}
        className="flex gap-2 mb-10"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="72HRS-1042"
          className="flex-1 border border-[#E1EAF5] rounded-lg px-4 py-2.5 text-sm font-mono"
        />
        <button type="submit" className="btn-primary px-5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap">
          <Search size={16} /> Track
        </button>
      </form>

      {searched && !order && (
        <div className="text-center py-16">
          <SudsLoader size="md" />
          <p className="text-darktext/60 mt-4">We couldn't find an order with that code. Double-check it and try again.</p>
        </div>
      )}

      {order && (
        <div>
          <div className="bg-lightbg rounded-2xl p-6 mb-6">
            <StatusTrack order={order} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div className="border border-[#E1EAF5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-darktext/50 mb-1">Current Stage</p>
              <p className="font-semibold text-navy">{currentStatusLabel}</p>
            </div>
            <div className="border border-[#E1EAF5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-darktext/50 mb-1">Total</p>
              <p className="font-semibold text-navy">{moneyOrPending(order.total)} · {order.paymentStatus}</p>
            </div>
          </div>

          {(order.beforePhoto || order.afterPhoto) && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {order.beforePhoto && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-darktext/50 mb-1">Before</p>
                  <img src={order.beforePhoto} alt="Before wash" className="w-full aspect-square object-cover rounded-xl border border-[#E1EAF5]" />
                </div>
              )}
              {order.afterPhoto && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-darktext/50 mb-1">After</p>
                  <img src={order.afterPhoto} alt="After wash" className="w-full aspect-square object-cover rounded-xl border border-[#E1EAF5]" />
                </div>
              )}
            </div>
          )}

          <div className="border border-[#E1EAF5] rounded-xl p-4 mb-6">
            <p className="text-xs uppercase tracking-wide text-darktext/50 mb-2">Items</p>
            {order.items.map((it) => {
              const p = pricing.find((pr) => pr.id === it.pricingId);
              return (
                <div key={it.pricingId} className="flex justify-between text-sm py-0.5">
                  <span>{p?.name} × {it.qty}</span>
                </div>
              );
            })}
          </div>

          {order.status === 'delivered' && !order.rated && !ratingSubmitted && (
            <div className="bg-lightbg rounded-xl p-5 mb-6 text-center">
              <p className="font-semibold text-navy text-sm mb-3">How was your laundry?</p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => submitRating(n)} aria-label={`Rate ${n} stars`}>
                    <Star size={28} className="text-gold hover:fill-gold transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {(ratingSubmitted || order.rated) && (
            <div className="bg-lightbg rounded-xl p-5 mb-6 text-center text-sm text-darktext/70">
              Thanks for the feedback! 🎉
            </div>
          )}

          <a
            href={whatsappLink(homepageCopy.whatsappNumber, `Hi! Checking on my order ${order.id} (tag ${order.tagCode}) — currently at "${currentStatusLabel}".`)}
            target="_blank" rel="noreferrer"
            className="block text-center btn-outline font-semibold py-3 rounded-full"
          >
            Ask About This Order on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
