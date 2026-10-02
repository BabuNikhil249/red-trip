import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Driver } from '../../types';

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Omit<Driver, 'id'>) => void;
  initialDriver?: Driver | null;
}

export const DriverModal: React.FC<DriverModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDriver,
}) => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [experienceYears, setExperienceYears] = useState(8);
  const [rating, setRating] = useState(4.9);
  const [completedTrips, setCompletedTrips] = useState(1200);
  const [languagesInput, setLanguagesInput] = useState('Kannada, English, Hindi');
  const [hourlyRate, setHourlyRate] = useState(250);
  const [dailyRate, setDailyRate] = useState(1500);
  const [phone, setPhone] = useState('+91 98765 00000');
  const [bio, setBio] = useState('Verified master driver with highway and mountain route expertise.');

  useEffect(() => {
    if (initialDriver) {
      setName(initialDriver.name);
      setPhoto(initialDriver.photo);
      setExperienceYears(initialDriver.experienceYears);
      setRating(initialDriver.rating);
      setCompletedTrips(initialDriver.completedTrips);
      setLanguagesInput(initialDriver.languages.join(', '));
      setHourlyRate(initialDriver.hourlyRate);
      setDailyRate(initialDriver.dailyRate);
      setPhone(initialDriver.phone);
      setBio(initialDriver.bio);
    } else {
      setName('');
      setPhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');
      setExperienceYears(8);
      setRating(4.9);
      setCompletedTrips(1200);
      setLanguagesInput('Kannada, English, Hindi');
      setHourlyRate(250);
      setDailyRate(1500);
      setPhone('+91 98765 00000');
      setBio('Verified master driver with highway and mountain route expertise.');
    }
  }, [initialDriver, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const languages = languagesInput.split(',').map((s) => s.trim()).filter(Boolean);
    onSave({
      name,
      photo: photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      experienceYears,
      rating,
      reviewsCount: initialDriver ? initialDriver.reviewsCount : 50,
      completedTrips,
      languages,
      hourlyRate,
      dailyRate,
      available: true,
      onlineStatus: initialDriver ? initialDriver.onlineStatus : 'ONLINE',
      workStatus: initialDriver ? initialDriver.workStatus : 'AVAILABLE',
      phone,
      bio,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialDriver ? 'Edit Driver Profile' : 'Add New Driver'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Driver Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Gowda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
            <input
              type="number"
              min={1}
              value={experienceYears}
              onChange={(e) => setExperienceYears(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Rating (Out of 5.0)</label>
            <input
              type="number"
              step="0.01"
              min={3}
              max={5}
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Hourly Rate (₹)</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Daily Rate (₹)</label>
            <input
              type="number"
              value={dailyRate}
              onChange={(e) => setDailyRate(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Photo URL</label>
            <input
              type="url"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Languages Spoken (Comma separated)</label>
            <input
              type="text"
              value={languagesInput}
              onChange={(e) => setLanguagesInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Driver Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20"
          >
            Save Driver
          </button>
        </div>
      </form>
    </Modal>
  );
};
