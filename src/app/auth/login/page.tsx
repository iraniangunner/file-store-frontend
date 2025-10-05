"use client";
import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions/login";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, Input, Spinner } from "@heroui/react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button size="sm" type="submit" className="w-full cursor-pointer" disabled={pending}>
      {pending ? <Spinner size="sm" className="h-4 w-4 animate-spin" /> : <></>}
      <span>{pending ?"Login ...": "Login"}</span>
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, {
    isSuccess: false,
    error: "",
  });




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


  const router = useRouter();
  // const recaptchaRef = useRef<ReCAPTCHA>(null);
  // const [token, setToken] = useState("");
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;

      if (event.data.status === "success") {
        // fetch برای گرفتن user از cookie
        fetch("/api/me")
          .then(res => res.json())
          .then(user => {
            console.log("Logged in user:", user);
            router.push("/dashboard/orders");
          });
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (state?.isSuccess) {
      // router.push("/dashboard");
      window.location.href = "/dashboard/orders";
    }
  }, [state?.isSuccess, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        action={formAction}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" name="email" required />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" name="password" required />
        </div>

        {/* ✅ reCAPTCHA */}
        {/* <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          ref={recaptchaRef}
          onChange={(value: any) => setToken(value || "")}
        /> */}

        {/* 🔑 hidden input برای ارسال توکن به سرور */}
        {/* <input type="hidden" name="g-recaptcha-response" value={token} /> */}

        <SubmitButton />
        <Button onClick={handleGoogleLogin} className="w-full cursor-pointer">Login with Google</Button>
        

        {state?.error && (
          <p className="text-xs text-red-500 text-center">{state.error}</p>
        )}
      </form>
    </div>
  );
}
