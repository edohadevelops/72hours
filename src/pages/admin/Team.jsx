import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminColors, PERMISSIONS, ROLE_LABELS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { Card, Badge } from '../../components/ui/Card';
import TeamFormModal from '../../components/admin/TeamFormModal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const ROLE_BADGE_COLORS = {
  super_admin: adminColors.accent,
  manager: adminColors.primary,
  customer_service: '#2ECC8F',
  marketing: '#B968F5',
};

export default function Team() {
  const { adminAccounts, addAdminAccount, updateAdminAccount, removeAdminAccount, adminUser } = useAuth();
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = add, object = edit
  const [error, setError] = useState('');

  const superAdminCount = adminAccounts.filter((a) => a.role === 'super_admin').length;

  const handleSave = (formValues, previousUsername) => {
    if (previousUsername) {
      updateAdminAccount(previousUsername, formValues);
    } else {
      addAdminAccount(formValues);
    }
    setEditing(undefined);
  };

  const handleDelete = (account) => {
    if (account.username === adminUser?.username) {
      setError("You can't remove your own account while signed in.");
      return;
    }
    if (account.role === 'super_admin' && superAdminCount <= 1) {
      setError("Can't remove the last Super Admin — add another one first.");
      return;
    }
    setError('');
    removeAdminAccount(account.username);
  };

  return (
    <AdminLayout title="Team & Roles" requiredPermission={PERMISSIONS.TEAM_MANAGE}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <p className="text-sm max-w-lg" style={{ color: adminColors.textMuted }}>
          Manage who can sign in to the admin console and what they can access.
          Super Admins see everything; other roles are scoped to their department.
        </p>
        <button
          onClick={() => setEditing(null)}
          className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap shrink-0 self-start sm:self-auto btn-admin-accent"
        >
          <Plus size={15} /> Add Team Member
        </button>
      </div>

      {error && (
        <p className="text-sm mb-4 px-4 py-2 rounded-lg" style={{ background: adminColors.bgPanelAlt, color: adminColors.danger }}>
          {error}
        </p>
      )}

      <Card colors={adminColors} className="overflow-x-auto mb-8">
        <table className="w-full text-sm" style={{ minWidth: 560 }}>
          <thead>
            <tr style={{ color: adminColors.textMuted, borderBottom: `1px solid ${adminColors.border}` }}>
              <th className="text-left font-medium px-4 py-3">Name</th>
              <th className="text-left font-medium px-4 py-3">Username</th>
              <th className="text-left font-medium px-4 py-3">Role</th>
              <th className="text-left font-medium px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {adminAccounts.map((a) => (
              <tr key={a.username} style={{ borderBottom: `1px solid ${adminColors.border}` }}>
                <td className="px-4 py-3 font-medium">
                  {a.name}
                  {a.username === adminUser?.username && (
                    <span className="ml-2 text-[10px] uppercase" style={{ color: adminColors.textMuted }}>(you)</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{a.username}</td>
                <td className="px-4 py-3">
                  <Badge color={ROLE_BADGE_COLORS[a.role]}>{ROLE_LABELS[a.role]}</Badge>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(a)} className="mr-3" style={{ color: adminColors.primary }}><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(a)} style={{ color: adminColors.danger }}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <h2 className="font-semibold mb-3">What each role can access</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(ROLE_LABELS).map(([key, label]) => (
          <Card key={key} colors={adminColors} className="p-4">
            <Badge color={ROLE_BADGE_COLORS[key]}>{label}</Badge>
            <ul className="text-xs mt-3 flex flex-col gap-1.5" style={{ color: adminColors.textMuted }}>
              {key === 'super_admin' && (
                <>
                  <li>✓ Dashboard, Orders, Customers</li>
                  <li>✓ Pricing (view & edit)</li>
                  <li>✓ Team & Roles management</li>
                </>
              )}
              {key === 'manager' && (
                <>
                  <li>✓ Dashboard, Orders, Customers</li>
                  <li>✓ Pricing (view & edit)</li>
                  <li>✗ Team & Roles management</li>
                </>
              )}
              {key === 'customer_service' && (
                <>
                  <li>✓ Dashboard, Orders, Customers</li>
                  <li>✗ Pricing</li>
                  <li>✗ Team & Roles management</li>
                </>
              )}
              {key === 'marketing' && (
                <>
                  <li>✓ Dashboard, Customers</li>
                  <li>✗ Orders, Pricing</li>
                  <li>✗ Team & Roles management</li>
                </>
              )}
            </ul>
          </Card>
        ))}
      </div>

      {editing !== undefined && (
        <TeamFormModal
          account={editing}
          existingUsernames={adminAccounts.map((a) => a.username)}
          onSave={handleSave}
          onClose={() => setEditing(undefined)}
        />
      )}
    </AdminLayout>
  );
}
