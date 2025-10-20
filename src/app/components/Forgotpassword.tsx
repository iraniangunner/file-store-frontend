"use client";
import { Card, CardBody, Input, Button } from "@heroui/react";
import { useFormState, useFormStatus } from "react-dom";
import { forgotPasswordAction } from "@/app/_actions/forgot-password";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";


function SubmitButton({
  labelIdle,
  labelPending,
}: {
  labelIdle: string;
  labelPending: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium h-12 text-base"
      size="lg"
    >
      {pending ? labelPending : labelIdle}
    </Button>
  );
}

// Main Forgot Password Page
export default function ForgotPassword() {
  const [formState, formAction] = useFormState(forgotPasswordAction, {
    isSuccess: false,
    error: "",
  });

  if (formState.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md border-border/50 shadow-xl">
          <CardBody className="p-8 md:p-10">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Check Your Email
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
                  We've sent a password reset link to your email address. Please
                  check your inbox and follow the instructions.
                </p>
              </div>
              <Link href="/auth" className="w-full mt-2">
                <Button
                  className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium h-12"
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardBody className="p-8 md:p-10">
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="space-y-3 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 text-foreground" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
                  Forgot Password?
                </h1>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  No worries! Enter your email address and we'll send you a link
                  to reset your password.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <form action={formAction} className="flex flex-col gap-5 mt-2">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                classNames={{
                  input: "text-base",
                  inputWrapper: "h-12 border-border/50",
                }}
                startContent={
                  <Mail className="w-4 h-4 text-muted-foreground" />
                }
              />

              {formState.error && (
                <div className="p-3 text-red-500 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-destructive text-sm font-medium">
                    {formState.error}
                  </p>
                </div>
              )}

              <SubmitButton
                labelIdle="Send Reset Link"
                labelPending="Sending..."
              />
            </form>

            {/* Footer Section */}
            <div className="pt-4 border-t border-border/50">
              <Link
                href="/auth"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
