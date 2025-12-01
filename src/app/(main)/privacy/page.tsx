import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Eye,
  Database,
  Share2,
  Cookie,
  UserCheck,
  Lock,
  Mail,
  Calendar,
  FileText,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Filerget | Privacy Policy",
  description:
    "Learn how FilerGet collects, uses, and protects your personal information. Your privacy is our priority.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      id: "information-we-collect",
      icon: Database,
      title: "Information We Collect",
      color: "from-violet-500 to-violet-600",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account or make a purchase, we may collect your name, email address, and payment information. We only collect information that is necessary to provide our services.",
        },
        {
          subtitle: "Usage Data",
          text: "We automatically collect certain information when you visit our website, including your IP address, browser type, pages visited, and time spent on pages. This helps us improve our services and user experience.",
        },
        {
          subtitle: "Cookies and Tracking",
          text: "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from.",
        },
      ],
    },
    {
      id: "how-we-use",
      icon: Eye,
      title: "How We Use Your Information",
      color: "from-sky-500 to-sky-600",
      content: [
        {
          subtitle: "Service Delivery",
          text: "We use your information to process transactions, deliver purchased files, and provide customer support. Your email is used to send order confirmations and important account updates.",
        },
        {
          subtitle: "Improvement and Analytics",
          text: "We analyze usage patterns to improve our website, products, and services. This includes understanding which features are most popular and identifying areas for improvement.",
        },
        {
          subtitle: "Communication",
          text: "With your consent, we may send you promotional emails about new products, special offers, or other information we think you may find interesting. You can opt out at any time.",
        },
      ],
    },
    {
      id: "data-protection",
      icon: Lock,
      title: "Data Protection",
      color: "from-emerald-500 to-emerald-600",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.",
        },
        {
          subtitle: "Payment Security",
          text: "All payment transactions are processed through secure, encrypted channels. We do not store your complete payment information on our servers. Cryptocurrency transactions are secured by blockchain technology.",
        },
        {
          subtitle: "Data Retention",
          text: "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.",
        },
      ],
    },
    {
      id: "sharing",
      icon: Share2,
      title: "Information Sharing",
      color: "from-amber-500 to-amber-600",
      content: [
        {
          subtitle: "Third-Party Services",
          text: "We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you. These parties are obligated to keep your information confidential.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information when required by law, such as to comply with a subpoena or similar legal process, or when we believe disclosure is necessary to protect our rights or the safety of others.",
        },
        {
          subtitle: "No Selling of Data",
          text: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties for marketing purposes. Your trust is important to us.",
        },
      ],
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "Cookies Policy",
      color: "from-rose-500 to-rose-600",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "These cookies are necessary for the website to function properly. They enable basic features like page navigation, secure access, and shopping cart functionality.",
        },
        {
          subtitle: "Analytics Cookies",
          text: "We use analytics cookies to understand how visitors interact with our website. This information is used to improve our services and create a better user experience.",
        },
        {
          subtitle: "Managing Cookies",
          text: "You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.",
        },
      ],
    },
    {
      id: "your-rights",
      icon: UserCheck,
      title: "Your Rights",
      color: "from-indigo-500 to-indigo-600",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You have the right to access the personal information we hold about you and to request corrections if any information is inaccurate or incomplete.",
        },
        {
          subtitle: "Data Deletion",
          text: "You may request the deletion of your personal information at any time. We will comply with your request unless we are legally required to retain certain information.",
        },
        {
          subtitle: "Opt-Out",
          text: "You can opt out of receiving promotional communications from us by following the unsubscribe link in our emails or by contacting us directly.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full mb-6">
            <Shield className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">
              Legal Document
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Your privacy is important to us. This policy explains how we collect,
            use, and protect your personal information.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 mb-10">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors group"
              >
                <section.icon className="w-4 h-4 text-slate-400 group-hover:text-violet-500" />
                <span>{section.title}</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden scroll-mt-24"
            >
              {/* Section Header */}
              <div className="px-6 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}
                  >
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Section {index + 1}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">
                      {section.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Section Content */}
              <div className="px-6 sm:px-8 py-6 space-y-6">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-bold text-white mb-2">
                Questions About Privacy?
              </h2>
              <p className="text-slate-300">
                If you have any questions about this Privacy Policy, please don't
                hesitate to contact us.
              </p>
            </div>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-colors flex-shrink-0"
            >
              Contact Us
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/terms"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}