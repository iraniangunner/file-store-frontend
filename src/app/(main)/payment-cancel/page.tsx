import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  ShoppingCart,
  RefreshCw,
  HelpCircle,
  Sparkles,
  MessageCircle,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-rose-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-slate-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
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

        {/* Cancel Card */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Header */}
          <div className="p-8 sm:p-10 text-center">
            {/* Cancel Icon */}
            <div className="relative mb-6 inline-block">
              <div className="absolute inset-0 bg-rose-200 rounded-full blur-xl opacity-50" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <XCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Payment Cancelled
            </h1>
            <p className="text-slate-500 text-lg">
              Your payment was not completed. Don't worry — your cart items are
              still saved.
            </p>
          </div>

          {/* What Happened Section */}
          <div className="px-8 sm:px-10 pb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              What might have happened?
            </h3>
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-sm text-slate-600">
                  You cancelled the payment process
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-sm text-slate-600">
                  The payment session expired
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-sm text-slate-600">
                  There was an issue with the payment provider
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 sm:px-10 pb-6 space-y-3">
            <Link
              href="/cart"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </Link>

            <Link
              href="/products"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* Help Section */}
          <div className="px-8 sm:px-10 pb-8 sm:pb-10">
            <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  Need help with your payment?
                </p>
                <p className="text-xs text-slate-500">
                  Our support team is here to assist you
                </p>
              </div>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-700 text-sm font-medium rounded-lg transition-colors flex-shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                Contact
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="px-8 sm:px-10 pb-6 border-t border-slate-100 pt-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
