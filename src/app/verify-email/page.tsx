"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardBody, Input, Spinner } from "@heroui/react";
import { useFormState, useFormStatus } from "react-dom";
import { verifyEmailAction } from "@/app/_actions/verify-email";

// === دکمه submit خارج از صفحه ===
function SubmitButton({
  labelIdle,
  labelPending,
}: {
  labelIdle: string;
  labelPending: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Spinner size="sm" className="h-4 w-4 animate-spin mr-2" />}
      {pending ? labelPending : labelIdle}
    </Button>
  );
}

// === صفحه Verify Email ===
export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  // فرم state
  const [formState, formAction] = useFormState(verifyEmailAction, {
    isSuccess: false,
    error: "",
  });

  // بعد از موفقیت redirect
  if (formState.isSuccess) {
    router.push("/auth");
  }

  return (
    <Card className="max-w-md mx-auto mt-20 p-6 shadow-lg">
      <CardBody className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center mb-4">
          Verify Your Email
        </h2>
        <p className="text-center text-sm">
          We sent a verification code to <strong>{emailParam}</strong>
        </p>

        <form action={formAction} className="flex flex-col gap-3">
          <Input
            label="Email"
            name="email"
            defaultValue={emailParam}
            readOnly
          />
          <Input
            label="Verification Code"
            name="token"
            placeholder="Enter OTP"
            required
          />

          {formState.error && (
            <p className="text-red-500 text-sm">{formState.error}</p>
          )}

          <SubmitButton labelIdle="Verify" labelPending="Verifying..." />
        </form>
      </CardBody>
    </Card>
  );
}
