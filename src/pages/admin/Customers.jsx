import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminColors, PERMISSIONS } from '../../utils/constants';
import { useContent } from '../../lib/contentStore';
import { money, formatDate, whatsappLink } from '../../utils/format';
import { Card } from '../../components/ui/Card';
import { Search } from 'lucide-react';

export default function Customers() {
  const { customers, orders } = useContent();
  const [query, setQuery] = useState('');

  const filtered = customers.filter((c) =>
    !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query)
  );

  return (
    <AdminLayout title="Customers" requiredPermission={PERMISSIONS.CUSTOMERS_VIEW}>
      <div className="flex items-center gap-2 rounded-lg px-3 mb-4 max-w-sm" style={{ border: `1px solid ${adminColors.border}` }}>
        <Search size={14} style={{ color: adminColors.textMuted }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers..."
          className="flex-1 bg-transparent py-2.5 text-sm outline-none"
          style={{ color: adminColors.text }}
        />
      </div>

      <Card colors={adminColors} className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 640 }}>
          <thead>
            <tr style={{ color: adminColors.textMuted, borderBottom: `1px solid ${adminColors.border}` }}>
              <th className="text-left font-medium px-4 py-3">Name</th>
              <th className="text-left font-medium px-4 py-3">Phone</th>
              <th className="text-left font-medium px-4 py-3">Orders</th>
              <th className="text-left font-medium px-4 py-3">Wallet</th>
              <th className="text-left font-medium px-4 py-3">Joined</th>
              <th className="text-left font-medium px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const orderCount = orders.filter((o) => o.customerId === c.id).length;
              return (
                <tr key={c.id} style={{ borderBottom: `1px solid ${adminColors.border}` }}>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3">{orderCount}</td>
                  <td className="px-4 py-3">{money(c.walletBalance)}</td>
                  <td className="px-4 py-3" style={{ color: adminColors.textMuted }}>{formatDate(c.joinedAt)}</td>
                  <td className="px-4 py-3">
                    <a
                      href={whatsappLink(c.whatsapp, `Hi ${c.name.split(' ')[0]}, this is 72hrs Laundry.`)}
                      target="_blank" rel="noreferrer"
                      className="text-xs font-semibold"
                      style={{ color: adminColors.primary }}
                    >
                      WhatsApp
                    </a>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10" style={{ color: adminColors.textMuted }}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </AdminLayout>
  );
}
