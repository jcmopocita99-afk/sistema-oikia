import { google } from "googleapis";

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.cwd() + "/sistema-oikia-1060432aa38e.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "'Terrenos'!A2:I100",
    });

    return Response.json(res.data.values || []);
  } catch (error) {
    return Response.json({ error: String(error) });
  }
}