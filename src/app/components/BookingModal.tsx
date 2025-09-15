
import React, { useState } from "react";

export default function BookingModal({
  start,
  end,
  sellerId,
  onClose,
  onSuccess,
}: {
  start: string;
  end: string;
  sellerId: string;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (data: any) => void;
}) {
  const [buyerId, setBuyerId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function confirm() {
    if (!buyerId) return alert("Please paste buyerId (from DB) to test booking.");
    setLoading(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, buyerId, start, end, notes }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert("Booking failed: " + (json?.error || JSON.stringify(json)));
      } else {
        alert("Booked! Check your calendar or appointments.");
        onSuccess(json);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert("Error: " + message);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl p-6">
        <h2 className="text-lg font-medium text-google-blue mb-2">Confirm Booking</h2>
        <p className="text-sm text-black mb-4">
          {new Date(start).toLocaleString()} — {new Date(end).toLocaleTimeString()}
        </p>
        <label className="text-xs text-gray-500">Buyer ID (paste for testing)</label>
        <input
          value={buyerId}
          onChange={(e) => setBuyerId(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
          placeholder="buyer id (paste from DB or admin)"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full border rounded-md p-2 mb-3"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 border rounded-md">
            Cancel
          </button>
          <button onClick={confirm} disabled={loading} className="flex-1 py-2 bg-google-blue text-white rounded-md">
            {loading ? "Booking…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
