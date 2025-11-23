import { Metadata } from "next";
import Link from "next/link";
import {
  Download,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  FileCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Filerget",
  description:
    "Digital files, made simple Buy and download what you need Instantly, Safely, Securely",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[blob_7s_infinite]"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[blob_7s_infinite_2s]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[blob_7s_infinite_4s]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
          <div className="text-center">
            {/* Logo and Badge */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Filer Get
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  Powered by Crypto
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Digital files,
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                made simple
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Buy and download what you need
            </p>

            {/* Bold Statement */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-gray-700">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Instantly</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Safely</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Lock className="w-5 h-5 text-pink-600" />
                <span className="font-semibold">Securely</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:shadow-xl border border-gray-200 transform hover:scale-105 transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                <span>Browse Files</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Instant Downloads
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get your files immediately after purchase. No waiting, no
                delays—just instant access to what you need.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Blockchain Secured
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every transaction is secured with blockchain technology,
                ensuring transparency and trust.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Crypto Payments
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pay with cryptocurrency for fast, secure, and private
                transactions. Your financial data stays yours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
