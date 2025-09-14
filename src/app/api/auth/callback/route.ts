// src/app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getTokensFromCode } from "@/app/lib/google";
import { encrypt } from "@/app/lib/crypto";
import { signSession } from "@/app/lib/jwt";
import { google } from "googleapis";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state") ?? "buyer";

    if (!code) return NextResponse.json({ error: "missing_code" }, { status: 400 });

    const tokens = await getTokensFromCode(code);
    // fetch profile
    const o = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    o.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: o, version: "v2" });
    const me = (await oauth2.userinfo.get()).data;
    const email = me.email!;
    const name = me.name ?? undefined;

    // Upsert user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const upsertData: any = {
      googleId: me.id,
      name,
    };
    if (tokens.refresh_token) {
      upsertData.refreshToken = encrypt(tokens.refresh_token);
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { ...upsertData, role: state },
      create: {
        email,
        name,
        googleId: me.id,
        role: state,
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
      },
    });

    // Create session JWT and set cookie
    const token = signSession({ userId: user.id, role: user.role as "seller" | "buyer" });

    const res = NextResponse.redirect(new URL("/", req.url));
    // set cookie 7 days, httponly, secure in prod, sameSite=lax
    res.headers.append("Set-Cookie", `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`);

    return res;
  } catch (err: unknown) {
    console.error("auth callback error", err);
    return NextResponse.json({ error: String((err instanceof Error ? err.message : err)) }, { status: 500 });
  }
}
