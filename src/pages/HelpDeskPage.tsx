import React, { useState } from 'react';
import { useBookingContext } from '../context/BookingContext';
import {
  PhoneCall,
  Mail,
  MapPin,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  Send,
  LifeBuoy,
} from 'lucide-react';

export const HelpDeskPage: React.FC = () => {
  const { addToast } = useBookingContext();

  const [ticketCategory, setTicketCategory] = useState('Booking Change / Cancellation');
  const [bookingId, setBookingId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `HD-${Math.floor(100000 + Math.random() * 900000)}`;
      addToast(`Support ticket ${ticketId} created successfully! Our Help Desk will contact you within 15 minutes.`, 'success');
      setIsSubmitting(false);
      setMessage('');
      setBookingId('');
    }, 800);
  };

  const faqs = [
    {
      question: 'How do I cancel or modify an existing booking?',
      answer:
        'You can modify or cancel your booking directly from the "My Bookings" page or Customer Dashboard. Alternatively, contact our 24/7 Help Desk helpline at +91 (800) RED-TRIP with your Booking ID for instant assistance. Free cancellation is available up to 6 to 24 hours prior to departure depending on the package type.',
    },
    {
      question: 'What documents are required for Self-Drive vehicle rentals?',
      answer:
        'For Self-Drive car rentals, you must present a valid Original Driving License (DL) with at least 1 year of driving experience, along with a Government Photo ID (Aadhaar or Passport). A fully refundable security deposit of ₹3,000 to ₹15,000 (depending on vehicle class) is held at pickup.',
    },
    {
      question: 'Are fuel, tolls, and driver allowances included in rental prices?',
      answer:
        'For Vehicle + Driver rentals and intercity Trip Packages, driver allowance, tolls, and state taxes are itemized or fully included as highlighted in the package details. For Self-Drive rentals, fuel is provided on a same-level handover basis and tolls are paid directly by the user.',
    },
    {
      question: 'What happens if a vehicle experiences a breakdown or emergency during travel?',
      answer:
        'RED TRIP provides 24/7 nationwide roadside assistance. Call our dedicated Emergency Hotline at +91 98765 43210 immediately. We will dispatch a backup vehicle or local mechanic support team within 30–45 minutes.',
    },
    {
      question: 'How long does refund processing take after trip cancellation?',
      answer:
        'Approved refunds are processed automatically back to your original payment method within 3 to 5 business days. An instant credit note option is also available for immediate reuse on future bookings.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden border border-slate-200/90">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80')` }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black uppercase tracking-widest border border-red-200 shadow-xs">
            <LifeBuoy className="w-3.5 h-3.5 text-red-600" /> 24/7 Customer Support Desk
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How Can We <span className="text-red-600">Help You</span> Today?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Need help with a trip package, chauffeur assignment, self-drive rental, or emergency roadside support? Our dedicated travel desk team is available 24/7 across Karnataka and India.
          </p>
        </div>
      </div>

      {/* Emergency Contact Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PhoneCall className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-2.5 py-0.5 rounded-md">
            24/7 Toll-Free Helpline
          </span>
          <h3 className="text-xl font-black text-slate-900">+91 (800) RED-TRIP</h3>
          <p className="text-xs text-slate-500 font-semibold">
            Direct 24/7 phone hotline for instant booking changes, emergency support, and travel inquiries.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
            WhatsApp Travel Desk
          </span>
          <h3 className="text-xl font-black text-slate-900">+91 98765 43210</h3>
          <p className="text-xs text-slate-500 font-semibold">
            Chat instantly on WhatsApp for live location updates, driver photos, and ticket confirmations.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
            Email Support SLA
          </span>
          <h3 className="text-xl font-black text-slate-900">support@redtrip.in</h3>
          <p className="text-xs text-slate-500 font-semibold">
            Guaranteed response within 15 minutes for corporate inquiries, refunds, and ticket issues.
          </p>
        </div>
      </div>

      {/* Main Grid: Ticket Form & Office Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Submit Support Ticket Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
              Submit Support Ticket
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">Help Desk Inquiry & Support Form</h2>
            <p className="text-xs text-slate-500 font-medium">
              Fill out the form below and our Help Desk supervisor will get back to you immediately.
            </p>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Inquiry Category *
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Booking Change / Cancellation">Booking Change / Cancellation</option>
                  <option value="Vehicle Mechanical Breakdown">Emergency Roadside Assistance</option>
                  <option value="Chauffeur & Driver Query">Chauffeur / Driver Issue</option>
                  <option value="Payment & Refund Status">Payment & Refund Status</option>
                  <option value="Trip Package Customization">Trip Package Customization</option>
                  <option value="General Inquiry">General Feedback / Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Booking Reference ID (Optional)
                </label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="e.g. RT-884210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message / Detailed Inquiry *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide details about your query, date of travel, or issue..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Submitting Ticket...' : 'Submit Help Desk Ticket'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Karnataka & All India Regional Offices */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl border border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Regional Office Locations</h3>
                <span className="text-xs text-slate-400 font-semibold">Karnataka & All Over India</span>
              </div>
            </div>

            <div className="space-y-5 text-xs text-slate-300">
              {/* HQ */}
              <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-[10px] font-black uppercase text-red-400 tracking-wider block">
                  Bangalore Headquarters
                </span>
                <h4 className="font-bold text-white text-sm">RED TRIP Towers, Indiranagar</h4>
                <p>#482, 100ft Road, Stage 2, Indiranagar, Bangalore, KA 560038</p>
                <span className="text-slate-400 block pt-1">Phone: +91 (80) 4123-9900</span>
              </div>

              {/* Mysore */}
              <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                  Mysore Regional Office
                </span>
                <h4 className="font-bold text-white text-sm">Palace Zone Business Center</h4>
                <p>Opp. Suburb KSRTC Bus Stand, B.N. Road, Mysore, KA 570001</p>
                <span className="text-slate-400 block pt-1">Phone: +91 (821) 244-8822</span>
              </div>

              {/* Coastal Hub */}
              <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                  Mangalore Coastal Desk
                </span>
                <h4 className="font-bold text-white text-sm">KSRTC Bejai Complex</h4>
                <p>Ground Floor, Bejai Main Road, Mangalore, KA 575004</p>
              </div>

              {/* Delhi Office */}
              <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">
                  North India National Hub
                </span>
                <h4 className="font-bold text-white text-sm">Connaught Place Executive Suites</h4>
                <p>Outer Circle, Connaught Place, New Delhi - 110001</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Help Desk Knowledge Base</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm sm:text-base flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-red-600 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
