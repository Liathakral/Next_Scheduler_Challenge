// src/app/api/freebusy/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getCalendarFromEncryptedToken } from "@/app/lib/google";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sellerId = url.searchParams.get("sellerId");
    const timeMin = url.searchParams.get("timeMin");
    const timeMax = url.searchParams.get("timeMax");

    if (!sellerId) return NextResponse.json({ error: "sellerId required" }, { status: 400 });

    const seller = await prisma.user.findUnique({ where: { id: sellerId } });
    if (!seller) return NextResponse.json({ error: "seller_not_found" }, { status: 404 });
    if (!seller.refreshToken) return NextResponse.json({ error: "seller_not_connected" }, { status: 400 });

    const { calendar } = getCalendarFromEncryptedToken(seller.refreshToken);

    const now = new Date();
    const min = timeMin ?? now.toISOString();
    const max = timeMax ?? new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString();

    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: min,
        timeMax: max,
        items: [{ id: "primary" }],
      },
    });

    const busy = fb.data.calendars?.primary?.busy ?? [];
   return NextResponse.json({ busy });
  } catch (err: unknown) {
    console.error("freebusy error", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
