"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardBody, InputOtp } from "@heroui/react";
import { useFormState, useFormStatus } from "react-dom";
import { verifyEmailAction } from "@/app/_actions/verify-email";
import { Mail, ShieldCheck, Clock } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-foreground text-background hover:opacity-90 font-medium"
      size="lg"
    >
      {pending ? "Verifying..." : "Verify Email"}
    </Button>
  );
}

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const [otpValue, setOtpValue] = useState("");

  const [formState, formAction] = useFormState(verifyEmailAction, {
    isSuccess: false,
    error: "",
  });

  useEffect(() => {
    if (formState.isSuccess) {
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    }
  }, [formState.isSuccess, router]);

  if (formState.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
        <Card className="w-full max-w-md shadow-2xl border-success/20">
          <CardBody className="p-8 md:p-10">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-success" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Email Verified!
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your email has been successfully verified. You can now access
                  all features of your account.
                </p>
              </div>
              <Button
                onClick={() => router.push("/auth")}
                className="w-full bg-foreground text-background hover:opacity-90 font-medium"
                size="lg"
              >
                Continue to Login
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-md shadow-2xl">
        <CardBody className="p-8 md:p-10">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Verify Your Email
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We sent a verification code to
                  <br />
                  <span className="font-semibold text-foreground">
                    {emailParam}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <Clock className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-sm text-warning-foreground">
                This code will expire in{" "}
                <span className="font-semibold">15 minutes</span>
              </p>
            </div>

            {/* Form */}
            <form action={formAction} className="flex flex-col gap-6">
              {/* Hidden email field */}
              <input type="hidden" name="email" value={emailParam} />

              {/* OTP Input */}
              <div className="flex flex-col items-center gap-3">
                <label className="text-sm font-medium text-foreground">
                  Enter verification code
                </label>
                <InputOtp
                  length={6}
                  value={otpValue}
                  onValueChange={setOtpValue}
                  size="lg"
                  className="gap-2"
                />
                <input type="hidden" name="token" value={otpValue} />
              </div>

              {/* Error Message */}
              {formState.error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                  <p className="text-danger text-sm text-center">
                    {formState.error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <SubmitButton />
            </form>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
