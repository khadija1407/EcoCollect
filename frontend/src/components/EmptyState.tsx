import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionText,
  actionLink,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-[#E5EAE6] rounded-2xl bg-white/60">
      <div className="p-3.5 bg-[#F7FAF8] text-[#6B756E] border border-[#E5EAE6] rounded-full mb-4">
        <Icon size={28} />
      </div>
      <h3 className="text-lg font-semibold text-[#17211B]">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-[#6B756E] max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {(actionText && (actionLink || onActionClick)) && (
        <div className="mt-6">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors shadow-xs"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors shadow-xs"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
