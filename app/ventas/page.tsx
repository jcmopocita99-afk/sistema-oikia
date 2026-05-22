'use client';

import { useEffect, useState } from "react";

export default function Ventas() {

  const [terrenos, setTerrenos] = useState<any[]>([]);
  const [seleccionado, setSeleccionado] = useState<any>(null);

  const [plusvalia, setPlusvalia] = useState({
    factura: "",
    valor: "",
    concepto: ""
  });

  const [otros, setOtros] = useState({
    factura: "",
    valor: "",
    concepto: ""
  });

  const [venta, setVenta] = useState(0);

  useEffect(() => {
    fetch("/api/terrenos")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTerrenos(data);
      });
  }, []);

  if (!seleccionado) {
    return (
      <div style={{ padding: 20 }}>

        <h2>🏡 Módulo Ventas</h2>

        <h3>Selecciona un terreno</h3>

        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Código</th>
              <th>Costo</th>
              <th>Venta sugerida</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {terrenos.map((t, i) => (
              <tr key={i}>
                <td>{t[2]}</td>
                <td>${t[5]}</td>
                <td>${t[6]}</td>

                <td>
                  <button onClick={() => setSeleccionado(t)}>
                    ✅ Seleccionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    );
  }

  const costo = Number(seleccionado[5]);
  const sugerida = Number(seleccionado[6]);

  const gastosVenta =
    Number(plusvalia.valor || 0) +
    Number(otros.valor || 0);

  const beneficioReal = venta - gastosVenta;

  return (
    <div style={{ padding: 20 }}>

      <button onClick={() => setSeleccionado(null)}>
        ← Volver
      </button>

      <h2>💼 Venta Terreno</h2>

      <h3>Terreno: {seleccionado[2]}</h3>

      <p>💰 Costo Real: ${costo}</p>
      <p>📈 Venta Sugerida: ${sugerida}</p>

      <h3>Precio Venta Final</h3>
      <input
        type="number"
        placeholder="Valor de venta"
        onChange={e => setVenta(Number(e.target.value))}
      />

      <h3>🏛 Plusvalía</h3>
      <input placeholder="Factura"
        onChange={e => setPlusvalia({...plusvalia, factura: e.target.value})}/>
      <input placeholder="Valor"
        onChange={e => setPlusvalia({...plusvalia, valor: e.target.value})}/>
      <input placeholder="Concepto"
        onChange={e => setPlusvalia({...plusvalia, concepto: e.target.value})}/>

      <h3>📋 Otros</h3>
      <input placeholder="Factura"
        onChange={e => setOtros({...otros, factura: e.target.value})}/>
      <input placeholder="Valor"
        onChange={e => setOtros({...otros, valor: e.target.value})}/>
      <input placeholder="Concepto"
        onChange={e => setOtros({...otros, concepto: e.target.value})}/>

      <h3>📊 Resultados</h3>

      <p>💸 Gastos Venta: ${gastosVenta}</p>
      <p>✅ Beneficio Real: ${beneficioReal}</p>

    </div>
  );
}
const guardarVenta = async () => {

  const payload = {
    codigo: seleccionado[2],
    venta: venta,
    plusvalia: Number(plusvalia.valor || 0),
    otros: Number(otros.valor || 0),
    beneficio: beneficioReal
  };
<button onClick={guardarVenta}>
  💾 Guardar Venta
</button>
  const res = await fetch("/api/crear-venta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (data.error) {
    alert("❌ Error");
    return;
  }

  alert("✅ Venta guardada");

};
