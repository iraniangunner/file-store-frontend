"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  Spinner,
  Divider,
} from "@heroui/react";
import { useFormState, useFormStatus } from "react-dom";
import { registerAction } from "@/app/_actions/register";
import { loginAction } from "@/app/_actions/login";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import api from "@/lib/api";
import { InternalAxiosRequestConfig } from "axios";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockIcon,
  LogIn,
  Mail,
  User,
  UserPlus,
} from "lucide-react";

function SubmitButton({
  labelPending,
  labelIdle,
}: {
  labelPending: any;
  labelIdle: any;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white font-semibold"
      disabled={pending}
      color="primary"
    >
      {pending && <Spinner size="sm" className="h-4 w-4 animate-spin" />}
      <span>{pending ? labelPending : labelIdle}</span>
    </Button>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("login");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginCaptchaToken, setLoginCaptchaToken] = useState<string | null>(
    null
  );
  const [registerCaptchaToken, setRegisterCaptchaToken] = useState<
    string | null
  >(null);

  // --- Login Form ---
  const [loginState, loginFormAction] = useFormState(loginAction, {
    isSuccess: false,
    error: "",
  });

  // --- Signup Form ---
  const [registerState, registerFormAction] = useFormState(registerAction, {
    isSuccess: false,
    error: "",
  });

  const [registerEmail, setRegisterEmail] = useState("");

  // Handle login success
  // ✅ وقتی لاگین موفق بود (کاربر تأییدشده)
  useEffect(() => {
    if (loginState?.isSuccess) {
      (async () => {
        try {
          const res = await api.get("/auth/me", {
            requiresAuth: true,
          } as InternalAxiosRequestConfig);

          const user = res.data.user;

          // اگر ایمیل کاربر هنوز تایید نشده
          if (!user?.email_verified_at) {
            router.push(
              `/verify-email?email=${encodeURIComponent(user.email)}`
            );
            return;
          }

          // اگر نقش ادمین داشت
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

  // ✅ وقتی ثبت‌نام موفق بود (به verify-email هدایت کن)
  useEffect(() => {
    if (registerState?.isSuccess) {
      router.push(`/verify-email?email=${encodeURIComponent(registerEmail)}`);
    }
  }, [registerState?.isSuccess, registerEmail, router]);

  // ✅ وقتی لاگین نیاز به وریفای دارد (بر اساس پاسخ سرور)
  useEffect(() => {
    if (loginState?.redirectToVerify && loginState.email) {
      router.push(
        `/verify-email?email=${encodeURIComponent(loginState.email)}`
      );
    }
  }, [loginState?.redirectToVerify, loginState?.email, router]);

  // Handle Google OAuth login popup
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
        // بعد از پیام، redirect کن
        window.location.href = "/dashboard/orders";
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="max-w-full w-[380px] min-h-[500px]">
      <div className="w-full max-w-md space-y-6 mb-4">
        {/* Brand Header */}
        <div className="text-center space-y-2 mt-2">
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] bg-clip-text text-transparent"
          >
            filerget
          </Link>
          <p className="text-gray-600 text-sm">
            Welcome back! Please login to your account.
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-lg border border-gray-100">
          <CardBody className="overflow-hidden p-6">
            <Tabs
              fullWidth
              aria-label="Auth Tabs"
              selectedKey={selected}
              size="lg"
              color="primary"
              variant="underlined"
              classNames={{
                tabList:
                  "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F]",
                tab: "max-w-fit px-0 h-12",
                tabContent:
                  "group-data-[selected=true]:text-[#3B9FE8] font-semibold",
              }}
              onSelectionChange={(key) => setSelected(String(key))}
            >
              {/* ========== LOGIN TAB ========== */}
              <Tab
                key="login"
                title={
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </div>
                }
              >
                <form
                  action={loginFormAction}
                  className="flex flex-col gap-5 pt-6"
                >
                  <Input
                    isRequired
                    label="Email"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    variant="bordered"
                    startContent={<Mail className="w-4 h-4 text-gray-400" />}
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "border-gray-200 hover:border-[#3B9FE8]",
                    }}
                  />
                  <Input
                    isRequired
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    type={showLoginPassword ? "text" : "password"}
                    variant="bordered"
                    startContent={
                      <LockIcon className="w-4 h-4 text-gray-400" />
                    }
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    }
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "border-gray-200 hover:border-[#3B9FE8]",
                    }}
                  />

                  <HCaptcha
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                    onVerify={(token) => setLoginCaptchaToken(token)}
                  />
                  <input
                    type="hidden"
                    name="h-captcha-response"
                    value={loginCaptchaToken ?? ""}
                  />

                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      size="sm"
                      className="text-[#3B9FE8] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <SubmitButton
                    labelPending="Logging in..."
                    labelIdle="Login"
                  />

                  {loginState?.error && (
                    <p className="text-xs text-red-500 text-center bg-red-50 p-2 rounded-lg">
                      {loginState.error}
                    </p>
                  )}

                  <p className="text-center text-sm text-gray-600">
                    Need an account?{" "}
                    <Link
                      size="sm"
                      onPress={() => setSelected("sign-up")}
                      className="text-[#3B9FE8] font-semibold cursor-pointer"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              </Tab>

              {/* ========== SIGNUP TAB ========== */}
              <Tab
                key="sign-up"
                title={
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Sign up</span>
                  </div>
                }
              >
                <form
                  action={registerFormAction}
                  className="flex flex-col gap-5 pt-6"
                >
                  <Input
                    isRequired
                    label="Name"
                    name="name"
                    placeholder="Enter your name"
                    type="text"
                    variant="bordered"
                    startContent={<User className="w-4 h-4 text-gray-400" />}
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "border-gray-200 hover:border-[#3B9FE8]",
                    }}
                  />
                  <Input
                    isRequired
                    label="Email"
                    name="email"
                    value={registerEmail}
                    placeholder="Enter your email"
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    type="email"
                    variant="bordered"
                    startContent={<Mail className="w-4 h-4 text-gray-400" />}
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "border-gray-200 hover:border-[#3B9FE8]",
                    }}
                  />
                  <Input
                    isRequired
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    type={showRegisterPassword ? "text" : "password"}
                    minLength={8}
                    variant="bordered"
                    startContent={
                      <LockIcon className="w-4 h-4 text-gray-400" />
                    }
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() =>
                          setShowRegisterPassword(!showRegisterPassword)
                        }
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    }
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "border-gray-200 hover:border-[#3B9FE8]",
                    }}
                  />
                  <Input
                    isRequired
                    label="Password Confirmation"
                    name="password_confirmation"
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    minLength={8}
                    variant="bordered"
                    startContent={
                      <LockIcon className="w-4 h-4 text-gray-400" />
                    }
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    }
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "border-gray-200 hover:border-[#3B9FE8]",
                    }}
                  />

                  <HCaptcha
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                    onVerify={(token) => setRegisterCaptchaToken(token)}
                  />
                  <input
                    type="hidden"
                    name="h-captcha-response"
                    value={registerCaptchaToken ?? ""}
                  />

                  <SubmitButton
                    labelPending="Signing up..."
                    labelIdle="Sign up"
                  />

                  <div className="relative">
                    <Divider />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                      OR
                    </span>
                  </div>

                  <Button
                    onClick={handleGoogleLogin}
                    variant="bordered"
                    className="w-full border-gray-200 hover:border-[#3B9FE8] font-semibold"
                    startContent={<FcGoogle className="w-5 h-5" />}
                  >
                    Sign up with Google
                  </Button>

                  {registerState?.error && (
                    <p className="text-xs text-red-500 text-center bg-red-50 p-2 rounded-lg">
                      {registerState.error}
                    </p>
                  )}

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      size="sm"
                      onPress={() => setSelected("login")}
                      className="text-[#3B9FE8] font-semibold cursor-pointer"
                    >
                      Login
                    </Link>
                  </p>
                </form>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
