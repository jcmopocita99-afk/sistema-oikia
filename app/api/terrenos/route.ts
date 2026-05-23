import { google } from "googleapis";
import path from "path";

export async function GET() {
  try {
    if (!process.env.SHEET_ID) {
      return Response.json(
        { error: "Variable de entorno SHEET_ID no configurada." },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve("./sistema-oikia-1060432aa38e.json"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Terrenos!A:J",
    });

    const rows: string[][] = (response.data.values ?? []) as string[][];

    const dataRows = rows.filter((row) => {
      const id = row[0];
      return id && id !== "ID" && id !== "id" && id.trim() !== "";
    });

    return Response.json(dataRows);
  } catch (error: unknown) {
    console.error("[GET /api/terrenos] Error:", error);
    const message =
      error instanceof Error ? error.message : "Error interno del servidor.";
    return Response.json({ error: message }, { status: 500 });
  }
}
