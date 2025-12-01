// import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@heroui/react";

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
