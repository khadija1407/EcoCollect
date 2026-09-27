import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, ArrowRight, Package } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PickupRequest, PickupStatus } from '../types';
import { requestsAPI } from '../services/api';
import { useRequestContext } from '../context/RequestContext';

const FILTER_TABS = ['All', 'Pending', 'Confirmed', 'Scheduled', 'Collected'];

export const MyRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedRequestIds } = useRequestContext();

  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Direct ID lookup bar
  const [lookupId, setLookupId] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestsAPI.getAll({
        search: searchQuery.trim() || undefined,
        status: activeTab !== 'All' ? activeTab : undefined,
      });

      // If user has local saved IDs, we prioritize showing their requests or show all public matching requests
      // Filter list: if user has saved requests and no search is applied, we can highlight or filter them,
      // but showing all requests or user's requests is helpful.
      // If user has saved requests, let's mark or show them.
      setRequests(data.items);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab, searchQuery]);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupId.trim()) {
      navigate(`/track/${encodeURIComponent(lookupId.trim())}`);
    }
  };

  return (
    <div className="py-10 sm:py-14 bg-[#F7FAF8] min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#17211B] tracking-tight">
              My Requests
            </h1>
            <p className="mt-1 text-sm text-[#6B756E]">
              View and track all waste pickup requests.
            </p>
          </div>

          <Link
            to="/request"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors shadow-xs"
          >
            <span>Request a Pickup</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Quick Lookup Card */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-[#E5EAE6] shadow-xs">
          <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Track by Request ID (e.g. EC-2026-00482)..."
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5EAE6] text-sm text-[#17211B] placeholder-[#6B756E] focus:border-[#16A34A] focus:outline-none"
              />
              <Search size={18} className="absolute left-3 top-3 text-[#6B756E]" />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#14532D] text-white text-sm font-semibold hover:bg-[#16A34A] transition-colors whitespace-nowrap"
            >
              Track Request
            </button>
          </form>
        </div>

        {/* Filters & Search */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-[#14532D] text-white shadow-2xs'
                    : 'bg-white text-[#6B756E] border border-[#E5EAE6] hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search location or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5EAE6] bg-white text-[#17211B] placeholder-[#6B756E] focus:border-[#16A34A] focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-[#6B756E]" />
          </div>
        </div>

        {/* Request Cards List */}
        <div className="mt-6">
          {loading ? (
            <LoadingSpinner message="Loading your requests..." />
          ) : error ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-red-200">
              <p className="text-sm font-semibold text-red-700">{error}</p>
              <button
                onClick={fetchRequests}
                className="mt-4 px-4 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-semibold hover:bg-[#15803D]"
              >
                Try Again
              </button>
            </div>
          ) : requests.length === 0 ? (
            <EmptyState
              title="You haven't requested a pickup yet."
              description="Schedule a waste pickup for plastic, electronics, organic scraps, or dry recyclables."
              actionText="Request a Pickup"
              actionLink="/request"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((item) => {
                const isUserSaved = savedRequestIds.includes(item.request_id);

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-2xs hover:border-[#16A34A]/50 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      {/* Top bar: ID and Status */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#14532D]">
                            {item.request_id}
                          </span>
                          {isUserSaved && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DCFCE7] text-[#14532D]">
                              Your Device
                            </span>
                          )}
                        </div>
                        <StatusBadge status={item.status as PickupStatus} />
                      </div>

                      {/* Waste category and location */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#17211B]">
                          <Package size={16} className="text-[#16A34A] shrink-0" />
                          <span>{item.waste_category}</span>
                        </div>

                        <div className="flex items-start gap-2 text-xs text-[#6B756E]">
                          <MapPin size={15} className="shrink-0 mt-0.5 text-[#6B756E]" />
                          <span className="line-clamp-1">{item.pickup_address}</span>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="mt-3 pt-3 border-t border-[#E5EAE6] flex items-center justify-between text-xs text-[#6B756E]">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{item.pickup_date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{item.pickup_time}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Details action */}
                    <div className="mt-4 pt-3 border-t border-[#E5EAE6] flex justify-end">
                      <Link
                        to={`/track/${encodeURIComponent(item.request_id)}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:text-[#14532D] transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
