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
} from "@heroui/react";
import { useFormState, useFormStatus } from "react-dom";
import { registerAction } from "@/app/_actions/register";
import { loginAction } from "@/app/_actions/login";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import HCaptcha from "@hcaptcha/react-hcaptcha";

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
      size="sm"
      type="submit"
      className="w-full cursor-pointer text-md p-5"
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

 const [loginCaptchaToken, setLoginCaptchaToken] = useState<string | null>(null);
  const [registerCaptchaToken, setRegisterCaptchaToken] = useState<string | null>(null);


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

  // Handle login success
  useEffect(() => {
    if (loginState?.isSuccess) {
      window.location.href = "/dashboard/orders";
    }
  }, [loginState?.isSuccess]);

  // Handle signup success
  useEffect(() => {
    if (registerState?.isSuccess) {
      window.location.href = "/dashboard/orders";
    }
  }, [registerState?.isSuccess]);

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
    <Card className="max-w-full w-[380px] min-h-[500px]">
      <CardBody className="overflow-hidden">
        <Tabs
          fullWidth
          aria-label="Auth Tabs"
          selectedKey={selected}
          size="md"
          onSelectionChange={(key) => setSelected(String(key))}
        >
          {/* ========== LOGIN TAB ========== */}
          <Tab key="login" title="Login">
            <form action={loginFormAction} className="flex flex-col gap-4">
              <Input
                isRequired
                label="Email"
                name="email"
                placeholder="Enter your email"
                type="email"
              />
              <Input
                isRequired
                label="Password"
                name="password"
                placeholder="Enter your password"
                type="password"
              />

              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                onVerify={(token) => setLoginCaptchaToken(token)}
              />

              {/* کپچا را به فرم اضافه می‌کنیم به صورت hidden input */}
              <input
                type="hidden"
                name="h-captcha-response"
                value={loginCaptchaToken ?? ""}
              />
              <SubmitButton labelPending="Login..." labelIdle="Login" />

              {loginState?.error && (
                <p className="text-xs text-red-500 text-center">
                  {loginState.error}
                </p>
              )}
              <p className="text-center text-small">
                Need an account?{" "}
                <Link size="sm" onPress={() => setSelected("sign-up")}>
                  Sign up
                </Link>
              </p>
            </form>
          </Tab>

          {/* ========== SIGNUP TAB ========== */}
          <Tab key="sign-up" title="Sign up">
            <form action={registerFormAction} className="flex flex-col gap-4">
              <Input
                isRequired
                label="Name"
                name="name"
                placeholder="Enter your name"
                type="text"
              />
              <Input
                isRequired
                label="Email"
                name="email"
                placeholder="Enter your email"
                type="email"
              />
              <Input
                isRequired
                label="Password"
                name="password"
                placeholder="Enter your password"
                type="password"
                minLength={8}
              />
              <Input
                isRequired
                label="Password Confirmation"
                name="password_confirmation"
                placeholder="Confirm your password"
                type="password"
                minLength={8}
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

              <SubmitButton labelPending="Signing up..." labelIdle="Sign up" />
              {/* <Button
                onClick={handleGoogleLogin}
                variant="flat"
                className="w-full cursor-pointer"
              >
                Sign up with Google
              </Button> */}
              <Button
                onClick={handleGoogleLogin}
                variant="flat"
                className="w-full cursor-pointer flex items-center justify-center gap-2"
              >
                <FcGoogle className="w-5 h-5" />
                Sign up with Google
              </Button>
              {registerState?.error && (
                <p className="text-xs text-red-500 text-center">
                  {registerState.error}
                </p>
              )}
              <p className="text-center text-small">
                Already have an account?{" "}
                <Link size="sm" onPress={() => setSelected("login")}>
                  Login
                </Link>
              </p>
            </form>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
