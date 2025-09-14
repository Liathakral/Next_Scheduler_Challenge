// src/app/api/sellers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const sellers = await prisma.user.findMany({
      where: { role: { contains: "seller" } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
    console.log("Found sellers:", sellers);
    return NextResponse.json(sellers);
  } catch (err) {
    console.error("sellers error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
