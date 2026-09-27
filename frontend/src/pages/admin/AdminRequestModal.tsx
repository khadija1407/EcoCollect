import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Package, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { PickupRequest } from '../../types';
import { requestsAPI } from '../../services/api';

interface AdminRequestModalProps {
  request: PickupRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (updated: PickupRequest) => void;
}

export const AdminRequestModal: React.FC<AdminRequestModalProps> = ({
  request,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  if (!isOpen || !request) return null;

  const [selectedStatus, setSelectedStatus] = useState<string>(request.status);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Allowed statuses
  const statusOptions = ['Pending', 'Confirmed', 'Scheduled', 'Collected', 'Cancelled'];

  const handleUpdate = async () => {
    if (selectedStatus === request.status) return;
    setUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updated = await requestsAPI.updateStatus(request.request_id, selectedStatus);
      setSuccessMsg(`Status updated to "${selectedStatus}".`);
      onStatusUpdated(updated);
      setTimeout(() => {
        setSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to update status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E5EAE6] max-w-lg w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EAE6] bg-[#F7FAF8]">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6B756E]">
              Request Details
            </span>
            <h3 className="text-lg font-bold font-mono text-[#14532D]">
              {request.request_id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B756E] hover:text-[#17211B] hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-[#16A34A]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Current Status banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E5EAE6]">
            <div>
              <span className="text-xs text-[#6B756E] block font-medium">Current Status</span>
              <span className="text-sm font-bold text-[#17211B]">{request.status}</span>
            </div>
            <StatusBadge status={request.status} />
          </div>

          {/* Details list */}
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Package size={17} className="text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-[#6B756E] block">Waste Category</span>
                <span className="font-semibold text-[#17211B]">{request.waste_category}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={17} className="text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-[#6B756E] block">Pickup Location</span>
                <span className="font-semibold text-[#17211B]">{request.pickup_address}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <Calendar size={17} className="text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-[#6B756E] block">Pickup Date</span>
                  <span className="font-semibold text-[#17211B]">{request.pickup_date}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock size={17} className="text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-[#6B756E] block">Pickup Time</span>
                  <span className="font-semibold text-[#17211B]">{request.pickup_time}</span>
                </div>
              </div>
            </div>

            {request.notes && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-[#E5EAE6]">
                <FileText size={16} className="text-[#6B756E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-[#6B756E] font-medium block">Notes:</span>
                  <p className="text-xs text-[#17211B] mt-0.5 leading-relaxed">{request.notes}</p>
                </div>
              </div>
            )}

            {request.created_at && (
              <div className="text-[11px] text-[#6B756E] pt-2 border-t border-[#E5EAE6]">
                Created on: {new Date(request.created_at).toLocaleString()}
              </div>
            )}
          </div>

          {/* Status Update Control */}
          <div className="pt-4 border-t border-[#E5EAE6]">
            <label className="block text-xs font-semibold text-[#17211B] uppercase tracking-wider mb-2">
              Update Request Status
            </label>
            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={updating || request.status === 'Collected'}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#E5EAE6] text-[#17211B] focus:border-[#16A34A] focus:outline-none disabled:bg-gray-100"
              >
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={updating || selectedStatus === request.status || request.status === 'Collected'}
                className="px-4 py-2 bg-[#16A34A] text-white text-xs font-semibold rounded-lg hover:bg-[#15803D] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
            {request.status === 'Collected' && (
              <p className="text-[11px] text-[#6B756E] mt-1.5">
                Completed requests are archived and cannot be changed.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-[#E5EAE6] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-[#E5EAE6] text-[#17211B] bg-white hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
