import React, { useState, useEffect } from 'react';
import { Search, Eye, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { AdminRequestModal } from './AdminRequestModal';
import { PickupRequest } from '../../types';
import { requestsAPI } from '../../services/api';

const CATEGORIES = ['All Categories', 'Plastic', 'Dry Waste', 'Organic', 'E-Waste', 'Hazardous', 'Other'];
const STATUSES = ['All Statuses', 'Pending', 'Confirmed', 'Scheduled', 'Collected', 'Cancelled'];

export const AdminRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Statuses');
  const [dateFilter, setDateFilter] = useState('');

  // Selected for Modal
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRequests = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await requestsAPI.getAll({
        search: search.trim() || undefined,
        category: category !== 'All Categories' ? category : undefined,
        status: status !== 'All Statuses' ? status : undefined,
        date: dateFilter || undefined,
      });
      setRequests(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching admin requests', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [category, status, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All Categories');
    setStatus('All Statuses');
    setDateFilter('');
  };

  const handleOpenModal = (req: PickupRequest) => {
    setSelectedRequest(req);
    setModalOpen(true);
  };

  const handleStatusUpdated = (updated: PickupRequest) => {
    setSelectedRequest(updated);
    fetchRequests(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211B] tracking-tight">
            Pickup Requests
          </h1>
          <p className="mt-1 text-sm text-[#6B756E]">
            Search, filter, and transition status of active collection orders ({total} total)
          </p>
        </div>

        <button
          onClick={() => fetchRequests(true)}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E5EAE6] text-[#17211B] hover:bg-gray-50 shadow-2xs"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
        {/* Search row */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by request ID or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#E5EAE6] text-[#17211B] placeholder-[#6B756E] focus:border-[#16A34A] focus:outline-none"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-[#6B756E]" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#16A34A] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-[#E5EAE6]">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B756E] uppercase mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E5EAE6] text-[#17211B] focus:border-[#16A34A] focus:outline-none bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B756E] uppercase mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E5EAE6] text-[#17211B] focus:border-[#16A34A] focus:outline-none bg-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B756E] uppercase mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E5EAE6] text-[#17211B] focus:border-[#16A34A] focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Reset button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full py-1.5 px-3 rounded-lg border border-[#E5EAE6] text-xs font-semibold text-[#6B756E] hover:bg-gray-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAE6] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner message="Fetching requests..." />
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No requests match your criteria"
              description="Try adjusting your search terms or filters to view collection requests."
              actionText="Reset Filters"
              onActionClick={handleResetFilters}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F7FAF8] border-b border-[#E5EAE6] text-[11px] font-semibold uppercase tracking-wider text-[#6B756E]">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Waste Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE6]">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#14532D]">
                      {req.request_id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-xs text-[#17211B]">
                      {req.waste_category}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#6B756E] max-w-[200px] truncate">
                      {req.pickup_address}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#6B756E] whitespace-nowrap">
                      {req.pickup_date}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#6B756E] whitespace-nowrap">
                      {req.pickup_time}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenModal(req)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#DCFCE7] text-[#14532D] hover:bg-[#BBF7D0] transition-colors"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Details & Status Update */}
      <AdminRequestModal
        request={selectedRequest}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
};
