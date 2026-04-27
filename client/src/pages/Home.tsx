import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, oklch(0.96 0.012 255) 0%, oklch(0.98 0.005 80) 50%, oklch(0.95 0.018 290) 100%)" }}>
      {/* Header */}
      <header className="border-b border-border/50 bg-white/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.40 0.1 255))" }}>
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground tracking-wide">Student Portal</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/students">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                受講生一覧
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">ログイン</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.38 0.1 255))" }} className="text-white shadow-sm hover:opacity-90">
                新規登録
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border" style={{ background: "oklch(0.95 0.02 255 / 0.5)", borderColor: "oklch(0.75 0.08 255 / 0.3)", color: "oklch(0.35 0.08 255)" }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "oklch(0.55 0.15 255)" }}></span>
            学習管理ポータル
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight" style={{ color: "oklch(0.18 0.025 255)" }}>
            学びの記録を、<br />
            <span style={{ background: "linear-gradient(90deg, oklch(0.28 0.07 255), oklch(0.55 0.15 255))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ひとつの場所に。
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            受講生の登録・ログインから採点結果の確認まで、シンプルで使いやすいポータルサイトです。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8 shadow-md hover:shadow-lg transition-all" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.38 0.1 255))", color: "white" }}>
                今すぐ登録する
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/students">
              <Button size="lg" variant="outline" className="gap-2 px-8 bg-white/80 hover:bg-white">
                <Users className="w-4 h-4" />
                受講生一覧を見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "簡単登録",
                desc: "ユーザー名・ID・パスワードを入力するだけで、すぐに登録完了。スプレッドシートにも自動で反映されます。",
                color: "oklch(0.28 0.07 255)",
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "採点結果確認",
                desc: "講師が記入した採点結果をリアルタイムで確認。自分のスコアをいつでもチェックできます。",
                color: "oklch(0.55 0.15 75)",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "受講生一覧",
                desc: "登録されている全受講生のユーザー名と採点結果を一覧で確認できます。",
                color: "oklch(0.48 0.14 180)",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-6 bg-white/80 border border-border/50 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white" style={{ background: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 Student Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
