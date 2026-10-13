import { Clock } from "lucide-react";

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
}

export function TimeInput({ label, value, onChange, error }: TimeInputProps) {
  return (
    <div className="flex-1">
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full rounded-lg border-2 py-2 pl-9 pr-3 text-sm outline-none transition",
            error
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-teal-500",
          ].join(" ")}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
