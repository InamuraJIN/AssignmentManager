-- Supabase / PostgreSQL 初期化SQL
-- Supabase ダッシュボードの SQL Editor で実行してください

-- ロールENUM
DO $$ BEGIN
  CREATE TYPE "role" AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ユーザーテーブル（Manus OAuth用 / Vercel単体では不要）
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "openId" varchar(64) NOT NULL UNIQUE,
  "name" text,
  "email" varchar(320),
  "loginMethod" varchar(64),
  "role" "role" NOT NULL DEFAULT 'user',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "lastSignedIn" timestamp NOT NULL DEFAULT now()
);

-- 生徒テーブル（独自ID/Pass認証）
CREATE TABLE IF NOT EXISTS "students" (
  "id" serial PRIMARY KEY,
  "loginId" varchar(100) NOT NULL UNIQUE,
  "passwordHash" varchar(255) NOT NULL,
  "sheetRow" integer,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
