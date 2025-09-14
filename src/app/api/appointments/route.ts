import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sellerId = url.searchParams.get("sellerId");
    const userId = url.searchParams.get("userId");
    if (!sellerId && !userId) {
      return NextResponse.json({ error: "sellerId or userId required" }, { status: 400 });
    }
    let appts;
    if (sellerId) {
      appts = await prisma.appointment.findMany({
        where: { sellerId },
        select: { start: true, end: true },
        orderBy: { start: "asc" },
      });
    } else {
      if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
      }
      appts = await prisma.appointment.findMany({
        where: { OR: [{ sellerId: userId }, { buyerId: userId }] },
        include: {
          seller: { select: { id: true, name: true, email: true } },
          buyer: { select: { id: true, name: true, email: true } },
        },
        orderBy: { start: "asc" },
      });
    }
    return NextResponse.json(appts);
  } catch (err: unknown) {
    console.error("appointments error", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
