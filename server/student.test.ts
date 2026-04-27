import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// DB・Sheetsをモック
vi.mock("./db", () => ({
  getStudentByLoginId: vi.fn(),
  getStudentById: vi.fn(),
  getAllStudents: vi.fn(),
  createStudent: vi.fn(),
  updateStudentSheetRow: vi.fn(),
}));

vi.mock("./sheets", () => ({
  appendUsernameToSheet: vi.fn().mockResolvedValue(2),
  fetchSheetData: vi.fn().mockResolvedValue([]),
  fetchScoreByUsername: vi.fn().mockResolvedValue(null),
}));

import * as db from "./db";
import bcrypt from "bcryptjs";

function createCtx(): TrpcContext {
  const cookies: Record<string, string> = {};
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies,
    } as unknown as TrpcContext["req"],
    res: {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("student.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("新規ユーザーを登録できる", async () => {
    vi.mocked(db.getStudentByLoginId)
      .mockResolvedValueOnce(undefined) // 重複チェック
      .mockResolvedValueOnce({
        id: 1,
        loginId: "YamadaTaro",
        passwordHash: "hash",
        sheetRow: null,
        createdAt: new Date(),
      }); // 登録後取得
    vi.mocked(db.createStudent).mockResolvedValue(undefined);
    vi.mocked(db.updateStudentSheetRow).mockResolvedValue(undefined);

    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.student.register({
      loginId: "YamadaTaro",
      password: "password123",
    });

    expect(result.success).toBe(true);
    expect(result.loginId).toBe("YamadaTaro");
  });

  it("IDが重複している場合はエラーになる", async () => {
    vi.mocked(db.getStudentByLoginId).mockResolvedValue({
      id: 1,
      loginId: "ExistingUser",
      passwordHash: "hash",
      sheetRow: null,
      createdAt: new Date(),
    });

    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.student.register({
        loginId: "ExistingUser",
        password: "password123",
      })
    ).rejects.toThrow("このIDはすでに使用されています");
  });
});

describe("student.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正しい認証情報でログインできる", async () => {
    const hash = await bcrypt.hash("correctpass", 12);
    vi.mocked(db.getStudentByLoginId).mockResolvedValue({
      id: 1,
      loginId: "InamuraJIN",
      passwordHash: hash,
      sheetRow: null,
      createdAt: new Date(),
    });

    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.student.login({
      loginId: "InamuraJIN",
      password: "correctpass",
    });

    expect(result.success).toBe(true);
    expect(result.loginId).toBe("InamuraJIN");
  });

  it("パスワードが間違っている場合はエラーになる", async () => {
    const hash = await bcrypt.hash("correctpass", 12);
    vi.mocked(db.getStudentByLoginId).mockResolvedValue({
      id: 1,
      loginId: "InamuraJIN",
      passwordHash: hash,
      sheetRow: null,
      createdAt: new Date(),
    });

    const ctx = createCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.student.login({ loginId: "InamuraJIN", password: "wrongpass" })
    ).rejects.toThrow("IDまたはパスワードが正しくありません");
  });
});
