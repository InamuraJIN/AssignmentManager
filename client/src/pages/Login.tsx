import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";

const schema = z.object({
  loginId: z.string().min(1, "ログインIDを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [, navigate] = useLocation();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const utils = trpc.useUtils();
  const mutation = trpc.student.login.useMutation({
    onSuccess: (data) => {
      toast.success(`「${data.loginId}」としてログインしました`);
      utils.student.me.invalidate();
      navigate("/mypage");
    },
    onError: (err) => {
      toast.error(err.message || "ログインに失敗しました");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, oklch(0.96 0.012 255) 0%, oklch(0.98 0.005 80) 50%, oklch(0.95 0.018 290) 100%)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: "linear-gradient(160deg, oklch(0.20 0.045 255), oklch(0.28 0.07 255))" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold tracking-wide">Student Portal</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            おかえりなさい。<br />続きを始めましょう。
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            ログインして、自分の採点結果や学習状況を確認しましょう。
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/10 border border-white/20">
          <p className="text-white/60 text-sm">登録がまだの方は</p>
          <Link href="/register">
            <span className="text-white font-medium hover:underline cursor-pointer">新規登録はこちら →</span>
          </Link>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              トップに戻る
            </button>
          </Link>

          <div className="bg-white/90 rounded-2xl shadow-xl border border-border/40 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.40 0.1 255))" }}>
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ログイン</h1>
                <p className="text-xs text-muted-foreground">アカウントにサインインしてください</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="loginId" className="text-sm font-medium">ID <span className="text-destructive">*</span></Label>
                <Input
                  id="loginId"
                  placeholder="例：YamadaTaro"
                  {...register("loginId")}
                  className="h-11 bg-white border-input focus:border-primary"
                />
                {errors.loginId && <p className="text-xs text-destructive">{errors.loginId.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">パスワード <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="パスワードを入力"
                    {...register("password")}
                    className="h-11 bg-white border-input focus:border-primary pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-11 font-semibold shadow-md hover:shadow-lg transition-all mt-2"
                style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.38 0.1 255))", color: "white" }}
              >
                {mutation.isPending ? "ログイン中..." : "ログイン"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                アカウントをお持ちでない方は{" "}
                <Link href="/register">
                  <span className="font-medium hover:underline" style={{ color: "oklch(0.38 0.1 255)" }}>新規登録</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
