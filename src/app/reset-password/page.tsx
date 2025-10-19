import dynamic from "next/dynamic";

// بارگذاری dynamic و غیر SSR
const ResetPassword = dynamic(
  () => import("../../app/components/Resetpassword"),
  { ssr: false }
);

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
