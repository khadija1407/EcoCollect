import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, CheckCircle, Clock, Calendar, CheckSquare, Sparkles } from 'lucide-react';
import { getCategoryIcon } from '../components/WasteCategoryCard';
import { WasteCategory } from '../types';

export const HomePage: React.FC = () => {
  const [quickId, setQuickId] = useState('');
  const navigate = useNavigate();

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickId.trim()) {
      navigate(`/track/${encodeURIComponent(quickId.trim())}`);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Choose Waste',
      desc: 'Select what you want collected.',
      icon: CheckSquare,
    },
    {
      num: '02',
      title: 'Schedule Pickup',
      desc: 'Tell us where and when.',
      icon: Calendar,
    },
    {
      num: '03',
      title: 'Track Request',
      desc: 'Follow your collection status.',
      icon: Clock,
    },
    {
      num: '04',
      title: 'Get It Collected',
      desc: 'Your request is completed.',
      icon: CheckCircle,
    },
  ];

  const categories: { name: WasteCategory; example: string }[] = [
    { name: 'Plastic', example: 'Bottles, containers, packaging' },
    { name: 'Dry Waste', example: 'Paper, cardboard, clean boxes' },
    { name: 'Organic', example: 'Food scraps and compostables' },
    { name: 'E-Waste', example: 'Phones, chargers, cables, laptops' },
    { name: 'Hazardous', example: 'Batteries, household chemicals' },
    { name: 'Other', example: 'Items that do not fit standard categories' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-white to-[#F7FAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle civic badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCFCE7] text-[#14532D] text-xs font-medium mb-6 border border-[#BBF7D0]">
            <Sparkles size={14} className="text-[#16A34A]" />
            <span>Modern Civic Waste Collection</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17211B] tracking-tight leading-[1.15]">
            Dispose responsibly. <br className="hidden sm:inline" />
            <span className="text-[#16A34A]">We'll help with the pickup.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#6B756E] max-w-2xl mx-auto leading-relaxed">
            Choose your waste, schedule a convenient pickup, and track your request from one simple platform.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/request"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-all shadow-sm focus:ring-4 focus:ring-[#DCFCE7]"
            >
              <span>Request a Pickup</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/my-requests"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold bg-white text-[#17211B] border border-[#E5EAE6] hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs"
            >
              <span>Track My Pickup</span>
            </Link>
          </div>

          {/* Quick Tracking input bar */}
          <div className="mt-12 max-w-md mx-auto">
            <form onSubmit={handleQuickTrack} className="relative flex items-center">
              <input
                type="text"
                placeholder="Have a request ID? (e.g. EC-2026-00482)"
                value={quickId}
                onChange={(e) => setQuickId(e.target.value)}
                className="w-full pl-11 pr-28 py-3 rounded-xl border border-[#E5EAE6] bg-white text-sm text-[#17211B] placeholder-[#6B756E] shadow-xs focus:border-[#16A34A] focus:outline-none"
              />
              <Search size={18} className="absolute left-3.5 text-[#6B756E]" />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-2 rounded-lg bg-[#14532D] text-white text-xs font-semibold hover:bg-[#16A34A] transition-colors"
              >
                Track
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-white border-y border-[#E5EAE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs uppercase font-bold tracking-widest text-[#16A34A]">
              Simple Process
            </h2>
            <h3 className="mt-2 text-3xl font-bold text-[#17211B]">
              How it works
            </h3>
            <p className="mt-2 text-sm text-[#6B756E]">
              Schedule your waste collection in four straightforward steps.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative p-6 rounded-2xl border border-[#E5EAE6] bg-[#F7FAF8] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-[#16A34A]/80 font-mono">
                        {step.num}
                      </span>
                      <div className="p-2 bg-white rounded-lg border border-[#E5EAE6] text-[#14532D]">
                        <StepIcon size={20} />
                      </div>
                    </div>
                    <h4 className="mt-5 text-lg font-semibold text-[#17211B]">
                      {step.title}
                    </h4>
                    <p className="mt-1 text-sm text-[#6B756E] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Waste Categories Compact Section */}
      <section className="py-16 sm:py-24 bg-[#F7FAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs uppercase font-bold tracking-widest text-[#16A34A]">
                Categories
              </h2>
              <h3 className="mt-2 text-3xl font-bold text-[#17211B]">
                Supported waste types
              </h3>
              <p className="mt-1 text-sm text-[#6B756E]">
                We ensure every category is routed to certified disposal and recycling centers.
              </p>
            </div>
            <Link
              to="/waste-guide"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#16A34A] hover:text-[#14532D] transition-colors"
            >
              <span>Explore full Waste Guide</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="p-5 rounded-xl border border-[#E5EAE6] bg-white hover:border-[#16A34A]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#F7FAF8] border border-[#E5EAE6]">
                    {getCategoryIcon(cat.name, 22)}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#17211B]">{cat.name}</h4>
                    <p className="text-xs text-[#6B756E] mt-0.5">{cat.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-[#14532D] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">Ready to clear your waste responsibly?</h3>
              <p className="mt-1 text-sm text-green-100 max-w-xl">
                Takes less than two minutes. No account required to submit your pickup.
              </p>
            </div>
            <Link
              to="/request"
              className="shrink-0 px-6 py-3 rounded-xl bg-white text-[#14532D] text-sm font-semibold hover:bg-gray-100 transition-colors shadow-xs"
            >
              Request a Pickup Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
