import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  createStudent,
  getAllStudents,
  getStudentByLoginId,
  getStudentByUsername,
  getStudentById,
  updateStudentSheetRow,
} from "../db";
import { appendUsernameToSheet, fetchScoreByUsername, fetchSheetData } from "../sheets";
import { publicProcedure, router } from "../_core/trpc";

const JWT_SECRET = process.env.JWT_SECRET || "student-secret-key";

function signStudentToken(studentId: number): string {
  return jwt.sign({ studentId }, JWT_SECRET, { expiresIn: "7d" });
}

function verifyStudentToken(token: string): { studentId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { studentId: number };
  } catch {
    return null;
  }
}

const STUDENT_COOKIE = "student_session";

export const studentRouter = router({
  // 生徒登録
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(1).max(100),
        loginId: z.string().min(3).max(100),
        password: z.string().min(6).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 重複チェック
      const existingUsername = await getStudentByUsername(input.username);
      if (existingUsername) {
        throw new TRPCError({ code: "CONFLICT", message: "このユーザー名はすでに使用されています" });
      }
      const existingLoginId = await getStudentByLoginId(input.loginId);
      if (existingLoginId) {
        throw new TRPCError({ code: "CONFLICT", message: "このログインIDはすでに使用されています" });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      await createStudent({
        username: input.username,
        loginId: input.loginId,
        passwordHash,
      });

      // 登録後に再取得してIDを得る
      const student = await getStudentByLoginId(input.loginId);
      if (!student) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // スプレッドシートにユーザー名を追記（エラーでも登録は成功扱い）
      try {
        const rowNumber = await appendUsernameToSheet(input.username);
        if (rowNumber > 0) {
          await updateStudentSheetRow(student.id, rowNumber);
        }
      } catch (e) {
        console.error("[Sheets] Failed to append username:", e);
      }

      // セッションクッキーを発行
      const token = signStudentToken(student.id);
      ctx.res.cookie(STUDENT_COOKIE, token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return { success: true, username: student.username };
    }),

  // ログイン
  login: publicProcedure
    .input(
      z.object({
        loginId: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const student = await getStudentByLoginId(input.loginId);
      if (!student) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "IDまたはパスワードが正しくありません" });
      }

      const valid = await bcrypt.compare(input.password, student.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "IDまたはパスワードが正しくありません" });
      }

      const token = signStudentToken(student.id);
      ctx.res.cookie(STUDENT_COOKIE, token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return { success: true, username: student.username };
    }),

  // ログアウト
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie(STUDENT_COOKIE, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    return { success: true };
  }),

  // 現在のログイン生徒情報
  me: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies?.[STUDENT_COOKIE];
    if (!token) return null;
    const payload = verifyStudentToken(token);
    if (!payload) return null;
    const student = await getStudentById(payload.studentId);
    if (!student) return null;
    return { id: student.id, username: student.username, loginId: student.loginId };
  }),

  // 全ユーザー名一覧（採点結果付き）
  list: publicProcedure.query(async () => {
    const students = await getAllStudents();
    const sheetData = await fetchSheetData().catch(() => []);

    return students.map((s) => {
      const sheetRow = sheetData.find((r) => r.username === s.username);
      return {
        id: s.id,
        username: s.username,
        scores: sheetRow?.scores ?? [],
        createdAt: s.createdAt,
      };
    });
  }),

  // 自分の採点結果のみ
  myScore: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies?.[STUDENT_COOKIE];
    if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });
    const payload = verifyStudentToken(token);
    if (!payload) throw new TRPCError({ code: "UNAUTHORIZED" });
    const student = await getStudentById(payload.studentId);
    if (!student) throw new TRPCError({ code: "NOT_FOUND" });

    const scores = await fetchScoreByUsername(student.username).catch(() => null);
    return {
      username: student.username,
      scores: scores ?? [],
    };
  }),
});
