import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  PieChart as PieIcon,
  Package
} from 'lucide-react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AnalyticsData } from '../../types';
import { adminAPI } from '../../services/api';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const result = await adminAPI.getAnalytics();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !data) {
    return (
      <div className="py-16">
        <LoadingSpinner message="Calculating database analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211B] tracking-tight">
            Collection Analytics
          </h1>
          <p className="mt-1 text-sm text-[#6B756E]">
            Real-time metrics and category breakdowns calculated directly from database records
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E5EAE6] text-[#17211B] hover:bg-gray-50 shadow-2xs"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Recalculating...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B756E]">
              Total Requests
            </span>
            <div className="p-2 rounded-lg bg-gray-100 text-[#17211B]">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-[#17211B]">
            {data?.total_requests ?? 0}
          </div>
          <p className="mt-1 text-xs text-[#6B756E]">All logged entries</p>
        </div>

        {/* Completed Collections */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#065F46]">
              Completed Pickups
            </span>
            <div className="p-2 rounded-lg bg-[#D1FAE5] text-[#047857]">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-[#047857]">
            {data?.completed_collections ?? 0}
          </div>
          <p className="mt-1 text-xs text-[#6B756E]">Successfully routed</p>
        </div>

        {/* Pending Requests */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#92400E]">
              Pending Requests
            </span>
            <div className="p-2 rounded-lg bg-[#FEF3C7] text-[#B45309]">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-[#B45309]">
            {data?.pending_requests ?? 0}
          </div>
          <p className="mt-1 text-xs text-[#6B756E]">In dispatch queue</p>
        </div>

        {/* Completion Rate */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#14532D]">
              Completion Rate
            </span>
            <div className="p-2 rounded-lg bg-[#DCFCE7] text-[#16A34A]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-[#14532D]">
            {data?.completion_rate ?? 0}%
          </div>
          <p className="mt-1 text-xs text-[#6B756E]">Completed vs total</p>
        </div>
      </div>

      {/* Highlight: Most Requested Waste Category */}
      <div className="p-6 rounded-2xl bg-[#14532D] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-white/10 text-[#DCFCE7] border border-white/20">
            <Sparkles size={28} />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-200">
              Most Requested Waste Category
            </span>
            <h2 className="text-2xl font-bold mt-0.5">
              {data?.most_requested_category || 'No submissions yet'}
            </h2>
            <p className="text-xs text-green-100 mt-1">
              Based on historical user collection submissions in the database.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs text-green-200 block">Total Categories Tracked</span>
          <span className="text-2xl font-bold font-mono">6 Categories</span>
        </div>
      </div>

      {/* Grid: Category Breakdown + Requests Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Category */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-[#E5EAE6]">
            <PieIcon size={18} className="text-[#16A34A]" />
            <h3 className="font-bold text-base text-[#17211B]">Requests by Category</h3>
          </div>

          <div className="mt-6 space-y-4">
            {data?.requests_by_category.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-[#16A34A]" />
                    <span className="font-semibold text-[#17211B]">{cat.category}</span>
                  </div>
                  <div className="font-mono text-[#6B756E]">
                    <span className="font-bold text-[#14532D]">{cat.count}</span> ({cat.percentage}%)
                  </div>
                </div>
                <div className="w-full bg-[#F7FAF8] h-3 rounded-full overflow-hidden border border-[#E5EAE6]">
                  <div
                    className="bg-[#14532D] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(cat.percentage, cat.count > 0 ? 4 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requests Over Time */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-[#E5EAE6]">
            <TrendingUp size={18} className="text-[#16A34A]" />
            <h3 className="font-bold text-base text-[#17211B]">Requests Over Time</h3>
          </div>

          <div className="mt-6">
            {data?.requests_over_time && data.requests_over_time.length > 0 ? (
              <div className="space-y-3.5">
                {data.requests_over_time.map((point) => {
                  const maxCount = Math.max(...data.requests_over_time.map((p) => p.count), 1);
                  const barWidth = Math.round((point.count / maxCount) * 100);

                  return (
                    <div key={point.date} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-[#17211B]">{point.date}</span>
                        <span className="font-mono font-bold text-[#16A34A]">
                          {point.count} {point.count === 1 ? 'pickup' : 'pickups'}
                        </span>
                      </div>
                      <div className="w-full bg-[#F7FAF8] h-3 rounded-full overflow-hidden border border-[#E5EAE6]">
                        <div
                          className="bg-[#16A34A] h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(barWidth, 8)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#6B756E] py-12 text-center">
                No time series data logged yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
