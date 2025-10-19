"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardBody, Input, Spinner } from "@heroui/react";
import { useFormState, useFormStatus } from "react-dom";
import { resetPasswordAction } from "@/app/_actions/reset-password";

// دکمه Submit عمومی
function SubmitButton({ labelIdle, labelPending }: { labelIdle: string; labelPending: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Spinner size="sm" className="h-4 w-4 animate-spin mr-2" />}
      {pending ? labelPending : labelIdle}
    </Button>
  );
}

// صفحه Reset Password
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const tokenParam = searchParams.get("token") ?? "";

  const [formState, formAction] = useFormState(resetPasswordAction, {
    isSuccess: false,
    error: "",
  });

  // بعد از موفقیت ریست، redirect به صفحه login
  useEffect(() => {
    if (formState.isSuccess) {
      router.push("/auth");
    }
  }, [formState.isSuccess, router]);
  return (
    <Card className="max-w-md mx-auto mt-20 p-6 shadow-lg">
      <CardBody className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center mb-4">Reset Your Password</h2>
        <p className="text-center text-sm">
          Reset password for <strong>{emailParam}</strong>
        </p>

        <form action={formAction} className="flex flex-col gap-3">
          <Input label="Email" name="email" defaultValue={emailParam} readOnly />

          <Input label="Reset Token" name="token" defaultValue={tokenParam} readOnly />

          <Input
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter new password"
            required
          />

          <Input
            label="Confirm New Password"
            name="password_confirmation"
            type="password"
            placeholder="Confirm new password"
            required
          />

          {formState.error && <p className="text-red-500 text-sm">{formState.error}</p>}

          <SubmitButton labelIdle="Reset Password" labelPending="Resetting..." />
        </form>
      </CardBody>
    </Card>
  );
}
