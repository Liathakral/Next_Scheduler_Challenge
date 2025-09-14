import { GoogleCard } from "./GoogleCard";

// components/AppointmentsList.tsx
export function AppointmentsList() {
  return (
    <GoogleCard title="Upcoming Appointments">
      <ul className="divide-y">
        <li className="py-3">Meeting with John Doe — Sep 15, 3:00 PM</li>
        <li className="py-3">Meeting with Alice Smith — Sep 16, 10:00 AM</li>
      </ul>
    </GoogleCard>
  );
}
