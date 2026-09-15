import { useState, useEffect } from 'react';
import { Modal } from '../ui/Card';
import { adminColors } from '../../utils/constants';
import { useContent } from '../../lib/contentStore';

const inputStyle = {
  width: '100%', borderRadius: 8, padding: '10px 14px', fontSize: 14,
  background: adminColors.bg, border: `1px solid ${adminColors.border}`, color: adminColors.text,
};

export default function PricingFormModal({ item, onClose }) {
  const { addItem, updateItem } = useContent();
  const isEdit = !!item;
  const [form, setForm] = useState({ name: '', category: 'Wash & Iron', price: '', unit: 'item' });

  useEffect(() => {
    if (item) setForm({ name: item.name, category: item.category, price: item.price, unit: item.unit });
    else setForm({ name: '', category: 'Wash & Iron', price: '', unit: 'item' });
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (isEdit) updateItem('pricing', item.id, payload);
    else addItem('pricing', { id: `p${Date.now()}`, ...payload });
    onClose();
  };

  return (
    <Modal open={!!item || item === null} onClose={onClose} title={isEdit ? 'Edit Item' : 'Add Pricing Item'} colors={adminColors}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
        <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle} />
        <input required type="number" min="0" placeholder="Price (NGN)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} />
        <input placeholder="Unit (e.g. item, kg)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} style={inputStyle} />
        <button type="submit" className="font-semibold py-2.5 rounded-full mt-2 btn-admin-accent">
          {isEdit ? 'Save Changes' : 'Add Item'}
        </button>
      </form>
    </Modal>
  );
}
