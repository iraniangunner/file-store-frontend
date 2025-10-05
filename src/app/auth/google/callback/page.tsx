"use client";
import { useEffect } from "react";

export default function GooglePopupCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const expiresAt = params.get("expires_at");

    if (accessToken && refreshToken && expiresAt) {
      fetch("/api/set-cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken, expiresAt }),
      }).then(() => {
        if (window.opener) {
          window.opener.postMessage({ status: "success" }, window.location.origin);
          window.close();
        }
      });
    }
  }, []);

  return <p>Logging in...</p>;
}
