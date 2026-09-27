import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Calendar, Clock, MapPin, AlertCircle, FileText, Check } from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { WasteCategoryCard, getCategoryIcon } from '../components/WasteCategoryCard';
import { WasteCategory, CreateRequestPayload } from '../types';
import { requestsAPI } from '../services/api';
import { useRequestContext } from '../context/RequestContext';

const CATEGORIES: { category: WasteCategory; description: string }[] = [
  {
    category: 'Plastic',
    description: 'Clean bottles, containers, and household packaging.',
  },
  {
    category: 'Dry Waste',
    description: 'Dry paper, clean cardboard boxes, and paper packaging.',
  },
  {
    category: 'Organic',
    description: 'Fruit & vegetable scraps, coffee grounds, and compostables.',
  },
  {
    category: 'E-Waste',
    description: 'Phones, chargers, cables, laptops, and small consumer electronics.',
  },
  {
    category: 'Hazardous',
    description: 'Batteries, paint cans, cleaning chemicals, and CFL bulbs.',
  },
  {
    category: 'Other',
    description: 'Broken ceramics, textiles, and items not fitting other categories.',
  },
];

const TIME_SLOTS = [
  '08:00 AM – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 PM – 02:00 PM',
  '02:00 PM – 04:00 PM',
  '04:00 PM – 06:00 PM',
];

export const RequestPickupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { saveRequestId } = useRequestContext();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [wasteCategory, setWasteCategory] = useState<WasteCategory | ''>('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState(TIME_SLOTS[0]);
  const [notes, setNotes] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Minimum date is today (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const catQuery = searchParams.get('category');
    if (catQuery && CATEGORIES.some((c) => c.category === catQuery)) {
      setWasteCategory(catQuery as WasteCategory);
    }
  }, [searchParams]);

  // Step 1 Validation & Proceed
  const handleProceedStep1 = () => {
    setErrorMsg(null);
    if (!wasteCategory) {
      setErrorMsg('Please choose a waste category to continue.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 Validation & Proceed
  const handleProceedStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!pickupAddress.trim()) {
      setErrorMsg('Please enter your pickup address.');
      return;
    }
    if (pickupAddress.trim().length < 5) {
      setErrorMsg('Please provide a complete address (at least 5 characters).');
      return;
    }
    if (!pickupDate) {
      setErrorMsg('Please select a pickup date.');
      return;
    }
    if (pickupDate < todayStr) {
      setErrorMsg('Pickup date cannot be in the past. Please select today or a future date.');
      return;
    }
    if (!pickupTime) {
      setErrorMsg('Please choose a preferred pickup time slot.');
      return;
    }

    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 Submission
  const handleConfirmSubmit = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);

    const payload: CreateRequestPayload = {
      waste_category: wasteCategory,
      pickup_address: pickupAddress.trim(),
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      notes: notes.trim() || undefined,
    };

    try {
      const created = await requestsAPI.create(payload);
      saveRequestId(created.request_id);
      navigate('/confirmation', { state: { request: created } });
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit pickup request. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 sm:py-14 bg-[#F7FAF8] min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Wizard Progress Bar */}
        <ProgressBar currentStep={step} />

        {/* Friendly Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </div>
        )}

        {/* STEP 1: CHOOSE WASTE */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-[#E5EAE6] p-6 sm:p-8 shadow-xs">
            <div className="text-center max-w-md mx-auto mb-8">
              <span className="text-xs font-bold tracking-wider text-[#16A34A] uppercase">
                Step 1 of 3
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17211B]">
                What do you want collected?
              </h1>
              <p className="mt-2 text-sm text-[#6B756E]">
                Select the primary waste category for this collection pickup.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map((item) => (
                <WasteCategoryCard
                  key={item.category}
                  category={item.category}
                  description={item.description}
                  isSelected={wasteCategory === item.category}
                  onSelect={(cat) => {
                    setWasteCategory(cat);
                    setErrorMsg(null);
                  }}
                />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5EAE6] flex justify-end">
              <button
                type="button"
                onClick={handleProceedStep1}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PICKUP DETAILS */}
        {step === 2 && (
          <form
            onSubmit={handleProceedStep2}
            className="bg-white rounded-2xl border border-[#E5EAE6] p-6 sm:p-8 shadow-xs"
          >
            <div className="text-center max-w-md mx-auto mb-8">
              <span className="text-xs font-bold tracking-wider text-[#16A34A] uppercase">
                Step 2 of 3
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17211B]">
                Where should we collect it?
              </h1>
              <p className="mt-2 text-sm text-[#6B756E]">
                Enter your pickup location, choose a future date, and pick a time window.
              </p>
            </div>

            <div className="space-y-5">
              {/* Pickup Address */}
              <div>
                <label className="block text-sm font-semibold text-[#17211B] mb-1.5">
                  Pickup Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your pickup address"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EAE6] bg-white text-sm text-[#17211B] placeholder-[#6B756E] focus:border-[#16A34A] focus:outline-none"
                  />
                  <MapPin size={18} className="absolute left-3.5 top-3 text-[#6B756E]" />
                </div>
              </div>

              {/* Grid: Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pickup Date */}
                <div>
                  <label className="block text-sm font-semibold text-[#17211B] mb-1.5">
                    Pickup Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EAE6] bg-white text-sm text-[#17211B] focus:border-[#16A34A] focus:outline-none"
                    />
                    <Calendar size={18} className="absolute left-3.5 top-3 text-[#6B756E]" />
                  </div>
                </div>

                {/* Preferred Pickup Time */}
                <div>
                  <label className="block text-sm font-semibold text-[#17211B] mb-1.5">
                    Preferred Pickup Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EAE6] bg-white text-sm text-[#17211B] focus:border-[#16A34A] focus:outline-none appearance-none"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <Clock size={18} className="absolute left-3.5 top-3 text-[#6B756E]" />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-[#17211B] mb-1.5">
                  Additional Notes <span className="text-xs font-normal text-[#6B756E]">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Anything the collector should know?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAE6] bg-white text-sm text-[#17211B] placeholder-[#6B756E] focus:border-[#16A34A] focus:outline-none"
                />
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="mt-8 pt-6 border-t border-[#E5EAE6] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#6B756E] hover:text-[#17211B] hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: REVIEW & CONFIRM */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-[#E5EAE6] p-6 sm:p-8 shadow-xs">
            <div className="text-center max-w-md mx-auto mb-8">
              <span className="text-xs font-bold tracking-wider text-[#16A34A] uppercase">
                Step 3 of 3
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17211B]">
                Check your pickup details
              </h1>
              <p className="mt-2 text-sm text-[#6B756E]">
                Please review your request information before submitting.
              </p>
            </div>

            <div className="border border-[#E5EAE6] rounded-xl overflow-hidden divide-y divide-[#E5EAE6]">
              {/* Waste type */}
              <div className="p-4 sm:p-5 flex items-start justify-between bg-white">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-[#F7FAF8] rounded-lg border border-[#E5EAE6] text-[#16A34A]">
                    {wasteCategory && getCategoryIcon(wasteCategory as WasteCategory, 20)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#6B756E] uppercase tracking-wider">
                      Waste Type
                    </span>
                    <h4 className="text-base font-bold text-[#17211B] mt-0.5">{wasteCategory}</h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-[#16A34A] hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Pickup location */}
              <div className="p-4 sm:p-5 flex items-start justify-between bg-white">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-[#F7FAF8] rounded-lg border border-[#E5EAE6] text-[#16A34A]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#6B756E] uppercase tracking-wider">
                      Pickup Location
                    </span>
                    <h4 className="text-sm font-semibold text-[#17211B] mt-0.5 leading-snug">
                      {pickupAddress}
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-[#16A34A] hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Date & Time */}
              <div className="p-4 sm:p-5 flex items-start justify-between bg-white">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-[#F7FAF8] rounded-lg border border-[#E5EAE6] text-[#16A34A]">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#6B756E] uppercase tracking-wider">
                      Date & Preferred Window
                    </span>
                    <h4 className="text-sm font-semibold text-[#17211B] mt-0.5">
                      {pickupDate} • {pickupTime}
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-[#16A34A] hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Additional notes */}
              {notes && (
                <div className="p-4 sm:p-5 flex items-start justify-between bg-white">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 bg-[#F7FAF8] rounded-lg border border-[#E5EAE6] text-[#16A34A]">
                      <FileText size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#6B756E] uppercase tracking-wider">
                        Additional Notes
                      </span>
                      <p className="text-sm text-[#17211B] mt-0.5 leading-relaxed">
                        {notes}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-[#16A34A] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Step 3 Actions */}
            <div className="mt-8 pt-6 border-t border-[#E5EAE6] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#6B756E] hover:text-[#17211B] hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                <span>Edit Details</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Check size={16} strokeWidth={3} />
                    <span>Confirm Pickup</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
