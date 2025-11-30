// import Link from "next/link";

// export function Footer() {
//   return (
//     <footer className="border-t border-gray-200 bg-white px-4 py-8">
//       <div className="container mx-auto max-w-6xl">
//         <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
//           <div className="flex items-center gap-1 text-xl font-bold">
//             <span className="text-[#3B9FE8]">Filer</span>
//             <span className="text-[#3D3D8F]">Get</span>
//           </div>
//           <div className="flex gap-6 text-sm text-gray-600">
//             <Link href="/" className="hover:text-[#3B9FE8]">
//               About
//             </Link>
//             <Link href="/contact-us" className="hover:text-[#3B9FE8]">
//               Contact
//             </Link>
//             <Link href="/" className="hover:text-[#3B9FE8]">
//               Terms
//             </Link>
//             <Link href="/" className="hover:text-[#3B9FE8]">
//               Privacy
//             </Link>
//           </div>
//         </div>
//         <div className="mt-6 text-center text-sm text-gray-500">
//           © 2025 FilerGet. All rights reserved. Powered by blockchain
//           technology.
//         </div>
//       </div>
//     </footer>
//   );
// }

import Link from "next/link";
import {
  Mail,
  Twitter,
  Github,
  Linkedin,
  ArrowUpRight,
  Sparkles,
  Shield,
  Zap,
  Heart,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Products", href: "/products" },
      { label: "Categories", href: "/products" },
      { label: "Pricing", href: "/products" },
      { label: "New Arrivals", href: "/products" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact-us" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:info@filerget.com", label: "Email" },
  ];

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-sky-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-1 group mb-6">
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent">
                  Filer
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-violet-500 bg-clip-text text-transparent">
                  Get
                </span>
                <Sparkles className="w-4 h-4 text-amber-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                Digital files, made simple. Buy and download what you need — instantly, safely, and securely with blockchain technology.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-medium text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Secure Payments
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-medium text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Instant Download
                </span>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <p className="text-sm text-slate-500 flex items-center gap-1">
                © {currentYear} FilerGet. Made with
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                All rights reserved.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}