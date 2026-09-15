import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminColors, ORDER_STATUSES, PERMISSIONS } from '../../utils/constants';
import { useContent } from '../../lib/contentStore';
import { moneyOrPending, formatDate } from '../../utils/format';
import { Badge, Card } from '../../components/ui/Card';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import { Search, ScanLine } from 'lucide-react';

export default function Orders() {
  const { orders, customers, findOrderByTag } = useContent();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [scanCode, setScanCode] = useState('');

  const filtered = orders
    .slice().reverse()
    .filter((o) => statusFilter === 'all' || o.status === statusFilter)
    .filter((o) => {
      if (!query) return true;
      const customer = customers.find((c) => c.id === o.customerId);
      const q = query.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.tagCode.toLowerCase().includes(q) || customer?.name?.toLowerCase().includes(q);
    });

  const handleScan = (e) => {
    e.preventDefault();
    const found = findOrderByTag(scanCode.trim().toUpperCase()) || findOrderByTag(scanCode.trim());
    if (found) { setSelected(found); setScanCode(''); }
  };

  return (
    <AdminLayout title="Orders" requiredPermission={PERMISSIONS.ORDERS_VIEW}>
      <form onSubmit={handleScan} className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 rounded-lg px-3" style={{ border: `1px solid ${adminColors.border}` }}>
          <ScanLine size={16} style={{ color: adminColors.textMuted }} />
          <input
            value={scanCode}
            onChange={(e) => setScanCode(e.target.value)}
            placeholder="Scan or type tag code to open order (e.g. 72HRS-1042)"
            className="flex-1 bg-transparent py-2.5 text-sm outline-none"
            style={{ color: adminColors.text }}
          />
        </div>
        <button type="submit" className="text-sm font-semibold px-5 py-2.5 rounded-lg flex items-center justify-center whitespace-nowrap btn-admin-accent">
          Open
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 flex-1 min-w-[200px]" style={{ border: `1px solid ${adminColors.border}` }}>
          <Search size={14} style={{ color: adminColors.textMuted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order, tag, or customer..."
            className="flex-1 bg-transparent py-2 text-sm outline-none"
            style={{ color: adminColors.text }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg px-3 text-sm"
          style={{ background: adminColors.bgPanel, border: `1px solid ${adminColors.border}`, color: adminColors.text }}
        >
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      <Card colors={adminColors} className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 640 }}>
          <thead>
            <tr style={{ color: adminColors.textMuted, borderBottom: `1px solid ${adminColors.border}` }}>
              <th className="text-left font-medium px-4 py-3">Order</th>
              <th className="text-left font-medium px-4 py-3">Tag</th>
              <th className="text-left font-medium px-4 py-3">Customer</th>
              <th className="text-left font-medium px-4 py-3">Status</th>
              <th className="text-left font-medium px-4 py-3">Total</th>
              <th className="text-left font-medium px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const customer = customers.find((c) => c.id === o.customerId);
              const statusInfo = ORDER_STATUSES.find((s) => s.key === o.status);
              return (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="cursor-pointer hover:opacity-80"
                  style={{ borderBottom: `1px solid ${adminColors.border}` }}
                >
                  <td className="px-4 py-3 font-medium">{o.id}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: adminColors.textMuted }}>{o.tagCode}</td>
                  <td className="px-4 py-3">{customer?.name || '—'}</td>
                  <td className="px-4 py-3"><Badge color={statusInfo?.color}>{statusInfo?.label}</Badge></td>
                  <td className="px-4 py-3">{moneyOrPending(o.total)}</td>
                  <td className="px-4 py-3" style={{ color: adminColors.textMuted }}>{formatDate(o.createdAt)}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10" style={{ color: adminColors.textMuted }}>No orders match.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <OrderDetailModal order={selected} onClose={() => setSelected(null)} />
    </AdminLayout>
  );
}
