// src/components/AvailabilityClient.tsx
"use client";
import React, { useEffect, useState } from "react";
import { addMinutes, eachDayOfInterval, format } from "date-fns";

type BusyInterval = { start: string; end: string };
type ReservedInterval = { start: string; end: string };

function isoToDate(s: string) {
  return new Date(s);
}
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}
function generateSlotsForRange(from: Date, to: Date, slotMin = 30, dayStartHour = 9, dayEndHour = 18) {
  const days = eachDayOfInterval({ start: from, end: to });
  const slots: { start: Date; end: Date }[] = [];
  for (const day of days) {
    const dayStart = new Date(day);
    dayStart.setHours(dayStartHour, 0, 0, 0); // local time
    const dayEnd = new Date(day);
    dayEnd.setHours(dayEndHour, 0, 0, 0);
    let cursor = new Date(dayStart);
    while (cursor < dayEnd) {
      const end = addMinutes(cursor, slotMin);
      slots.push({ start: new Date(cursor), end: new Date(end) });
      cursor = end;
    }
  }
  return slots;
}


export default function AvailabilityClient({ sellerId }: { sellerId: string }) {
  const [busy, setBusy] = useState<BusyInterval[]>([]);
  const [reserved, setReserved] = useState<ReservedInterval[]>([]);
  const [loading, setLoading] = useState(false);
  const [selSlot, setSelSlot] = useState<{ start: string; end: string } | null>(null);
  const [me, setMe] = useState<{ id: string; role?: string; email?: string } | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Google Calendar busy slots
        const res = await fetch(`/api/freebusy?sellerId=${encodeURIComponent(sellerId)}`);
        const json = await res.json();
        if (res.ok) setBusy(json.busy ?? []);

        // DB reserved appointments
        const r2 = await fetch(`/api/appointments?sellerId=${encodeURIComponent(sellerId)}`);
        const j2 = await r2.json();
        if (r2.ok) setReserved(j2 ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();

    (async () => {
      try {
        const r = await fetch("/api/me");
        const j = await r.json();
        setMe(j.user ?? null);
      } catch {}
    })();
  }, [sellerId]);

  const now = new Date();
  const end = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  const allSlots = generateSlotsForRange(now, end, 30, 9, 18);

  const busyIntervals = busy.map((b) => ({ start: isoToDate(b.start), end: isoToDate(b.end) }));
const reservedIntervals = reserved.map((r) => ({
  start: new Date(r.start), // local Date object

  end: new Date(r.end),
}));
console.log("Slots:", allSlots.map(s => s.start.toISOString()));
console.log("Reserved:", reservedIntervals.map(r => r.start.toISOString()));

  const slotsWithAvailability = allSlots.map((slot) => {
    const isReserved = reservedIntervals.some((ri) => overlaps(slot.start, slot.end, ri.start, ri.end));
    const isBusy = busyIntervals.some((bi) => overlaps(slot.start, slot.end, bi.start, bi.end));
    return { ...slot, isBusy, isReserved };
  });

  // group by day
  const groups: Record<string, typeof slotsWithAvailability> = {};
  for (const slot of slotsWithAvailability) {
    const dayKey = format(slot.start, "yyyy-MM-dd");
    if (!groups[dayKey]) groups[dayKey] = [];
    groups[dayKey].push(slot);
  }
  const dayKeys = Object.keys(groups).slice(0, 7);

  async function confirmBooking(startIso: string, endIso: string, buyerId: string | null) {
    if (!buyerId) {
      alert("You must be signed in as a buyer to book. Sign in first.");
      return;
    }
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, buyerId, start: startIso, end: endIso, notes: "" }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert("Booking failed: " + JSON.stringify(json));
      } else {
        alert("Booking successful!");
      }
    } catch (err) {
      alert("Booking error: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  return (
    <div>
      <div className="mb-3">
        <div className="text-sm text-gray-600">Next 7 days · 30-minute slots</div>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading availability…</div>}

      <div className="space-y-6">
        {dayKeys.map((dayKey) => (
          <div key={dayKey}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-google-blue">
                {format(new Date(dayKey), "dd/MM/yyyy")}
              </h3>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {groups[dayKey].map((slot, i) => {
                const label = format(slot.start, "HH:mm");
                if (slot.isReserved) {
                  return (
                    <div key={i} className="px-2 py-2 rounded-md bg-red-500 text-xs text-white text-center">
                      {label}
                      <div className="text-[10px]">reserved</div>
                    </div>
                  );
                }
                if (slot.isBusy) {
                  return (
                    <div key={i} className="px-2 py-2 rounded-md bg-gray-200 text-xs text-gray-500 text-center">
                      {label}
                      <div className="text-[10px]">busy</div>
                    </div>
                  );
                }
                return (
                  <button
                    key={i}
                    onClick={() => setSelSlot({ start: slot.start.toISOString(), end: slot.end.toISOString() })}
                    className="px-2 py-2 rounded-md bg-white border hover:shadow-sm text-xs text-google-gray text-center"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-lg font-medium text-google-blue mb-2">Confirm Booking</h2>
            <p className="text-sm mb-3">
              {format(new Date(selSlot.start), "dd/MM/yyyy HH:mm")} — {format(new Date(selSlot.end), "HH:mm")}
            </p>
            <p className="text-sm text-gray-500 mb-3">Buyer: {me ? me.email : "Not signed in"}</p>
            <div className="flex gap-2">
              <button onClick={() => setSelSlot(null)} className="flex-1 py-2 border rounded-md">
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmBooking(selSlot.start, selSlot.end, me?.id ?? null);
                  setSelSlot(null);
                }}
                className="flex-1 py-2 bg-google-blue text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
