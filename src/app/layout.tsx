import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Providers } from "./providers";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "filerget",
  description:
    "Digital files, made simple Buy and download what you need Instantly, Safely, Securely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Providers> */}

        {children}
        {/* </Providers> */}
      </body>
    </html>
  );
}
