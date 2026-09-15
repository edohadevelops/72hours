import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../lib/contentStore';
import LoadingButton from '../../components/ui/LoadingButton';

export default function Login() {
  const { signUp, continueAsGuest } = useAuth();
  const { customers, addItem } = useContent();
  const navigate = useNavigate();
  const [mode, setMode] = useState('account'); // 'account' | 'guest'
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', whatsapp: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (mode === 'guest') {
        continueAsGuest({ phone: form.phone, whatsapp: form.whatsapp || form.phone });
      } else {
        const existing = customers.find((c) => c.phone === form.phone);
        const customerId = existing?.id || `c${Date.now()}`;
        if (!existing) {
          addItem('customers', {
            id: customerId,
            name: form.name,
            phone: form.phone,
            whatsapp: form.whatsapp || form.phone,
            addresses: [],
            walletBalance: 0,
            loyaltyPoints: 0,
            joinedAt: new Date().toISOString(),
          });
        }
        signUp({ name: form.name || existing?.name, phone: form.phone, whatsapp: form.whatsapp || form.phone, customerId });
      }
      setLoading(false);
      navigate('/account');
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-navy mb-2">Sign in to 72hrs Laundry</h1>
      <p className="text-sm text-darktext/60 mb-6">
        Create an account to track orders and rebook in one tap — or continue as a guest with just your phone number.
      </p>

      <div className="flex rounded-full bg-lightbg p-1 mb-6 text-sm font-medium">
        <button
          type="button"
          onClick={() => setMode('account')}
          className={`flex-1 py-2 rounded-full transition-colors ${mode === 'account' ? 'btn-primary' : 'text-navy'}`}
        >
          Create Account
        </button>
        <button
          type="button"
          onClick={() => setMode('guest')}
          className={`flex-1 py-2 rounded-full transition-colors ${mode === 'guest' ? 'btn-primary' : 'text-navy'}`}
        >
          Continue as Guest
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'account' && (
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-[#E1EAF5] rounded-lg px-4 py-2.5 text-sm"
          />
        )}
        <input
          required
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border border-[#E1EAF5] rounded-lg px-4 py-2.5 text-sm"
        />
        <input
          placeholder="WhatsApp number (if different)"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          className="border border-[#E1EAF5] rounded-lg px-4 py-2.5 text-sm"
        />
        <LoadingButton loading={loading} type="submit" className="btn-accent font-semibold py-3 rounded-full">
          {mode === 'guest' ? 'Continue' : 'Create Account'}
        </LoadingButton>
      </form>
    </div>
  );
}
