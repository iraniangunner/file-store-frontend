"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "@heroui/react";
import { useFormState, useFormStatus } from "react-dom";
import { registerAction } from "@/app/_actions/register";
import { loginAction } from "@/app/_actions/login";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import api from "@/lib/api";
import { InternalAxiosRequestConfig } from "axios";
import {
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  User,
  UserPlus,
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

function SubmitButton({
  labelPending,
  labelIdle,
  icon,
}: {
  labelPending: string;
  labelIdle: string;
  icon?: React.ReactNode;
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
          {icon}
          <span>{labelIdle}</span>
        </>
      )}
    </button>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"login" | "sign-up">("login");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginCaptchaToken, setLoginCaptchaToken] = useState<string | null>(
    null
  );
  const [registerCaptchaToken, setRegisterCaptchaToken] = useState<
    string | null
  >(null);

  const [loginState, loginFormAction] = useFormState(loginAction, {
    isSuccess: false,
    error: "",
  });

  const [registerState, registerFormAction] = useFormState(registerAction, {
    isSuccess: false,
    error: "",
  });

  const [registerEmail, setRegisterEmail] = useState("");

  useEffect(() => {
    if (loginState?.isSuccess) {
      (async () => {
        try {
          const res = await api.get("/auth/me", {
            requiresAuth: true,
          } as InternalAxiosRequestConfig);

          const user = res.data.user;

          if (!user?.email_verified_at) {
            router.push(
              `/verify-email?email=${encodeURIComponent(user.email)}`
            );
            return;
          }

          if (user?.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard/orders");
          }
        } catch {
          router.push("/dashboard/orders");
        }
      })();
    }
  }, [loginState?.isSuccess, router]);

  useEffect(() => {
    if (registerState?.isSuccess) {
      router.push(`/verify-email?email=${encodeURIComponent(registerEmail)}`);
    }
  }, [registerState?.isSuccess, registerEmail, router]);

  useEffect(() => {
    if (loginState?.redirectToVerify && loginState.email) {
      router.push(
        `/verify-email?email=${encodeURIComponent(loginState.email)}`
      );
    }
  }, [loginState?.redirectToVerify, loginState?.email, router]);

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`,
      "GoogleLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data.status === "success") {
        window.location.href = "/dashboard/orders";
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1 mb-4 group">
            <span className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Filer
            </span>
            <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
              Get
            </span>
            <Sparkles className="w-5 h-5 text-amber-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-slate-500">
            {selected === "login"
              ? "Welcome back! Sign in to continue."
              : "Create an account to get started."}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setSelected("login")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-all duration-200 relative ${
                selected === "login"
                  ? "text-violet-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
              {selected === "login" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-violet-600" />
              )}
            </button>
            <button
              onClick={() => setSelected("sign-up")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-all duration-200 relative ${
                selected === "sign-up"
                  ? "text-violet-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
              {selected === "sign-up" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-violet-600" />
              )}
            </button>
          </div>

          {/* Form Container */}
          <div className="p-6 sm:p-8">
            {/* ========== LOGIN FORM ========== */}
            {selected === "login" && (
              <form action={loginFormAction} className="space-y-5">
                {/* Email */}
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

                {/* Password */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                               focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                               transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-violet-600 hover:text-violet-700 font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Captcha */}
                <div className="flex justify-center py-2">
                  <HCaptcha
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                    onVerify={(token) => setLoginCaptchaToken(token)}
                    theme="light"
                  />
                </div>
                <input
                  type="hidden"
                  name="h-captcha-response"
                  value={loginCaptchaToken ?? ""}
                />

                {/* Error Message */}
                {loginState?.error && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center">
                      !
                    </span>
                    {loginState.error}
                  </div>
                )}

                {/* Submit */}
                <SubmitButton
                  labelPending="Signing in..."
                  labelIdle="Sign In"
                  icon={<ArrowRight className="w-5 h-5" />}
                />

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm text-slate-400">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Google Login */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-slate-200 
                           hover:border-slate-300 hover:bg-slate-50 rounded-xl font-medium text-slate-700 transition-all duration-200"
                >
                  <FcGoogle className="w-5 h-5" />
                  Sign in with Google
                </button>

                {/* Switch to Sign Up */}
                <p className="text-center text-sm text-slate-500 pt-2">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setSelected("sign-up")}
                    className="text-violet-600 font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            )}

            {/* ========== SIGN UP FORM ========== */}
            {selected === "sign-up" && (
              <form action={registerFormAction} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <User className="w-4 h-4 text-slate-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                             focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                             transition-all duration-200"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                             focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                             transition-all duration-200"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength={8}
                      placeholder="Min. 8 characters"
                      className="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                               focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                               transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowRegisterPassword(!showRegisterPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      required
                      minLength={8}
                      placeholder="Re-enter password"
                      className="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                               focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                               transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Captcha */}
                <div className="flex justify-center py-2">
                  <HCaptcha
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                    onVerify={(token) => setRegisterCaptchaToken(token)}
                    theme="light"
                  />
                </div>
                <input
                  type="hidden"
                  name="h-captcha-response"
                  value={registerCaptchaToken ?? ""}
                />

                {/* Error Message */}
                {registerState?.error && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center">
                      !
                    </span>
                    {registerState.error}
                  </div>
                )}

                {/* Submit */}
                <SubmitButton
                  labelPending="Creating account..."
                  labelIdle="Create Account"
                  icon={<UserPlus className="w-5 h-5" />}
                />

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm text-slate-400">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-slate-200 
                           hover:border-slate-300 hover:bg-slate-50 rounded-xl font-medium text-slate-700 transition-all duration-200"
                >
                  <FcGoogle className="w-5 h-5" />
                  Sign up with Google
                </button>

                {/* Switch to Login */}
                <p className="text-center text-sm text-slate-500 pt-2">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setSelected("login")}
                    className="text-violet-600 font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Secure
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Trusted
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4" />
            Encrypted
          </span>
        </div>
      </div>
    </>
  );
}
