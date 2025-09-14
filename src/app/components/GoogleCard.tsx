// components/GoogleCard.tsx
import { ReactNode } from "react";

type GoogleCardProps = {
  title: string;
  children: ReactNode;
};

export function GoogleCard({ title, children }: GoogleCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
      <h2 className="text-lg font-medium text-google-blue mb-3">{title}</h2>
      {children}
    </div>
  );
}
