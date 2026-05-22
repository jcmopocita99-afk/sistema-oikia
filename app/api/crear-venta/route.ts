import { google } from "googleapis";
import path from "path";

export async function POST(req: Request) {
  try {

    const data = await req.json();

    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve("./sistema-oikia-1060432aa38e.json"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const values = [[
      Date.now().toString(),
      data.codigo,
      Number(data.venta),
      Number(data.plusvalia),
      Number(data.otros),
      Number(data.beneficio),
      new Date().toISOString()
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Ventas!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: { values }
    });

    return Response.json({ ok: true });

  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error guardando venta" });
  }
}