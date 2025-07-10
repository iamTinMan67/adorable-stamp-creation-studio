import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Type, Square, Circle, Star, Trash2, Download, RectangleEllipsis, MousePointer } from "lucide-react";

interface StampToolbarProps {
  activeTool: "select" | "text" | "rectangle" | "circle" | "star";
  onToolClick: (tool: "select" | "text" | "rectangle" | "circle" | "star") => void;
  onClear: () => void;
  onExport: () => void;
  onAddBorder: () => void;
  stampText: string;
  onStampTextChange: (text: string) => void;
}

export const StampToolbar = ({ 
  activeTool, 
  onToolClick, 
  onClear, 
  onExport, 
  onAddBorder,
  stampText,
  onStampTextChange 
}: StampToolbarProps) => {
  const tools = [
    { id: "select" as const, icon: MousePointer, label: "Select" },
    { id: "text" as const, icon: Type, label: "Text" },
    { id: "rectangle" as const, icon: Square, label: "Rectangle" },
    { id: "circle" as const, icon: Circle, label: "Circle" },
    { id: "star" as const, icon: Star, label: "Star" },
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center p-4 bg-card rounded-lg border shadow-sm">
      <div className="flex gap-1">
        {tools.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={activeTool === id ? "default" : "outline"}
            size="sm"
            onClick={() => onToolClick(id)}
            className="h-9 w-9 p-0"
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      
      <div className="h-6 w-px bg-border mx-2" />
      
      {activeTool === "text" && (
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Enter text..."
            value={stampText}
            onChange={(e) => onStampTextChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onToolClick("text")}
            className="w-32"
          />
          <Button
            size="sm"
            onClick={() => onToolClick("text")}
            disabled={!stampText.trim()}
            variant="secondary"
          >
            Add
          </Button>
        </div>
      )}
      
      <div className="h-6 w-px bg-border mx-2" />
      
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddBorder}
          className="h-9 w-9 p-0"
          title="Add Border"
        >
          <RectangleEllipsis className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="h-9 w-9 p-0 text-destructive hover:text-destructive"
          title="Clear Canvas"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onExport}
          className="h-9 w-9 p-0 bg-gradient-primary hover:opacity-90"
          title="Download Stamp"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};