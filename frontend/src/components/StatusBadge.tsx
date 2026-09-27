import React from 'react';
import { PickupStatus } from '../types';

interface StatusBadgeProps {
  status: PickupStatus | string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  showIcon = true,
}) => {
  switch (status) {
    case 'Pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] ${className}`}
        >
          {showIcon && <span className="text-[#F59E0B] text-xs">●</span>}
          <span>Pending</span>
        </span>
      );
    case 'Confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] ${className}`}
        >
          {showIcon && <span className="text-[#0284C7] text-xs">✓</span>}
          <span>Confirmed</span>
        </span>
      );
    case 'Scheduled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] ${className}`}
        >
          {showIcon && <span className="text-[#16A34A] text-xs">●</span>}
          <span>Scheduled</span>
        </span>
      );
    case 'Collected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] ${className}`}
        >
          {showIcon && <span className="text-[#14532D] text-xs font-bold">✓</span>}
          <span>Collected</span>
        </span>
      );
    case 'Cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA] ${className}`}
        >
          {showIcon && <span className="text-[#EF4444] text-xs">✕</span>}
          <span>Cancelled</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 ${className}`}
        >
          <span>{status}</span>
        </span>
      );
  }
};
