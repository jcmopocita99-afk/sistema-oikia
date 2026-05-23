import type { ReactNode } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, subtitle, children, className = "" }: Props) {
  return (
    <section
      className={`rounded-[var(--oikia-radius)] border border-[var(--oikia-border)] bg-[var(--oikia-surface)] p-5 shadow-[var(--oikia-shadow)] ${className}`}
    >
      {(title || subtitle) && (
        <header className="mb-4 border-b border-[var(--oikia-border)] pb-3">
          {title && <h3 className="text-base font-semibold text-[var(--oikia-primary)]">{title}</h3>}
          {subtitle && (
            <p className="mt-0.5 text-sm text-[var(--oikia-text-muted)]">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
