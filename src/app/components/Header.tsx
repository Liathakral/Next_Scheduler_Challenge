// src/components/HeaderClient.tsx
"use client";
import React, { useEffect, useState } from "react";

type User = { id: string; email: string; name?: string; role?: string } | null;

export default function HeaderClient() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        setUser(json.user ?? null);
      } catch (err) {
        console.error("me fetch error", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function signInAs(role: "seller" | "buyer") {
    try {
      const res = await fetch(`/api/auth/url?role=${role}`);
      const json = await res.json();
      if (json?.url) window.location.href = json.url;
      else alert("Auth URL failed: " + JSON.stringify(json));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Error creating auth url: " + err.message);
      } else {
        alert("Error creating auth url: " + String(err));
      }
    }
  }

  async function signOut() {
    // Clear cookie server-side? For now, hit /api/logout (if you implement) or just reload.
    // We'll call a simple endpoint that clears cookie if present; if not available, just reload.
    try {
      await fetch("/api/logout", { method: "POST" }).catch(() => {});
    } catch {}
    window.location.href = "/";
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-google-blue text-white font-bold">
          S
        </div>
        <h1 className="text-2xl font-medium text-google-blue">Scheduler</h1>
      </div>

      <div className="flex items-center gap-3">
        {!loading && user ? (
          <>
            <div className="text-sm text-google-gray">
              {user.name ? <span>{user.name}</span> : <span>{user.email}</span>}
              <span className="ml-2 text-xs text-gray-400">({user.role})</span>
            </div>
            <button onClick={() => (window.location.href = "/appointments")} className="px-4 py-2 rounded-md bg-white border hover:shadow-sm text-google-gray">
              Appointments
            </button>
            <button onClick={() => signOut()} className="px-4 py-2 rounded-md bg-google-blue text-white hover:bg-blue-600">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button onClick={() => signInAs("buyer")} className="px-4 py-2 rounded-md bg-white border hover:shadow-sm text-google-gray">
              Sign in as Buyer
            </button>
            <button onClick={() => signInAs("seller")} className="px-4 py-2 rounded-md bg-google-blue text-white hover:bg-blue-600">
              Sign in as Seller
            </button>
          </>
        )}
      </div>
    </header>
  );
}
