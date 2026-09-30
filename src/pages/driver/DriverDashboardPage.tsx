import React, { useEffect, useState } from 'react';
import { useBookingContext } from '../../context/BookingContext';
import { agencyDriverService } from '../../services/agencyDriverService';
import type { AgencyBooking, DutySlipData } from '../../types';
import { DutySlipDocument } from '../../components/duty/DutySlipDocument';
import { Car, Phone, MapPin, Plane, FileSpreadsheet, Eye, MessageSquare, Send, KeyRound, CheckCircle } from 'lucide-react';

export const DriverDashboardPage: React.FC = () => {
  const { user, addToast } = useBookingContext();
  const [bookings, setBookings] = useState<AgencyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDutyForFill, setSelectedDutyForFill] = useState<AgencyBooking | null>(null);
  const [selectedDutyForView, setSelectedDutyForView] = useState<AgencyBooking | null>(null);

  // OTP Verification state
  const [otpInputs, setOtpInputs] = useState<{ [pickupId: string]: string }>({});
  const [verifyingPickupId, setVerifyingPickupId] = useState<string | null>(null);

  // Duty Form state
  const [dutyFormData, setDutyFormData] = useState<DutySlipData>({
    logSheetNo: 'LS-74520',
    agencyName: 'M/S Apoorva',
    guestName: 'Ms. Agey George',
    guestMobile: '9871418158',
    reportingTo: 'M/S Apoorva',
    cabType: 'Innova Crysta',
    cabNo: 'KA 05 AM 2969',
    driverName: 'Vikas U',
    driverPhone: '+91 98123 45678',
    particulars: 'Local',
    date: '14/06/2026',
    openingKm: 149103,
    openingTime: '06:00 AM',
    closingKm: 149228,
    closingTime: '07:00 PM',
    totalKm: 125,
    totalHours: 13,
    detailsOfJourney: 'Bangalore Airport -> Thanisandra Main Road -> SAIACS CEO Centre Kyalasanahalli',
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
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await agencyDriverService.getAgencyBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyOtp = async (bookingId: string, pickupId: string) => {
    const enteredOtp = otpInputs[pickupId];
    if (!enteredOtp || enteredOtp.trim().length !== 4) {
      addToast('Please enter a 4-digit OTP provided by the passenger', 'error');
      return;
    }

    setVerifyingPickupId(pickupId);
    try {
      const res = await agencyDriverService.verifyPickupOtp(bookingId, pickupId, enteredOtp);
      if (res.success) {
        addToast(res.message, 'success');
        loadData();
      } else {
        addToast(res.message, 'error');
      }
    } catch (err) {
      addToast('Failed to verify OTP', 'error');
    } finally {
      setVerifyingPickupId(null);
    }
  };

  const openFillModal = (b: AgencyBooking) => {
    setSelectedDutyForFill(b);
    const existing = b.dutySlip;
    setDutyFormData({
      logSheetNo: existing?.logSheetNo || `LS-${b.id.replace('AG-', '')}`,
      agencyName: b.agencyName || 'M/S Apoorva',
      guestName: b.travelerName,
      guestMobile: b.travelerPhone,
      reportingTo: b.agencyName,
      cabType: b.vehicleTypeRequested,
      cabNo: b.assignedCabNo || 'KA 05 AM 2969',
      driverName: user.name || 'Vikas U',
      driverPhone: user.phone || '+91 98123 45678',
      particulars: existing?.particulars || 'Local',
      date: existing?.date || b.travelDate,
      openingKm: existing?.openingKm || 149103,
      openingTime: existing?.openingTime || '06:00 AM',
      closingKm: existing?.closingKm || 149228,
      closingTime: existing?.closingTime || '07:00 PM',
      totalKm: existing?.totalKm || 125,
      totalHours: existing?.totalHours || 13,
      detailsOfJourney: existing?.detailsOfJourney || `Pickups: ${b.pickupPoints?.map(p => p.passengerName + ' (' + p.location + ')').join(' -> ')} \nDrop: ${b.dropLocation}`,
      fastTag: existing?.fastTag || 350,
      parking: existing?.parking || 200,
      tax: existing?.tax || 150,
      batta: existing?.batta || 500,
      advance: existing?.advance || 1000,
      others: existing?.others || 0,
      ratePerKm: existing?.ratePerKm || 18,
      baseFare: existing?.baseFare || 2250,
      totalAmount: existing?.totalAmount || 3450,
      guestSignature: existing?.guestSignature || 'Apoorva',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleKmChange = (openingKm: number, closingKm: number) => {
    const totalKm = Math.max(0, closingKm - openingKm);
    const baseFare = totalKm * dutyFormData.ratePerKm;
    const totalAmount = baseFare + dutyFormData.fastTag + dutyFormData.parking + dutyFormData.tax + dutyFormData.batta + dutyFormData.others;
    setDutyFormData((prev) => ({
      ...prev,
      openingKm,
      closingKm,
      totalKm,
      baseFare,
      totalAmount,
    }));
  };

  const handleCompleteJourney = async (b: AgencyBooking) => {
    try {
      const updated = await agencyDriverService.completeTripAndGenerateBill(b.id);
      addToast('Journey completed! Bill Report generated for both Agency and Driver.', 'success');
      setSelectedDutyForView(updated);
      loadData();
    } catch (err) {
      addToast('Failed to complete journey', 'error');
    }
  };

  const handleSaveDutySlip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDutyForFill) return;
    try {
      await agencyDriverService.saveDutySlip(selectedDutyForFill.id, dutyFormData);
      addToast('Duty Slip updated and Bill Report generated for Agency!', 'success');
      setSelectedDutyForFill(null);
      loadData();
    } catch (err) {
      addToast('Error saving duty slip', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Driver Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Driver Duty Portal</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name || 'Vikas U'}</h1>
              <p className="text-xs font-mono font-bold text-slate-300 mt-0.5">
                Assigned Cab: <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">{user.driverCabNo || 'KA 05 AM 2969'}</span> (Toyota Innova Crysta)
              </p>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700 text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Duties</span>
            <span className="text-xl font-black text-amber-400">{bookings.length} Assigned</span>
          </div>
        </div>
      </div>

      {/* Assigned Duties List */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900">Your Assigned Trips & Passenger OTP Verification</h2>
          <p className="text-xs text-slate-500">
            Verify passenger OTPs at each pickup stop and fill out the Duty Slip Logbook once completed.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500 font-semibold border border-slate-200">
            Loading assigned driver duties...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 font-semibold">No assigned duties found at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => {
              const pickups = booking.pickupPoints || [];

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden p-6 space-y-6"
                >
                  {/* Header Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-white bg-slate-900 px-3 py-1 rounded-xl">
                        {booking.id}
                      </span>
                      <span className="text-xs font-bold text-slate-600">Reporting To: {booking.agencyName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                          booking.dutySlip ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {booking.dutySlip ? '✓ Duty Slip & Bill Generated' : 'Pending Logbook Fill'}
                      </span>

                      {!booking.dutySlip ? (
                        <button
                          onClick={() => handleCompleteJourney(booking)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                        >
                          <CheckCircle className="w-4 h-4" /> Complete Pickups & Generate Bill
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedDutyForView(booking)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                        >
                          <Eye className="w-4 h-4" /> View Driver & Agency Bill Report
                        </button>
                      )}

                      <button
                        onClick={() => openFillModal(booking)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        {booking.dutySlip ? 'Edit Duty Slip' : 'Fill Custom Logbook'}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Pickup Points & OTP Entry Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-600" /> Sequential Pickup Stops & Customer OTP Verification ({pickups.length} Stops)
                      </h3>
                      <span className="text-xs font-semibold text-slate-500">
                        Travel Date: <strong>{booking.travelDate}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pickups.map((pt) => (
                        <div
                          key={pt.id}
                          className={`p-5 rounded-2xl border-2 transition-all space-y-4 ${
                            pt.status === 'PickedUp'
                              ? 'bg-emerald-50/60 border-emerald-400'
                              : 'bg-amber-50/60 border-amber-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-300">
                              📍 STOP #{pt.orderNumber}
                            </span>

                            {pt.status === 'PickedUp' ? (
                              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-emerald-600" /> Picked Up ({pt.pickedUpAt})
                              </span>
                            ) : (
                              <span className="text-xs font-extrabold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-lg">
                                ⏳ Pending OTP Entry
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-lg font-black text-slate-900">{pt.passengerName}</h4>
                            <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-slate-500" /> {pt.passengerPhone}
                            </p>
                            <p className="text-xs text-slate-800 font-medium bg-white p-2.5 rounded-xl border border-slate-200 mt-1">
                              {pt.location}
                            </p>
                            {pt.flightNo && (
                              <p className="text-xs text-blue-700 font-bold flex items-center gap-1 pt-1">
                                <Plane className="w-3.5 h-3.5" /> Flight: {pt.flightNo} (Scheduled: {pt.pickupTime})
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <a
                              href={`tel:${pt.passengerPhone}`}
                              className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                            >
                              <Phone className="w-3.5 h-3.5" /> Call Passenger
                            </a>
                            <a
                              href={`https://wa.me/91${pt.passengerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                            </a>
                          </div>

                          {/* OTP Input Form for Driver */}
                          {pt.status !== 'PickedUp' && (
                            <div className="pt-3 border-t border-amber-200 space-y-2">
                              <label className="block text-[11px] font-black text-amber-900 uppercase">
                                Ask Passenger for 4-Digit Pickup OTP:
                              </label>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <KeyRound className="w-4 h-4 text-amber-600 absolute left-3 top-2.5" />
                                  <input
                                    type="text"
                                    maxLength={4}
                                    placeholder="e.g. 1942"
                                    value={otpInputs[pt.id] || ''}
                                    onChange={(e) => setOtpInputs({ ...otpInputs, [pt.id]: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-amber-300 rounded-xl font-mono font-black text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  />
                                </div>
                                <button
                                  type="button"
                                  disabled={verifyingPickupId === pt.id}
                                  onClick={() => handleVerifyOtp(booking.id, pt.id)}
                                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 shrink-0"
                                >
                                  {verifyingPickupId === pt.id ? 'Verifying...' : 'Verify OTP & Pickup'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Final Drop Location */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500 uppercase flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-red-600" /> Final Drop Location:
                      </span>
                      <span className="font-extrabold text-slate-900">{booking.dropLocation}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DRIVER DUTY SLIP FILL MODAL */}
      {selectedDutyForFill && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Duty Slip Log Sheet Form (Logbook #{dutyFormData.logSheetNo})
                </h3>
                <p className="text-xs text-slate-500">
                  Fill opening/ending meter readings, toll/parking charges, and guest signature to generate bill
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDutyForFill(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveDutySlip} className="space-y-6">
              {/* Top Meta Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Log Sheet No</label>
                  <input
                    type="text"
                    required
                    value={dutyFormData.logSheetNo}
                    onChange={(e) => setDutyFormData({ ...dutyFormData, logSheetNo: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Cab Type</label>
                  <input
                    type="text"
                    required
                    value={dutyFormData.cabType}
                    onChange={(e) => setDutyFormData({ ...dutyFormData, cabType: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Cab No</label>
                  <input
                    type="text"
                    required
                    value={dutyFormData.cabNo}
                    onChange={(e) => setDutyFormData({ ...dutyFormData, cabNo: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono font-bold text-xs text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Particulars</label>
                  <select
                    value={dutyFormData.particulars}
                    onChange={(e) => setDutyFormData({ ...dutyFormData, particulars: e.target.value as any })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-xs"
                  >
                    <option value="Local">Local</option>
                    <option value="Out Station">Out Station</option>
                  </select>
                </div>
              </div>

              {/* Meter Readings Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Meter Opening & Ending Readings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                  {/* Opening */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-900 block">OPENING DETAILS</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Opening Kms *</label>
                        <input
                          type="number"
                          required
                          value={dutyFormData.openingKm}
                          onChange={(e) => handleKmChange(Number(e.target.value), dutyFormData.closingKm)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Opening Time *</label>
                        <input
                          type="text"
                          required
                          value={dutyFormData.openingTime}
                          onChange={(e) => setDutyFormData({ ...dutyFormData, openingTime: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ending */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-900 block">ENDING DETAILS</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Ending Kms *</label>
                        <input
                          type="number"
                          required
                          value={dutyFormData.closingKm}
                          onChange={(e) => handleKmChange(dutyFormData.openingKm, Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Ending Time *</label>
                        <input
                          type="text"
                          required
                          value={dutyFormData.closingTime}
                          onChange={(e) => setDutyFormData({ ...dutyFormData, closingTime: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-around bg-slate-900 text-white p-3 rounded-xl font-bold text-xs">
                  <span>Total Kms: <strong className="text-yellow-300">{dutyFormData.totalKm} Kms</strong></span>
                  <span>Total Duration: <strong className="text-blue-300">{dutyFormData.totalHours} Hours</strong></span>
                  <span>Rate: <strong>₹{dutyFormData.ratePerKm}/Km</strong></span>
                </div>
              </div>

              {/* Expenses Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Charges & Expense Breakdown (Tolls, Parking, Batta)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Fast Tag (₹)</label>
                    <input
                      type="number"
                      value={dutyFormData.fastTag}
                      onChange={(e) => setDutyFormData({ ...dutyFormData, fastTag: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Parking (₹)</label>
                    <input
                      type="number"
                      value={dutyFormData.parking}
                      onChange={(e) => setDutyFormData({ ...dutyFormData, parking: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Toll / Tax (₹)</label>
                    <input
                      type="number"
                      value={dutyFormData.tax}
                      onChange={(e) => setDutyFormData({ ...dutyFormData, tax: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Driver Batta (₹)</label>
                    <input
                      type="number"
                      value={dutyFormData.batta}
                      onChange={(e) => setDutyFormData({ ...dutyFormData, batta: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Advance Paid (₹)</label>
                    <input
                      type="number"
                      value={dutyFormData.advance}
                      onChange={(e) => setDutyFormData({ ...dutyFormData, advance: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Journey Notes & Signature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Details of Journey Notes
                  </label>
                  <textarea
                    rows={3}
                    value={dutyFormData.detailsOfJourney}
                    onChange={(e) => setDutyFormData({ ...dutyFormData, detailsOfJourney: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Guest Signature Name
                  </label>
                  <input
                    type="text"
                    value={dutyFormData.guestSignature}
                    onChange={(e) => setDutyFormData({ ...dutyFormData, guestSignature: e.target.value })}
                    className="w-full px-3 py-2 bg-amber-50/50 border border-amber-300 rounded-xl text-base font-serif italic text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400 italic">Signature string rendered on printed duty sheet</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedDutyForFill(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Save Duty Slip & Generate Bill Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DUTY SLIP DOCUMENT MODAL */}
      {selectedDutyForView && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8">
            <DutySlipDocument
              booking={selectedDutyForView}
              onClose={() => setSelectedDutyForView(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
