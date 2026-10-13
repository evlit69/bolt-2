import { Clock, MapPin, Users, Ban } from "lucide-react";
import type { Room, Booking } from "@/types";
import { minutesToLabel } from "@/utils/availability";

interface RoomOptionProps {
  room: Room;
  roomBookings: Booking[];
  selected: boolean;
  onSelect: () => void;
}

export function RoomOption({ room, roomBookings, selected, onSelect }: RoomOptionProps) {
  return (
    <button
      onClick={onSelect}
      disabled={room.blocked}
      className={[
        "w-full text-left rounded-xl border-2 p-4 transition-all duration-200",
        selected
          ? "border-teal-500 bg-teal-50 shadow-md"
          : room.blocked
            ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
            : "border-gray-200 bg-white hover:border-teal-300 hover:shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 truncate">{room.name}</span>
            {room.blocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                <Ban className="h-3 w-3" /> Blocked
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {room.building}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {room.capacity} seats
            </span>
          </div>
        </div>
        {!room.blocked && (
          <div
            className={[
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
              selected ? "border-teal-500 bg-teal-500" : "border-gray-300",
            ].join(" ")}
          >
            {selected && <span className="h-2 w-2 rounded-full bg-white" />}
          </div>
        )}
      </div>

      {!room.blocked && roomBookings.length > 0 && (
        <div className="mt-3 space-y-1">
          {roomBookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800"
            >
              <Clock className="h-3 w-3 shrink-0" />
              <span>
                {minutesToLabel(b.start)} – {minutesToLabel(b.end)} · {b.bookedBy}
              </span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
