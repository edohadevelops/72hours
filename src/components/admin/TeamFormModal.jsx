import { useState, useEffect } from 'react';
import { Modal } from '../ui/Card';
import { adminColors, ROLE_LABELS } from '../../utils/constants';

const inputStyle = {
  width: '100%', borderRadius: 8, padding: '10px 14px', fontSize: 14,
  background: adminColors.bg, border: `1px solid ${adminColors.border}`, color: adminColors.text,
};

export default function TeamFormModal({ account, existingUsernames, onSave, onClose }) {
  const isEdit = !!account;
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'customer_service' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (account) setForm({ name: account.name, username: account.username, password: account.password, role: account.role });
    else setForm({ name: '', username: '', password: '', role: 'customer_service' });
    setError('');
  }, [account]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const usernameLower = form.username.trim().toLowerCase();
    const clash = existingUsernames.some(
      (u) => u.toLowerCase() === usernameLower && (!isEdit || u.toLowerCase() !== account.username.toLowerCase())
    );
    if (clash) {
      setError('That username is already taken.');
      return;
    }
    if (!form.name.trim() || !usernameLower || !form.password) {
      setError('All fields are required.');
      return;
    }
    onSave({ ...form, username: usernameLower }, isEdit ? account.username : null);
  };

  return (
    <Modal open={!!account || account === null} onClose={onClose} title={isEdit ? 'Edit Team Member' : 'Add Team Member'} colors={adminColors}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
        <input required placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} style={inputStyle} />
        <input required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputStyle}>
          {Object.entries(ROLE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {error && <p className="text-xs" style={{ color: adminColors.danger }}>{error}</p>}
        <button type="submit" className="font-semibold py-2.5 rounded-full mt-2 btn-admin-accent">
          {isEdit ? 'Save Changes' : 'Add Team Member'}
        </button>
      </form>
    </Modal>
  );
}
