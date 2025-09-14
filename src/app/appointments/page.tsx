"use client";
import { useEffect, useState } from "react";

export default function AppointmentsPageClientWrapper() {
  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <AppointmentsClient />
      </div>
    </>
  );
}

type User = {
  id: string;
  email: string;
  // Add other user properties as needed
};

function AppointmentsClient() {
  const [user, setUser] = useState<User | null>(null);
  type Appointment = {
    id: string;
    seller?: {
      name?: string;
      email?: string;
    };
    start: string;
    end: string;
    status: string;
    hangoutLink?: string;
  };
  
    const [appts, setAppts] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/me");
      const json = await res.json();
      setUser(json.user ?? null);
      if (json.user) {
        loadAppts(json.user.id);
      }
    })();
  }, []);

  async function loadAppts(userId?: string) {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?userId=${encodeURIComponent(userId)}`);
      const json = await res.json();
      if (res.ok) setAppts(json);
      else {
        console.error(json);
        setAppts([]);
      }
    } catch (err) {
      console.error(err);
      setAppts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-medium text-google-blue mb-3">Appointments</h2>
      {!user && <div className="text-sm text-gray-500">Sign in to see your appointments.</div>}

      {user && (
        <>
          <div className="text-sm text-gray-600 mb-4">Showing appointments for {user.email}</div>
          {loading && <div>Loading…</div>}
          {!loading && appts && appts.length === 0 && <div className="text-sm text-gray-500">No appointments found.</div>}
          {!loading && appts?.map((a) => (
            <div key={a.id} className="border rounded-md p-3 mt-2 bg-white">
              <div className="text-sm font-medium text-google-blue">{a.seller?.name || a.seller?.email}</div>
              <div className="text-xs text-gray-600">{new Date(a.start).toLocaleString()} - {new Date(a.end).toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Status: {a.status}</div>
              {a.hangoutLink && <a href={a.hangoutLink} target="_blank" rel="noreferrer" className="text-xs text-google-green">Join Meeting</a>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
