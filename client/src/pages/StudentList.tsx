import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ArrowLeft, RefreshCw, Trophy, Medal } from "lucide-react";

export default function StudentList() {
  const { data: students, isLoading, refetch, isFetching } = trpc.student.list.useQuery();

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-4 h-4" style={{ color: "oklch(0.72 0.15 75)" }} />;
    if (index === 1) return <Medal className="w-4 h-4" style={{ color: "oklch(0.65 0.05 255)" }} />;
    if (index === 2) return <Medal className="w-4 h-4" style={{ color: "oklch(0.58 0.1 45)" }} />;
    return <span className="text-xs text-muted-foreground font-mono w-4 text-center">{index + 1}</span>;
  };

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
            <Link href="/login">
              <Button variant="outline" size="sm">ログイン</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.38 0.1 255))", color: "white" }}>
                新規登録
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto py-10">
        {/* Back + Title */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              トップに戻る
            </button>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.40 0.1 255))" }}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">受講生一覧</h1>
                <p className="text-sm text-muted-foreground">
                  {students ? `${students.length}名が登録中` : "読み込み中..."}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2 bg-white/80"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              更新
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/90 rounded-2xl shadow-lg border border-border/40 overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground text-sm">読み込み中...</p>
            </div>
          ) : !students || students.length === 0 ? (
            <div className="py-20 text-center">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">まだ登録された受講生がいません</p>
              <Link href="/register">
                <Button size="sm" className="mt-4" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.38 0.1 255))", color: "white" }}>
                  最初に登録する
                </Button>
              </Link>
            </div>
          ) : (
            <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50" style={{ background: "oklch(0.97 0.008 255)" }}>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">#</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">採点結果</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">登録日</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {students.map((student, index) => (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-6">{getRankIcon(index)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: `hsl(${(index * 47) % 360}, 55%, 45%)` }}>
                            {student.loginId.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">{student.loginId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {student.scores && student.scores.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {student.scores.map((score, i) => (
                              <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "oklch(0.93 0.04 255 / 0.5)", color: "oklch(0.32 0.08 255)" }}>
                                {score}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground/60 italic">未採点</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(student.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border/30">
              {students.map((student, index) => (
                <div key={student.id} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-6">{getRankIcon(index)}</div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: `hsl(${(index * 47) % 360}, 55%, 45%)` }}>
                      {student.loginId.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-foreground">{student.loginId}</span>
                  </div>
                  <div className="ml-12 space-y-1">
                    {student.scores && student.scores.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {student.scores.map((score, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "oklch(0.93 0.04 255 / 0.5)", color: "oklch(0.32 0.08 255)" }}>
                            {score}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/60 italic">未採点</span>
                    )}
                    <p className="text-xs text-muted-foreground">{new Date(student.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })}</p>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
