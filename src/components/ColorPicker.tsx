import { Palette } from "lucide-react";

const PRESET_COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Green", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Indigo", value: "#6366F1" },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-1 text-sm text-muted-foreground">
        <Palette className="h-4 w-4" />
        Color
      </label>
      <div className="flex items-center gap-1">
        {/* Preset Colors */}
        <div className="flex gap-1 p-1 border rounded-md">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => onChange(color.value)}
              className={`w-6 h-6 rounded hover:scale-110 transition-transform ${
                value === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
        {/* Custom Color Picker */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 rounded cursor-pointer border"
          title="Custom color"
        />
      </div>
    </div>
  );
}
