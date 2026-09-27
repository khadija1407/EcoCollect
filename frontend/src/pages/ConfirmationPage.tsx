import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Check, Copy, CheckCheck, ArrowRight, Home, Calendar, MapPin, Package } from 'lucide-react';
import { PickupRequest } from '../types';

export const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Retrieve request passed via state or redirect
  const request = location.state?.request as PickupRequest | undefined;

  const handleCopy = () => {
    if (request?.request_id) {
      navigator.clipboard.writeText(request.request_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!request) {
    return (
      <div className="py-16 px-4 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-[#17211B]">No Request Found</h2>
        <p className="mt-2 text-sm text-[#6B756E]">
          You have reached this page without submitting a new pickup request.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/request"
            className="px-4 py-2.5 rounded-lg bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D]"
          >
            Request a Pickup
          </Link>
          <Link
            to="/"
            className="px-4 py-2.5 rounded-lg border border-[#E5EAE6] bg-white text-sm font-semibold text-[#17211B] hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-[#F7FAF8] min-h-[calc(100vh-4rem)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-[#E5EAE6] p-6 sm:p-10 shadow-xs text-center">
          {/* Large Check Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#DCFCE7] text-[#14532D] mx-auto flex items-center justify-center border-4 border-[#BBF7D0]">
            <Check size={36} strokeWidth={3} className="text-[#16A34A]" />
          </div>

          <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#17211B]">
            Pickup requested!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6B756E]">
            Your request has been successfully submitted.
          </p>

          {/* Copyable Request ID Box */}
          <div className="mt-8 p-4 rounded-xl bg-[#F7FAF8] border border-[#E5EAE6] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#6B756E]">
                Request ID
              </span>
              <div className="text-lg sm:text-xl font-bold font-mono text-[#14532D] tracking-wide">
                {request.request_id}
              </div>
            </div>

            <button
              onClick={handleCopy}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-[#E5EAE6] text-[#17211B] hover:bg-gray-50 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <CheckCheck size={14} className="text-[#16A34A]" />
                  <span className="text-[#16A34A]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Request Details Summary Card */}
          <div className="mt-6 border border-[#E5EAE6] rounded-xl text-left divide-y divide-[#E5EAE6] bg-[#FFFFFF] text-sm">
            <div className="p-3.5 sm:p-4 flex items-center gap-3">
              <Package size={18} className="text-[#16A34A] shrink-0" />
              <div className="flex-1 flex justify-between">
                <span className="text-[#6B756E]">Waste Type</span>
                <span className="font-semibold text-[#17211B]">{request.waste_category}</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 flex items-center gap-3">
              <MapPin size={18} className="text-[#16A34A] shrink-0" />
              <div className="flex-1 flex justify-between">
                <span className="text-[#6B756E]">Pickup Location</span>
                <span className="font-semibold text-[#17211B] text-right truncate max-w-[240px] sm:max-w-none">
                  {request.pickup_address}
                </span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 flex items-center gap-3">
              <Calendar size={18} className="text-[#16A34A] shrink-0" />
              <div className="flex-1 flex justify-between">
                <span className="text-[#6B756E]">Scheduled For</span>
                <span className="font-semibold text-[#17211B]">
                  {request.pickup_date} • {request.pickup_time}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate(`/track/${encodeURIComponent(request.request_id)}`)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors shadow-xs"
            >
              <span>Track My Pickup</span>
              <ArrowRight size={16} />
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-[#E5EAE6] text-[#17211B] hover:bg-gray-50 transition-colors"
            >
              <Home size={16} className="text-[#6B756E]" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
