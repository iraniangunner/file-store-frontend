import { cookies } from "next/headers";

export async function POST(req:Request) {
  const c = cookies();
  const refreshToken = c.get("refresh_token")?.value;

  if (!refreshToken) {
    return new Response(JSON.stringify({ error: "No refresh token" }), { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });


  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify(data), { status: res.status });
  }

  
// بروز رسانی cookie ها
  // const cookieBase = {
  //   httpOnly: true,
  //   sameSite: "lax" as const,
  //   path: "/",
  //   secure: false,
  // };

  const cookieBase = {
  httpOnly: true,
  sameSite: "none" as const,
  path: "/",
  secure: true,
  domain: ".filerget.com",
};

  const expiresAt = Date.now() + data.expires_in * 1000;

  const SEVEN_DAYS = 7 * 24 * 60 * 60; // 604800 seconds

  c.set("access_token", data.access_token, { ...cookieBase, maxAge: data.expires_in });
  c.set("expires_at", String(expiresAt), { ...cookieBase, maxAge: data.expires_in });
  c.set("refresh_token", data.refresh_token, { 
    ...cookieBase, 
    maxAge: SEVEN_DAYS 
  });

  return new Response(JSON.stringify(data), { status: 200 });
}
