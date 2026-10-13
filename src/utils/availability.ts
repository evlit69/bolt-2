import type { Room, Booking, AvailabilityDecision } from "@/types";

export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function labelToMinutes(label: string): number {
  // Expects "H:MM AM" or "HH:MM PM"
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return -1;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

export function checkAvailability(
  rooms: Room[],
  bookings: Booking[],
  roomId: string,
  start: number,
  end: number,
  currentMinutes: number,
): AvailabilityDecision {
  const reasons: string[] = [];

  // Rule 1: valid interval
  if (start < 0 || end > 1440 || start >= end) {
    return { available: false, reasons: ["Start must be ≥ 00:00, end must be ≤ 24:00, and start must be before end."] };
  }
  if (start <= currentMinutes) {
    return { available: false, reasons: ["The start time must be strictly after the current time."] };
  }

  // Rule 2: max 120 minutes
  if (end - start > 120) {
    return { available: false, reasons: ["Bookings cannot be longer than 120 minutes."] };
  }

  // Rule 3: room blocked
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return { available: false, reasons: ["Please select a valid room."] };
  }
  if (room.blocked) {
    return { available: false, reasons: [`${room.name} is currently blocked and unavailable for booking.`] };
  }

  // Rule 4: no overlapping bookings (touching endpoints are OK)
  const overlapping = bookings.filter(
    (b) => b.roomId === roomId && start < b.end && b.start < end,
  );
  if (overlapping.length > 0) {
    const conflictDesc = overlapping
      .map((b) => `${minutesToLabel(b.start)}–${minutesToLabel(b.end)} (${b.bookedBy})`)
      .join(", ");
    return {
      available: false,
      reasons: [`This interval overlaps an existing booking: ${conflictDesc}. Touching endpoints are allowed, but your range crosses into an occupied slot.`],
    };
  }

  return {
    available: true,
    reasons: [`${room.name} is available from ${minutesToLabel(start)} to ${minutesToLabel(end)}.`],
  };
}
