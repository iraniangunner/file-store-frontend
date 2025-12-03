"use client";

import { Button } from "@heroui/react";
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="flat"
        className="bg-blue-100 text-blue-600 hover:bg-blue-200"
        onPress={() => handleShare("facebook")}
        isIconOnly
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </Button>

      <Button
        size="sm"
        variant="flat"
        className="bg-sky-100 text-sky-600 hover:bg-sky-200"
        onPress={() => handleShare("twitter")}
        isIconOnly
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </Button>

      <Button
        size="sm"
        variant="flat"
        className="bg-blue-100 text-blue-700 hover:bg-blue-200"
        onPress={() => handleShare("linkedin")}
        isIconOnly
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </Button>

      <Button
        size="sm"
        variant="flat"
        className={`${
          copied
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        onPress={handleCopyLink}
        isIconOnly
        aria-label="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}
