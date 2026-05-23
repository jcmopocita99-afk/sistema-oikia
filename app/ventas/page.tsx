"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../components/AppShell";
import { GastoBlock } from "../components/GastoBlock";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Tabs, type TabItem } from "../components/ui/Tabs";

type GastoFields = { factura: string; valor: string; concepto: string };

const LIST_TABS: TabItem[] = [
  { id: "seleccion", label: "Seleccionar terreno", icon: "🏡" },
];

const SALE_TABS: TabItem[] = [
  { id: "venta", label: "Datos de venta", icon: "💰" },
  { id: "resultados", label: "Resultados", icon: "📊" },
];

export default function Ventas() {
  const [terrenos, setTerrenos] = useState<string[][]>([]);
  const [seleccionado, setSeleccionado] = useState<string[] | null>(null);
  const [tab, setTab] = useState("seleccion");
  const [saleTab, setSaleTab] = useState("venta");
  const [plusvalia, setPlusvalia] = useState<GastoFields>({ factura: "", valor: "", concepto: "" });
  const [otros, setOtros] = useState<GastoFields>({ factura: "", valor: "", concepto: "" });
  const [venta, setVenta] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch("/api/terrenos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTerrenos(data);
      });
  }, []);

  const costo = seleccionado ? Number(seleccionado[5]) : 0;
  const sugerida = seleccionado ? Number(seleccionado[6]) : 0;
  const gastosVenta = Number(plusvalia.valor || 0) + Number(otros.valor || 0);
  const beneficioReal = venta - gastosVenta - costo;

  const guardarVenta = async () => {
    if (!seleccionado) return;
    if (!venta || venta <= 0) {
      setErrorMsg("Indica un precio de venta válido.");
      setSaleTab("venta");
      return;
    }

    setErrorMsg("");
    setGuardando(true);
    try {
      const payload = {
        codigo: seleccionado[2],
        venta,
        plusvalia: Number(plusvalia.valor || 0),
        otros: Number(otros.valor || 0),
        beneficio: beneficioReal,
      };

      const res = await fetch("/api/crear-venta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      alert("Venta guardada correctamente.");
      setSeleccionado(null);
      setVenta(0);
      setPlusvalia({ factura: "", valor: "", concepto: "" });
      setOtros({ factura: "", valor: "", concepto: "" });
      setTab("seleccion");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Error al guardar la venta");
    } finally {
      setGuardando(false);
    }
  };

  if (!seleccionado) {
    return (
      <AppShell title="Ventas" subtitle="Selecciona un terreno para registrar la venta">
        {errorMsg && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-[var(--oikia-danger)]">
            {errorMsg}
          </p>
        )}

        <Tabs tabs={LIST_TABS} active={tab} onChange={setTab}>
          <Card title="Terrenos disponibles">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--oikia-border)] bg-[var(--oikia-surface-muted)] text-left">
                    <th className="px-3 py-2 font-semibold">Código</th>
                    <th className="px-3 py-2 font-semibold">Costo</th>
                    <th className="px-3 py-2 font-semibold">Venta sugerida</th>
                    <th className="px-3 py-2 text-right font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {terrenos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-[var(--oikia-text-muted)]">
                        No hay terrenos. Regístralos primero en el módulo Terrenos.
                      </td>
                    </tr>
                  ) : (
                    terrenos.map((t, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--oikia-border)] hover:bg-[var(--oikia-surface-muted)]/60"
                      >
                        <td className="px-3 py-2 font-medium">{t[2]}</td>
                        <td className="px-3 py-2">${Number(t[5] || 0).toLocaleString()}</td>
                        <td className="px-3 py-2">${Number(t[6] || 0).toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">
                          <Button type="button" onClick={() => setSeleccionado(t)}>
                            Seleccionar
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </Tabs>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Registrar venta"
      subtitle={`Terreno ${seleccionado[2]}`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button variant="secondary" type="button" onClick={() => setSeleccionado(null)}>
          ← Volver al listado
        </Button>
        <span className="rounded-full bg-[var(--oikia-surface-muted)] px-3 py-1 text-sm">
          Costo: <strong>${costo.toLocaleString()}</strong>
        </span>
        <span className="rounded-full bg-green-50 px-3 py-1 text-sm text-[var(--oikia-accent)]">
          Sugerida: <strong>${sugerida.toLocaleString()}</strong>
        </span>
      </div>

      {errorMsg && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-[var(--oikia-danger)]">
          {errorMsg}
        </p>
      )}

      <Tabs tabs={SALE_TABS} active={saleTab} onChange={setSaleTab}>
        {saleTab === "venta" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Precio y gastos de venta">
              <div className="mb-6">
                <Input
                  label="Precio de venta final"
                  type="number"
                  placeholder={String(sugerida)}
                  value={venta || ""}
                  onChange={(e) => setVenta(Number(e.target.value))}
                />
                <Button
                  variant="ghost"
                  type="button"
                  className="mt-2"
                  onClick={() => setVenta(sugerida)}
                >
                  Usar precio sugerido (${sugerida.toLocaleString()})
                </Button>
              </div>

              <div className="flex flex-col gap-6">
                <GastoBlock
                  title="Plusvalía"
                  values={plusvalia}
                  onChange={(field, value) =>
                    setPlusvalia((p) => ({ ...p, [field]: value }))
                  }
                />
                <GastoBlock
                  title="Otros gastos"
                  values={otros}
                  onChange={(field, value) => setOtros((p) => ({ ...p, [field]: value }))}
                />
              </div>
            </Card>

            <Card title="Vista previa">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--oikia-text-muted)]">Precio venta</dt>
                  <dd className="font-semibold">${venta.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--oikia-text-muted)]">Gastos venta</dt>
                  <dd className="font-semibold">${gastosVenta.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between border-t border-[var(--oikia-border)] pt-3">
                  <dt className="text-[var(--oikia-text-muted)]">Beneficio neto</dt>
                  <dd
                    className={`text-lg font-bold ${
                      beneficioReal >= 0 ? "text-[var(--oikia-accent)]" : "text-[var(--oikia-danger)]"
                    }`}
                  >
                    ${beneficioReal.toLocaleString()}
                  </dd>
                </div>
              </dl>
              <Button
                className="mt-6 w-full"
                onClick={guardarVenta}
                disabled={guardando}
              >
                {guardando ? "Guardando…" : "Guardar venta"}
              </Button>
            </Card>
          </div>
        )}

        {saleTab === "resultados" && (
          <Card title="Resumen de la operación">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-[var(--oikia-surface-muted)] p-4 text-center">
                <p className="text-xs text-[var(--oikia-text-muted)]">Ingreso</p>
                <p className="text-2xl font-bold text-[var(--oikia-primary)]">
                  ${venta.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-[var(--oikia-surface-muted)] p-4 text-center">
                <p className="text-xs text-[var(--oikia-text-muted)]">Gastos + costo</p>
                <p className="text-2xl font-bold text-[var(--oikia-warning)]">
                  ${(gastosVenta + costo).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-xs text-[var(--oikia-text-muted)]">Beneficio</p>
                <p className="text-2xl font-bold text-[var(--oikia-accent)]">
                  ${beneficioReal.toLocaleString()}
                </p>
              </div>
            </div>
            <Button className="mt-6" onClick={guardarVenta} disabled={guardando}>
              Confirmar y guardar venta
            </Button>
          </Card>
        )}
      </Tabs>
    </AppShell>
  );
}
