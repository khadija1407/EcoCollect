import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { getCategoryIcon } from '../components/WasteCategoryCard';
import { WasteCategory } from '../types';

export const WasteGuidePage: React.FC = () => {
  const guideCategories: {
    category: WasteCategory;
    examples: string;
    tip: string;
    accepted: string[];
    notAccepted: string[];
  }[] = [
    {
      category: 'Plastic',
      examples: 'Bottles, containers, packaging',
      tip: 'Empty and rinse recyclable plastic before collection.',
      accepted: ['Beverage bottles & jugs', 'Clean food take-out containers', 'Rigid plastic packaging', 'Detergent containers'],
      notAccepted: ['Styrofoam packaging', 'Dirty plastic wrap with food grease', 'Medical plastic tubing'],
    },
    {
      category: 'Dry Waste',
      examples: 'Paper, cardboard, clean packaging',
      tip: 'Keep paper and cardboard dry.',
      accepted: ['Flattened cardboard boxes', 'Newspapers, magazines, office paper', 'Paper cartons & paper bags', 'Clean books'],
      notAccepted: ['Wet or oiled pizza boxes', 'Waxed thermal receipts', 'Soiled tissue paper'],
    },
    {
      category: 'Organic',
      examples: 'Food scraps and biodegradable waste',
      tip: 'Keep organic waste separated from other waste.',
      accepted: ['Fruit & vegetable peels', 'Coffee grounds & tea bags', 'Eggshells & bread scraps', 'Garden leaves & plant clippings'],
      notAccepted: ['Plastic produce bags', 'Pet waste or animal carcasses', 'Treated chemically sprayed lumber'],
    },
    {
      category: 'E-Waste',
      examples: 'Phones, chargers, cables, small electronics',
      tip: 'Keep electronic items separate from regular waste.',
      accepted: ['Mobile phones & tablets', 'Chargers, adapters & USB cables', 'Laptops, monitors & keyboards', 'Printers & small home gadgets'],
      notAccepted: ['Leaking industrial machinery', 'Uncontained loose lithium pouch cells', 'CRT TVs with cracked leaded glass'],
    },
    {
      category: 'Hazardous',
      examples: 'Batteries and potentially harmful household materials',
      tip: 'Keep hazardous materials separated and clearly identified.',
      accepted: ['Household AA/AAA/rechargeable batteries', 'Paint cans & paint thinners', 'Disinfectants & aerosol cans', 'Fluorescent CFL bulbs'],
      notAccepted: ['Commercial biomedical waste', 'Explosives or ammunition', 'Radioactive components'],
    },
    {
      category: 'Other',
      examples: 'For waste that does not fit the listed categories.',
      tip: 'Provide a brief note during pickup request so the team can prepare.',
      accepted: ['Broken ceramics & glass dishware', 'Worn textiles & unusable shoes', 'Composite furniture scraps', 'Bulky household non-recyclables'],
      notAccepted: ['Asbestos materials', 'Heavy concrete rubble exceeding residential limits'],
    },
  ];

  return (
    <div className="py-12 sm:py-16 bg-[#F7FAF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-[#16A34A] uppercase">
            Disposal Reference
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#17211B] tracking-tight">
            Waste Disposal Guide
          </h1>
          <p className="mt-3 text-base text-[#6B756E] leading-relaxed">
            Understand how to categorize and prepare your items before scheduling a pickup. Proper sorting prevents contamination and boosts recycling rates.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guideCategories.map((item) => (
            <div
              key={item.category}
              className="bg-white rounded-2xl border border-[#E5EAE6] p-6 shadow-xs flex flex-col justify-between hover:border-[#16A34A]/50 transition-colors"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E5EAE6]">
                    {getCategoryIcon(item.category, 26)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#17211B]">{item.category}</h3>
                    <p className="text-xs text-[#6B756E]">{item.examples}</p>
                  </div>
                </div>

                {/* Practical Tip */}
                <div className="mt-5 p-3 rounded-xl bg-[#DCFCE7]/40 border border-[#BBF7D0] flex items-start gap-2.5">
                  <Lightbulb size={16} className="text-[#15803D] shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-[#14532D] leading-relaxed">
                    <span className="font-bold">Tip: </span>
                    {item.tip}
                  </p>
                </div>

                {/* Acceptable items */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#17211B]">
                    Common Examples
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-[#6B756E]">
                    {item.accepted.map((acc, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
                        <span>{acc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-[#E5EAE6]">
                <Link
                  to={`/request?category=${encodeURIComponent(item.category)}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[#F7FAF8] text-[#14532D] border border-[#E5EAE6] hover:bg-[#DCFCE7] hover:border-[#16A34A] transition-colors"
                >
                  <span>Request {item.category} Pickup</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Global Disposal Tip */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white border border-[#E5EAE6] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#17211B]">Still have questions about an unusual item?</h3>
            <p className="text-sm text-[#6B756E]">
              You can choose <strong>Other</strong> when scheduling your pickup and add a short note describing the materials.
            </p>
          </div>
          <Link
            to="/request?category=Other"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors shadow-xs"
          >
            Request Other Pickup
          </Link>
        </div>
      </div>
    </div>
  );
};
