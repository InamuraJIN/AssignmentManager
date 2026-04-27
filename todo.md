# Student Register - TODO

## DB & Backend
- [x] drizzle/schema.ts に students テーブル追加（id, username, loginId, passwordHash, createdAt）
- [x] DBマイグレーション実行
- [x] server/db.ts に生徒クエリヘルパー追加
- [x] server/routers/student.ts 実装（register, login, list, me）
- [x] Google Sheets API 連携（googleapis パッケージ導入・Service Account 設定）
- [x] スプレッドシートへのユーザー名自動追記機能
- [x] スプレッドシートから採点結果取得機能
- [x] JWT ベースの独自セッション管理（生徒用）
- [x] 環境変数でスプレッドシートURL/IDを外部設定可能にする

## Frontend
- [x] エレガントなグローバルデザインテーマ設定（index.css）
- [x] ランディングページ（Home.tsx）
- [x] 生徒登録フォームページ（Register.tsx）
- [x] ログインページ（Login.tsx）
- [x] ユーザー名一覧ページ（StudentList.tsx）
- [x] マイページ（MyPage.tsx）- 自分のユーザー名と採点結果のみ表示
- [x] App.tsx にルーティング追加
- [x] レスポンシブ対応

## Tests
- [x] student register/login vitest テスト
- [x] sheets sync vitest テスト
