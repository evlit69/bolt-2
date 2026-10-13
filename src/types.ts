export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes from 00:00
  end: number; // minutes from 00:00
  bookedBy: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface ValidationResult {
  ok: boolean;
  reason?: string;
  kind?: "error" | "info" | "success";
}

export type AvailabilityDecision = {
  available: boolean;
  reasons: string[];
};
