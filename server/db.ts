import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { InsertUser, users, students, InsertStudent, Student } from "../drizzle/schema";
import { ENV } from './_core/env';

function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const sql = neon(connectionString);
  return drizzle(sql);
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = getDb();

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];

  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };

  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = 'admin';
    updateSet.role = 'admin';
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onConflictDoUpdate({
    target: users.openId,
    set: updateSet,
  });
}

export async function getUserByOpenId(openId: string) {
  const db = getDb();
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createStudent(data: InsertStudent): Promise<void> {
  const db = getDb();
  await db.insert(students).values(data);
}

export async function getStudentByLoginId(loginId: string): Promise<Student | undefined> {
  const db = getDb();
  const result = await db.select().from(students).where(eq(students.loginId, loginId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllStudents(): Promise<Student[]> {
  const db = getDb();
  return db.select().from(students).orderBy(students.createdAt);
}

export async function getStudentById(id: number): Promise<Student | undefined> {
  const db = getDb();
  const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateStudentSheetRow(id: number, sheetRow: number): Promise<void> {
  const db = getDb();
  await db.update(students).set({ sheetRow }).where(eq(students.id, id));
}