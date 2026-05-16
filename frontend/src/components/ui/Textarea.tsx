import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-surface-800">
        {label}
      </label>
      <textarea
        id={inputId}
        rows={4}
        className={`w-full resize-y rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${
          error ? "border-red-400" : "border-surface-200"
        } ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
