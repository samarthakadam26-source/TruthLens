import type { ReactNode } from 'react';
import { classNames } from '@/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={classNames('flex flex-col items-center justify-center text-center py-12 px-6', className)}>
      {icon && (
        <div className="mb-4 flex items-center justify-center rounded-full h-16 w-16 bg-gray-100 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-navy-900 mb-1.5">{title}</h3>
      <p className="text-sm text-navy-500 max-w-sm mb-6">{message}</p>
      {action}
    </div>
  );
}
