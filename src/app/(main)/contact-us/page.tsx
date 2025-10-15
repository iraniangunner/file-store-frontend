import { ContactForm } from "@/app/components/Contactform";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-6">
     
      <div className="max-w-lg text-center md:text-left md:mr-12 mb-10 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Get in Touch
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Have questions, feedback, or partnership inquiries?  
          We’d love to hear from you! Fill out the form and our team will get back to you soon.
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

     
      <Card
        className="w-full max-w-md border border-gray-200 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-50 to-white"
      >
        <CardHeader className="text-2xl font-semibold text-center text-indigo-700 border-b border-gray-100 pb-4">
          Contact Us
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          <ContactForm />
        </CardBody>
      </Card>
    </section>
  );
}


