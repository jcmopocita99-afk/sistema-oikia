import { google } from "googleapis";
import path from "path";

export async function POST(req: Request) {
  const { usuario, password } = await req.json();

  try {
    const keyFilePath = path.resolve("./sistema-oikia-1060432aa38e.json");

    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "'Usuarios'!A2:C",
    });

    const rows = res.data.values || [];

    // 🔍 buscar usuario
    const user = rows.find(
      (row) => row[0] === usuario && row[1] === password
    );

    if (!user) {
      return Response.json({ error: "Credenciales incorrectas" });
    }

    return Response.json({
      usuario: user[0],
      rol: user[2],
    });

  } catch (error) {
    return Response.json({ error: String(error) });
  }
}
``