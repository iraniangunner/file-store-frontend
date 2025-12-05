import { CartProvider } from "@/context/CartContext";
import dynamic from "next/dynamic";
import { Footer } from "../components/Footer";

const Navbar = dynamic(() => import("../components/Navbar"), {
  ssr: false,
  loading: () => (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-6 w-32 bg-slate-300 rounded-lg" /> {/* Logo skeleton */}
      <div className="hidden md:flex items-center gap-4">
        <div className="h-5 w-20 bg-slate-300 rounded-lg" />
        <div className="h-5 w-20 bg-slate-300 rounded-lg" />
        <div className="h-5 w-20 bg-slate-300 rounded-lg" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-slate-300 rounded-full" /> {/* Cart */}
        <div className="h-8 w-8 bg-slate-300 rounded-full" /> {/* User */}
      </div>
    </nav>
  ),
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
        <Footer />
      </CartProvider>
    </div>
  );
}
