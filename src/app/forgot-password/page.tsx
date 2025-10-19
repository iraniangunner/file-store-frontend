"use client";

import React from "react";
import { Card, CardBody, Input, Button, Spinner } from "@heroui/react";
import { useFormState, useFormStatus } from "react-dom";
import { forgotPasswordAction } from "@/app/_actions/forgot-password";

// دکمه Submit
function SubmitButton({ labelIdle, labelPending }: { labelIdle: string; labelPending: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Spinner size="sm" className="h-4 w-4 animate-spin mr-2" />}
      {pending ? labelPending : labelIdle}
    </Button>
  );
}

// صفحه Forgot Password
export default function ForgotPasswordPage() {
  const [formState, formAction] = useFormState(forgotPasswordAction, { isSuccess: false, error: "" });

  if (formState.isSuccess) {
    return (
      <Card className="max-w-md mx-auto mt-20 p-6 shadow-lg">
        <CardBody className="text-center">
          <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
          <p>We have sent a password reset link to your email. Please check your inbox.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-20 p-6 shadow-lg">
      <CardBody className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center mb-4">Forgot Password</h2>
        <form action={formAction} className="flex flex-col gap-3">
          <Input label="Email" name="email" type="email" placeholder="Enter your email" required />
          {formState.error && <p className="text-red-500 text-sm">{formState.error}</p>}
          <SubmitButton labelIdle="Send Reset Link" labelPending="Sending..." />
        </form>
      </CardBody>
    </Card>
  );
}
