import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        className="relative bg-white rounded-xl shadow-elevated max-w-md w-full p-6 animate-slide-up"
        role="alertdialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-desc"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="flex items-center justify-center rounded-full h-10 w-10 bg-danger-100 flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-danger-600" />
          </div>
          <div>
            <h2 id="dialog-title" className="text-lg font-semibold text-navy-900">
              {title}
            </h2>
            <p id="dialog-desc" className="text-sm text-navy-600 mt-1">
              {message}
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
