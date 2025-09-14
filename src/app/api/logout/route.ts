// src/app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", `token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
  return res;
}
