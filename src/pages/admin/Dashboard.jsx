import AdminLayout from '../../components/layout/AdminLayout';
import { adminColors, ORDER_STATUSES, PERMISSIONS } from '../../utils/constants';
import { useContent } from '../../lib/contentStore';
import { money, moneyOrPending, formatDate } from '../../utils/format';
import { Link } from 'react-router-dom';
import { Badge, Card } from '../../components/ui/Card';

export default function Dashboard() {
  const { orders, customers, expenses } = useContent();

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const revenue = orders.reduce((s, o) => s + (o.paymentStatus === 'paid' ? (o.total || 0) : 0), 0);
  const unpaidTotal = orders.reduce((s, o) => s + (o.paymentStatus !== 'paid' ? (o.total || 0) : 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const stats = [
    { label: 'Active Orders', value: activeOrders.length },
    { label: 'Total Customers', value: customers.length },
    { label: 'Revenue Collected', value: money(revenue) },
    { label: 'Outstanding', value: money(unpaidTotal) },
  ];

  return (
    <AdminLayout title="Dashboard" requiredPermission={PERMISSIONS.DASHBOARD_VIEW}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} colors={adminColors} className="p-5">
            <p className="text-xs uppercase tracking-wide" style={{ color: adminColors.textMuted }}>{s.label}</p>
            <p className="text-2xl font-semibold mt-1">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Recent Orders</h2>
        <Link to="/admin/orders" className="text-sm font-semibold" style={{ color: adminColors.primary }}>View all</Link>
      </div>

      <Card colors={adminColors} className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 640 }}>
          <thead>
            <tr style={{ color: adminColors.textMuted, borderBottom: `1px solid ${adminColors.border}` }}>
              <th className="text-left font-medium px-4 py-3">Order</th>
              <th className="text-left font-medium px-4 py-3">Customer</th>
              <th className="text-left font-medium px-4 py-3">Status</th>
              <th className="text-left font-medium px-4 py-3">Total</th>
              <th className="text-left font-medium px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice().reverse().slice(0, 6).map((o) => {
              const customer = customers.find((c) => c.id === o.customerId);
              const statusInfo = ORDER_STATUSES.find((s) => s.key === o.status);
              return (
                <tr key={o.id} style={{ borderBottom: `1px solid ${adminColors.border}` }}>
                  <td className="px-4 py-3 font-medium">{o.id}</td>
                  <td className="px-4 py-3">{customer?.name || '—'}</td>
                  <td className="px-4 py-3"><Badge color={statusInfo?.color}>{statusInfo?.label}</Badge></td>
                  <td className="px-4 py-3">{moneyOrPending(o.total)}</td>
                  <td className="px-4 py-3" style={{ color: adminColors.textMuted }}>{formatDate(o.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </AdminLayout>
  );
}
