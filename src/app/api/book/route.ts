// src/app/api/book/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getCalendarFromEncryptedToken } from "@/app/lib/google";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sellerId, buyerId, start, end, notes } = body || {};

    if (!sellerId || !buyerId || !start || !end) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const startDt = new Date(start);
    const endDt = new Date(end);
    if (isNaN(startDt.getTime()) || isNaN(endDt.getTime()) || startDt >= endDt) {
      return NextResponse.json({ error: "invalid_dates" }, { status: 400 });
    }

    const seller = await prisma.user.findUnique({ where: { id: sellerId } });
    const buyer = await prisma.user.findUnique({ where: { id: buyerId } });
    if (!seller || !buyer) return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    if (!seller.refreshToken) return NextResponse.json({ error: "seller_not_connected" }, { status: 400 });

    // Create reservation
    let appt;
    try {
      appt = await prisma.appointment.create({
        data: { sellerId, buyerId, start: startDt, end: endDt, status: "reserved" },
      });
    } catch (err: unknown) {
      // likely unique constraint violation
      console.error("reservation failed", err);
      return NextResponse.json({ error: "slot_already_reserved" }, { status: 409 });
    }

    // Re-check freebusy
    const { calendar } = getCalendarFromEncryptedToken(seller.refreshToken);
    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDt.toISOString(),
        timeMax: endDt.toISOString(),
        items: [{ id: "primary" }],
      },
    });
    const busy = fb.data.calendars?.primary?.busy ?? [];
    if (busy.length > 0) {
      await prisma.appointment.delete({ where: { id: appt.id } });
      return NextResponse.json({ error: "slot_not_available" }, { status: 409 });
    }

    // Create event
    const event = {
      summary: `Meeting with ${buyer.name ?? buyer.email}`,
      description: notes ?? "",
      start: { dateTime: startDt.toISOString() },
      end: { dateTime: endDt.toISOString() },
      attendees: [{ email: buyer.email }],
      conferenceData: { createRequest: { requestId: uuidv4() } },
      reminders: { useDefault: true },
    };

    let created;
    try {
      const res = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: "all",
      });
      created = res.data;
    } catch (err: unknown) {
      console.error("event create failed", err);
      await prisma.appointment.delete({ where: { id: appt.id } });
      const message = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json({ error: "calendar_event_create_failed", details: message }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hangout = created.hangoutLink ?? created.conferenceData?.entryPoints?.find((e: any) => e.entryPointType === "video")?.uri ?? null;

    const updated = await prisma.appointment.update({
      where: { id: appt.id },
      data: { status: "confirmed", googleEventId: created.id, hangoutLink: hangout },
    });

    return NextResponse.json({ appointment: updated, event: created });
  } catch (err: unknown) {
    console.error("book error", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
