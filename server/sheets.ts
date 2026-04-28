import { sheets as sheetsApi } from "@googleapis/sheets";
import { JWT } from "google-auth-library";

function getSpreadsheetId(): string {
  const url = process.env.GOOGLE_SPREADSHEET_URL || "";
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  return process.env.GOOGLE_SPREADSHEET_ID || "";
}

function getSheetName(): string {
  return process.env.GOOGLE_SHEET_NAME || "Sheet1";
}

async function getAuthenticatedSheets() {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");
  }
  const credentials = JSON.parse(credentialsJson) as {
    client_email: string;
    private_key: string;
  };
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return sheetsApi({ version: "v4", auth: auth as any });
}

export async function appendUsernameToSheet(loginId: string): Promise<number> {
  const spreadsheetId = getSpreadsheetId();
  if (!spreadsheetId) throw new Error("Spreadsheet ID is not configured");
  const sheetsClient = await getAuthenticatedSheets();
  const sheetName = getSheetName();
  const response = await sheetsClient.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:A`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[loginId]],
    },
  });
  const updatedRange = response.data.updates?.updatedRange || "";
  const rowMatch = updatedRange.match(/(\d+)$/);
  const rowNumber = rowMatch ? parseInt(rowMatch[1], 10) : 0;
  return rowNumber;
}

export type ScoreData = {
  total: number | null;
  totalMax: number | null;
  videoSubmitted: boolean | null;
  hasScore: boolean;
};

export async function fetchSheetData(): Promise<{ username: string; scores: string[] }[]> {
  const spreadsheetId = getSpreadsheetId();
  if (!spreadsheetId) return [];
  try {
    const sheetsClient = await getAuthenticatedSheets();
    const sheetName = getSheetName();
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:AZ`,
    });
    const rows: string[][] = (response.data.values || []) as string[][];
    if (rows.length === 0) return [];

    const dataRows = rows.slice(1);

    return dataRows
      .filter((row) => row[0] && String(row[0]).trim() !== "")
      .map((row) => ({
        username: String(row[0]).trim(),
        scores: row.slice(1).map((v) => String(v ?? "")),
      }));
  } catch (error) {
    console.error("[Sheets] Failed to fetch data:", error);
    return [];
  }
}

export async function fetchScoreByUsername(loginId: string): Promise<{ scores: string[]; scoreData: ScoreData } | null> {
  const spreadsheetId = getSpreadsheetId();
  if (!spreadsheetId) return null;
  try {
    const sheetsClient = await getAuthenticatedSheets();
    const sheetName = getSheetName();
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:AZ`,
    });
    const rows: string[][] = (response.data.values || []) as string[][];
    if (rows.length === 0) return null;

    const headerRow = rows[0].map((h) => String(h ?? "").trim());

    const totalColIndex = headerRow.findIndex((h) => h === "TotalScore");
    const videoColIndex = headerRow.findIndex((h) => h === "VideoSubmission");
    const totalMaxColIndex = headerRow.findIndex((h) => h === "MaxScore");

    const dataRows = rows.slice(1);
    const found = dataRows.find((row) => String(row[0] ?? "").trim() === loginId);
    if (!found) return null;

    const scores = found.slice(1).map((v) => String(v ?? ""));

    let total: number | null = null;
    let totalMax: number | null = null;
    let videoSubmitted: boolean | null = null;

    if (totalColIndex >= 1) {
      const val = found[totalColIndex];
      if (val !== undefined && val !== "") {
        total = parseFloat(String(val));
        if (isNaN(total)) total = null;
      }
    }

    if (totalMaxColIndex >= 1) {
      const val = found[totalMaxColIndex];
      if (val !== undefined && val !== "") {
        totalMax = parseFloat(String(val));
        if (isNaN(totalMax)) totalMax = null;
      }
    }

    if (videoColIndex >= 1) {
      const val = found[videoColIndex];
      if (val !== undefined && val !== "") {
        videoSubmitted = String(val).trim() === "1";
      }
    }

    const hasScore = total !== null;

    return {
      scores,
      scoreData: { total, totalMax, videoSubmitted, hasScore },
    };
  } catch (error) {
    console.error("[Sheets] Failed to fetch score:", error);
    return null;
  }
}