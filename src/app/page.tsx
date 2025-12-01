// import { Metadata } from "next";
// import Link from "next/link";
// import {
//   Download,
//   Shield,
//   Zap,
//   ArrowRight,
//   Sparkles,
//   Lock,
//   FileCheck,
// } from "lucide-react";

// export const metadata: Metadata = {
//   title: "Filerget",
//   description:
//     "Digital files, made simple Buy and download what you need Instantly, Safely, Securely",
// };

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         {/* Decorative Background Elements */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[blob_7s_infinite]"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[blob_7s_infinite_2s]"></div>
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[blob_7s_infinite_4s]"></div>
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
//           <div className="text-center">
//             {/* Logo and Badge */}
//             <div className="flex flex-col items-center gap-4 mb-8">
//               <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
//                 <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//                   <FileCheck className="w-5 h-5 text-white" />
//                 </div>
//                 <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   Filer Get
//                 </span>
//               </div>

//               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
//                 <Sparkles className="w-4 h-4 text-white" />
//                 <span className="text-sm font-medium text-white">
//                   Powered by Crypto
//                 </span>
//               </div>
//             </div>

//             {/* Main Headline */}
//             <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
//               Digital files,
//               <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 made simple
//               </span>
//             </h1>

//             {/* Subheadline */}
//             <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
//               Buy and download what you need
//             </p>

//             {/* Bold Statement */}
//             <div className="flex flex-wrap justify-center gap-6 mb-12">
//               <div className="flex items-center gap-2 text-gray-700">
//                 <Zap className="w-5 h-5 text-blue-600" />
//                 <span className="font-semibold">Instantly</span>
//               </div>
//               <div className="flex items-center gap-2 text-gray-700">
//                 <Shield className="w-5 h-5 text-purple-600" />
//                 <span className="font-semibold">Safely</span>
//               </div>
//               <div className="flex items-center gap-2 text-gray-700">
//                 <Lock className="w-5 h-5 text-pink-600" />
//                 <span className="font-semibold">Securely</span>
//               </div>
//             </div>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <Link
//                 href="/products"
//                 className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
//               >
//                 <span>Get Started</span>
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Link>

//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:shadow-xl border border-gray-200 transform hover:scale-105 transition-all duration-200"
//               >
//                 <Download className="w-5 h-5" />
//                 <span>Browse Files</span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="relative py-20 bg-white/50 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Feature 1 */}
//             <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
//               <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                 <Zap className="w-7 h-7 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-3">
//                 Instant Downloads
//               </h3>
//               <p className="text-gray-600 leading-relaxed">
//                 Get your files immediately after purchase. No waiting, no
//                 delays—just instant access to what you need.
//               </p>
//             </div>

//             {/* Feature 2 */}
//             <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
//               <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                 <Shield className="w-7 h-7 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-3">
//                 Blockchain Secured
//               </h3>
//               <p className="text-gray-600 leading-relaxed">
//                 Every transaction is secured with blockchain technology,
//                 ensuring transparency and trust.
//               </p>
//             </div>

//             {/* Feature 3 */}
//             <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
//               <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                 <Lock className="w-7 h-7 text-white" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-3">
//                 Crypto Payments
//               </h3>
//               <p className="text-gray-600 leading-relaxed">
//                 Pay with cryptocurrency for fast, secure, and private
//                 transactions. Your financial data stays yours.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

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
  Users,
  Globe,
  CreditCard,
  CheckCircle2,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  ChevronRight,
  Wallet,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Filerget - Digital Files Made Simple",
  description:
    "Digital files, made simple. Buy and download what you need Instantly, Safely, Securely with crypto payments.",
};

export default function HomePage() {
  const stats = [
    { value: "50K+", label: "Downloads", icon: Download },
    { value: "10K+", label: "Happy Users", icon: Users },
    { value: "99.9%", label: "Uptime", icon: Zap },
    { value: "24/7", label: "Support", icon: Clock },
  ];

  const fileTypes = [
    { name: "Documents", icon: FileText, color: "from-blue-500 to-blue-600" },
    { name: "Images", icon: Image, color: "from-emerald-500 to-emerald-600" },
    { name: "Videos", icon: Video, color: "from-rose-500 to-rose-600" },
    { name: "Audio", icon: Music, color: "from-amber-500 to-amber-600" },
    { name: "Archives", icon: Archive, color: "from-violet-500 to-violet-600" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Instant Downloads",
      description:
        "Get your files immediately after purchase. No waiting, no delays—just instant access to what you need.",
      color: "from-sky-500 to-sky-600",
      bgColor: "bg-sky-50",
    },
    {
      icon: Shield,
      title: "Blockchain Secured",
      description:
        "Every transaction is secured with blockchain technology, ensuring transparency and trust.",
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      icon: Wallet,
      title: "Crypto Payments",
      description:
        "Pay with cryptocurrency for fast, secure, and private transactions. Your financial data stays yours.",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-violet-200/50 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-sky-200/50 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-violet-100/30 via-transparent to-sky-100/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-36 sm:pb-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">
                Powered by Blockchain Technology
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
              Digital files,
              <span className="block mt-2 bg-gradient-to-r from-violet-600 via-sky-600 to-violet-600 bg-clip-text text-transparent">
                made simple
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Buy and download what you need — instantly, safely, and securely
              with crypto payments.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-slate-700">Instant Access</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="font-medium text-slate-700">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
                <Lock className="w-5 h-5 text-violet-500" />
                <span className="font-medium text-slate-700">Privacy First</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-2xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl shadow-lg border border-slate-200 hover:border-slate-300 transition-all duration-200"
              >
                <span>Create Account</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 mt-12 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Free to browse
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No hidden fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Secure checkout
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-y border-slate-200/60 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-100 mb-4">
                  <stat.icon className="w-6 h-6 text-violet-600" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-sky-700">
                Why Choose Us
              </span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Everything you need for digital files
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We provide a secure, fast, and user-friendly platform for buying
              and downloading digital content.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* File Types Section */}
      <section className="relative py-24 bg-slate-900">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-sky-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              All file types supported
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From documents to videos, we support a wide range of file formats
              for all your needs.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {fileTypes.map((type, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}
                >
                  <type.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-white">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Simple Process
              </span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get your files in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 text-white text-2xl font-bold mb-6 shadow-lg shadow-violet-500/25">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Browse & Choose
              </h3>
              <p className="text-slate-600">
                Explore our collection and find the files you need
              </p>
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-violet-300 to-sky-300" />
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white text-2xl font-bold mb-6 shadow-lg shadow-sky-500/25">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Pay with Crypto
              </h3>
              <p className="text-slate-600">
                Secure checkout with your preferred cryptocurrency
              </p>
              {/* Connector */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-sky-300 to-emerald-300" />
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold mb-6 shadow-lg shadow-emerald-500/25">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Download Instantly
              </h3>
              <p className="text-slate-600">
                Get immediate access to your purchased files
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 sm:p-16 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">
                Start Today
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust FilerGet for their digital file
              needs. Browse our collection and find what you're looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-2xl transition-all duration-200"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all duration-200"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}