import { GoogleCard } from "./GoogleCard";

// components/AvailabilityCalendar.tsx
export function AvailabilityCalendar() {
  return (
    <GoogleCard title="Your Availability">
      <div className="h-80 flex items-center justify-center text-google-gray">
        [Google Calendar availability will be shown here]
      </div>
    </GoogleCard>
  );
}
