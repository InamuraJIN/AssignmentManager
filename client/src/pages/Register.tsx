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
import { BookOpen, Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";

const schema = z.object({
  username: z.string().min(1, "ユーザー名を入力してください").max(100),
  loginId: z.string().min(3, "ログインIDは3文字以上で入力してください").max(100),
  password: z.string().min(6, "パスワードは6文字以上で入力してください").max(100),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const [, navigate] = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = trpc.student.register.useMutation({
    onSuccess: (data) => {
      toast.success(`「${data.username}」として登録しました！`);
      navigate("/mypage");
    },
    onError: (err) => {
      toast.error(err.message || "登録に失敗しました");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({ username: data.username, loginId: data.loginId, password: data.password });
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
            学びの第一歩を<br />ここから始めよう
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            登録するだけで、採点結果の確認や受講生一覧へのアクセスが可能になります。
          </p>
        </div>
        <div className="flex gap-4">
          {["登録無料", "採点結果確認", "いつでもアクセス"].map((t) => (
            <div key={t} className="px-3 py-1.5 rounded-full text-xs text-white/80 border border-white/20 bg-white/10">
              {t}
            </div>
          ))}
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
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">新規登録</h1>
                <p className="text-xs text-muted-foreground">アカウントを作成してください</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium">ユーザー名 <span className="text-destructive">*</span></Label>
                <Input
                  id="username"
                  placeholder="例：山田太郎"
                  {...register("username")}
                  className="h-11 bg-white border-input focus:border-primary"
                />
                {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="loginId" className="text-sm font-medium">ログインID <span className="text-destructive">*</span></Label>
                <Input
                  id="loginId"
                  placeholder="例：yamada2024"
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
                    placeholder="6文字以上"
                    {...register("password")}
                    className="h-11 bg-white border-input focus:border-primary pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">パスワード（確認） <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="もう一度入力"
                    {...register("confirmPassword")}
                    className="h-11 bg-white border-input focus:border-primary pr-10"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-11 font-semibold shadow-md hover:shadow-lg transition-all mt-2"
                style={{ background: "linear-gradient(135deg, oklch(0.28 0.07 255), oklch(0.38 0.1 255))", color: "white" }}
              >
                {mutation.isPending ? "登録中..." : "登録する"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                すでにアカウントをお持ちの方は{" "}
                <Link href="/login">
                  <span className="font-medium hover:underline" style={{ color: "oklch(0.38 0.1 255)" }}>ログイン</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
