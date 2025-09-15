// src/app/page.tsx
import Link from "next/link";

async function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    // Deployed on Vercel
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local dev
  return "http://localhost:3000";
}

async function getSellers() {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/sellers`, { cache: "no-store" });

  if (!res.ok) {
    const txt = await res.text();
    console.error("sellers fetch failed", txt);
    return [];
  }
  return res.json();
}


export default async function Home() {
  const sellers: { id: string; name?: string; email: string }[] = await getSellers();

  return (
    <>
     
      <main className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-medium text-google-blue mb-3">Available Sellers</h2>
              <p className="text-sm text-gray-600 mb-4">Browse sellers and view their availability.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sellers.length === 0 && <div className="text-sm text-gray-500">No sellers found.</div>}
                {sellers.map((s) => (
                  <div key={s.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-google-blue">{s.name || s.email}</div>
                      <div className="text-xs text-gray-500">{s.email}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link  href={`/sellers/${s.id}`}>
                        <p className="px-3 py-2 bg-google-green text-white rounded-md text-sm">View Availability</p>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-md font-medium text-google-blue mb-2">Quick Actions</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Sign in as Seller to connect your Google Calendar.</li>
                <li>Sign in as Buyer to book slots.</li>
                <li>Use the Appointments page to view your meetings.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
