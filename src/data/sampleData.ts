import type { Room, Booking } from "@/types";

export const rooms: Room[] = [
  { id: "r1", name: "Athena Hall", building: "Science Block", capacity: 120, blocked: false },
  { id: "r2", name: "Tesla Lab", building: "Engineering Wing", capacity: 45, blocked: false },
  { id: "r3", name: "Curie Room", building: "Science Block", capacity: 30, blocked: true },
  { id: "r4", name: "Da Vinci Studio", building: "Arts Center", capacity: 25, blocked: false },
  { id: "r5", name: "Newton Auditorium", building: "Main Building", capacity: 200, blocked: false },
  { id: "r6", name: "Hopper Lab", building: "Engineering Wing", capacity: 60, blocked: false },
];

export const bookings: Booking[] = [
  { id: "b1", roomId: "r1", start: 540, end: 600, bookedBy: "Dr. Smith" },
  { id: "b2", roomId: "r1", start: 720, end: 780, bookedBy: "Prof. Lee" },
  { id: "b3", roomId: "r2", start: 600, end: 660, bookedBy: "TA Patel" },
  { id: "b4", roomId: "r4", start: 840, end: 900, bookedBy: "Ms. Garcia" },
  { id: "b5", roomId: "r5", start: 480, end: 540, bookedBy: "Dept. Chair" },
  { id: "b6", roomId: "r6", start: 900, end: 960, bookedBy: "Dr. Turing" },
  { id: "b7", roomId: "r2", start: 1020, end: 1080, bookedBy: "Prof. Lin" },
  { id: "b8", roomId: "r1", start: 1140, end: 1200, bookedBy: "Dr. Brown" },
];
