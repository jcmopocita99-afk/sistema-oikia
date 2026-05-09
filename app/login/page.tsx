'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ usuario, password }),
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    router.push("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔐 Login Sistema Oikia</h1>

      <input
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>Ingresar</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}