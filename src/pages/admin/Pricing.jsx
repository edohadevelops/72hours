import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminColors, PERMISSIONS } from '../../utils/constants';
import { useContent } from '../../lib/contentStore';
import { money } from '../../utils/format';
import { Card } from '../../components/ui/Card';
import PricingFormModal from '../../components/admin/PricingFormModal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function Pricing() {
  const { pricing, removeItem } = useContent();
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = add, object = edit

  const categories = [...new Set(pricing.map((p) => p.category))];

  return (
    <AdminLayout title="Pricing" requiredPermission={PERMISSIONS.PRICING_VIEW}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <p className="text-sm" style={{ color: adminColors.textMuted }}>
          Edits here reflect instantly on the public Pricing page and booking flow.
        </p>
        <button
          onClick={() => setEditing(null)}
          className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap shrink-0 self-start sm:self-auto btn-admin-accent"
        >
          <Plus size={15} /> Add Item
        </button>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <p className="text-xs uppercase tracking-wide mb-2" style={{ color: adminColors.textMuted }}>{cat}</p>
          <Card colors={adminColors} className="overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {pricing.filter((p) => p.category === cat).map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${adminColors.border}` }}>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{money(p.price)} / {p.unit}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEditing(p)} className="mr-3" style={{ color: adminColors.primary }}><Pencil size={15} /></button>
                      <button onClick={() => removeItem('pricing', p.id)} style={{ color: adminColors.danger }}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      ))}

      {editing !== undefined && <PricingFormModal item={editing} onClose={() => setEditing(undefined)} />}
    </AdminLayout>
  );
}
