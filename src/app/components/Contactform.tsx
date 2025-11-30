"use client";

import { useState, useRef } from "react";
import { Button, Spinner } from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Send, User, Mail, MessageSquare, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const captchaRef = useRef<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        toast.success("Your message has been sent!");
        setName("");
        setEmail("");
        setMessage("");
        setCaptchaToken(null);

        if (captchaRef.current?.resetCaptcha) {
          captchaRef.current.resetCaptcha();
        } else if (captchaRef.current?.reset) {
          captchaRef.current.reset();
        }

        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        toast.error(data?.message || "Failed to submit the form");
      }
    } catch (err: any) {
      toast.error(err.message || "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
        <div className="text-center py-8">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
          <p className="text-slate-500 mb-6">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Send className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Send a Message</h2>
        </div>
        <p className="text-slate-500 ml-13">Fill out the form below and we'll be in touch soon.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                     focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                     transition-all duration-200"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Mail className="w-4 h-4 text-slate-400" />
            Email Address
            <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                     focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                     transition-all duration-200"
          />
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            Your Message
            <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help you?"
            required
            rows={5}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400
                     focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10
                     transition-all duration-200 resize-none"
          />
          <p className="text-xs text-slate-400 text-right">{message.length}/500 characters</p>
        </div>

        {/* Captcha */}
        <div className="flex justify-center py-2">
          <HCaptcha
            ref={captchaRef}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            onVerify={setCaptchaToken}
            theme="light"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !captchaToken}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-500 to-violet-600 
                   hover:from-violet-600 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-400
                   text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 
                   hover:shadow-xl hover:shadow-violet-500/30 disabled:shadow-none
                   transition-all duration-200 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" color="white" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </>
          )}
        </button>

        {/* Helper text */}
        <p className="text-center text-xs text-slate-400">
          By submitting this form, you agree to our{" "}
          <a href="/privacy" className="text-violet-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}