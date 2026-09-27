import React from 'react';
import {
  Package,
  FileText,
  Apple,
  Tv,
  AlertTriangle,
  HelpCircle,
  Check
} from 'lucide-react';
import { WasteCategory } from '../types';

interface WasteCategoryCardProps {
  category: WasteCategory;
  description: string;
  isSelected: boolean;
  onSelect: (category: WasteCategory) => void;
}

export const getCategoryIcon = (category: WasteCategory, size = 24) => {
  switch (category) {
    case 'Plastic':
      return <Package size={size} className="text-[#16A34A]" />;
    case 'Dry Waste':
      return <FileText size={size} className="text-[#0284C7]" />;
    case 'Organic':
      return <Apple size={size} className="text-[#15803D]" />;
    case 'E-Waste':
      return <Tv size={size} className="text-[#7C3AED]" />;
    case 'Hazardous':
      return <AlertTriangle size={size} className="text-[#DC2626]" />;
    case 'Other':
    default:
      return <HelpCircle size={size} className="text-[#4B5563]" />;
  }
};

export const WasteCategoryCard: React.FC<WasteCategoryCardProps> = ({
  category,
  description,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(category)}
      className={`relative w-full text-left p-5 rounded-xl border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#16A34A] ${
        isSelected
          ? 'border-[#16A34A] bg-[#DCFCE7]/20 shadow-sm ring-1 ring-[#16A34A]'
          : 'border-[#E5EAE6] bg-white hover:border-[#16A34A]/50 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-lg bg-[#F7FAF8] border border-[#E5EAE6]">
          {getCategoryIcon(category, 26)}
        </div>
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-xs">
            <Check size={14} strokeWidth={3} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-base font-semibold text-[#17211B]">{category}</h3>
        <p className="mt-1 text-sm text-[#6B756E] leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </button>
  );
};
