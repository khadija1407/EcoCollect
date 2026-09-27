import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  Eye,
  RefreshCw
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AdminRequestModal } from './AdminRequestModal';
import {
  Statistics,
  CategoryStatisticsResponse,
  PickupRequest,
  AnalyticsData
} from '../../types';
import { adminAPI, requestsAPI } from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStatisticsResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentRequests, setRecentRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal view for selected request
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadDashboardData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsData, catData, analyticsData, reqData] = await Promise.all([
        adminAPI.getStatistics(),
        adminAPI.getCategoryStatistics(),
        adminAPI.getAnalytics(),
        requestsAPI.getAll({ limit: 6 }),
      ]);
      setStats(statsData);
      setCategoryStats(catData);
      setAnalytics(analyticsData);
      setRecentRequests(reqData.items);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleOpenDetail = (req: PickupRequest) => {
    setSelectedRequest(req);
    setModalOpen(true);
  };

  const handleStatusUpdated = (updated: PickupRequest) => {
    setSelectedRequest(updated);
    // Refresh table and stats
    loadDashboardData(true);
  };

  if (loading && !stats) {
    return (
      <div className="py-16">
        <LoadingSpinner message="Loading dashboard metrics..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211B] tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#6B756E]">
            Overview of waste pickup activity
          </p>
        </div>

        <button
          onClick={() => loadDashboardData(true)}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-[#E5EAE6] text-[#17211B] hover:bg-gray-50 transition-colors shadow-2xs"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Activity'}</span>
        </button>
      </div>

      {/* Four Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B756E]">
              Total Requests
            </span>
            <div className="p-2 rounded-lg bg-gray-100 text-[#17211B]">
              <Inbox size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-[#17211B]">
            {stats?.total_requests ?? 0}
          </div>
          <p className="mt-1 text-xs text-[#6B756E]">Total pickups logged</p>
        </div>

        {/* Pending */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#92400E]">
              Pending
            </span>
            <div className="p-2 rounded-lg bg-[#FEF3C7] text-[#B45309]">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-[#B45309]">
            {stats?.pending ?? 0}
          </div>
          <p className="mt-1 text-xs text-[#6B756E]">Awaiting verification</p>
        </div>

        {/* Scheduled */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#166534]">
              Scheduled
            </span>
            <div className="p-2 rounded-lg bg-[#DCFCE7] text-[#16A34A]">
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-[#16A34A]">
            {stats?.scheduled ?? 0}
          </div>
          <p className="mt-1 text-xs text-[#6B756E]">Vehicles & slots assigned</p>
        </div>

        {/* Collected */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#065F46]">
              Collected
            </span>
            <div className="p-2 rounded-lg bg-[#D1FAE5] text-[#047857]">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-[#047857]">
            {stats?.collected ?? 0}
          </div>
          <p className="mt-1 text-xs text-[#6B756E]">Safely transported</p>
        </div>
      </div>

      {/* Visual Analytics Row: Requests Overview + Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Overview Chart */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE6]">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-[#16A34A]" />
                <h3 className="font-bold text-base text-[#17211B]">Requests Overview</h3>
              </div>
              <span className="text-xs text-[#6B756E]">Activity by Date</span>
            </div>

            <div className="mt-6">
              {analytics?.requests_over_time && analytics.requests_over_time.length > 0 ? (
                <div className="space-y-3">
                  {analytics.requests_over_time.slice(-5).map((point) => {
                    const maxCount = Math.max(
                      ...analytics.requests_over_time.map((p) => p.count),
                      1
                    );
                    const widthPct = Math.round((point.count / maxCount) * 100);

                    return (
                      <div key={point.date} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-[#17211B]">{point.date}</span>
                          <span className="font-mono text-[#14532D] font-bold">
                            {point.count} {point.count === 1 ? 'request' : 'requests'}
                          </span>
                        </div>
                        <div className="w-full bg-[#F7FAF8] h-3 rounded-full overflow-hidden border border-[#E5EAE6]">
                          <div
                            className="bg-[#16A34A] h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(widthPct, 6)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#6B756E] py-8 text-center">
                  No date activity recorded yet.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5EAE6] flex justify-between items-center text-xs text-[#6B756E]">
            <span>Completion Rate: <strong className="text-[#14532D]">{analytics?.completion_rate ?? 0}%</strong></span>
            <Link to="/admin/analytics" className="text-[#16A34A] hover:underline font-semibold">
              Full Analytics →
            </Link>
          </div>
        </div>

        {/* Waste Categories Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE6]">
              <div className="flex items-center gap-2">
                <PieIcon size={18} className="text-[#16A34A]" />
                <h3 className="font-bold text-base text-[#17211B]">Waste Categories</h3>
              </div>
              <span className="text-xs text-[#6B756E]">Distribution</span>
            </div>

            <div className="mt-6 space-y-3.5">
              {categoryStats?.categories.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#17211B]">{cat.category}</span>
                    <span className="text-[#6B756E] font-mono">
                      {cat.count} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F7FAF8] h-2.5 rounded-full overflow-hidden border border-[#E5EAE6]">
                    <div
                      className="bg-[#14532D] h-full rounded-full transition-all duration-300"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5EAE6] text-xs text-[#6B756E] flex justify-between">
            <span>Primary Category: <strong className="text-[#17211B]">{analytics?.most_requested_category || 'N/A'}</strong></span>
            <span>Total Categories: <strong>6</strong></span>
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAE6] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E5EAE6] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#17211B]">Recent Requests</h3>
            <p className="text-xs text-[#6B756E] mt-0.5">
              Latest pickup requests received across all categories
            </p>
          </div>
          <Link
            to="/admin/requests"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#16A34A] hover:text-[#14532D] transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#F7FAF8] border-b border-[#E5EAE6] text-[11px] font-semibold uppercase tracking-wider text-[#6B756E]">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Waste</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE6]">
              {recentRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#6B756E]">
                    No pickup requests logged in the database yet.
                  </td>
                </tr>
              ) : (
                recentRequests.map((req) => (
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
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetail(req)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-[#DCFCE7] text-[#17211B] hover:text-[#14532D] transition-colors"
                      >
                        <Eye size={12} />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View for Status Transition */}
      <AdminRequestModal
        request={selectedRequest}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
};
