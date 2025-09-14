// components/Sidebar.tsx
export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-sm p-4">
      <nav className="space-y-3">
        <a href="/dashboard" className="block text-google-gray hover:text-google-blue">
          Dashboard
        </a>
        <a href="/appointments" className="block text-google-gray hover:text-google-blue">
          Appointments
        </a>
        <a href="/settings" className="block text-google-gray hover:text-google-blue">
          Settings
        </a>
      </nav>
    </aside>
  );
}
