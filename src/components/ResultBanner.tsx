import { CheckCircle2, XCircle } from "lucide-react";
import type { AvailabilityDecision } from "@/types";

interface ResultBannerProps {
  decision: AvailabilityDecision | null;
}

export function ResultBanner({ decision }: ResultBannerProps) {
  if (!decision) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-400">
          Select a room and time range to check availability.
        </p>
      </div>
    );
  }

  return (
    <div
      className={[
        "rounded-xl border-2 p-5 transition-all",
        decision.available
          ? "border-teal-400 bg-teal-50"
          : "border-red-400 bg-red-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {decision.available ? (
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-teal-600" />
        ) : (
          <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
        )}
        <div className="min-w-0">
          <h3
            className={[
              "text-lg font-bold",
              decision.available ? "text-teal-800" : "text-red-800",
            ].join(" ")}
          >
            {decision.available ? "Available" : "Unavailable"}
          </h3>
          <ul className="mt-1 space-y-0.5">
            {decision.reasons.map((r, i) => (
              <li
                key={i}
                className={[
                  "text-sm",
                  decision.available ? "text-teal-700" : "text-red-700",
                ].join(" ")}
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
