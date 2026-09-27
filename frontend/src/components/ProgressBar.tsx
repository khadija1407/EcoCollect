import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: 1 | 2 | 3;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Waste' },
    { number: 2, label: 'Pickup' },
    { number: 3, label: 'Confirm' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E5EAE6] -translate-y-1/2 z-0" />
        
        {/* Active progress fill line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-[#16A34A] -translate-y-1/2 z-0 transition-all duration-300"
          style={{
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                  isCompleted
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : isCurrent
                    ? 'bg-white border-2 border-[#16A34A] text-[#16A34A] ring-4 ring-[#DCFCE7]'
                    : 'bg-white border border-[#E5EAE6] text-[#6B756E]'
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.number}
              </div>
              <span
                className={`mt-2 text-xs font-medium tracking-wide ${
                  isCurrent
                    ? 'text-[#14532D] font-semibold'
                    : isCompleted
                    ? 'text-[#16A34A]'
                    : 'text-[#6B756E]'
                }`}
              >
                {step.number}. {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
