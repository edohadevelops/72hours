import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoMark from '../../assets/logo-mark.png';
import { useAuth } from '../../context/AuthContext';
import { adminColors } from '../../utils/constants';
import LoadingButton from '../../components/ui/LoadingButton';

export default function AdminLogin() {
  const { adminSignIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = adminSignIn(username, password);
      setLoading(false);
      if (ok) navigate('/admin');
      else setError('Incorrect username or password.');
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: adminColors.bg, color: adminColors.text }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{
          background: `linear-gradient(160deg, ${adminColors.bgPanelAlt} 0%, ${adminColors.bgPanel} 100%)`,
          border: `1px solid ${adminColors.border}`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex flex-col items-center gap-2 mb-6">
          <img src={logoMark} alt="72hrs Laundry" className="w-16 h-16 object-contain" />
          <p className="font-semibold">72hrs Laundry Admin</p>
        </div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          className="w-full rounded-lg px-4 py-2.5 text-sm mb-3"
          style={{ background: adminColors.bg, border: `1px solid ${adminColors.border}`, color: adminColors.text }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-lg px-4 py-2.5 text-sm mb-3"
          style={{ background: adminColors.bg, border: `1px solid ${adminColors.border}`, color: adminColors.text }}
        />
        {error && <p className="text-xs mb-3" style={{ color: adminColors.danger }}>{error}</p>}
        <LoadingButton
          loading={loading}
          type="submit"
          className="w-full font-semibold py-3 rounded-full btn-accent"
        >
          Sign In
        </LoadingButton>
      </form>
    </div>
  );
}
