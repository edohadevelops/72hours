import { Link, Navigate, useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../lib/contentStore';
import { money, moneyOrPending, formatDate } from '../../utils/format';
import { ORDER_STATUSES } from '../../utils/constants';
import { Badge } from '../../components/ui/Card';

export default function Account() {
  const { session, signOut } = useAuth();
  const { orders, customers, createOrder } = useContent();
  const navigate = useNavigate();

  if (!session) return <Navigate to="/login" replace />;

  const myOrders = session.customerId
    ? orders.filter((o) => o.customerId === session.customerId)
    : [];

  const customer = customers.find((c) => c.id === session.customerId);

  const handleRebook = (order, e) => {
    e.preventDefault();
    e.stopPropagation();
    const scheduledPickup = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 19);
    const expectedHours = order.tier === 'sameday' ? 12 : order.tier === 'express24' ? 24 : 72;
    const expectedDelivery = new Date(new Date(scheduledPickup).getTime() + expectedHours * 3600 * 1000).toISOString();
    createOrder({
      customerId: session.customerId,
      items: order.items,
      tier: order.tier,
      pickupAddress: order.pickupAddress,
      pickupLat: order.pickupLat,
      pickupLng: order.pickupLng,
      scheduledPickup,
      expectedDelivery,
      paymentMethod: order.paymentMethod,
      paymentStatus: 'unpaid',
      total: order.total,
    });
    navigate('/account');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">
            {session.isGuest ? 'Guest' : (session.name || 'My Account')}
          </h1>
          <p className="text-sm text-darktext/60">{session.phone}</p>
        </div>
        <button onClick={signOut} className="text-sm font-semibold text-darktext/60 hover:text-navy">
          Sign out
        </button>
      </div>

      {session.isGuest && (
        <div className="bg-lightbg rounded-xl p-4 mb-8 text-sm text-darktext/70">
          You're browsing as a guest. <Link to="/login" className="text-royal font-semibold">Create an account</Link> to save your order history across devices.
        </div>
      )}

      {!session.isGuest && (
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="border border-[#E1EAF5] rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-darktext/50 mb-1">Wallet Balance</p>
            <p className="font-semibold text-navy text-lg">{money(customer?.walletBalance || 0)}</p>
          </div>
          <div className="border border-[#E1EAF5] rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-darktext/50 mb-1">Loyalty Points</p>
            <p className="font-semibold text-navy text-lg">{customer?.loyaltyPoints || 0} pts</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-navy">Order History</h2>
        <Link to="/book" className="text-sm font-semibold text-royal whitespace-nowrap">+ New Order</Link>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#E1EAF5] rounded-xl">
          <p className="text-darktext/60 mb-4">No orders yet.</p>
          <Link to="/book" className="btn-accent font-semibold px-6 py-2.5 rounded-full">Schedule Your First Pickup</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {myOrders.slice().reverse().map((o) => {
            const statusInfo = ORDER_STATUSES.find((s) => s.key === o.status);
            return (
              <Link key={o.id} to={`/track?tag=${o.tagCode}`} className="border border-[#E1EAF5] rounded-xl p-4 flex justify-between items-center gap-3 hover:border-royal transition-colors">
                <div className="min-w-0">
                  <p className="font-semibold text-navy text-sm">{o.id}</p>
                  <p className="text-xs text-darktext/50">{formatDate(o.createdAt)} · {moneyOrPending(o.total)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge color={statusInfo?.color}>{statusInfo?.label}</Badge>
                  <button
                    onClick={(e) => handleRebook(o, e)}
                    className="flex items-center justify-center gap-1 text-xs font-semibold text-royal border border-royal rounded-full px-3 py-1.5 whitespace-nowrap"
                    title="Rebook this order"
                  >
                    <RotateCcw size={12} /> Rebook
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
