import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

export default function ImageUploadField({ value, onChange, label, colors }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const border = colors?.border ?? '#E1EAF5';
  const muted = colors?.textMuted ?? '#94A3B8';

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => onChange?.(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {label && <p className="text-xs uppercase tracking-wide mb-1" style={{ color: muted }}>{label}</p>}
      {value ? (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
          <img src={value} alt={label || 'upload'} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange?.(null)}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
            aria-label="Remove photo"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
          className="w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 text-xs"
          style={{
            border: `2px dashed ${dragOver ? '#0878D1' : border}`,
            color: muted,
            background: dragOver ? 'rgba(8,120,209,0.05)' : 'transparent',
          }}
        >
          <Camera size={20} />
          Add photo
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
