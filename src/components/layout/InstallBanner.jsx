import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('72hrs_install_dismissed') === '1');

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const install = async () => {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('72hrs_install_dismissed', '1');
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 text-white rounded-2xl p-4 shadow-xl flex items-start gap-3"
      style={{ background: 'linear-gradient(160deg, #0E4098 0%, #062A67 100%)', boxShadow: '0 8px 24px rgba(6,42,103,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}
    >
      <Download size={20} className="text-gold shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm">Add 72hrs Laundry to your home screen</p>
        <p className="text-xs text-white/70 mt-0.5">Book pickups and track orders like a native app.</p>
        <button onClick={install} className="mt-2 btn-accent text-xs font-semibold px-3 py-1.5 rounded-full">
          Install
        </button>
      </div>
      <button onClick={dismiss} aria-label="Dismiss"><X size={16} className="text-white/50" /></button>
    </div>
  );
}
