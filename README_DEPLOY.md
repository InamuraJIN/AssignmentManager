# Student Register - Vercel + Supabase デプロイ手順

## 概要

このアプリは **Vercel**（ホスティング）+ **Supabase**（PostgreSQLデータベース）+ **Google Sheets**（採点結果管理）の組み合わせで、完全無料で動作します。

---

## ステップ 1: Supabase のセットアップ

### 1-1. Supabase プロジェクト作成

1. [https://supabase.com](https://supabase.com) にアクセスしてアカウント作成（無料）
2. 「New project」をクリック
3. プロジェクト名・パスワード・リージョン（Northeast Asia - Tokyo）を設定

### 1-2. データベースの初期化

1. Supabase ダッシュボード左メニューの「SQL Editor」を開く
2. `drizzle/init.sql` の内容をコピーして貼り付けて実行

### 1-3. 接続文字列の取得

1. 左メニュー「Settings」→「Database」
2. 「Connection string」→「URI」タブをクリック
3. `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres` をコピー

---

## ステップ 2: Google Sheets の Service Account 設定

### 2-1. Google Cloud Console でプロジェクト作成

1. [https://console.cloud.google.com](https://console.cloud.google.com) にアクセス
2. 「新しいプロジェクト」を作成

### 2-2. Google Sheets API を有効化

1. 「APIとサービス」→「ライブラリ」
2. 「Google Sheets API」を検索して「有効にする」

### 2-3. Service Account を作成

1. 「IAMと管理」→「サービスアカウント」→「サービスアカウントを作成」
2. 名前を入力して作成（ロール設定は不要）
3. 作成したサービスアカウントをクリック→「キー」タブ→「鍵を追加」→「JSON」
4. ダウンロードされた JSON ファイルの内容を控えておく

### 2-4. スプレッドシートを共有

1. 対象のスプレッドシートを開く
2. 右上「共有」ボタン
3. サービスアカウントのメールアドレス（`xxx@xxx.iam.gserviceaccount.com`）を「編集者」として追加

---

## ステップ 3: GitHub にコードをアップロード

1. [https://github.com](https://github.com) でリポジトリを新規作成（Private 推奨）
2. ローカルでターミナルを開き：

```bash
cd student-register-vercel
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/あなたのユーザー名/student-register.git
git push -u origin main
```

---

## ステップ 4: Vercel にデプロイ

### 4-1. Vercel アカウント作成

1. [https://vercel.com](https://vercel.com) にアクセス
2. 「Sign up with GitHub」でアカウント作成（無料）

### 4-2. プロジェクトをインポート

1. Vercel ダッシュボード → 「Add New Project」
2. GitHub リポジトリを選択して「Import」

### 4-3. 環境変数を設定

「Environment Variables」セクションで以下を追加：

| 変数名 | 値 |
|---|---|
| `DATABASE_URL` | Supabase の接続文字列（ステップ1-3でコピーしたもの） |
| `JWT_SECRET` | 任意の長い文字列（例: `openssl rand -hex 32` で生成） |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | ダウンロードした JSON ファイルの内容（全文） |
| `GOOGLE_SPREADSHEET_URL` | `https://docs.google.com/spreadsheets/d/1ha4Hxq-g1XpkhaH_nk48IT5SyW9gcp0tW8l-MzE02gk/edit` |
| `GOOGLE_SHEET_NAME` | `Sheet1` |

### 4-4. デプロイ

「Deploy」ボタンをクリック。数分でデプロイ完了！

---

## ローカルで動かす場合

```bash
# 依存パッケージをインストール
pnpm install

# .env ファイルを作成して環境変数を設定
# （ENV_SETUP.md を参照）

# 開発サーバー起動
pnpm dev
```

---

## スプレッドシートのフォーマット

| A列（自動） | B列（講師が記入） | C列（講師が記入） | ... |
|---|---|---|---|
| ユーザー名 | 第1回テスト | 第2回テスト | ... |
| 山田太郎 | 85 | 90 | |
| 鈴木花子 | 78 | | |

- **A列**: 生徒が登録すると自動で追記されます
- **B列以降**: 講師が採点結果を手動で入力してください
- サイトは定期的にスプレッドシートを読み込んで採点結果を表示します

---

## よくある質問

**Q: 無料枠の制限は？**
- Supabase: 500MB ストレージ、月50万リクエストまで無料
- Vercel: 月100GBの帯域幅、サーバーレス関数100GB-Hrsまで無料
- 通常の授業用途では無料枠で十分です

**Q: GOOGLE_SERVICE_ACCOUNT_JSON の JSON に改行が含まれてエラーになる**
- JSON全文をそのままコピーしてください（改行も含めてOK）
- Vercel の環境変数は複数行に対応しています
