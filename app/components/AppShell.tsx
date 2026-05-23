"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "./ui/Button";

const NAV = [
  { href: "/", label: "Terrenos", icon: "🏘" },
  { href: "/ventas", label: "Ventas", icon: "💼" },
] as const;

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      router.replace("/login");
      return;
    }
    try {
      const user = JSON.parse(raw);
      setUserName(user.nombre ?? user.usuario ?? "Usuario");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--oikia-border)] bg-[var(--oikia-primary)] text-white">
        <div className="border-b border-white/10 px-4 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">
            Sistema
          </p>
          <h1 className="text-xl font-bold tracking-tight">Oikia</h1>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <p className="mb-2 truncate px-2 text-xs text-white/60">{userName}</p>
          <Button
            variant="secondary"
            className="w-full !text-[var(--oikia-text)]"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-[var(--oikia-border)] bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-[var(--oikia-primary)]">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-[var(--oikia-text-muted)]">{subtitle}</p>
          )}
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
