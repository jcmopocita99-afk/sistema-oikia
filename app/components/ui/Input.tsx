import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = "", id, ...props }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && (
        <span className="font-medium text-[var(--oikia-text)]">{label}</span>
      )}
      <input
        id={inputId}
        className={`rounded-lg border border-[var(--oikia-border)] bg-white px-3 py-2 text-[var(--oikia-text)] outline-none transition placeholder:text-[var(--oikia-text-muted)] focus:border-[var(--oikia-primary)] focus:ring-2 focus:ring-[var(--oikia-primary)]/15 ${className}`}
        {...props}
      />
    </label>
  );
}
