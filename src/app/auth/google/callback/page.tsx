// app/auth/google/popup-callback/page.tsx
"use client";
import { useEffect } from "react";

export default function GooglePopupCallback() {
  useEffect(() => {
    if (window.opener) {
      // به parent پیام بده که لاگین موفق بود
      window.opener.postMessage({ status: "success" }, window.location.origin);
      window.close();
    }
  }, []);

  return <p>Logging in...</p>;
}
