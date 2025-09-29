"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registerAction } from "@/app/actions/register";
import { useEffect } from "react";
import { Button, Input, Spinner } from "@heroui/react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      size="sm"
      type="submit"
      className="w-full cursor-pointer"
      disabled={pending}
    >
      {pending ? <Spinner size="sm" className="h-4 w-4 animate-spin" /> : <></>}
      <span>{pending ? "Signing up ..." : "Sign up"}</span>
    </Button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, {
    isSuccess: false,
    error: "",
  });

  useEffect(() => {
    if (state?.isSuccess) {
      window.location.href = "/dashboard";
    }
  }, [state?.isSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        action={formAction}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center">Signup</h1>

        <div className="space-y-1">
          <label className="text-sm font-medium">Name</label>
          <Input type="text" name="name" required />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" name="email" required />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" name="password" required minLength={8} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password Confirmation</label>
          <Input
            type="password"
            name="password_confirmation"
            required
            minLength={8}
          />
        </div>

        <SubmitButton />

        {state?.error && (
          <p className="text-xs text-red-500 text-center">{state.error}</p>
        )}
      </form>
    </div>
  );
}
