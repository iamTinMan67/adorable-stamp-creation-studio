import { Button } from "./ui/button";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const presetColors = [
    "#dc2626", // Red
    "#2563eb", // Blue  
    "#16a34a", // Green
    "#9333ea", // Purple
    "#ea580c", // Orange
    "#0891b2", // Cyan
    "#be123c", // Rose
    "#000000", // Black
  ];

  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border shadow-sm">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Color:</span>
      </div>
      
      <div className="flex gap-1">
        {presetColors.map((presetColor) => (
          <Button
            key={presetColor}
            variant="outline"
            size="sm"
            className={`h-8 w-8 p-0 border-2 ${
              color === presetColor ? "border-foreground" : "border-border"
            }`}
            style={{ backgroundColor: presetColor }}
            onClick={() => onChange(presetColor)}
            title={`Select ${presetColor}`}
          />
        ))}
      </div>
      
      <div className="h-6 w-px bg-border mx-2" />
      
      <div className="flex items-center gap-2">
        <label 
          htmlFor="color-input" 
          className="h-8 w-8 rounded border-2 border-border cursor-pointer"
          style={{ backgroundColor: color }}
          title="Custom color"
        />
        <input
          id="color-input"
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </div>
    </div>
  );
};