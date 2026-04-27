# 環境変数の設定

## ローカル開発時

プロジェクトルートに `.env` ファイルを作成して以下を設定してください。

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=your-very-secret-key-here
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
GOOGLE_SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/1ha4Hxq-g1XpkhaH_nk48IT5SyW9gcp0tW8l-MzE02gk/edit
GOOGLE_SHEET_NAME=Sheet1
```

## Vercel デプロイ時

Vercel ダッシュボード > Settings > Environment Variables に同じキーを登録してください。

| キー | 説明 |
|---|---|
| `DATABASE_URL` | Supabase の接続文字列（URI形式） |
| `JWT_SECRET` | セッション署名用の秘密鍵（任意の長い文字列） |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Service Account の JSON キー（全文） |
| `GOOGLE_SPREADSHEET_URL` | 連携するスプレッドシートの URL |
| `GOOGLE_SHEET_NAME` | 対象シート名（デフォルト: Sheet1） |
