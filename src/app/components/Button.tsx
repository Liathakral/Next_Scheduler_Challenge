// components/GoogleButton.tsx
import Image from "next/image";
export function GoogleButton({ text }: { text: string }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 border rounded-md shadow-sm bg-white hover:bg-gray-50 transition">
      <Image src="/google-icon.svg" alt="google" className="w-5 h-5" />
      <span className="text-sm font-medium text-google-gray">{text}</span>
    </button>
  );
}
