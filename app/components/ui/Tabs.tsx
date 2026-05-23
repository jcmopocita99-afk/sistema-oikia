"use client";

import type { ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
  icon?: string;
};

type Props = {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  children: ReactNode;
};

export function Tabs({ tabs, active, onChange, children }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        className="flex flex-wrap gap-1 rounded-lg border border-[var(--oikia-border)] bg-white p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              active === tab.id
                ? "bg-[var(--oikia-primary)] text-white shadow-sm"
                : "text-[var(--oikia-text-muted)] hover:bg-[var(--oikia-surface-muted)] hover:text-[var(--oikia-text)]"
            }`}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{children}</div>
    </div>
  );
}
