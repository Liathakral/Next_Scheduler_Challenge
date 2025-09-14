// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { verifySession } from "@/app/lib/jwt";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("token="))?.split("=")[1];
    if (!token) return NextResponse.json({ user: null });

    const session = verifySession(token);
    if (!session) return NextResponse.json({ user: null });

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, email: true, name: true, role: true } });
    return NextResponse.json({ user: user ?? null });
  } catch (err) {
    console.error("me error", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
