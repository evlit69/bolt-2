import { describe, it, expect, beforeEach } from "vitest";
import { checkAvailability } from "@/utils/availability";
import type { Room, Booking } from "@/types";

const NOW = 540;

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: "r1",
    name: "Test Room",
    building: "Test Building",
    capacity: 30,
    blocked: false,
    ...overrides,
  };
}

function makeBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: "b1",
    roomId: "r1",
    start: 600,
    end: 660,
    bookedBy: "Tester",
    ...overrides,
  };
}

describe("checkAvailability", () => {
  let rooms: Room[];
  let bookings: Booking[];
  let snapshot: Booking[];

  beforeEach(() => {
    rooms = [makeRoom()];
    bookings = [makeBooking()];
    // Deep-copy snapshot so we can prove the function never mutates input data (AC5)
    snapshot = bookings.map((b) => ({ ...b }));
  });

  // ── AC4: touching endpoints, no overlap ──────────────────────────────
  it("T01: 660-720 is available — touches end of existing booking (AC4)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 660, 720, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0]).toContain("available");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC1: start must be strictly after current time ───────────────────
  it("T02: 540-570 is rejected — start equals current time (AC1)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 540, 570, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0]).toContain("current time");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC1: start must be strictly less than end ────────────────────────
  it("T03: 720-720 is rejected — start equals end (AC1)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 720, 720, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0].length).toBeGreaterThan(0);
    expect(bookings).toEqual(snapshot);
  });

  // ── AC1: start must be less than end ─────────────────────────────────
  it("T04: 750-720 is rejected — start after end (AC1)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 750, 720, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0].length).toBeGreaterThan(0);
    expect(bookings).toEqual(snapshot);
  });

  // ── AC1: end must be ≤ 1440 ──────────────────────────────────────────
  it("T05: 1380-1441 is rejected — end exceeds 1440 (AC1)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 1380, 1441, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0].length).toBeGreaterThan(0);
    expect(bookings).toEqual(snapshot);
  });

  // ── AC1: start = 0 is the lower boundary and is accepted ─────────────
  it("T05b: 0-60 is available — start at lower boundary 0 (AC1)", () => {
    bookings = [];
    const result = checkAvailability(rooms, bookings, "r1", 0, 60, -1);
    expect(result.available).toBe(true);
    expect(result.reasons[0]).toContain("available");
    expect(bookings).toEqual([]);
  });

  // ── AC1: end = 1440 is the upper boundary and is accepted ────────────
  it("T05c: 1320-1440 is available — end at upper boundary 1440 (AC1)", () => {
    bookings = [];
    const result = checkAvailability(rooms, bookings, "r1", 1320, 1440, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons[0]).toContain("available");
    expect(bookings).toEqual([]);
  });

  // ── AC1: negative start is rejected ──────────────────────────────────
  it("T05d: -60-60 is rejected — negative start (AC1)", () => {
    const result = checkAvailability(rooms, bookings, "r1", -60, 60, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0].length).toBeGreaterThan(0);
    expect(bookings).toEqual(snapshot);
  });

  // ── AC2: exactly 120 minutes is allowed ──────────────────────────────
  it("T06: 720-840 is available — exactly 120 minutes (AC2)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 720, 840, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0]).toContain("available");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC2: 121 minutes is rejected ─────────────────────────────────────
  it("T07: 720-841 is rejected — 121 minutes exceeds 120 (AC2)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 720, 841, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons[0]).toContain("120");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC4: touching start endpoint is allowed ──────────────────────────
  it("T08: 570-600 is available — touches start of existing booking (AC4)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 570, 600, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0]).toContain("available");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC4: partial overlap at the end ──────────────────────────────────
  it("T09: 630-690 is rejected — overlaps tail of existing booking (AC4)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 630, 690, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons[0]).toContain("overlaps");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC4: candidate fully contains existing booking ───────────────────
  it("T10: 570-690 is rejected — fully contains existing booking (AC4)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 570, 690, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons[0]).toContain("overlaps");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC4: partial overlap in the middle ───────────────────────────────
  it("T11: 615-645 is rejected — inside existing booking (AC4)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 615, 645, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons[0]).toContain("overlaps");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC4: exact match of existing booking ─────────────────────────────
  it("T12: 600-660 is rejected — identical to existing booking (AC4)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 600, 660, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons[0]).toContain("overlaps");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC3: blocked room is rejected ────────────────────────────────────
  it("T13: 660-720 with blocked room is rejected (AC3)", () => {
    rooms = [makeRoom({ blocked: true })];
    const result = checkAvailability(rooms, bookings, "r1", 660, 720, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons[0]).toContain("blocked");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC3: non-existent room ID is rejected ────────────────────────────
  it("T13b: 660-720 with non-existent room is rejected (AC3)", () => {
    const result = checkAvailability(rooms, bookings, "rX", 660, 720, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0].length).toBeGreaterThan(0);
    expect(bookings).toEqual(snapshot);
  });

  // ── AC4: no bookings means no overlap ────────────────────────────────
  it("T14: 630-690 with empty bookings is available (AC4)", () => {
    bookings = [];
    const result = checkAvailability(rooms, bookings, "r1", 630, 690, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons[0]).toContain("available");
    expect(bookings).toEqual([]);
  });

  // ── AC5: decision is shown without modifying booking data ────────────
  it("T15: original booking data is not mutated after check (AC5)", () => {
    bookings = [
      makeBooking({ id: "b1", start: 600, end: 660 }),
      makeBooking({ id: "b2", start: 660, end: 720 }),
    ];
    snapshot = bookings.map((b) => ({ ...b }));
    checkAvailability(rooms, bookings, "r1", 660, 720, NOW);
    expect(bookings).toEqual(snapshot);
  });

  // ── AC2: very short booking is allowed ───────────────────────────────
  it("T16: 550-551 is available — 1-minute booking within 120 limit (AC2)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 550, 551, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons[0]).toContain("available");
    expect(bookings).toEqual(snapshot);
  });

  // ── AC1: end before start (wrapping) is rejected ─────────────────────
  it("T17: 1380-60 is rejected — end before start (AC1)", () => {
    const result = checkAvailability(rooms, bookings, "r1", 1380, 60, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons).toHaveLength(1);
    expect(result.reasons[0].length).toBeGreaterThan(0);
    expect(bookings).toEqual(snapshot);
  });

  // ── AC6: decision always contains a well-formed reasons array ────────
  it("T18: available result has non-empty string reasons (AC6)", () => {
    bookings = [];
    const result = checkAvailability(rooms, bookings, "r1", 660, 720, NOW);
    expect(result.available).toBe(true);
    expect(Array.isArray(result.reasons)).toBe(true);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(typeof result.reasons[0]).toBe("string");
    expect(result.reasons[0].length).toBeGreaterThan(0);
  });
});
