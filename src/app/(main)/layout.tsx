import { CartProvider } from "@/context/CartContext";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("../components/Navbar"), {
  ssr: false,
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <CartProvider>
        <Navbar />
        {children}
      </CartProvider>
    </div>
  );
}
