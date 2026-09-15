import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Minus, Plus, CheckCircle2 } from 'lucide-react';
import { useContent } from '../../lib/contentStore';
import { useAuth } from '../../context/AuthContext';
import { SERVICE_TIERS, PAYMENT_METHODS } from '../../utils/constants';
import { money, whatsappLink } from '../../utils/format';
import PickupMap from '../../components/ui/PickupMap';
import LoadingButton from '../../components/ui/LoadingButton';

const STEPS = ['Items', 'Pickup', 'Contact', 'Payment', 'Confirm'];

export default function Book() {
  const { pricing, createOrder, homepageCopy, orderCounter, addItem, customers } = useContent();
  const { session, attachCustomerId } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [qty, setQty] = useState({});
  const [tier, setTier] = useState('normal');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [contact, setContact] = useState({
    name: session?.name || '',
    phone: session?.phone || '',
    whatsapp: session?.whatsapp || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const selectedItems = useMemo(
    () => Object.entries(qty).filter(([, q]) => q > 0).map(([id, q]) => ({ pricingId: id, qty: q })),
    [qty]
  );

  const tierInfo = SERVICE_TIERS.find((t) => t.key === tier);

  useEffect(() => {
    if (tierInfo?.contactForPricing && paymentMethod !== 'cod') {
      setPaymentMethod('cod');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  const subtotal = selectedItems.reduce((sum, it) => {
    const p = pricing.find((pr) => pr.id === it.pricingId);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);
  // Normal (72hrs) has a fixed price list. The other 3 tiers are priced
  // per-order by the team via WhatsApp — no multiplier is fabricated here.
  const total = tierInfo?.contactForPricing ? null : Math.round(subtotal * (tierInfo?.multiplier || 1));

  const canProceed = [
    selectedItems.length > 0,
    address.trim().length > 2 && scheduledDate,
    contact.name.trim() && contact.phone.trim(),
    true,
  ][step];

  const setItemQty = (id, delta) => {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  };

  const handleConfirm = () => {
    setSubmitting(true);
    let customerId = session?.customerId;
    if (!customerId) {
      customerId = `c${Date.now()}`;
      addItem('customers', {
        id: customerId, name: contact.name, phone: contact.phone,
        whatsapp: contact.whatsapp || contact.phone, addresses: [address],
        walletBalance: 0, loyaltyPoints: 0, joinedAt: new Date().toISOString(),
      });
      attachCustomerId(customerId);
    }

    const scheduledPickup = `${scheduledDate}T${scheduledTime}:00`;
    const expectedHours = tier === 'exp_norm' || tier === 'exp_wash' ? 24 : 72;
    const expectedDelivery = new Date(new Date(scheduledPickup).getTime() + expectedHours * 3600 * 1000).toISOString();

    const orderId = `ORD-${orderCounter}`;
    const tagCode = `72HRS-${orderCounter}`;

    createOrder({
      customerId,
      items: selectedItems,
      tier,
      pickupAddress: address,
      pickupLat: coords?.[0],
      pickupLng: coords?.[1],
      scheduledPickup,
      expectedDelivery,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'pending',
      total,
    });

    setTimeout(() => {
      setSubmitting(false);
      setConfirmedOrder({ id: orderId, tagCode, expectedDelivery });
      setStep(4);
    }, 700);
  };

  if (confirmedOrder) {
    const waMsg = `Hi 72hrs Laundry! I just booked order ${confirmedOrder.id} (tag ${confirmedOrder.tagCode}). Pickup: ${address}, ${scheduledDate} ${scheduledTime}.`;
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <CheckCircle2 size={48} className="text-[#0F9D58] mx-auto mb-4" />
        <h1 className="font-display text-2xl font-semibold text-navy mb-2">Pickup Scheduled!</h1>
        <p className="text-darktext/70 mb-6">
          We'll see you on {scheduledDate} at {scheduledTime}. Your laundry tag code is below —
          keep it to track your order.
        </p>
        <div className="bg-lightbg rounded-2xl p-6 mb-6 flex flex-col items-center gap-3">
          <QRCodeSVG value={confirmedOrder.tagCode} size={140} fgColor="#062A67" />
          <p className="font-mono font-semibold text-navy tracking-wide">{confirmedOrder.tagCode}</p>
          <p className="text-xs text-darktext/60">{confirmedOrder.id}</p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate(`/track?tag=${confirmedOrder.tagCode}`)} className="btn-primary font-semibold py-3 rounded-full flex items-center justify-center">
            Track This Order
          </button>
          <a
            href={whatsappLink(homepageCopy.whatsappNumber, waMsg)}
            target="_blank" rel="noreferrer"
            className="btn-outline font-semibold py-3 rounded-full flex items-center justify-center"
          >
            Confirm via WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-navy mb-2">Schedule a Pickup</h1>

      <div className="flex items-center gap-2 mb-8">
        {STEPS.slice(0, 4).map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: i <= step ? '#062A67' : '#E1EAF5', color: i <= step ? '#fff' : '#94A3B8' }}
            >
              {i + 1}
            </div>
            {i < 3 && <div className="flex-1 h-0.5" style={{ background: i < step ? '#062A67' : '#E1EAF5' }} />}
          </div>
        ))}
      </div>

      <div key={step} className="page-fade-in">
      {step === 0 && (
        <div>
          <h2 className="font-semibold text-navy mb-1">What do you need washed?</h2>
          <p className="text-sm text-darktext/60 mb-4">Select items and quantities.</p>
          <div className="flex flex-col gap-2 mb-6">
            {pricing.map((p) => (
              <div key={p.id} className="flex items-center justify-between border border-[#E1EAF5] rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-darktext">{p.name}</p>
                  <p className="text-xs text-darktext/50">{money(p.price)} / {p.unit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setItemQty(p.id, -1)} className="w-7 h-7 rounded-full bg-lightbg flex items-center justify-center text-navy">
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{qty[p.id] || 0}</span>
                  <button type="button" onClick={() => setItemQty(p.id, 1)} className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-navy mb-2 text-sm">Turnaround</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            {SERVICE_TIERS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTier(t.key)}
                className={`flex flex-col items-center justify-center gap-0.5 text-center px-2 py-3 rounded-lg border-2 transition-colors ${tier === t.key ? 'border-navy btn-primary' : 'border-[#E1EAF5] text-darktext'}`}
              >
                <span className="text-xs font-semibold leading-tight">{t.shortLabel}</span>
                <span className="text-[10px] opacity-75 leading-tight">{t.duration}</span>
              </button>
            ))}
          </div>
          {tierInfo?.contactForPricing && (
            <p className="text-xs text-royal bg-lightbg rounded-lg px-3 py-2 mb-6">
              Pricing for {tierInfo.shortLabel} is confirmed by our team based on volume — you won't be charged until they reach out.
            </p>
          )}
          {!tierInfo?.contactForPricing && <div className="mb-6" />}
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="font-semibold text-navy mb-1">Where should we pick up?</h2>
          <p className="text-sm text-darktext/60 mb-4">Drop a pin or use your current location.</p>
          <PickupMap value={coords} onChange={setCoords} />
          <input
            placeholder="Address (e.g. 12 Bodija Estate, Ibadan)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-[#E1EAF5] rounded-lg px-4 py-2.5 text-sm mt-4 mb-4"
          />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="border border-[#E1EAF5] rounded-lg px-4 py-2.5 text-sm" />
            <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="border border-[#E1EAF5] rounded-lg px-4 py-2.5 text-sm" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-navy mb-1">How can we reach you?</h2>
          <input placeholder="Full name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="border border-[#E1EAF5] rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="Phone number" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="border border-[#E1EAF5] rounded-lg px-4 py-2.5 text-sm" />
          <input placeholder="WhatsApp number (optional, if different)" value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} className="border border-[#E1EAF5] rounded-lg px-4 py-2.5 text-sm" />
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-semibold text-navy mb-4">Review & Payment</h2>
          <div className="bg-lightbg rounded-xl p-4 mb-4 text-sm">
            {selectedItems.map((it) => {
              const p = pricing.find((pr) => pr.id === it.pricingId);
              return (
                <div key={it.pricingId} className="flex justify-between py-1">
                  <span>{p?.name} × {it.qty}</span>
                  <span>{money((p?.price || 0) * it.qty)}</span>
                </div>
              );
            })}
            <div className="border-t border-[#E1EAF5] mt-2 pt-2 flex justify-between font-semibold text-navy">
              <span>{tierInfo?.contactForPricing ? `Item cost (${tierInfo?.shortLabel} rate not set)` : `Total (${tierInfo?.label})`}</span>
              <span>{tierInfo?.contactForPricing ? `${money(subtotal)}+` : money(total)}</span>
            </div>
            {tierInfo?.contactForPricing && (
              <p className="text-xs text-darktext/60 mt-2">
                Final price includes the {tierInfo.shortLabel.toLowerCase()} rate, confirmed by our team via WhatsApp before pickup.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {(tierInfo?.contactForPricing ? PAYMENT_METHODS.filter((m) => m.key === 'cod') : PAYMENT_METHODS).map((m) => (
              <label key={m.key} className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer ${paymentMethod === m.key ? 'border-navy bg-lightbg' : 'border-[#E1EAF5]'}`}>
                <input type="radio" name="payment" checked={paymentMethod === m.key} onChange={() => setPaymentMethod(m.key)} />
                <span className="text-sm font-medium text-darktext">{m.label}</span>
              </label>
            ))}
          </div>
          {tierInfo?.contactForPricing && (
            <p className="text-xs text-darktext/50 mb-4">
              Online payment and wallet aren't available until your final price is confirmed — pay on pickup/delivery for now.
            </p>
          )}
          {(paymentMethod === 'paystack' || paymentMethod === 'flutterwave') && (
            <p className="text-xs text-darktext/50 mb-4">
              You'll be redirected to complete secure payment once online checkout is connected. For now this books your order — payment can be settled on pickup.
            </p>
          )}
        </div>
      )}

      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`text-sm font-semibold text-navy ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          Back
        </button>
        {step < 3 ? (
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => setStep((s) => s + 1)}
            className="btn-primary font-semibold px-6 py-2.5 rounded-full disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <LoadingButton loading={submitting} onClick={handleConfirm} className="btn-accent font-semibold px-6 py-2.5 rounded-full">
            Confirm Pickup
          </LoadingButton>
        )}
      </div>
    </div>
  );
}
