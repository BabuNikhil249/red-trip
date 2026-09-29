import React from 'react';
import type { VehicleCategory } from '../../types';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';

interface FilterPanelProps {
  selectedCategory: VehicleCategory | 'All';
  onCategoryChange: (cat: VehicleCategory | 'All') => void;
  priceMax: number;
  onPriceChange: (price: number) => void;
  onReset?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onCategoryChange,
  priceMax,
  onPriceChange,
  onReset,
}) => {
  const categories: (VehicleCategory | 'All')[] = [
    'All',
    'Sedan',
    'SUV',
    'Premium',
    'Tempo Traveller',
    'Bus',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-red-600" /> Filter Options
        </h4>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Vehicle Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Max Price / Day
          </label>
          <span className="text-xs font-extrabold text-red-600">₹{priceMax.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={1500}
          max={20000}
          step={500}
          value={priceMax}
          onChange={(e) => onPriceChange(parseInt(e.target.value))}
          className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
          <span>₹1,500</span>
          <span>₹20,000</span>
        </div>
      </div>
    </div>
  );
};
