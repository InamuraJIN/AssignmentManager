import { google } from "googleapis";

// スプレッドシートIDは環境変数から取得（外部から差し替え可能）
function getSpreadsheetId(): string {
  const url = process.env.GOOGLE_SPREADSHEET_URL || "";
  // URL形式: https://docs.google.com/spreadsheets/d/{ID}/edit...
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  // IDが直接指定されている場合
  return process.env.GOOGLE_SPREADSHEET_ID || "";
}

function getSheetName(): string {
  return process.env.GOOGLE_SHEET_NAME || "Sheet1";
}

async function getAuthClient() {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");
  }
  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth;
}

/**
 * スプレッドシートにユーザー名を新しい行として追記する
 * 戻り値: 追記された行番号（1始まり）
 */
export async function appendUsernameToSheet(username: string): Promise<number> {
  const spreadsheetId = getSpreadsheetId();
  if (!spreadsheetId) throw new Error("Spreadsheet ID is not configured");

  const auth = await getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const sheetName = getSheetName();

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:A`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[username]],
    },
  });

  // 追記された範囲から行番号を取得
  const updatedRange = response.data.updates?.updatedRange || "";
  const rowMatch = updatedRange.match(/(\d+)$/);
  const rowNumber = rowMatch ? parseInt(rowMatch[1], 10) : 0;
  return rowNumber;
}

/**
 * スプレッドシートから全データを取得する
 * 想定フォーマット: A列=ユーザー名, B列以降=採点結果
 */
export async function fetchSheetData(): Promise<{ username: string; scores: string[] }[]> {
  const spreadsheetId = getSpreadsheetId();
  if (!spreadsheetId) return [];

  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });
    const sheetName = getSheetName();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values || [];
    return rows
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

/**
 * 特定ユーザー名の採点結果をスプレッドシートから取得する
 */
export async function fetchScoreByUsername(username: string): Promise<string[] | null> {
  const data = await fetchSheetData();
  const found = data.find((row) => row.username === username);
  return found ? found.scores : null;
}
