import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Target,
  Eye,
  Heart,
  Shield,
  Zap,
  Users,
  Globe,
  Award,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Lock,
  Wallet,
  Download,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Filerget | About Us",
  description:
    "Learn about FilerGet - your trusted digital marketplace for instant, secure file downloads powered by blockchain technology.",
};

export default function AboutUsPage() {
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description:
        "We prioritize the security of your data and transactions above everything else.",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description:
        "Get immediate access to your purchased files with no waiting or delays.",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description:
        "Your satisfaction is our priority. We're here to help you every step of the way.",
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      icon: Globe,
      title: "Global Access",
      description:
        "Available worldwide with crypto payments, making digital content accessible to everyone.",
      color: "from-sky-500 to-sky-600",
      bgColor: "bg-sky-50",
    },
  ];

  const stats = [
    { value: "50K+", label: "Downloads", icon: Download },
    { value: "10K+", label: "Happy Users", icon: Users },
    { value: "99.9%", label: "Uptime", icon: Clock },
    { value: "24/7", label: "Support", icon: Shield },
  ];

  const features = [
    "Blockchain-secured transactions",
    "Instant file delivery",
    "Multiple cryptocurrency support",
    "No hidden fees or subscriptions",
    "Lifetime access to purchases",
    "24/7 customer support",
  ];

  const timeline = [
    {
      year: "2023",
      title: "The Beginning",
      description:
        "FilerGet was founded with a vision to revolutionize digital file distribution using blockchain technology.",
    },
    {
      year: "2024",
      title: "Growing Strong",
      description:
        "Reached 10,000+ users and expanded our product catalog to include diverse digital content categories.",
    },
    {
      year: "2025",
      title: "Looking Ahead",
      description:
        "Continuing to innovate with new features, better security, and an enhanced user experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-200/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-200/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">
              Our Story
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            Digital files,
            <span className="block mt-2 bg-gradient-to-r from-violet-600 via-sky-600 to-violet-600 bg-clip-text text-transparent">
              made simple
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            FilerGet is your trusted destination for digital content. We combine
            blockchain security with instant delivery to provide a seamless
            experience for buying and downloading digital files.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8">
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
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8 hover:shadow-lg hover:shadow-slate-200/50 transition-shadow duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/25">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Our Mission
              </h2>
              <p className="text-slate-600 leading-relaxed">
                To democratize access to digital content by providing a secure,
                transparent, and user-friendly platform where creators and
                consumers can connect seamlessly. We believe everyone deserves
                instant, affordable access to quality digital files.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8 hover:shadow-lg hover:shadow-slate-200/50 transition-shadow duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center mb-6 shadow-lg shadow-sky-500/25">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Our Vision
              </h2>
              <p className="text-slate-600 leading-relaxed">
                To become the world's most trusted digital marketplace, where
                blockchain technology ensures every transaction is secure,
                transparent, and instant. We envision a future where digital
                content is accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-16 bg-slate-900">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-sky-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              The principles that guide everything we do at FilerGet
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-6">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  Why FilerGet
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">
                Why thousands trust us with their digital needs
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We've built a platform that puts security, speed, and simplicity
                first. Here's what sets us apart from the rest.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/25">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Blockchain Security
                    </h3>
                    <p className="text-sm text-slate-600">
                      Every transaction is recorded on the blockchain, ensuring
                      complete transparency and immutability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-500/25">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Crypto Payments
                    </h3>
                    <p className="text-sm text-slate-600">
                      Pay with USDT and other cryptocurrencies for fast, private,
                      and borderless transactions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Instant Access
                    </h3>
                    <p className="text-sm text-slate-600">
                      Download your files immediately after purchase. No waiting,
                      no approval process needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-16 bg-gradient-to-br from-violet-50 via-white to-sky-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 border border-violet-200 rounded-full mb-6">
              <Clock className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">
                Our Journey
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              The FilerGet Story
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-sky-500 to-emerald-500 hidden sm:block" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex gap-6 sm:gap-8">
                  {/* Timeline Dot */}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border-2 border-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-lg font-bold text-violet-600">
                      {item.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-shadow">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">
                Join Us Today
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust FilerGet for their digital file
              needs. Browse our collection and experience the difference.
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