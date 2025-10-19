import dynamic from "next/dynamic";

const Orders = dynamic(() => import("../../../../app/components/Orders"), {
  ssr: false,
});

export default function OrdersPage() {
  return <Orders />;
}
