import { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Filerget",
  description:
    "Digital files, made simple Buy and download what you need Instantly, Safely, Securely",
};


export default function HomePage() {
  return (
    <>
    {/* <Navbar/> */}
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex max-w-4xl flex-col items-center text-center">
        {/* Logo and Tagline */}
        <div className="mb-12">
          <h1 className="mb-2 font-sans text-6xl font-bold tracking-tight md:text-7xl">
            <span className="text-[#3B9FE8]">Filer</span>
            <span className="text-[#3D3D8F]">Get</span>
          </h1>
          <p className="text-lg text-gray-900">Powered by Crypto</p>
        </div>

        {/* Main Headline */}
        <h2 className="mb-6 font-sans text-5xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
          Digital files, made simple
        </h2>

        {/* Subheadline */}
        <p className="mb-8 text-xl text-gray-700 md:text-2xl">
          Buy and download what you need
        </p>

        {/* Bold Statement */}
        <p className="mb-12 font-sans text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
          Instantly, Safely, Securely
        </p>

        {/* CTA Button with Gradient */}
        <Link
          href="/products"
          className="h-14 rounded-full bg-gradient-to-r from-[#3B9FE8] to-[#5B4FB5] px-12 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 inline-flex items-center justify-center"
        >
          Get Started
        </Link>
      </div>
    </main>
    </>
    
  );
}
