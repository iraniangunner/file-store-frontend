import dynamic from "next/dynamic";

// بارگذاری dynamic و غیر SSR
const PaymentSuccess = dynamic(
  () => import("../../../app/components/Paymentsuccess"), 
  { ssr: false }
);

export default function PaymentSuccessPage() {
  return <PaymentSuccess />;
}
