import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E5EAE6] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand intro */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold">
                <Recycle size={18} className="stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#17211B]">
                Eco<span className="text-[#16A34A]">Collect</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-[#6B756E] max-w-md leading-relaxed">
              A simplified civic waste pickup and request tracking platform designed to make responsible household and commercial disposal straightforward and accessible.
            </p>
            <p className="mt-2 text-xs text-[#6B756E]">
              Solo Student Hackathon MVP Project — Designed for Google Cloud Run
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17211B]">
              Quick Links
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-[#6B756E] hover:text-[#16A34A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-[#6B756E] hover:text-[#16A34A] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/waste-guide" className="text-[#6B756E] hover:text-[#16A34A] transition-colors">
                  Waste Disposal Guide
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-[#6B756E] hover:text-[#16A34A] transition-colors">
                  Request a Pickup
                </Link>
              </li>
              <li>
                <Link to="/my-requests" className="text-[#6B756E] hover:text-[#16A34A] transition-colors">
                  Track My Pickup
                </Link>
              </li>
            </ul>
          </div>

          {/* Staff & Admin links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17211B]">
              Staff & Operations
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/admin/login" className="text-[#6B756E] hover:text-[#16A34A] transition-colors">
                  Staff Login
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="text-[#6B756E] hover:text-[#16A34A] transition-colors">
                  Pickup Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/requests" className="text-[#6B756E] hover:text-[#16A34A] transition-colors">
                  Manage Requests
                </Link>
              </li>
              <li>
                <Link to="/admin/analytics" className="text-[#6B756E] hover:text-[#16A34A] transition-colors">
                  Collection Statistics
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E5EAE6] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B756E] gap-4">
          <p>© {new Date().getFullYear()} EcoCollect. Built for sustainable civic communities.</p>
          <p>Privacy-friendly • No invasive tracking • Open civic technology</p>
        </div>
      </div>
    </footer>
  );
};
