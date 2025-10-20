import dynamic from "next/dynamic";

// بارگذاری dynamic و غیر SSR
const ForgotPassword = dynamic(
  () => import("../../app/components/Forgotpassword"),
  { ssr: false }
);

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
