import React from 'react';

interface PriceBreakdownProps {
  baseFare: number;
  driverCharge?: number;
  securityDeposit?: number;
  taxAmount: number;
  discount?: number;
  totalAmount: number;
  currency?: string;
  isSelfDrive?: boolean;
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
}) => {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
      <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2.5">
        Price Breakdown
      </h4>

      <div className="space-y-2 text-xs md:text-sm text-slate-600">
        <div className="flex justify-between items-center">
          <span>Base Fare / Rental Cost</span>
          <span className="font-semibold text-slate-800">
            {currency}
            {baseFare.toLocaleString()}
          </span>
        </div>

        {driverCharge > 0 && (
          <div className="flex justify-between items-center">
            <span>Chauffeur Allowance</span>
            <span className="font-semibold text-slate-800">
              {currency}
              {driverCharge.toLocaleString()}
            </span>
          </div>
        )}

        {isSelfDrive && securityDeposit > 0 && (
          <div className="flex justify-between items-center text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60">
            <div>
              <span className="font-medium block">Refundable Security Deposit</span>
              <span className="text-[10px] text-amber-600">Refunded upon vehicle return</span>
            </div>
            <span className="font-bold">
              {currency}
              {securityDeposit.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>GST & Toll Taxes (5%)</span>
          <span className="font-semibold text-slate-800">
            {currency}
            {taxAmount.toLocaleString()}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-700">
            <span>Promo Discount</span>
            <span className="font-semibold">
              -{currency}
              {discount.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Total Payable
          </span>
          <span className="text-[11px] text-slate-400">Inclusive of all taxes</span>
        </div>
        <span className="text-2xl font-black text-red-600">
          {currency}
          {totalAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
