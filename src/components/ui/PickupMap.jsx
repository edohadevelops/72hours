import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import { LocateFixed } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const IBADAN_CENTER = [7.3775, 3.9470];

function ClickCapture({ onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function PickupMap({ value, onChange, height = 260 }) {
  const [position, setPosition] = useState(value || IBADAN_CENTER);
  const [locating, setLocating] = useState(false);

  const handlePick = useCallback((pos) => {
    setPosition(pos);
    onChange?.(pos);
  }, [onChange]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handlePick([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div>
      <p className="text-xs text-darktext/50 mb-2">Tap the map to drop your pickup pin, or use your current location.</p>
      <div className="relative rounded-xl overflow-hidden border border-[#E1EAF5]" style={{ height, isolation: 'isolate' }}>
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCapture onPick={handlePick} />
          <CircleMarker
            center={position}
            radius={10}
            pathOptions={{ color: '#062A67', fillColor: '#F5B400', fillOpacity: 1, weight: 3 }}
          />
        </MapContainer>
        <button
          type="button"
          onClick={useMyLocation}
          className="absolute bottom-3 right-3 z-[500] bg-white shadow-md rounded-full px-3 py-2 flex items-center gap-2 text-xs font-semibold text-navy hover:bg-lightbg"
        >
          <LocateFixed size={14} className={locating ? 'animate-pulse' : ''} />
          {locating ? 'Locating…' : 'Use my location'}
        </button>
      </div>
    </div>
  );
}
