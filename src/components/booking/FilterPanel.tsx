import React from 'react';
import type { VehicleCategory } from '../../types';
import { SlidersHorizontal, RefreshCw, Check, Sparkles } from 'lucide-react';

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
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6 sticky top-24">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-red-600" /> Filter Vehicles
        </h4>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Vehicle Category Chips */}
      <div className="space-y-3">
        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
          Vehicle Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 font-black'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Budget Slider */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Max Budget
          </label>
          <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
            ₹{priceMax.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={1500}
          max={20000}
          step={500}
          value={priceMax}
          onChange={(e) => onPriceChange(parseInt(e.target.value))}
          className="w-full accent-red-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
          <span>₹1,500</span>
          <span>₹20,000</span>
        </div>
      </div>

      {/* Trust Guarantee Box */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-black uppercase text-[10px]">
          <Sparkles className="w-3.5 h-3.5" /> RED TRIP Guarantee
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          All vehicles include 100+ point sanitation checklist, zero surge pricing guarantee, and certified driver verification.
        </p>
      </div>
    </div>
  );
};
