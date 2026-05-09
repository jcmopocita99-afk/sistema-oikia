export async function POST(req: Request) {
  const { usuario, password } = await req.json();

  // usuarios simulados (luego los sacamos del Sheet)
  const users = [
    { usuario: "admin", password: "admin123", rol: "admin" },
    { usuario: "operador", password: "operador123", rol: "operador" },
  ];

  const user = users.find(
    (u) => u.usuario === usuario && u.password === password
  );

  if (!user) {
    return Response.json({ error: "Credenciales incorrectas" });
  }

  return Response.json({
    usuario: user.usuario,
    rol: user.rol,
  });
}
``