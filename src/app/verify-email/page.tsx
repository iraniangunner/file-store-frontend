import dynamic from "next/dynamic";

// بارگذاری dynamic و غیر SSR
const VerifyEmail = dynamic(() => import("../../app/components/Verifyemail"), {
  ssr: false,
});

export default function VerifyEmailPage() {
  return <VerifyEmail />;
}
