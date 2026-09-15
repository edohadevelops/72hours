import { ORDER_STATUSES } from '../../utils/constants';
import { formatDateTime, hoursRemaining } from '../../utils/format';

// Horizontal progress track through the 9-stage order status flow.
// Direct reuse of the OverdueLadder pattern from Eli's Autos, relabeled
// for laundry — any collection of sequential states can use this shape.
export default function StatusTrack({ order, compact = false }) {
  const currentIndex = ORDER_STATUSES.findIndex((s) => s.key === order.status);
  const remaining = hoursRemaining(order.expectedDelivery);

  return (
    <div>
      {!compact && (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-60">Order</p>
            <p className="font-semibold text-lg">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide opacity-60">
              {order.status === 'delivered' ? 'Delivered' : 'Time remaining'}
            </p>
            <p className="font-semibold text-lg" style={{ color: remaining <= 6 && order.status !== 'delivered' ? '#F0554A' : undefined }}>
              {order.status === 'delivered' ? formatDateTime(order.statusHistory.at(-1)?.at) : `${remaining} hrs`}
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute top-3 left-0 right-0 h-1 bg-black/10 rounded-full" />
        <div
          className="absolute top-3 left-0 h-1 rounded-full transition-all duration-500"
          style={{
            width: `${(currentIndex / (ORDER_STATUSES.length - 1)) * 100}%`,
            background: 'linear-gradient(90deg, #0878D1, #13A9E5, #F5B400)',
          }}
        />
        <div className="relative flex justify-between">
          {ORDER_STATUSES.map((s, i) => {
            const done = i <= currentIndex;
            const historyEntry = order.statusHistory.find((h) => h.status === s.key);
            return (
              <div key={s.key} className="flex flex-col items-center" style={{ width: `${100 / ORDER_STATUSES.length}%` }}>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors"
                  style={{
                    background: done ? s.color : '#fff',
                    borderColor: done ? s.color : 'rgba(0,0,0,0.15)',
                    color: done ? '#fff' : 'rgba(0,0,0,0.3)',
                  }}
                >
                  {i + 1}
                </div>
                {!compact && (
                  <>
                    <p className="hidden sm:block text-[10px] mt-2 text-center leading-tight max-w-[64px]" style={{ opacity: done ? 1 : 0.5 }}>
                      {s.label}
                    </p>
                    {historyEntry && (
                      <p className="hidden sm:block text-[9px] opacity-40 mt-0.5">{formatDateTime(historyEntry.at).split(',')[1]}</p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
