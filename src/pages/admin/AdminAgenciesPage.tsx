import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { adminService } from '../../services/adminService';
import { useBookingContext } from '../../context/BookingContext';
import type { TravelAgency } from '../../types';
import { Building2, Plus, Search, Phone, Mail, MapPin, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export const AdminAgenciesPage: React.FC = () => {
  const { addToast } = useBookingContext();
  const [agencies, setAgencies] = useState<TravelAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState<TravelAgency | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    agencyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    gstin: '',
    address: '',
    commissionRate: 10,
    status: 'Active' as 'Active' | 'Inactive',
  });

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllAgencies();
      setAgencies(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load travel agencies', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleOpenAddModal = () => {
    setEditingAgency(null);
    setFormData({
      agencyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      gstin: '',
      address: '',
      commissionRate: 10,
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (agency: TravelAgency) => {
    setEditingAgency(agency);
    setFormData({
      agencyName: agency.agencyName,
      contactPerson: agency.contactPerson,
      phone: agency.phone,
      email: agency.email,
      gstin: agency.gstin || '',
      address: agency.address,
      commissionRate: agency.commissionRate,
      status: agency.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAgency) {
        await adminService.updateAgency(editingAgency.id, formData);
        addToast(`Travel Agency "${formData.agencyName}" updated!`, 'success');
      } else {
        await adminService.addAgency(formData);
        addToast(`New Travel Agency "${formData.agencyName}" registered successfully!`, 'success');
      }
      setShowModal(false);
      fetchAgencies();
    } catch (err) {
      addToast('Error saving travel agency', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete agency "${name}"?`)) return;
    try {
      await adminService.deleteAgency(id);
      addToast(`Agency "${name}" deleted.`, 'info');
      fetchAgencies();
    } catch (err) {
      addToast('Failed to delete agency', 'error');
    }
  };

  const filteredAgencies = agencies.filter(
    (a) =>
      a.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <AdminSidebar />

        <main className="flex-1 space-y-6">
          {/* Top Banner Header */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-red-500 uppercase tracking-widest mb-1">
                <Building2 className="w-4 h-4" /> Travel Agency Management
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">Registered Travel Agencies</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Manage B2B travel partners, agency contacts, commission rates, and GST credentials.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-red-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add New Travel Agency
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Agencies</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{agencies.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Partners</span>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">
                {agencies.filter((a) => a.status === 'Active').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Commission</span>
              <p className="text-2xl font-black text-blue-600 mt-0.5">10%</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Billed Volume</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">₹1,00,100</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4" />
            <input
              type="text"
              placeholder="Search agency by name, contact person, phone or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500 shadow-xs"
            />
          </div>

          {/* Agencies Table */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500 font-semibold border border-slate-200">
              Loading travel agencies...
            </div>
          ) : filteredAgencies.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <p className="text-slate-500 font-semibold">No travel agencies found matching search.</p>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs"
              >
                Add Travel Agency
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-4 px-6">Agency Details</th>
                      <th className="py-4 px-6">Contact Person</th>
                      <th className="py-4 px-6">Location Address</th>
                      <th className="py-4 px-6 text-center">Commission</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredAgencies.map((agency) => (
                      <tr key={agency.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black shrink-0 mt-0.5">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900">{agency.agencyName}</p>
                              <span className="text-xs font-mono text-slate-400">
                                ID: {agency.id} {agency.gstin && `• GST: ${agency.gstin}`}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 space-y-0.5">
                          <p className="font-bold text-slate-800">{agency.contactPerson}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                            <Phone className="w-3 h-3 text-slate-400" /> {agency.phone}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                            <Mail className="w-3 h-3 text-slate-400" /> {agency.email}
                          </p>
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-600 font-medium max-w-xs">
                          <span className="flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            {agency.address}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center font-bold text-slate-900">
                          {agency.commissionRate}%
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                              agency.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {agency.status === 'Active' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {agency.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(agency)}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Agency"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(agency.id, agency.agencyName)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Agency"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ADD / EDIT AGENCY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingAgency ? 'Edit Travel Agency Details' : 'Register New Travel Agency'}
                </h3>
                <p className="text-xs text-slate-500">Enter B2B travel partner contact, address, & GST details</p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Travel Agency Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M/S Apoorva / Shree Travels"
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ms. Agey George"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9871418158"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="apoorva.travels@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    GSTIN / Registration No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 29AAAAA1234A1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Office Address *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. No. 56, Matrukrupa, Indiranagar, Bengaluru, Karnataka 560038"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Active">Active Partner</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-red-600/20 active:scale-95"
                >
                  {editingAgency ? 'Save Changes' : 'Register Travel Agency'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
