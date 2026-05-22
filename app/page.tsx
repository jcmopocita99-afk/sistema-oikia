'use client';

import { useEffect, useState } from "react";

export default function Home() {

  const [terrenos, setTerrenos] = useState<any[]>([]);
  const [detalleActivo, setDetalleActivo] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const [porcentaje, setPorcentaje] = useState(35);
  const [descuento, setDescuento] = useState(10);

  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
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
    otros_concepto: ""
  });

  useEffect(() => {
    cargar();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const cargar = async () => {
    try {
      const res = await fetch("/api/terrenos");
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Error al cargar");

      setTerrenos(data);

    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const gastos =
    Number(form.abogado_valor || 0) +
    Number(form.alcabala_valor || 0) +
    Number(form.registro_valor || 0) +
    Number(form.notaria_valor || 0) +
    Number(form.otros_valor || 0);

  const costoReal = Number(form.costo || 0) + gastos;

  const ventaSugerida = Math.round(costoReal * (1 + porcentaje / 100));

  const ventaMinima = Math.round(ventaSugerida * (1 - descuento / 100));

  const guardar = async () => {
    try {

      const payload = {
        ...form,
        costo: costoReal,
        venta: ventaSugerida,
        gastos
      };

      const res = await fetch("/api/crear-terreno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("✅ Guardado");
      cargar();

    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  return (
    <div style={{
      padding: 20,
      minHeight: "100vh",
      backgroundImage: "url('/logo.png')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "250px",
      backgroundColor: "#f5f5f5"
    }}>

      <h2>🏘 Sistema Oikia</h2>

      <button onClick={cerrarSesion}>
        🔒 Cerrar sesión
      </button>
<button
  style={{
    padding: "8px 15px",
    background: "#1B4F72",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginLeft: 10
  }}
  onClick={() => window.location.href = "/ventas"}
>
  💼 Ir a Ventas
</button>
``
      {errorMsg && <p>⚠ {errorMsg}</p>}

      <h4>Ganancia %</h4>
      <input type="number" value={porcentaje}
        onChange={e => setPorcentaje(Number(e.target.value))}/>

      <h4>Descuento %</h4>
      <input type="number" value={descuento}
        onChange={e => setDescuento(Number(e.target.value))}/>

      <br />

      <input placeholder="Código"
        onChange={e => setForm({...form, codigo: e.target.value})}/>

      <input placeholder="Costo base"
        onChange={e => setForm({...form, costo: e.target.value})}/>

      <h4>Abogado</h4>
      <input placeholder="Factura"
        onChange={e => setForm({...form, abogado_factura: e.target.value})}/>
      <input placeholder="Valor"
        onChange={e => setForm({...form, abogado_valor: e.target.value})}/>
      <input placeholder="Concepto"
        onChange={e => setForm({...form, abogado_concepto: e.target.value})}/>

      <h4>Alcabala</h4>
      <input placeholder="Factura"
        onChange={e => setForm({...form, alcabala_factura: e.target.value})}/>
      <input placeholder="Valor"
        onChange={e => setForm({...form, alcabala_valor: e.target.value})}/>
      <input placeholder="Concepto"
        onChange={e => setForm({...form, alcabala_concepto: e.target.value})}/>

      <h4>Registro</h4>
      <input placeholder="Factura"
        onChange={e => setForm({...form, registro_factura: e.target.value})}/>
      <input placeholder="Valor"
        onChange={e => setForm({...form, registro_valor: e.target.value})}/>
      <input placeholder="Concepto"
        onChange={e => setForm({...form, registro_concepto: e.target.value})}/>

      <h4>Notaría</h4>
      <input placeholder="Factura"
        onChange={e => setForm({...form, notaria_factura: e.target.value})}/>
      <input placeholder="Valor"
        onChange={e => setForm({...form, notaria_valor: e.target.value})}/>
      <input placeholder="Concepto"
        onChange={e => setForm({...form, notaria_concepto: e.target.value})}/>

      <h4>Otros</h4>
      <input placeholder="Factura"
        onChange={e => setForm({...form, otros_factura: e.target.value})}/>
      <input placeholder="Valor"
        onChange={e => setForm({...form, otros_valor: e.target.value})}/>
      <input placeholder="Concepto"
        onChange={e => setForm({...form, otros_concepto: e.target.value})}/>

      <br />
      <button onClick={guardar}>💾 Guardar</button>

      <h4>💸 Gastos: ${gastos}</h4>
      <h4>💰 Costo Real: ${costoReal}</h4>
      <h4>📈 Venta sugerida: ${ventaSugerida}</h4>
      <h4>🔻 Venta mínima: ${ventaMinima}</h4>

      <table border="1" style={{ marginTop: 20 }}>
        <tbody>
          {terrenos.map((t, i) => (
            <tr key={i}>
              <td>{t[2]}</td>
              <td>${t[5]}</td>
              <td>
                <button onClick={() => {
                  setDetalleActivo(t[9] || "Sin detalle");
                  setMostrarModal(true);
                }}>
                  📄 Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)"
        }}>
          <div style={{
            background: "white",
            padding: 20,
            margin: "100px auto",
            width: 400
          }}>
            <pre>{detalleActivo}</pre>
            <button onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}