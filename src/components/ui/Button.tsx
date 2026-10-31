import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { classNames } from '@/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-navy-800 text-white hover:bg-navy-900 active:bg-navy-950 shadow-card',
  secondary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-card',
  outline: 'border-2 border-navy-200 text-navy-700 hover:border-navy-400 hover:text-navy-900 bg-white',
  ghost: 'text-navy-600 hover:bg-navy-50 hover:text-navy-900',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-card',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames('btn-base', variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin-slow" />}
      {children}
    </button>
  );
}
