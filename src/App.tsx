import { useMemo, useState } from "react";
import { Building2, Clock3, Info } from "lucide-react";
import { rooms, bookings } from "@/data/sampleData";
import { checkAvailability, minutesToLabel } from "@/utils/availability";
import type { AvailabilityDecision } from "@/types";
import { RoomOption } from "@/components/RoomOption";
import { Timeline } from "@/components/Timeline";
import { ResultBanner } from "@/components/ResultBanner";
import { TimeInput } from "@/components/TimeInput";

function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState<string>("r1");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [useLiveTime, setUseLiveTime] = useState(true);
  const [customNow, setCustomNow] = useState("09:00");
  const [decision, setDecision] = useState<AvailabilityDecision | null>(null);
  const [startErr, setStartErr] = useState<string | null>(null);
  const [endErr, setEndErr] = useState<string | null>(null);

  const currentMinutes = useMemo(() => {
    if (useLiveTime) return nowMinutes();
    const parts = customNow.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 0;
  }, [useLiveTime, customNow]);

  const roomBookings = useMemo(
    () => bookings.filter((b) => b.roomId === selectedRoom),
    [selectedRoom],
  );

  const selectedRoomObj = rooms.find((r) => r.id === selectedRoom)!;

  function handleCheck() {
    setStartErr(null);
    setEndErr(null);

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    let hasError = false;
    if (start < 0) {
      setStartErr("Enter a valid time (HH:MM, 24-hour).");
      hasError = true;
    }
    if (end < 0) {
      setEndErr("Enter a valid time (HH:MM, 24-hour).");
      hasError = true;
    }
    if (hasError) {
      setDecision(null);
      return;
    }

    const result = checkAvailability(rooms, bookings, selectedRoom, start, end, currentMinutes);
    setDecision(result);
  }

  function parseTime(t: string): number {
    const parts = t.split(":");
    if (parts.length !== 2) return -1;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return -1;
    return h * 60 + m;
  }

  const candidateStart = decision ? parseTime(startTime) : null;
  const candidateEnd = decision ? parseTime(endTime) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-teal-50/30">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Smart Campus Room Checker
              </h1>
              <p className="text-sm text-gray-500">
                Check whether a campus room is available for your requested time slot.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column: Room selection + time inputs */}
          <div className="space-y-5">
            {/* Current time reference */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock3 className="h-4 w-4 text-teal-600" />
                  Current time reference
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    checked={useLiveTime}
                    onChange={(e) => setUseLiveTime(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  Use live time
                </label>
              </div>
              {!useLiveTime && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Set current time:</span>
                  <input
                    type="time"
                    value={customNow}
                    onChange={(e) => setCustomNow(e.target.value)}
                    className="rounded-lg border-2 border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-teal-500"
                  />
                </div>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Reference now: <span className="font-medium text-gray-600">{minutesToLabel(currentMinutes)}</span>
              </p>
            </div>

            {/* Room selection */}
            <div>
              <h2 className="mb-3 text-sm font-semibold text-gray-700">1. Select a room</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {rooms.map((room) => (
                  <RoomOption
                    key={room.id}
                    room={room}
                    roomBookings={bookings.filter((b) => b.roomId === room.id)}
                    selected={selectedRoom === room.id}
                    onSelect={() => {
                      setSelectedRoom(room.id);
                      setDecision(null);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Time inputs */}
            <div>
              <h2 className="mb-3 text-sm font-semibold text-gray-700">2. Choose a time range</h2>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <TimeInput
                    label="Start time"
                    value={startTime}
                    onChange={(v) => { setStartTime(v); setDecision(null); setStartErr(null); }}
                    error={startErr}
                  />
                  <TimeInput
                    label="End time"
                    value={endTime}
                    onChange={(v) => { setEndTime(v); setDecision(null); setEndErr(null); }}
                    error={endErr}
                  />
                </div>
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <p className="text-xs text-blue-700">
                    Max 120 minutes per booking. Time must be after the current time reference.
                    Touching endpoints (e.g. 10:00–11:00 next to 11:00–12:00) are allowed.
                  </p>
                </div>
              </div>
            </div>

            {/* Check button */}
            <button
              onClick={handleCheck}
              className="w-full rounded-xl bg-teal-600 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.99]"
            >
              Check Availability
            </button>
          </div>

          {/* Right column: Result + timeline */}
          <div className="space-y-5">
            <ResultBanner decision={decision} />

            <Timeline
              bookings={roomBookings}
              candidateStart={candidateStart}
              candidateEnd={candidateEnd}
              available={decision?.available ?? false}
            />

            {/* Booking details for selected room */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Existing bookings — {selectedRoomObj.name}
              </h3>
              {roomBookings.length === 0 ? (
                <p className="text-sm text-gray-400">No existing bookings for this room.</p>
              ) : (
                <ul className="space-y-1.5">
                  {roomBookings.map((b) => (
                    <li
                      key={b.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                    >
                      <span className="text-gray-700">
                        {minutesToLabel(b.start)} – {minutesToLabel(b.end)}
                      </span>
                      <span className="text-gray-400">{b.bookedBy}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-400">
          Fictional sample data · No bookings are created or modified — this tool only checks availability.
        </footer>
      </main>
    </div>
  );
}
