import { Mail } from "lucide-react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const ContactForm = dynamic(() => import("@/app/components/Contactform"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Filerget | contact",
  description:
    "Digital files, made simple Buy and download what you need Instantly, Safely, Securely",
};

export default function ContactPage() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-6">
      <div className="max-w-lg text-center md:text-left md:mr-12 mb-10 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Get in Touch
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Have questions, feedback, or partnership inquiries? We’d love to hear
          from you! Fill out the form and our team will get back to you soon.
        </p>

        <div className="flex items-center justify-center md:justify-start gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition">
          <Mail className="text-indigo-600" size={20} />
          <Link
            href="mailto:info@filerget.com"
            className="text-indigo-700 font-medium hover:underline"
          >
            info@filerget.com
          </Link>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
