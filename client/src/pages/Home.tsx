import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, ArrowRight, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, oklch(0.96 0.012 255) 0%, oklch(0.98 0.005 80) 50%, oklch(0.95 0.018 290) 100%)" }}>
      {/* Header */}
      <header className="border-b border-border/50 bg-white/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.40 0.1 255))" }}>
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground tracking-wide">Student Portal</span>
          </div>
        </div>
      </header>

      {/* Hero - メインコンテンツ */}
      <section className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="container max-w-lg mx-auto text-center">
          {/* ロゴアイコン */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.40 0.1 255))" }}>
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "oklch(0.18 0.025 255)" }}>
            Student Portal
          </h1>
          <p className="text-base text-muted-foreground mb-12">
            採点結果確認システム
          </p>

          {/* メインボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-10 h-14 text-base font-semibold w-full sm:w-auto bg-white hover:bg-gray-50 border-2 shadow-sm"
              >
                <LogIn className="w-5 h-5" />
                ログイン
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                className="gap-2 px-10 h-14 text-base font-semibold w-full sm:w-auto shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.38 0.1 255))", color: "white" }}
              >
                新規登録
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features - シンプルな説明 */}
      <section className="py-12 px-4">
        <div className="container max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: <BookOpen className="w-5 h-5" />,
                title: "簡単登録",
                desc: "IDとパスワードを入力するだけで登録完了。",
                color: "oklch(0.28 0.07 255)",
              },
              {
                icon: <Award className="w-5 h-5" />,
                title: "採点結果確認",
                desc: "ログイン後、自分の採点結果をすぐに確認できます。",
                color: "oklch(0.55 0.15 75)",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-5 bg-white/80 border border-border/50 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white" style={{ background: f.color }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 Student Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
