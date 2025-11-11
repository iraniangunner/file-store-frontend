import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-1 text-xl font-bold">
            <span className="text-[#3B9FE8]">Filer</span>
            <span className="text-[#3D3D8F]">Get</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#3B9FE8]">
              About
            </Link>
            <Link href="/contact-us" className="hover:text-[#3B9FE8]">
              Contact
            </Link>
            <Link href="/" className="hover:text-[#3B9FE8]">
              Terms
            </Link>
            <Link href="/" className="hover:text-[#3B9FE8]">
              Privacy
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          © 2025 FilerGet. All rights reserved. Powered by blockchain
          technology.
        </div>
      </div>
    </footer>
  );
}
