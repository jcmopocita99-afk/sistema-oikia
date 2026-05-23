"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      router.push("/");
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--oikia-primary)] to-[var(--oikia-primary-dark)] p-4">
      <Card
        title="Sistema Oikia"
        subtitle="Ingresa tus credenciales para continuar"
        className="w-full max-w-md"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <Input
            label="Usuario"
            placeholder="Tu usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--oikia-danger)]">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Ingresando…" : "Ingresar al sistema"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--oikia-text-muted)]">
          Fase 1 — Acceso y módulos base
        </p>
      </Card>
    </div>
  );
}
