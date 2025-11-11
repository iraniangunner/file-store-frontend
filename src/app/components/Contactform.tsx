"use client";

import { useState, useRef } from "react";
import {
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const captchaRef = useRef<any>(null); // ✅ از any استفاده کن

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }

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
        toast.success("Your message has been sent!");
        // ریست مقادیر فرم
        setName("");
        setEmail("");
        setMessage("");
        setCaptchaToken(null);

        // ریست HCaptcha
        if (captchaRef.current?.resetCaptcha) {
          captchaRef.current.resetCaptcha(); // ✅ بعضی نسخه‌ها همین متد را دارند
        } else if (captchaRef.current?.reset) {
          captchaRef.current.reset(); // اگر نسخه قدیمی است
        }
      } else {
        toast.error(data?.message || "Failed to submit the form");
      }
    } catch (err: any) {
      toast.error(err.message || "Network error");
    }
  };

  return (
    <Card className="w-full max-w-md border border-gray-200 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-50 to-white">
      <CardHeader className="text-2xl font-semibold text-center text-indigo-700 border-b border-gray-100 pb-4">
        Contact Us
      </CardHeader>
      <CardBody className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Toaster />
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            isRequired
          />
          <Textarea
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minRows={4}
            placeholder="Your message..."
            isRequired
          />

          <HCaptcha
            ref={captchaRef}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            onVerify={setCaptchaToken}
          />

          <Button type="submit" className="bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white font-semibold" fullWidth>
            Send Message
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
