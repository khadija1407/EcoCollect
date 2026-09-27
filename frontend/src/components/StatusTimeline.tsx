import React from 'react';
import { Check, Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { PickupStatus } from '../types';

interface StatusTimelineProps {
  status: PickupStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  status,
}) => {
  const steps = [
    {
      key: 'Pending',
      label: 'Request received',
      desc: 'Your pickup request has been recorded in our system.',
      icon: Clock,
    },
    {
      key: 'Confirmed',
      label: 'Pickup confirmed',
      desc: 'Our collection team has verified and accepted the request.',
      icon: Check,
    },
    {
      key: 'Scheduled',
      label: 'Pickup scheduled',
      desc: 'A collection vehicle and crew have been assigned to your route.',
      icon: Calendar,
    },
    {
      key: 'Collected',
      label: 'Waste collected',
      desc: 'Your waste has been successfully picked up and routed for disposal/recycling.',
      icon: CheckCircle2,
    },
  ];

  if (status === 'Cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 my-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-full mt-0.5">
            <XCircle size={22} />
          </div>
          <div>
            <h4 className="font-semibold text-red-900 text-base">Request Cancelled</h4>
            <p className="text-sm text-red-700 mt-1 leading-relaxed">
              This waste collection request has been cancelled. If you still need waste picked up, please submit a new request.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const order = ['Pending', 'Confirmed', 'Scheduled', 'Collected'];
  const currentIndex = order.indexOf(status);

  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 my-6">
      {/* Vertical linking line */}
      <div className="absolute top-4 bottom-4 left-3 sm:left-4 w-0.5 bg-[#E5EAE6] -translate-x-1/2 z-0" />

      {steps.map((step, idx) => {
        const isPassed = currentIndex > idx;
        const isCurrent = currentIndex === idx;

        return (
          <div key={step.key} className="relative z-10 flex items-start gap-4">
            {/* Step circle indicator */}
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                isPassed
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : isCurrent
                  ? 'bg-white border-2 border-[#16A34A] text-[#16A34A] ring-4 ring-[#DCFCE7]'
                  : 'bg-white border-2 border-[#E5EAE6] text-[#A3AFA6]'
              }`}
            >
              {isPassed ? (
                <Check size={14} strokeWidth={3} />
              ) : isCurrent ? (
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#D1D9D3]" />
              )}
            </div>

            {/* Step text content */}
            <div className="pt-0.5">
              <h4
                className={`text-sm sm:text-base font-semibold ${
                  isCurrent
                    ? 'text-[#14532D]'
                    : isPassed
                    ? 'text-[#17211B]'
                    : 'text-[#6B756E]'
                }`}
              >
                {step.label}
              </h4>
              <p className="text-xs sm:text-sm text-[#6B756E] mt-0.5 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
