import { forwardRef, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { classNames } from '@/utils';

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  hint?: string;
  showToggle: boolean;
  isVisible: boolean;
  onToggle: () => void;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { label, error, hint, showToggle, isVisible, onToggle, className, id, ...rest },
  ref
) {
  const inputId = id ?? `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="label-base">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={classNames('input-base pr-11', error && 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/20', className)}
          {...rest}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-700 transition-colors"
            tabIndex={-1}
          >
            {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default PasswordField;
