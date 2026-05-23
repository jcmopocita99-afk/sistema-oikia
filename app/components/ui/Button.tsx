import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--oikia-primary)] text-white hover:bg-[var(--oikia-primary-dark)] shadow-sm",
  secondary:
    "bg-white text-[var(--oikia-primary)] border border-[var(--oikia-border)] hover:bg-[var(--oikia-surface-muted)]",
  ghost: "bg-transparent text-[var(--oikia-text-muted)] hover:bg-[var(--oikia-surface-muted)]",
  danger: "bg-[var(--oikia-danger)] text-white hover:opacity-90",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
