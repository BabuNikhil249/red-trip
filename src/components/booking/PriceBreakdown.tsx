import React, { useState } from 'react';
import { Tag, CheckCircle2, ShieldCheck, Percent } from 'lucide-react';

interface BreakdownDetails {
  days: number;
  dayRate: number;
  km: number;
  kmRate: number;
  driverBattaPerDay?: number;
}

interface PriceBreakdownProps {
  baseFare: number;
  driverCharge?: number;
  securityDeposit?: number;
  taxAmount: number;
  discount?: number;
  totalAmount: number;
  currency?: string;
  isSelfDrive?: boolean;
  breakdownDetails?: BreakdownDetails;
  onApplyCoupon?: (code: string, discountAmount: number) => void;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  baseFare,
  driverCharge = 0,
  securityDeposit = 0,
  taxAmount,
  discount = 0,
  totalAmount,
  currency = '₹',
  isSelfDrive = false,
  breakdownDetails,
  onApplyCoupon,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    if (code === 'REDTRIP10') {
      const disc = Math.round(baseFare * 0.1);
      setAppliedCoupon('REDTRIP10 (10% OFF)');
      if (onApplyCoupon) onApplyCoupon('REDTRIP10', disc);
    } else if (code === 'FIRST500') {
      const disc = Math.min(500, baseFare);
      setAppliedCoupon('FIRST500 (Flat ₹500 OFF)');
      if (onApplyCoupon) onApplyCoupon('FIRST500', disc);
    } else if (code === 'AGENCYVIP') {
      const disc = Math.round(baseFare * 0.15);
      setAppliedCoupon('AGENCYVIP (15% Corporate Discount)');
      if (onApplyCoupon) onApplyCoupon('AGENCYVIP', disc);
    } else {
      setCouponError('Invalid coupon code. Try REDTRIP10 or FIRST500');
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/90 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Tag className="w-4 h-4 text-red-600" /> Fare Summary
        </h4>
        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
          Transparent KM + Day Tariff
        </span>
      </div>

      <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
        {breakdownDetails ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-800 block">Daily Vehicle Tariff</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {currency}{breakdownDetails.dayRate.toLocaleString()} × {breakdownDetails.days} {breakdownDetails.days === 1 ? 'day' : 'days'}
                </span>
              </div>
              <span className="font-bold text-slate-900">
                {currency}
                {(breakdownDetails.dayRate * breakdownDetails.days).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-800 block">Estimated Distance Fare</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {currency}{breakdownDetails.kmRate}/km × {breakdownDetails.km} KM
                </span>
              </div>
              <span className="font-bold text-slate-900">
                {currency}
                {(breakdownDetails.kmRate * breakdownDetails.km).toLocaleString()}
              </span>
            </div>

            {driverCharge > 0 && (
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-800 block">Chauffeur Allowance & Batta</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {currency}500/day × {breakdownDetails.days} {breakdownDetails.days === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <span className="font-bold text-slate-900">
                  {currency}
                  {driverCharge.toLocaleString()}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span>Base Vehicle / Package Fare</span>
              <span className="font-bold text-slate-900">
                {currency}
                {baseFare.toLocaleString()}
              </span>
            </div>

            {driverCharge > 0 && (
              <div className="flex justify-between items-center">
                <span>Chauffeur Allowance & Batta</span>
                <span className="font-bold text-slate-900">
                  {currency}
                  {driverCharge.toLocaleString()}
                </span>
              </div>
            )}
          </>
        )}

        {isSelfDrive && securityDeposit > 0 && (
          <div className="flex justify-between items-center text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <div>
              <span className="font-bold block">Refundable Security Deposit</span>
              <span className="text-[10px] text-amber-700 font-medium">100% refunded upon vehicle return</span>
            </div>
            <span className="font-black">
              {currency}
              {securityDeposit.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>GST & Highway Taxes (5%)</span>
          <span className="font-bold text-slate-900">
            {currency}
            {taxAmount.toLocaleString()}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-bold">
            <span className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" /> Promo Discount Applied
            </span>
            <span className="font-black">
              -{currency}
              {discount.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Coupon Code Input */}
      <div className="pt-2 border-t border-slate-200 space-y-2">
        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
          Have a Promo Code?
        </label>
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. REDTRIP10"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono uppercase font-bold text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shrink-0 transition-all active:scale-95"
          >
            Apply
          </button>
        </form>

        {appliedCoupon && (
          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {appliedCoupon} applied successfully!
          </span>
        )}

        {couponError && (
          <span className="text-[11px] font-bold text-red-600 block">{couponError}</span>
        )}
      </div>

      {/* Total Amount Callout */}
      <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-center bg-white p-4 rounded-2xl border">
        <div>
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
            Total Payable
          </span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Guaranteed Best Price
          </span>
        </div>
        <span className="text-3xl font-black text-red-600">
          {currency}
          {totalAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
