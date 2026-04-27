import { describe, expect, it, vi } from "vitest";

// googleapis をモックして単体テストとして実行
vi.mock("googleapis", () => {
  const mockAppend = vi.fn().mockResolvedValue({
    data: {
      updates: { updatedRange: "Sheet1!A2" },
    },
  });
  const mockGet = vi.fn().mockResolvedValue({
    data: {
      values: [
        ["山田太郎", "85", "90"],
        ["鈴木花子", "78"],
        ["", ""],
      ],
    },
  });
  return {
    google: {
      auth: {
        GoogleAuth: vi.fn().mockImplementation(() => ({})),
      },
      sheets: vi.fn().mockReturnValue({
        spreadsheets: {
          values: {
            append: mockAppend,
            get: mockGet,
          },
        },
      }),
    },
  };
});

// 環境変数をセット
process.env.GOOGLE_SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/test-id/edit";
process.env.GOOGLE_SHEET_NAME = "Sheet1";
process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
  type: "service_account",
  project_id: "test",
  private_key_id: "key-id",
  private_key: "-----BEGIN RSA PRIVATE KEY-----\ntest\n-----END RSA PRIVATE KEY-----\n",
  client_email: "test@test.iam.gserviceaccount.com",
  client_id: "123",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
});

import { appendUsernameToSheet, fetchSheetData, fetchScoreByUsername } from "./sheets";

describe("sheets.appendUsernameToSheet", () => {
  it("ユーザー名を追記して行番号を返す", async () => {
    const row = await appendUsernameToSheet("テストユーザー");
    expect(row).toBe(2);
  });
});

describe("sheets.fetchSheetData", () => {
  it("空行を除いてデータを返す", async () => {
    const data = await fetchSheetData();
    expect(data).toHaveLength(2);
    expect(data[0].username).toBe("山田太郎");
    expect(data[0].scores).toEqual(["85", "90"]);
    expect(data[1].username).toBe("鈴木花子");
    expect(data[1].scores).toEqual(["78"]);
  });
});

describe("sheets.fetchScoreByUsername", () => {
  it("ユーザー名に対応するスコアを返す", async () => {
    const scores = await fetchScoreByUsername("山田太郎");
    expect(scores).toEqual(["85", "90"]);
  });

  it("存在しないユーザー名はnullを返す", async () => {
    const scores = await fetchScoreByUsername("存在しないユーザー");
    expect(scores).toBeNull();
  });
});
