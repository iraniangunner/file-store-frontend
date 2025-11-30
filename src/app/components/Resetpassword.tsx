// "use client";

// import React from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button, Card, CardBody, Input } from "@heroui/react";
// import { useFormState, useFormStatus } from "react-dom";
// import { resetPasswordAction } from "@/app/_actions/reset-password";
// import { Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
// import Link from "next/link";


// function SubmitButton({
//   labelIdle,
//   labelPending,
// }: {
//   labelIdle: string;
//   labelPending: string;
// }) {
//   const { pending } = useFormStatus();

//   return (
//     <Button
//       type="submit"
//       disabled={pending}
//       className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium h-12 text-base"
//       size="lg"
//     >
//       {pending ? labelPending : labelIdle}
//     </Button>
//   );
// }

// // Main Reset Password Page
// export default function ResetPassword() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const emailParam = searchParams.get("email") ?? "";
//   const tokenParam = searchParams.get("token") ?? "";

//   const [showPassword, setShowPassword] = React.useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

//   const [formState, formAction] = useFormState(resetPasswordAction, {
//     isSuccess: false,
//     error: "",
//   });

//   if (formState.isSuccess) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4 bg-background">
//         <Card className="w-full max-w-md border-border/50 shadow-xl">
//           <CardBody className="p-8 md:p-10">
//             <div className="flex flex-col items-center text-center gap-6">
//               <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
//                 <CheckCircle2 className="w-8 h-8 text-success" />
//               </div>
//               <div className="space-y-3">
//                 <h2 className="text-2xl md:text-3xl font-bold text-foreground">
//                   Password Reset Successfully
//                 </h2>
//                 <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
//                   Your password has been updated. You can now log in with your
//                   new password.
//                 </p>
//               </div>
//               <Link href="/auth" className="w-full mt-2">
//                 <Button
//                   className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium h-12"
//                   size="lg"
//                 >
//                   Continue to Login
//                 </Button>
//               </Link>
//             </div>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-background">
//       <Card className="w-full max-w-md border-border/50 shadow-xl">
//         <CardBody className="p-8 md:p-10">
//           <div className="flex flex-col gap-6">
//             {/* Header Section */}
//             <div className="space-y-3 text-center">
//               <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
//                 <Lock className="w-7 h-7 text-foreground" />
//               </div>
//               <div className="space-y-2">
//                 <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
//                   Reset Your Password
//                 </h1>
//                 <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
//                   Enter your new password below. Make sure it's strong and
//                   secure.
//                 </p>
//               </div>
//             </div>

//             {/* Form Section */}
//             <form action={formAction} className="flex flex-col gap-5 mt-2">
//               {/* Hidden fields for email and token */}
//               <input type="hidden" name="email" value={emailParam} />
//               <input type="hidden" name="token" value={tokenParam} />

//               <Input
//                 label="New Password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your new password"
//                 required
//                 classNames={{
//                   input: "text-base",
//                   inputWrapper: "h-12 border-border/50",
//                 }}
//                 startContent={
//                   <Lock className="w-4 h-4 text-muted-foreground" />
//                 }
//                 endContent={
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="focus:outline-none"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-4 h-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="w-4 h-4 text-muted-foreground" />
//                     )}
//                   </button>
//                 }
//               />

//               <Input
//                 label="Confirm New Password"
//                 name="password_confirmation"
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm your new password"
//                 required
//                 classNames={{
//                   input: "text-base",
//                   inputWrapper: "h-12 border-border/50",
//                 }}
//                 startContent={
//                   <Lock className="w-4 h-4 text-muted-foreground" />
//                 }
//                 endContent={
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="focus:outline-none"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="w-4 h-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="w-4 h-4 text-muted-foreground" />
//                     )}
//                   </button>
//                 }
//               />

//               {formState.error && (
//                 <div className="p-3 text-red-500 rounded-lg bg-destructive/10 border border-destructive/20">
//                   <p className="text-destructive text-sm font-medium">
//                     {formState.error}
//                   </p>
//                 </div>
//               )}

//               <SubmitButton
//                 labelIdle="Reset Password"
//                 labelPending="Resetting..."
//               />
//             </form>

//             {/* Footer Section */}
//             <div className="pt-4 border-t border-border/50">
//               <Link
//                 href="/auth"
//                 className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Back to Login
//               </Link>
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// }


"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { resetPasswordAction } from "@/app/_actions/reset-password";
import { Lock, CheckCircle2, Eye, EyeOff, ArrowLeft, KeyRound, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@heroui/react";

function SubmitButton({
  labelIdle,
  labelPending,
}: {
  labelIdle: string;
  labelPending: string;
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
          <ShieldCheck className="w-5 h-5" />
          <span>{labelIdle}</span>
        </>
      )}
    </button>
  );
}

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const tokenParam = searchParams.get("token") ?? "";

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");

  const [formState, formAction] = useFormState(resetPasswordAction, {
    isSuccess: false,
    error: "",
  });

  // Password strength indicator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;

    if (strength <= 1) return { strength: 1, label: "Weak", color: "bg-rose-500" };
    if (strength === 2) return { strength: 2, label: "Fair", color: "bg-amber-500" };
    if (strength === 3) return { strength: 3, label: "Good", color: "bg-sky-500" };
    return { strength: 4, label: "Strong", color: "bg-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  // Success State
  if (formState.isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-200/40 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-1 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                Filer
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
                Get
              </span>
            </Link>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              {/* Success Icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Message */}
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Password Reset Successfully
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Your password has been updated. You can now log in with your new password.
              </p>

              {/* Success Badge */}
              <div className="w-full flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-emerald-800">Account Secured</p>
                  <p className="text-xs text-emerald-600">Your account is now protected</p>
                </div>
              </div>

              {/* Continue Button */}
              <Link href="/auth" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200">
                  Continue to Login
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form State
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Filer
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
              Get
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-500/25">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Reset Your Password
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Enter your new password below. Make sure it's strong and secure.
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="px-8 pb-8 space-y-5">
            {/* Hidden fields */}
            <input type="hidden" name="email" value={emailParam} />
            <input type="hidden" name="token" value={tokenParam} />

            {/* New Password */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Lock className="w-4 h-4 text-slate-400" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                           focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                           transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.strength <= 1 ? "text-rose-500" :
                    passwordStrength.strength === 2 ? "text-amber-500" :
                    passwordStrength.strength === 3 ? "text-sky-500" :
                    "text-emerald-500"
                  }`}>
                    {passwordStrength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Lock className="w-4 h-4 text-slate-400" />
                Confirm New Password
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-medium text-slate-700 mb-2">Password must contain:</p>
              <ul className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <li className={`flex items-center gap-1.5 ${password.length >= 8 ? "text-emerald-600" : ""}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? "bg-emerald-500" : "bg-slate-300"}`} />
                  8+ characters
                </li>
                <li className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? "text-emerald-600" : ""}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? "bg-emerald-500" : "bg-slate-300"}`} />
                  Uppercase letter
                </li>
                <li className={`flex items-center gap-1.5 ${/[0-9]/.test(password) ? "text-emerald-600" : ""}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? "bg-emerald-500" : "bg-slate-300"}`} />
                  Number
                </li>
                <li className={`flex items-center gap-1.5 ${/[^A-Za-z0-9]/.test(password) ? "text-emerald-600" : ""}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(password) ? "bg-emerald-500" : "bg-slate-300"}`} />
                  Special character
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {formState.error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold">
                  !
                </span>
                {formState.error}
              </div>
            )}

            {/* Submit Button */}
            <SubmitButton
              labelIdle="Reset Password"
              labelPending="Resetting..."
            />

            {/* Back to Login */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/auth"
                className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}