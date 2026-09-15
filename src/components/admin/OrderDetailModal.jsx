import { Modal, Badge } from '../ui/Card';
import { adminColors, ORDER_STATUSES } from '../../utils/constants';
import { useContent } from '../../lib/contentStore';
import { money, moneyOrPending, formatDateTime, whatsappLink } from '../../utils/format';
import StatusTrack from '../ui/StatusTrack';
import ImageUploadField from '../ui/ImageUploadField';

export default function OrderDetailModal({ order, onClose }) {
  const { pricing, customers, advanceOrderStatus, updateItem } = useContent();
  if (!order) return null;

  const customer = customers.find((c) => c.id === order.customerId);
  const currentIndex = ORDER_STATUSES.findIndex((s) => s.key === order.status);
  const nextStatus = ORDER_STATUSES[currentIndex + 1];

  const handleAdvance = () => {
    if (nextStatus) advanceOrderStatus(order.id, nextStatus.key);
  };

  const handleMarkPaid = () => {
    updateItem('orders', order.id, { paymentStatus: 'paid' });
  };

  const setPhoto = (key, dataUrl) => {
    updateItem('orders', order.id, { [key]: dataUrl });
  };

  const statusMessage = `Update on your order ${order.id}: it's now "${ORDER_STATUSES[currentIndex]?.label}". — 72hrs Laundry`;

  return (
    <Modal open={!!order} onClose={onClose} title={order.id} colors={adminColors}>
      <div className="mb-4">
        <StatusTrack order={order} compact />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <p style={{ color: adminColors.textMuted }} className="text-xs uppercase mb-0.5">Customer</p>
          <p>{customer?.name || '—'}</p>
        </div>
        <div>
          <p style={{ color: adminColors.textMuted }} className="text-xs uppercase mb-0.5">Tag Code</p>
          <p className="font-mono">{order.tagCode}</p>
        </div>
        <div>
          <p style={{ color: adminColors.textMuted }} className="text-xs uppercase mb-0.5">Pickup</p>
          <p>{order.pickupAddress}</p>
        </div>
        <div>
          <p style={{ color: adminColors.textMuted }} className="text-xs uppercase mb-0.5">Scheduled</p>
          <p>{formatDateTime(order.scheduledPickup)}</p>
        </div>
        <div>
          <p style={{ color: adminColors.textMuted }} className="text-xs uppercase mb-0.5">Payment</p>
          <p className="flex items-center gap-2">
            {order.paymentMethod} <Badge color={order.paymentStatus === 'paid' ? adminColors.success : adminColors.warning}>{order.paymentStatus}</Badge>
          </p>
        </div>
        <div>
          <p style={{ color: adminColors.textMuted }} className="text-xs uppercase mb-0.5">Total</p>
          <p className="font-semibold">{moneyOrPending(order.total)}</p>
        </div>
      </div>

      <div className="mb-4">
        <p style={{ color: adminColors.textMuted }} className="text-xs uppercase mb-1">Items</p>
        {order.items.map((it) => {
          const p = pricing.find((pr) => pr.id === it.pricingId);
          return (
            <div key={it.pricingId} className="flex justify-between text-sm py-0.5">
              <span>{p?.name} × {it.qty}</span>
              <span>{money((p?.price || 0) * it.qty)}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <ImageUploadField label="Before (pickup)" value={order.beforePhoto} onChange={(d) => setPhoto('beforePhoto', d)} colors={adminColors} />
        <ImageUploadField label="After (ready)" value={order.afterPhoto} onChange={(d) => setPhoto('afterPhoto', d)} colors={adminColors} />
      </div>

      <div className="flex flex-wrap gap-2">
        {nextStatus && (
          <button
            onClick={handleAdvance}
            className="text-sm font-semibold px-4 py-2 rounded-full flex items-center justify-center whitespace-nowrap btn-admin-primary"
          >
            Advance to "{nextStatus.label}"
          </button>
        )}
        {order.paymentStatus !== 'paid' && (
          <button
            onClick={handleMarkPaid}
            className="text-sm font-semibold px-4 py-2 rounded-full flex items-center justify-center whitespace-nowrap btn-admin-outline"
          >
            Mark as Paid
          </button>
        )}
        {customer && (
          <a
            href={whatsappLink(customer.whatsapp, statusMessage)}
            target="_blank" rel="noreferrer"
            className="text-sm font-semibold px-4 py-2 rounded-full flex items-center justify-center whitespace-nowrap btn-admin-outline"
          >
            Send WhatsApp Update
          </a>
        )}
      </div>
    </Modal>
  );
}
