import { Metadata } from "next";
import dynamic from "next/dynamic";

const Orders = dynamic(() => import("../../../../app/components/Orders"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Filerget | orders",
  description: "List of user orders",
};


export default function OrdersPage() {
  return <Orders />;
}
