import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  RefreshCw,
  Users,
  MessageCircle,
  ChevronRight,
  Mail,
  Zap,
} from "lucide-react";

import dynamic from "next/dynamic";

const FAQAccordion = dynamic(() => import("@/app/components/Faqaccordion"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Filerget | FAQ",
  description:
    "Find answers to frequently asked questions about FilerGet. Learn about payments, downloads, security, and more.",
};

const faqCategories = [
  {
    id: "general",
    title: "General Questions",
    icon: "HelpCircle",
    color: "from-violet-500 to-violet-600",
    questions: [
      {
        question: "What is FilerGet?",
        answer:
          "FilerGet is a digital marketplace where you can buy and download digital files instantly. We offer a wide range of products including documents, images, videos, audio files, and more. Our platform is powered by blockchain technology for secure and transparent transactions.",
      },
      {
        question: "Do I need an account to make a purchase?",
        answer:
          "While you can browse our products without an account, you'll need to create a free account to make purchases and access your downloaded files. Creating an account also allows you to track your orders and manage your purchase history.",
      },
      {
        question: "What file formats do you support?",
        answer:
          "We support a wide variety of file formats including PDF, DOCX, XLSX, JPG, PNG, MP4, MP3, ZIP, and many more. Each product listing shows the specific file format you'll receive upon purchase.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & Pricing",
    icon: "CreditCard",
    color: "from-emerald-500 to-emerald-600",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept cryptocurrency payments including USDT (ERC20) and USDT (BEP20). Crypto payments provide fast, secure, and private transactions. We're working on adding more payment options in the future.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "No, there are no hidden fees. The price you see on the product page is the final price you pay. We believe in transparent pricing and will never surprise you with additional charges at checkout.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Due to the digital nature of our products, we generally don't offer refunds once a file has been downloaded. However, if you experience technical issues or receive a corrupted file, please contact our support team and we'll work to resolve the issue.",
      },
    ],
  },
  {
    id: "downloads",
    title: "Downloads & Access",
    icon: "Download",
    color: "from-sky-500 to-sky-600",
    questions: [
      {
        question: "How do I download my purchased files?",
        answer:
          "After completing your purchase, you can access your files immediately from your Orders page in the dashboard. Simply click the download button next to each file. Your purchases are available for download at any time from your account.",
      },
      {
        question: "Is there a download limit?",
        answer:
          "No, there's no download limit. Once you purchase a file, you can download it as many times as you need. Your purchases are permanently linked to your account for lifetime access.",
      },
      {
        question: "How long do I have access to my purchased files?",
        answer:
          "You have lifetime access to all your purchased files. As long as you have a FilerGet account, you can access and re-download your purchases at any time.",
      },
    ],
  },
  {
    id: "security",
    title: "Security & Privacy",
    icon: "Shield",
    color: "from-amber-500 to-amber-600",
    questions: [
      {
        question: "How secure are my transactions?",
        answer:
          "All transactions on FilerGet are secured using blockchain technology, which provides an immutable and transparent record of every transaction. Your payment information is never stored on our servers.",
      },
      {
        question: "Is my personal information safe?",
        answer:
          "Yes, we take your privacy seriously. We only collect the minimum information necessary to provide our services. Your data is encrypted and stored securely, and we never sell your information to third parties.",
      },
      {
        question: "Do you use cookies?",
        answer:
          "Yes, we use essential cookies to provide basic functionality and improve your experience on our platform. You can manage your cookie preferences in your browser settings.",
      },
    ],
  },
];

export default function FAQPage() {
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
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">
              Help Center
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions about FilerGet. Can't find what
            you're looking for? Contact our support team.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 text-center shadow-sm">
            <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">Instant Access</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 text-center shadow-sm">
            <Shield className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">
              Secure Payments
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 text-center shadow-sm">
            <RefreshCw className="w-6 h-6 text-sky-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">
              Lifetime Access
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 text-center shadow-sm">
            <Users className="w-6 h-6 text-violet-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900">24/7 Support</p>
          </div>
        </div>

        {/* FAQ Accordion - Client Component */}
        <FAQAccordion categories={faqCategories} />

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Still have questions?
          </h2>
          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            Can't find the answer you're looking for? Our friendly support team
            is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
            >
              Browse Products
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
