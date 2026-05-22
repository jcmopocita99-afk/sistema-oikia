import { google } from "googleapis";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.codigo) {
      return Response.json({ error: "Falta código" }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve("./sistema-oikia-1060432aa38e.json"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const detalle = `
⚖️ Abogado
Factura: ${data.abogado_factura || "-"}
Valor: $${data.abogado_valor || 0}
Concepto: ${data.abogado_concepto || "-"}

🏛 Alcabala
Factura: ${data.alcabala_factura || "-"}
Valor: $${data.alcabala_valor || 0}
Concepto: ${data.alcabala_concepto || "-"}

📑 Registro
Factura: ${data.registro_factura || "-"}
Valor: $${data.registro_valor || 0}
Concepto: ${data.registro_concepto || "-"}

🏢 Notaría
Factura: ${data.notaria_factura || "-"}
Valor: $${data.notaria_valor || 0}
Concepto: ${data.notaria_concepto || "-"}

📋 Otros
Factura: ${data.otros_factura || "-"}
Valor: $${data.otros_valor || 0}
Concepto: ${data.otros_concepto || "-"}
`;

    const values = [[
      Date.now().toString(),
      "1",
      data.codigo,
      new Date().toISOString(),
      "",
      Number(data.costo || 0),
      Number(data.venta || 0),
      Number(data.gastos || 0),
      "Disponible",
      detalle
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID!,
      range: "Terrenos!A:J",
      valueInputOption: "RAW",
      requestBody: { values },
    });

    return Response.json({ ok: true });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}
