// import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@heroui/react";
import NextTopLoader from "nextjs-toploader";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  verification: {
    google: "mDyxRv4048g-2nWuFLoEMSy7OPQQD8up6gcsw438vaQ",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={inter.className}>
        {/* Top loader */}
        <NextTopLoader
          color="#6366f1" // Loader color (violet)
          height={3} // Thickness
          showSpinner={false} // Hide spinner
          crawlSpeed={200} // Animation speed
        />
        {children}
      </body>
    </html>
  );
}
