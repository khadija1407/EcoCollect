import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Package, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { StatusTimeline } from '../components/StatusTimeline';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PickupRequest } from '../types';
import { requestsAPI } from '../services/api';

export const TrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState(id || '');
  const [request, setRequest] = useState<PickupRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequestDetails = async (targetId: string, isRefresh = false) => {
    if (!targetId.trim()) return;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await requestsAPI.getById(targetId.trim());
      setRequest(data);
    } catch (err: any) {
      setRequest(null);
      setError(err.message || `No pickup request found with ID "${targetId}".`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      setSearchId(id);
      fetchRequestDetails(id);
    }
  }, [id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/track/${encodeURIComponent(searchId.trim())}`);
    }
  };

  return (
    <div className="py-10 sm:py-14 bg-[#F7FAF8] min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/my-requests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B756E] hover:text-[#17211B] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Requests</span>
          </Link>

          {request && (
            <button
              onClick={() => fetchRequestDetails(request.request_id, true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#16A34A] hover:text-[#14532D] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
            </button>
          )}
        </div>

        {/* Search input header */}
        <div className="bg-white rounded-2xl border border-[#E5EAE6] p-4 sm:p-5 shadow-xs mb-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Request ID (e.g. EC-2026-00482)..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#E5EAE6] text-[#17211B] placeholder-[#6B756E] focus:border-[#16A34A] focus:outline-none"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-[#6B756E]" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#16A34A] text-white rounded-lg text-xs font-semibold hover:bg-[#15803D] transition-colors"
            >
              Look Up
            </button>
          </form>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-[#E5EAE6] p-12">
            <LoadingSpinner message="Looking up pickup request..." />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full mx-auto flex items-center justify-center mb-3">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-base font-bold text-red-900">Request Not Found</h3>
            <p className="mt-1 text-sm text-red-700 max-w-sm mx-auto">{error}</p>
            <div className="mt-5">
              <Link
                to="/my-requests"
                className="px-4 py-2 bg-[#16A34A] text-white text-xs font-semibold rounded-lg hover:bg-[#15803D]"
              >
                Browse Recent Requests
              </Link>
            </div>
          </div>
        ) : !request ? (
          <div className="bg-white rounded-2xl border border-[#E5EAE6] p-8 text-center">
            <Package size={32} className="mx-auto text-[#6B756E] mb-3" />
            <h3 className="text-base font-bold text-[#17211B]">Enter a Request ID</h3>
            <p className="mt-1 text-sm text-[#6B756E]">
              Use the search bar above to look up your collection request details and live status.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5EAE6] p-6 sm:p-8 shadow-xs">
            {/* Header & Prominent Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5EAE6] gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#6B756E]">
                  Your Pickup
                </span>
                <h1 className="text-2xl font-extrabold font-mono text-[#14532D]">
                  {request.request_id}
                </h1>
              </div>

              {/* Prominent Current Status Box */}
              <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E5EAE6] flex items-center gap-3">
                <span className="text-xs text-[#6B756E] font-medium">Current status:</span>
                <StatusBadge status={request.status} />
              </div>
            </div>

            {/* Request Summary Metadata Grid */}
            <div className="py-6 border-b border-[#E5EAE6] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#F7FAF8] rounded-lg border border-[#E5EAE6] text-[#16A34A] shrink-0">
                  <Package size={18} />
                </div>
                <div>
                  <span className="text-xs text-[#6B756E] font-medium">Waste Type</span>
                  <div className="font-semibold text-[#17211B]">{request.waste_category}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#F7FAF8] rounded-lg border border-[#E5EAE6] text-[#16A34A] shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-xs text-[#6B756E] font-medium">Pickup Location</span>
                  <div className="font-semibold text-[#17211B]">{request.pickup_address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#F7FAF8] rounded-lg border border-[#E5EAE6] text-[#16A34A] shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-xs text-[#6B756E] font-medium">Pickup Date</span>
                  <div className="font-semibold text-[#17211B]">{request.pickup_date}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#F7FAF8] rounded-lg border border-[#E5EAE6] text-[#16A34A] shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-xs text-[#6B756E] font-medium">Preferred Time</span>
                  <div className="font-semibold text-[#17211B]">{request.pickup_time}</div>
                </div>
              </div>

              {request.notes && (
                <div className="sm:col-span-2 p-3 rounded-lg bg-[#F7FAF8] border border-[#E5EAE6] text-xs">
                  <span className="font-semibold text-[#17211B]">Collector Notes: </span>
                  <span className="text-[#6B756E]">{request.notes}</span>
                </div>
              )}
            </div>

            {/* Vertical Status Timeline */}
            <div className="pt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#17211B]">
                Collection Progress
              </h3>
              <StatusTimeline
                status={request.status}
                createdAt={request.created_at}
                updatedAt={request.updated_at}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
