'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const [terrenos, setTerrenos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // 🔐 PROTECCIÓN DE LOGIN
  useEffect(() => {
    const session = localStorage.getItem("user");

    if (!session) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(session);
    setUser(parsedUser);

    fetch("/api/terrenos")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTerrenos(data);
        }
      });

  }, []);

  // 📊 KPIs
  const totalCosto = terrenos.reduce((sum, t) => sum + Number(t[5] || 0), 0);
  const totalVenta = terrenos.reduce((sum, t) => sum + Number(t[6] || 0), 0);
  const totalGastos = terrenos.reduce((sum, t) => sum + Number(t[7] || 0), 0);

  const utilidadTotal = totalVenta - totalCosto - totalGastos;

  const rentabilidad =
    totalCosto > 0 ? ((utilidadTotal / totalCosto) * 100).toFixed(2) : 0;

  return (
    <div style={{ padding: 20 }}>

      {/* 👤 USUARIO */}
      <h2>
        👤 {user?.usuario} ({user?.rol})
      </h2>

      <h1>🏘 Oikia Santa Rosa – Control Financiero</h1>

      {/* 🔐 LOGOUT */}
      <button onClick={() => {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }}>
        Cerrar sesión
      </button>

      {/* 📊 KPIs */}
      <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>

        <div style={boxStyle}>
          <h3>💰 Inversión</h3>
          <p>${totalCosto}</p>
        </div>

        <div style={boxStyle}>
          <h3>📈 Venta Total</h3>
          <p>${totalVenta}</p>
        </div>

        <div style={boxStyle}>
          <h3>💸 Gastos</h3>
          <p>${totalGastos}</p>
        </div>

        <div style={boxStyle}>
          <h3>✅ Utilidad</h3>
          <p style={{ color: utilidadTotal >= 0 ? "green" : "red" }}>
            ${utilidadTotal}
          </p>
        </div>

        <div style={boxStyle}>
          <h3>📊 Rentabilidad</h3>
          <p>{rentabilidad}%</p>
        </div>

      </div>

      {/* 🔐 SOLO ADMIN */}
      {user?.rol === "admin" && (
        <div style={{ marginTop: 20 }}>
          <button style={{ background: "#0070f3", color: "white", padding: 10 }}>
            ➕ Agregar terreno (admin)
          </button>
        </div>
      )}

      {/* 📋 TABLA */}
      <table border="1" cellPadding="8" style={{ marginTop: 30, width: "100%" }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Área</th>
            <th>Costo</th>
            <th>Venta</th>
            <th>Gastos</th>
            <th>Utilidad</th>
          </tr>
        </thead>

        <tbody>
          {terrenos.length === 0 ? (
            <tr>
              <td colSpan={6}>No hay datos</td>
            </tr>
          ) : (
            terrenos.map((t, i) => {

              const costo = Number(t[5] || 0);
              const venta = Number(t[6] || 0);
              const gastos = Number(t[7] || 0);

              const utilidad = venta - costo - gastos;

              return (
                <tr key={i}>
                  <td>{t[2]}</td>
                  <td>{t[4]}</td>
                  <td>${costo}</td>
                  <td>${venta}</td>
                  <td>${gastos}</td>
                  <td style={{ color: utilidad >= 0 ? "green" : "red" }}>
                    ${utilidad}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>

      </table>

    </div>
  );
}


// 🎨 Estilo
const boxStyle = {
  border: "1px solid #ccc",
  borderRadius: 10,
  padding: 15,
  width: 160,
  textAlign: "center" as const,
  background: "#f5f5f5"
};