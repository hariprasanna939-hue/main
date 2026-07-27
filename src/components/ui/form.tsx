import React from 'react';

// Common Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl text-slate-800 placeholder-slate-400 transition-all text-sm outline-none ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium block">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Common Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl text-slate-800 placeholder-slate-400 transition-all text-sm outline-none ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium block">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// Common Select Component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, children, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl text-slate-800 transition-all text-sm outline-none cursor-pointer appearance-none pr-10 ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-red-500 font-medium block">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// Common Checkbox Component
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-3 cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          className={`w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer ${className}`}
          {...props}
        />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
