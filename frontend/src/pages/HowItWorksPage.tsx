import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const detailedSteps = [
    {
      num: '01',
      title: 'Choose Waste',
      short: 'Select what you want collected.',
      detail:
        'Identify which category your waste falls under: Plastic, Dry Waste, Organic, E-Waste, Hazardous, or Other. If you are unsure, check our comprehensive Waste Guide for examples and preparation tips.',
      icon: CheckSquare,
    },
    {
      num: '02',
      title: 'Schedule Pickup',
      short: 'Tell us where and when.',
      detail:
        'Provide your collection address and select an upcoming date and convenient two-hour pickup window. You can also add special access instructions or gate codes for the collector.',
      icon: Calendar,
    },
    {
      num: '03',
      title: 'Track Request',
      short: 'Follow your collection status.',
      detail:
        'Immediately receive a unique reference code (like EC-2026-00482). Use it anytime on our tracking page to view real-time updates as our collection dispatch confirms and schedules your route.',
      icon: Clock,
    },
    {
      num: '04',
      title: 'Get It Collected',
      short: 'Your request is completed.',
      detail:
        'Place your packaged waste at the designated spot before your pickup window. Our team collects the items and transports them directly to certified recycling or treatment facilities.',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="py-12 sm:py-16 bg-[#F7FAF8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-[#16A34A] uppercase">
            Step-by-Step Guide
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#17211B] tracking-tight">
            How EcoCollect Works
          </h1>
          <p className="mt-3 text-base text-[#6B756E] leading-relaxed">
            We bridge the gap between residents and municipal or private collection services, ensuring waste is handled safely, promptly, and responsibly.
          </p>
        </div>

        {/* Steps List */}
        <div className="mt-12 space-y-8">
          {detailedSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col sm:flex-row items-start gap-6"
              >
                <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#14532D] font-mono text-xl font-bold">
                  {step.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <Icon size={20} className="text-[#16A34A]" />
                    <h3 className="text-xl font-bold text-[#17211B]">{step.title}</h3>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#16A34A]">{step.short}</p>
                  <p className="mt-3 text-sm text-[#6B756E] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pickup Day Guidelines */}
        <div className="mt-14 p-8 rounded-2xl bg-white border border-[#E5EAE6]">
          <h3 className="text-lg font-bold text-[#17211B]">What to Expect on Pickup Day</h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-[#6B756E]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#17211B]">
                <ShieldCheck size={18} className="text-[#16A34A]" />
                <span>Proper Packaging</span>
              </div>
              <p>Keep items bagged or boxed appropriately. Never mix food scraps with electronics or hazardous items.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#17211B]">
                <Truck size={18} className="text-[#16A34A]" />
                <span>Accessible Placement</span>
              </div>
              <p>Set items outside your door, lobby, or curbside at least 15 minutes before the scheduled time slot.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#17211B]">
                <Leaf size={18} className="text-[#16A34A]" />
                <span>Certified Recycling</span>
              </div>
              <p>Items collected are logged and routed directly to authorized recycling and eco-disposal partners.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/request"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors shadow-sm"
          >
            <span>Request a Pickup</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
