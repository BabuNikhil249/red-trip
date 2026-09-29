import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  iconColor?: string;
}

const POPULAR_CITIES = [
  'Bangalore',
  'Mysore',
  'Coorg (Madikeri)',
  'Chikmagalur',
  'Mangalore',
  'Goa (Panaji)',
  'Ooty',
  'Wayanad',
  'Chennai',
  'Hyderabad',
  'Kochi',
];

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select location',
  iconColor = 'text-red-600',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = POPULAR_CITIES.filter((city) =>
    city.toLowerCase().includes((value || '').toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative flex items-center">
        <MapPin className={`w-5 h-5 ${iconColor} absolute left-3.5 shrink-0 pointer-events-none`} />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all placeholder:text-slate-400"
        />
      </div>

      {isOpen && filteredCities.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-56 overflow-y-auto py-2 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Popular Destinations
          </div>
          {filteredCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                onChange(city);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-red-500 shrink-0" />
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
