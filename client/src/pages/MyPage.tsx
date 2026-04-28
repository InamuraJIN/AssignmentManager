import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookOpen, Award, LogOut, ArrowLeft, ShieldCheck, CheckCircle, XCircle } from "lucide-react";

export default function MyPage() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const { data: me, isLoading: meLoading } = trpc.student.me.useQuery();
  const { data: myScore, isLoading: scoreLoading } = trpc.student.myScore.useQuery(
    undefined,
    { enabled: !!me, retry: false, refetchOnWindowFocus: false, refetchOnMount: false, refetchInterval: false }
  );

  const logoutMutation = trpc.student.logout.useMutation({
    onSuccess: () => {
      utils.student.me.invalidate();
      toast.success("ログアウトしました");
      navigate("/");
    },
  });

  const scoreData = (myScore as any)?.scoreData;
  const total = scoreData?.total ?? null;
  const videoSubmitted = scoreData?.videoSubmitted ?? null;
  const hasScore = scoreData?.hasScore ?? false;

  function getScoreMessage(score: number): { text: string; color: string } {
    if (score <= 40) {
      return { text: "再提出してください", color: "oklch(0.55 0.18 25)" };
    } else if (score <= 79) {
      return { text: "合格です！これからも頑張ってください！", color: "oklch(0.50 0.15 145)" };
    } else {
      return { text: "大変よくできました！", color: "oklch(0.45 0.18 255)" };
    }
  }

  if (meLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.96 0.012 255) 0%, oklch(0.98 0.005 80) 50%, oklch(0.95 0.018 290) 100%)" }}>
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.96 0.012 255) 0%, oklch(0.98 0.005 80) 50%, oklch(0.95 0.018 290) 100%)" }}>
        <div className="bg-white/90 rounded-2xl shadow-xl border border-border/40 p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(0.94 0.02 255)" }}>
            <ShieldCheck className="w-7 h-7" style={{ color: "oklch(0.38 0.1 255)" }} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">ログインが必要です</h2>
          <p className="text-sm text-muted-foreground mb-6">マイページを表示するにはログインしてください。</p>
          <div className="flex flex-col gap-3">
            <Link href="/login">
              <Button className="w-full" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.38 0.1 255))", color: "white" }}>
                ログインする
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full bg-white">新規登録</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, oklch(0.96 0.012 255) 0%, oklch(0.98 0.005 80) 50%, oklch(0.95 0.018 290) 100%)" }}>
      <header className="border-b border-border/50 bg-white/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.40 0.1 255))" }}>
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground tracking-wide">Student Portal</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white/80"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4" />
            ログアウト
          </Button>
        </div>
      </header>

      <div className="container max-w-3xl mx-auto py-10 px-4">
        <Link href="/">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            トップに戻る
          </button>
        </Link>

        {/* Profile Card */}
        <div className="rounded-2xl shadow-xl border border-border/40 mb-6 overflow-hidden">
          <div className="px-8 py-6 flex items-center" style={{ background: "linear-gradient(135deg, oklch(0.20 0.045 255), oklch(0.35 0.1 255))" }}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
            <h2 className="text-2xl font-bold text-white truncate">{me.loginId}</h2>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-white/90 rounded-2xl shadow-lg border border-border/40 overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.65 0.15 75), oklch(0.75 0.12 80))" }}>
              <Award className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-foreground">採点結果</h3>
          </div>

          <div className="p-6">
            {scoreLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-muted-foreground">採点結果を読み込み中...</p>
              </div>
            ) : hasScore ? (
              <div className="space-y-4">
                {total !== null && (
                  <div className="rounded-xl border border-border/40 p-5 text-center" style={{ background: "oklch(0.97 0.008 255)" }}>
                    <p className="text-sm text-muted-foreground mb-1">合計点</p>
                    <p className="text-4xl font-bold" style={{ color: "oklch(0.32 0.08 255)" }}>
                      {total}
                      <span className="text-base font-medium text-muted-foreground ml-1">/100</span>
                    </p>
                    {(() => {
                      const msg = getScoreMessage(total);
                      return (
                        <p className="text-sm font-medium mt-2" style={{ color: msg.color }}>
                          {msg.text}
                        </p>
                      );
                    })()}
                  </div>
                )}

                {videoSubmitted !== null && (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-border/40" style={{ background: "oklch(0.97 0.008 255)" }}>
                    {videoSubmitted ? (
                      <>
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "oklch(0.50 0.15 145)" }} />
                        <div>
                          <p className="text-sm font-medium text-foreground">動画提出</p>
                          <p className="text-sm" style={{ color: "oklch(0.50 0.15 145)" }}>提出済み</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: "oklch(0.55 0.18 25)" }} />
                        <div>
                          <p className="text-sm font-medium text-foreground">動画提出</p>
                          <p className="text-sm" style={{ color: "oklch(0.55 0.18 25)" }}>提出が確認できません。</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(0.95 0.015 75)" }}>
                  <Award className="w-8 h-8" style={{ color: "oklch(0.65 0.15 75)" }} />
                </div>
                <p className="font-medium text-foreground mb-1">まだ採点結果がありません</p>
                <p className="text-sm text-muted-foreground">講師が採点結果を記入すると、ここに表示されます。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}