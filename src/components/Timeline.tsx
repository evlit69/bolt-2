import type { Booking } from "@/types";
import { minutesToLabel } from "@/utils/availability";

interface TimelineProps {
  bookings: Booking[];
  candidateStart: number | null;
  candidateEnd: number | null;
  available: boolean;
}

const DAY_START = 7 * 60; // 7:00 AM
const DAY_END = 20 * 60; // 8:00 PM
const RANGE = DAY_END - DAY_START;

export function Timeline({ bookings, candidateStart, candidateEnd, available }: TimelineProps) {
  const hourMarks: number[] = [];
  for (let m = DAY_START; m <= DAY_END; m += 60) {
    hourMarks.push(m);
  }

  function pct(min: number): number {
    return ((min - DAY_START) / RANGE) * 100;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Today&apos;s schedule (7 AM – 8 PM)</h3>
      <div className="relative h-16">
        {/* track */}
        <div className="absolute top-6 left-0 right-0 h-6 rounded-md bg-gray-100" />

        {/* hour ticks */}
        {hourMarks.map((m) => (
          <div
            key={m}
            className="absolute top-6 h-6 w-px bg-gray-300"
            style={{ left: `${pct(m)}%` }}
          />
        ))}

        {/* hour labels */}
        {hourMarks.map((m) => (
          <div
            key={`label-${m}`}
            className="absolute top-0 -translate-x-1/2 text-[10px] text-gray-400"
            style={{ left: `${pct(m)}%` }}
          >
            {minutesToLabel(m).replace(":00", "")}
          </div>
        ))}

        {/* existing bookings */}
        {bookings.map((b) => {
          const left = Math.max(0, pct(b.start));
          const width = Math.min(100, pct(b.end)) - left;
          return (
            <div
              key={b.id}
              className="absolute top-6 flex items-center justify-center rounded-md bg-gray-400 text-[9px] text-white overflow-hidden"
              style={{ left: `${left}%`, width: `${Math.max(0.5, width)}%` }}
              title={`${minutesToLabel(b.start)}–${minutesToLabel(b.end)} ${b.bookedBy}`}
            >
              {width > 8 ? "Busy" : ""}
            </div>
          );
        })}

        {/* candidate slot */}
        {candidateStart !== null && candidateEnd !== null && (
          <div
            className={[
              "absolute top-6 rounded-md border-2 transition-all",
              available ? "border-teal-500 bg-teal-300/70" : "border-red-500 bg-red-300/70",
            ].join(" ")}
            style={{
              left: `${Math.max(0, pct(Math.max(DAY_START, candidateStart)))}%`,
              width: `${Math.max(0.5, pct(Math.min(DAY_END, candidateEnd)) - Math.max(0, pct(Math.max(DAY_START, candidateStart))))}%`,
            }}
          />
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-gray-400" /> Existing bookings
        </span>
        {candidateStart !== null && candidateEnd !== null && (
          <span className="inline-flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-sm ${available ? "bg-teal-300 border border-teal-500" : "bg-red-300 border border-red-500"}`} />
            Your requested slot
          </span>
        )}
      </div>
    </div>
  );
}
