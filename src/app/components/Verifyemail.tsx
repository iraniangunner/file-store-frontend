"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardBody, InputOtp } from "@heroui/react";
import { useFormState, useFormStatus } from "react-dom";
import { verifyEmailAction } from "@/app/_actions/verify-email";
import { Mail, ShieldCheck, Clock, RefreshCw } from "lucide-react";
import api from "@/lib/api";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-foreground text-background hover:opacity-90 font-medium"
      size="lg"
    >
      {pending ? "Verifying..." : "Verify Email"}
    </Button>
  );
}

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [otpValue, setOtpValue] = useState("");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0); // 🕒 countdown timer

  const [formState, formAction] = useFormState(verifyEmailAction, {
    isSuccess: false,
    error: "",
  });

  // ✅ بعد از verify موفق، به login هدایت کن
  useEffect(() => {
    if (formState.isSuccess) {
      setTimeout(() => router.push("/auth"), 2000);
    }
  }, [formState.isSuccess, router]);

  // ✅ تایمر countdown برای دکمه‌ی resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // ✅ تابع resend با کنترل خطا و محدودیت زمانی
  const handleResend = async () => {
    if (resending || cooldown > 0) return;

    setResending(true);
    setMessage("");
    try {
      const res = await api.post("/resend-verification", { email: emailParam });
      setMessage("✅ Verification code resent to your email!");
      setCooldown(60); // 🔒 قفل دکمه برای ۶۰ ثانیه
    } catch (err: any) {
      if (err.response?.status === 429) {
        const msg =
          err.response.data?.message ||
          "Please wait before requesting another code.";
        setMessage(`⚠️ ${msg}`);

        // در صورت وجود مدت باقیمانده از سرور، از اون استفاده کن
        const match = msg.match(/(\d+)\s*seconds/);
        if (match) setCooldown(parseInt(match[1]));
        else setCooldown(60);
      } else {
        setMessage("❌ Failed to resend verification code.");
      }
    } finally {
      setResending(false);
    }
  };

  // ✅ در صورت verify موفق
  if (formState.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
        <Card className="w-full max-w-md shadow-2xl border-success/20">
          <CardBody className="p-8 md:p-10">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Email Verified!
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your email has been successfully verified. You can now log in.
              </p>
              <Button
                onClick={() => router.push("/auth")}
                className="w-full bg-foreground text-background hover:opacity-90 font-medium"
                size="lg"
              >
                Continue to Login
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ✅ صفحه verify اصلی
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-md shadow-2xl">
        <CardBody className="p-8 md:p-10">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Verify Your Email
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We sent a verification code to
                <br />
                <span className="font-semibold text-foreground">
                  {emailParam}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <Clock className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-sm text-warning-foreground">
                This code will expire in{" "}
                <span className="font-semibold">15 minutes</span>
              </p>
            </div>

            {/* Form */}
            <form action={formAction} className="flex flex-col gap-6">
              <input type="hidden" name="email" value={emailParam} />
              <div className="flex flex-col items-center gap-3">
                <label className="text-sm font-medium text-foreground">
                  Enter verification code
                </label>
                <InputOtp
                  length={6}
                  value={otpValue}
                  onValueChange={setOtpValue}
                  size="lg"
                  className="gap-2"
                />
                <input type="hidden" name="token" value={otpValue} />
              </div>

              {formState.error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                  <p className="text-danger text-sm text-center">
                    {formState.error}
                  </p>
                </div>
              )}

              <SubmitButton />
            </form>

            {/* ✅ resend button + countdown */}
            <div className="flex flex-col gap-2 mt-2">
              <Button
                variant="flat"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {cooldown > 0
                  ? `Resend available in ${cooldown}s`
                  : resending
                  ? "Resending..."
                  : "Resend Verification Code"}
              </Button>

              {message && (
                <p className="text-center text-sm text-muted-foreground">
                  {message}
                </p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
