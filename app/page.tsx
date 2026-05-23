"use client";

import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { GastoBlock } from "./components/GastoBlock";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Modal } from "./components/ui/Modal";
import { Tabs, type TabItem } from "./components/ui/Tabs";

const TABS: TabItem[] = [
  { id: "registrar", label: "Registrar", icon: "➕" },
  { id: "inventario", label: "Inventario", icon: "📋" },
  { id: "parametros", label: "Parámetros", icon: "⚙️" },
];

const GASTO_KEYS = [
  "abogado",
  "alcabala",
  "registro",
  "notaria",
  "otros",
] as const;

type GastoKey = (typeof GASTO_KEYS)[number];

const GASTO_LABELS: Record<GastoKey, string> = {
  abogado: "Abogado",
  alcabala: "Alcabala",
  registro: "Registro",
  notaria: "Notaría",
  otros: "Otros",
};

type FormState = {
  codigo: string;
  costo: string;
} & Record<`${GastoKey}_factura` | `${GastoKey}_valor` | `${GastoKey}_concepto`, string>;

const emptyForm = (): FormState => ({
  codigo: "",
  costo: "",
  abogado_factura: "",
  abogado_valor: "",
  abogado_concepto: "",
  alcabala_factura: "",
  alcabala_valor: "",
  alcabala_concepto: "",
  registro_factura: "",
  registro_valor: "",
  registro_concepto: "",
  notaria_factura: "",
  notaria_valor: "",
  notaria_concepto: "",
  otros_factura: "",
  otros_valor: "",
  otros_concepto: "",
});

export default function Home() {
  const [tab, setTab] = useState("registrar");
  const [terrenos, setTerrenos] = useState<string[][]>([]);
  const [detalleActivo, setDetalleActivo] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [porcentaje, setPorcentaje] = useState(35);
  const [descuento, setDescuento] = useState(10);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      const res = await fetch("/api/terrenos");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(data.error ?? "Error al cargar terrenos");
      setTerrenos(data);
      setErrorMsg("");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Error al cargar");
    }
  };

  const gastos = GASTO_KEYS.reduce(
    (sum, key) => sum + Number(form[`${key}_valor`] || 0),
    0
  );

  const costoReal = Number(form.costo || 0) + gastos;
  const ventaSugerida = Math.round(costoReal * (1 + porcentaje / 100));
  const ventaMinima = Math.round(ventaSugerida * (1 - descuento / 100));

  const updateGasto = (key: GastoKey, field: "factura" | "valor" | "concepto", value: string) => {
    setForm((prev) => ({ ...prev, [`${key}_${field}`]: value }));
  };

  const guardar = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!form.codigo.trim()) {
      setErrorMsg("El código del terreno es obligatorio.");
      setTab("registrar");
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        ...form,
        costo: costoReal,
        venta: ventaSugerida,
        gastos,
      };

      const res = await fetch("/api/crear-terreno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al guardar");

      setSuccessMsg("Terreno registrado correctamente.");
      setForm(emptyForm());
      await cargar();
      setTab("inventario");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AppShell
      title="Terrenos"
      subtitle="Registro, costos y listado de propiedades"
    >
      {(errorMsg || successMsg) && (
        <div className="mb-4 space-y-2">
          {errorMsg && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-[var(--oikia-danger)]">
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-[var(--oikia-accent)]">
              {successMsg}
            </p>
          )}
        </div>
      )}

      <Tabs tabs={TABS} active={tab} onChange={setTab}>
        {tab === "registrar" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <Card title="Datos del terreno" subtitle="Información base y gastos asociados">
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Código"
                  placeholder="Ej. T-001"
                  value={form.codigo}
                  onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                />
                <Input
                  label="Costo base"
                  type="number"
                  placeholder="0"
                  value={form.costo}
                  onChange={(e) => setForm({ ...form, costo: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-6">
                {GASTO_KEYS.map((key) => (
                  <GastoBlock
                    key={key}
                    title={GASTO_LABELS[key]}
                    values={{
                      factura: form[`${key}_factura`],
                      valor: form[`${key}_valor`],
                      concepto: form[`${key}_concepto`],
                    }}
                    onChange={(field, value) => updateGasto(key, field, value)}
                  />
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={guardar} disabled={guardando}>
                  {guardando ? "Guardando…" : "Guardar terreno"}
                </Button>
                <Button variant="secondary" type="button" onClick={() => setForm(emptyForm())}>
                  Limpiar formulario
                </Button>
              </div>
            </Card>

            <Card title="Resumen" subtitle="Cálculo en tiempo real">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-[var(--oikia-border)] pb-2">
                  <dt className="text-[var(--oikia-text-muted)]">Gastos</dt>
                  <dd className="font-semibold">${gastos.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between border-b border-[var(--oikia-border)] pb-2">
                  <dt className="text-[var(--oikia-text-muted)]">Costo real</dt>
                  <dd className="font-semibold">${costoReal.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between border-b border-[var(--oikia-border)] pb-2">
                  <dt className="text-[var(--oikia-text-muted)]">Venta sugerida</dt>
                  <dd className="font-semibold text-[var(--oikia-accent)]">
                    ${ventaSugerida.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--oikia-text-muted)]">Venta mínima</dt>
                  <dd className="font-semibold text-[var(--oikia-warning)]">
                    ${ventaMinima.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        )}

        {tab === "inventario" && (
          <Card
            title="Inventario de terrenos"
            subtitle={`${terrenos.length} registro(s)`}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--oikia-border)] bg-[var(--oikia-surface-muted)] text-left">
                    <th className="px-3 py-2 font-semibold">Código</th>
                    <th className="px-3 py-2 font-semibold">Costo real</th>
                    <th className="px-3 py-2 font-semibold">Venta sugerida</th>
                    <th className="px-3 py-2 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {terrenos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-[var(--oikia-text-muted)]">
                        No hay terrenos registrados. Usa la pestaña Registrar.
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
                          <Button
                            variant="secondary"
                            type="button"
                            onClick={() => {
                              setDetalleActivo(t[9] || "Sin detalle registrado.");
                              setMostrarModal(true);
                            }}
                          >
                            Ver detalle
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button variant="ghost" type="button" onClick={cargar}>
                Actualizar listado
              </Button>
            </div>
          </Card>
        )}

        {tab === "parametros" && (
          <Card
            title="Parámetros de cálculo"
            subtitle="Afectan la venta sugerida y mínima de nuevos terrenos"
          >
            <div className="grid max-w-md gap-4">
              <Input
                label="Ganancia (%)"
                type="number"
                value={porcentaje}
                onChange={(e) => setPorcentaje(Number(e.target.value))}
              />
              <Input
                label="Descuento máximo (%)"
                type="number"
                value={descuento}
                onChange={(e) => setDescuento(Number(e.target.value))}
              />
            </div>
            <p className="mt-4 text-sm text-[var(--oikia-text-muted)]">
              Con ganancia {porcentaje}% y descuento {descuento}%, un costo de $100.000
              sugiere venta ${Math.round(100000 * (1 + porcentaje / 100)).toLocaleString()}{" "}
              y mínima $
              {Math.round(
                100000 * (1 + porcentaje / 100) * (1 - descuento / 100)
              ).toLocaleString()}
              .
            </p>
          </Card>
        )}
      </Tabs>

      <Modal open={mostrarModal} title="Detalle del terreno" onClose={() => setMostrarModal(false)}>
        <pre className="whitespace-pre-wrap rounded-lg bg-[var(--oikia-surface-muted)] p-3 text-sm">
          {detalleActivo}
        </pre>
      </Modal>
    </AppShell>
  );
}
