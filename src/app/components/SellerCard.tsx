import Link from "next/link";

interface Seller {
  id: string;
  name?: string;
  email: string;
}

export default function SellerCard({ seller }: { seller: Seller }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center hover:shadow-lg transition">
      <div>
        <h3 className="font-medium text-google-blue">{seller.name || seller.email}</h3>
        <p className="text-sm text-google-gray">{seller.email}</p>
        <p className="text-xs text-gray-400">id: {seller.id}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Link href={`/sellers/${seller.id}`}>
          <a className="px-4 py-2 bg-google-green text-white rounded-md hover:bg-green-600 text-sm">
            View Availability
          </a>
        </Link>
      </div>
    </div>
  );
}
