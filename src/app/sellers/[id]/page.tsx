import { notFound } from "next/navigation";
import AvailabilityGrid from "@/app/components/AvailaibiltyGrid";

type Props = { params: Promise<{ id: string }> }; // 👈 mark params as Promise

async function getSeller(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/sellers`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const arr = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return arr.find((s: any) => s.id === id) ?? null;
}

export default async function SellerPage({ params }: Props) {
  const { id } = await params; // 👈 await params
  const seller = await getSeller(id);
  if (!seller) return notFound();

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-medium text-google-blue mb-3">
              Availability — {seller.name || seller.email}
            </h2>
            <AvailabilityGrid sellerId={seller.id} />
          </div>
        </div>
        <aside>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-md font-medium text-google-blue mb-2">Seller Info</h3>
            <div className="text-sm text-gray-700 mb-3">{seller.email}</div>
            <div className="text-xs text-gray-400">Seller ID: {seller.id}</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
