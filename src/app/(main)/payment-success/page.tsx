import dynamic from "next/dynamic";


const PaymentSuccessClientPage = dynamic(() => import("./paymentSuccessClient"), {
  ssr: false,
});
export default function PaymentSuccessPage() {
  return <PaymentSuccessClientPage />;
}
