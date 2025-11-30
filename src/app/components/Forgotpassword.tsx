"use client";

import { useFormState, useFormStatus } from "react-dom";
import { forgotPasswordAction } from "@/app/_actions/forgot-password";
import { Mail, ArrowLeft, CheckCircle2, Send, Sparkles, KeyRound } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@heroui/react";

function SubmitButton({
  labelIdle,
  labelPending,
}: {
  labelIdle: string;
  labelPending: string;
}) {
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
          <span>{labelPending}</span>
        </>
      ) : (
        <>
          <Send className="w-5 h-5" />
          <span>{labelIdle}</span>
        </>
      )}
    </button>
  );
}

export default function ForgotPassword() {
  const [formState, formAction] = useFormState(forgotPasswordAction, {
    isSuccess: false,
    error: "",
  });

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
                Check Your Email
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>

              {/* Tips */}
              <div className="w-full bg-slate-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-medium text-slate-700 mb-2">Didn't receive the email?</p>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Check your spam or junk folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• Wait a few minutes and try again</li>
                </ul>
              </div>

              {/* Back Button */}
              <Link href="/auth" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-900/25 transition-all duration-200">
                  <ArrowLeft className="w-5 h-5" />
                  Back to Login
                </button>
              </Link>
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
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="px-8 pb-8 space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                         focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                         transition-all duration-200"
              />
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
            <SubmitButton
              labelIdle="Send Reset Link"
              labelPending="Sending..."
            />

            {/* Back to Login */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/auth"
                className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          For security, the reset link will expire in 60 minutes.
        </p>
      </div>
    </div>
  );
}