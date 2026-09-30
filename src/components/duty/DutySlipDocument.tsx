import React from 'react';
import type { DutySlipData, AgencyBooking } from '../../types';
import { Printer, CheckCircle, Car } from 'lucide-react';

interface DutySlipDocumentProps {
  booking: AgencyBooking;
  onClose?: () => void;
}

export const DutySlipDocument: React.FC<DutySlipDocumentProps> = ({ booking, onClose }) => {
  const ds: DutySlipData = booking.dutySlip || {
    logSheetNo: `LS-${booking.id.replace('AG-', '')}`,
    agencyName: booking.agencyName || 'M/S Apoorva',
    guestName: booking.travelerName,
    guestMobile: booking.travelerPhone,
    reportingTo: booking.agencyName || 'M/S Apoorva',
    cabType: booking.vehicleTypeRequested,
    cabNo: booking.assignedCabNo || 'KA 05 AM 2969',
    driverName: booking.assignedDriverName || 'Vikas U',
    driverPhone: booking.assignedDriverPhone || '+91 98123 45678',
    particulars: 'Local',
    date: booking.travelDate,
    openingKm: 149103,
    openingTime: '06:00 AM',
    closingKm: 149228,
    closingTime: '07:00 PM',
    totalKm: 125,
    totalHours: 13,
    detailsOfJourney: `1st Pickup: ${booking.pickup1} (Flight: ${booking.flightNo || 'N/A'}) \n2nd Pickup: ${booking.pickup2 || 'N/A'} \nDrop Point: ${booking.dropLocation}`,
    fastTag: 350,
    parking: 200,
    tax: 150,
    batta: 500,
    advance: 1000,
    others: 0,
    ratePerKm: 18,
    baseFare: 2250,
    totalAmount: 3450,
    guestSignature: 'Apoorva',
    updatedAt: new Date().toISOString(),
  };

  const grossTotal = ds.baseFare + ds.fastTag + ds.parking + ds.tax + ds.batta + ds.others;
  const netAmount = grossTotal - ds.advance;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white text-slate-900 rounded-3xl border border-slate-300 shadow-2xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6 print:shadow-none print:border-none print:p-0 print:m-0">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Duty Slip & Generated Bill Report</h3>
            <p className="text-xs text-slate-500">Official logbook sheet generated for Agency billing</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Close View
            </button>
          )}
        </div>
      </div>

      {/* PAPER TRIP SHEET CONTAINER (Replicates physical log book image) */}
      <div className="border-2 border-slate-800 rounded-2xl p-4 sm:p-6 bg-amber-50/20 space-y-4 font-sans text-xs sm:text-sm">
        {/* Header Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b-2 border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                RED<span className="text-red-600 ml-1">TRIP</span>
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Luxury Cabs & Outstation Travels • Bangalore
            </p>
            <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold tracking-widest mt-1">
              TRIP SHEET / ಟ್ರಿಪ್ ಶೀಟ್
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-1.5 shadow-xs">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="font-semibold text-slate-500">M/s (Agency):</span>
              <span className="font-bold text-slate-900 text-sm">{ds.agencyName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="font-semibold text-slate-500">Guest Name:</span>
              <span className="font-bold text-red-600">{ds.guestName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="font-semibold text-slate-500">Mob. No:</span>
              <span className="font-bold text-slate-900">{ds.guestMobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Reporting To:</span>
              <span className="font-bold text-slate-800">{ds.reportingTo || ds.agencyName}</span>
            </div>
          </div>
        </div>

        {/* Row 1: Vehicle & Driver Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center bg-white p-2.5 rounded-xl border border-slate-400">
          <div className="border-r border-slate-200 pr-2">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Log Sheet No.</span>
            <span className="font-black text-slate-900">{ds.logSheetNo}</span>
          </div>
          <div className="border-r border-slate-200 pr-2">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Cab Type</span>
            <span className="font-bold text-slate-800">{ds.cabType}</span>
          </div>
          <div className="border-r border-slate-200 pr-2">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Cab No.</span>
            <span className="font-mono font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">{ds.cabNo}</span>
          </div>
          <div className="border-r border-slate-200 pr-2 col-span-2 sm:col-span-1">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Driver & Contact</span>
            <span className="font-bold text-slate-900">{ds.driverName} ({ds.driverPhone})</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Particulars</span>
            <span className="font-bold text-blue-700">{ds.particulars}</span>
          </div>
        </div>

        {/* Row 2: Meter Reading Table (Opening / Closing Kms & Hours) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-800 bg-white">
            <thead>
              <tr className="bg-slate-100 text-slate-800 text-[11px] font-bold uppercase text-center border-b border-slate-800">
                <th className="p-2 border-r border-slate-800">Date</th>
                <th className="p-2 border-r border-slate-800" colSpan={2}>Opening</th>
                <th className="p-2 border-r border-slate-800" colSpan={2}>Ending</th>
                <th className="p-2 border-r border-slate-800" colSpan={2}>TOTAL</th>
                <th className="p-2">Guest Signature</th>
              </tr>
              <tr className="bg-slate-50 text-slate-600 text-[10px] font-bold text-center border-b border-slate-800">
                <th className="p-1 border-r border-slate-800"></th>
                <th className="p-1 border-r border-slate-800">Kms.</th>
                <th className="p-1 border-r border-slate-800">Hrs.</th>
                <th className="p-1 border-r border-slate-800">Kms.</th>
                <th className="p-1 border-r border-slate-800">Hrs.</th>
                <th className="p-1 border-r border-slate-800">Kms.</th>
                <th className="p-1 border-r border-slate-800">Hrs.</th>
                <th className="p-1"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center font-bold text-slate-900">
                <td className="p-2.5 border-r border-slate-800 bg-slate-50">{ds.date}</td>
                <td className="p-2.5 border-r border-slate-800 font-mono">{ds.openingKm}</td>
                <td className="p-2.5 border-r border-slate-800">{ds.openingTime}</td>
                <td className="p-2.5 border-r border-slate-800 font-mono">{ds.closingKm}</td>
                <td className="p-2.5 border-r border-slate-800">{ds.closingTime}</td>
                <td className="p-2.5 border-r border-slate-800 font-mono text-red-600 bg-red-50/50">{ds.totalKm} Kms</td>
                <td className="p-2.5 border-r border-slate-800 text-blue-700 bg-blue-50/50">{ds.totalHours} Hrs</td>
                <td className="p-2.5 italic text-slate-700 font-serif text-base bg-amber-50/30">
                  {ds.guestSignature || 'Apoorva'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Details of Journey Box */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-400 space-y-1">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-500 block">
            Details of Journey:
          </span>
          <div className="font-medium text-slate-800 whitespace-pre-line text-xs leading-relaxed pl-2 border-l-2 border-red-500">
            {ds.detailsOfJourney}
          </div>
        </div>

        {/* Itemized Financial Breakdown Grid (Matches bottom boxes in printed receipt) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <div className="bg-white p-2 rounded-lg border border-slate-300 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Fast Tag</span>
            <span className="font-bold text-slate-900">₹{ds.fastTag}</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-300 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Parking</span>
            <span className="font-bold text-slate-900">₹{ds.parking}</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-300 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Toll / Tax</span>
            <span className="font-bold text-slate-900">₹{ds.tax}</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-300 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Driver Batta</span>
            <span className="font-bold text-slate-900">₹{ds.batta}</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-300 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Advance</span>
            <span className="font-bold text-emerald-700">- ₹{ds.advance}</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-300 text-center">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Base Tariff</span>
            <span className="font-bold text-slate-900">₹{ds.baseFare}</span>
          </div>
          <div className="bg-slate-900 text-white p-2 rounded-lg border border-slate-900 text-center col-span-2 sm:col-span-1 shadow-md">
            <span className="block text-[10px] font-bold text-red-400 uppercase">Total Bill</span>
            <span className="font-black text-base text-yellow-300">₹{netAmount}</span>
          </div>
        </div>

        {/* Bill Summary Statement */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-900 block">
              FINAL BILL REPORT GENERATED FOR AGENCY ({ds.agencyName})
            </span>
            <span className="text-[11px] text-emerald-700">
              Total Calculated Mileage: {ds.totalKm} KM @ ₹{ds.ratePerKm}/km + Tolls/Parking/Batta ({ds.totalHours} Hrs duration)
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Due / Amount to Pay</span>
            <span className="text-xl font-black text-emerald-950">₹{netAmount}</span>
          </div>
        </div>

        {/* Bottom Terms & Conditions Notes */}
        <div className="pt-2 border-t border-slate-300 text-[9.5px] text-slate-500 leading-tight space-y-1">
          <p>
            <strong className="text-slate-700">NOTE:</strong> 1. Users must enter KM & time before releasing the vehicle. 2. Outstation minimum 300 kms per day for all vehicles except Volvo Buses 400 kms otherwise same will be charged. Day means Calendar Day. 3. Timings & KMS are calculated from Garage to Garage. 4. We are not responsible for your luggages. 5. After 10:00 p.m. or before 6:00 a.m. Driver Batta Extra for local & outstation. 6. Parking, Toll & Permit Charges will be paid by customer. 7. GST will be charged as per government rules on gross billing amount. 8. All disputes subject to Bengaluru Jurisdiction. E.&O.E.
          </p>
          <div className="flex justify-between items-center font-bold text-slate-600 text-[10px] pt-1">
            <span>Official Red Trip Digital Duty Logbook</span>
            <span className="italic text-red-600">"Travel the best possible way with us"</span>
          </div>
        </div>
      </div>
    </div>
  );
};
