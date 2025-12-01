import Link from "next/link";
import {
  Home,
  Search,
  ArrowLeft,
  Sparkles,
  FileQuestion,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";

export default function NotFound() {
  const quickLinks = [
    {
      icon: ShoppingBag,
      label: "Browse Products",
      href: "/products",
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      hoverBg: "hover:bg-violet-100",
    },
    {
      icon: Home,
      label: "Go Home",
      href: "/",
      color: "from-sky-500 to-sky-600",
      bgColor: "bg-sky-50",
      hoverBg: "hover:bg-sky-100",
    },
    {
      icon: HelpCircle,
      label: "Contact Support",
      href: "/contact-us",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      hoverBg: "hover:bg-emerald-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Filer
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
              Get
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-8 sm:p-12">
          {/* 404 Icon */}
          <div className="relative mb-8 inline-block">
            <div className="absolute inset-0 bg-violet-200 rounded-full blur-2xl opacity-40" />
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-100 to-slate-100 flex items-center justify-center mx-auto border border-slate-200/60">
              <FileQuestion className="w-14 h-14 text-violet-400" />
            </div>
          </div>

          {/* Error Code */}
          <div className="mb-4">
            <span className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-violet-600 via-sky-600 to-violet-600 bg-clip-text text-transparent">
              404
            </span>
          </div>

          {/* Message */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Page not found
          </h1>
          <p className="text-slate-500 mb-8 leading-relaxed max-w-sm mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved to
            a new location.
          </p>

          {/* Primary CTA */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-2xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200 mb-6"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400">or try these</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl ${link.bgColor} ${link.hoverBg} transition-colors group`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
                >
                  <link.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Help Text */}
        <p className="mt-8 text-sm text-slate-400">
          Think this is a mistake?{" "}
          <Link
            href="/contact-us"
            className="text-violet-600 font-medium hover:underline"
          >
            Let us know
          </Link>
        </p>
      </div>
    </div>
  );
}