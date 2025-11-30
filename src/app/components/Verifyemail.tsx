"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InputOtp, Spinner } from "@heroui/react";
import { useFormState, useFormStatus } from "react-dom";
import { verifyEmailAction } from "@/app/_actions/verify-email";
import {
  Mail,
  ShieldCheck,
  Clock,
  RefreshCw,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MailOpen,
} from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-500 to-violet-600 
               hover:from-violet-600 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-400
               text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 
               hover:shadow-xl hover:shadow-violet-500/30 disabled:shadow-none
               transition-all duration-200 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Spinner size="sm" color="white" />
          <span>Verifying...</span>
        </>
      ) : (
        <>
          <ShieldCheck className="w-5 h-5" />
          <span>Verify Email</span>
        </>
      )}
    </button>
  );
}

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [otpValue, setOtpValue] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [formState, formAction] = useFormState(verifyEmailAction, {
    isSuccess: false,
    error: "",
  });

  useEffect(() => {
    if (formState.isSuccess) {
      setTimeout(() => router.push("/auth"), 2000);
    }
  }, [formState.isSuccess, router]);

  const handleResend = async () => {
    if (resending || cooldown > 0) return;

    setResending(true);
    setMessage("");
    setMessageType("");
    try {
      const res = await api.post("/resend-verification", { email: emailParam });
      setMessage("Verification code resent to your email!");
      setMessageType("success");

      const match = res.data.message?.match(/(\d+)\s*seconds/);
      if (match) setCooldown(parseInt(match[1], 10));
      else setCooldown(60);
    } catch (err: any) {
      if (err.response?.status === 429) {
        const match = err.response.data?.message?.match(/(\d+)\s*seconds/);
        if (match) setCooldown(parseInt(match[1], 10));
        setMessage(
          err.response.data?.message || "Please wait before requesting again."
        );
        setMessageType("error");
      } else {
        setMessage("Failed to resend verification code.");
        setMessageType("error");
      }
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Success State
  if (formState.isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-200/40 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-1 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                Filer
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
                Get
              </span>
            </Link>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              {/* Success Icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Message */}
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Email Verified!
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Your email has been successfully verified. You can now access
                your account.
              </p>

              {/* Redirecting indicator */}
              <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl mb-6">
                <Spinner size="sm" color="success" />
                <span className="text-sm font-medium text-emerald-700">
                  Redirecting to login...
                </span>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => router.push("/auth")}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
              >
                Continue to Login
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form State
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Filer
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
              Get
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-500/25">
              <MailOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              We sent a verification code to
            </p>
            <p className="font-semibold text-slate-900 mt-1">{emailParam}</p>
          </div>

          {/* Timer Warning */}
          <div className="mx-8 mb-6">
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-amber-800">
                  Code expires in 15 minutes
                </p>
                <p className="text-xs text-amber-600">
                  Check your spam folder if not received
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form action={formAction} className="px-8 pb-8 space-y-6">
            <input type="hidden" name="email" value={emailParam} />

            {/* OTP Input */}
            <div className="flex flex-col items-center gap-4">
              <label className="text-sm font-medium text-slate-700">
                Enter 6-digit verification code
              </label>
              <div className="w-full flex justify-center">
                <InputOtp
                  length={6}
                  value={otpValue}
                  onValueChange={setOtpValue}
                  size="lg"
                  classNames={{
                    segment:
                      "w-12 h-14 text-xl font-bold border-2 border-slate-200 rounded-xl bg-slate-50 data-[active=true]:border-violet-500 data-[active=true]:bg-white",
                    segmentWrapper: "gap-2",
                  }}
                />
              </div>
              <input type="hidden" name="token" value={otpValue} />
            </div>

            {/* Error Message */}
            {formState.error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold">
                  !
                </span>
                {formState.error}
              </div>
            )}

            {/* Submit Button */}
            <SubmitButton />

            {/* Resend Section */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <p className="text-center text-sm text-slate-500">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  cooldown > 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${resending ? "animate-spin" : ""}`}
                />
                {cooldown > 0
                  ? `Resend available in ${cooldown}s`
                  : resending
                  ? "Resending..."
                  : "Resend Code"}
              </button>

              {/* Resend Message */}
              {message && (
                <div
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm ${
                    messageType === "success"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold">
                      !
                    </span>
                  )}
                  {message}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Wrong email?{" "}
          <Link
            href="/auth"
            className="text-violet-600 font-medium hover:underline"
          >
            Go back to sign up
          </Link>
        </p>
      </div>
    </div>
  );
}