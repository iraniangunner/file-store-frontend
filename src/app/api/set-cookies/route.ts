import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { accessToken, refreshToken, expiresAt } = await req.json();

  if (!accessToken || !refreshToken || !expiresAt) {
    return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });

  // بروز رسانی cookie ها
  const cookieBase = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: false,
  };

  //   const cookieBase = {
  //   httpOnly: true,
  //   sameSite: "none" as const,
  //   path: "/",
  //   secure: true,
  //   domain: ".filerget.com",
  // };

  const expires_At = Date.now() + expiresAt * 1000;

  const SEVEN_DAYS = 7 * 24 * 60 * 60; // 604800 seconds

  response.cookies.set("access_token", accessToken, {
    ...cookieBase,
    maxAge: expires_At,
  });
  response.cookies.set("expires_at", String(expires_At), {
    ...cookieBase,
    maxAge: expires_At,
  });
  response.cookies.set("refresh_token", refreshToken, {
    ...cookieBase,
    maxAge: SEVEN_DAYS,
  });

  return response;
}
