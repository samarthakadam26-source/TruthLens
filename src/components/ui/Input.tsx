import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { classNames } from '@/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  hint?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon, className, id, ...rest },
  ref
) {
  const inputId = id ?? `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="label-base">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={classNames(
            'input-base',
            icon ? 'pl-10' : '',
            error ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-500/20' : '',
            className
          )}
          {...rest}
        />
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

export default Input;
