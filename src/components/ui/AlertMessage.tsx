import { AlertCircle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { classNames } from '@/utils';
import type { ReactNode } from 'react';

type AlertType = 'error' | 'info' | 'success' | 'warning';

interface AlertMessageProps {
  type: AlertType;
  title?: string;
  children: ReactNode;
  className?: string;
}

const config: Record<AlertType, { icon: typeof AlertCircle; bg: string; border: string; text: string; iconColor: string }> = {
  error: {
    icon: XCircle,
    bg: 'bg-danger-50',
    border: 'border-danger-200',
    text: 'text-danger-800',
    iconColor: 'text-danger-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-success-50',
    border: 'border-success-200',
    text: 'text-success-800',
    iconColor: 'text-success-500',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-warning-50',
    border: 'border-warning-200',
    text: 'text-warning-800',
    iconColor: 'text-warning-500',
  },
};

export default function AlertMessage({ type, title, children, className }: AlertMessageProps) {
  const { icon: Icon, bg, border, text, iconColor } = config[type];
  return (
    <div className={classNames('flex gap-3 rounded-lg border p-4 animate-fade-in', bg, border, text, className)} role="alert">
      <Icon className={classNames('h-5 w-5 flex-shrink-0 mt-0.5', iconColor)} />
      <div className="min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
