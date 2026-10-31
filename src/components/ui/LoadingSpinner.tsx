import { Loader2 } from 'lucide-react';
import { classNames } from '@/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export default function LoadingSpinner({ size = 'md', label, className }: LoadingSpinnerProps) {
  return (
    <div className={classNames('flex items-center gap-2 text-navy-500', className)} role="status">
      <Loader2 className={classNames('animate-spin-slow', sizeMap[size])} />
      {label && <span className="text-sm font-medium">{label}</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
}
