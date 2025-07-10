import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Type, Square, Circle, Star, Trash2, Download, RectangleEllipsis, MousePointer, Image, Undo, Redo, Copy, ChevronDown } from "lucide-react";

interface StampToolbarProps {
  activeTool: "select" | "text" | "rectangle" | "circle" | "star" | "image";
  onToolClick: (tool: "select" | "text" | "rectangle" | "circle" | "star" | "image") => void;
  onClear: () => void;
  onExport: (format?: 'png' | 'pdf' | 'svg') => void;
  onAddBorder: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  stampText: string;
  onStampTextChange: (text: string) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const StampToolbar = ({ 
  activeTool, 
  onToolClick, 
  onClear, 
  onExport, 
  onAddBorder,
  onUndo,
  onRedo,
  onDuplicate,
  onDelete,
  stampText,
  onStampTextChange,
  canUndo,
  canRedo
}: StampToolbarProps) => {
  const tools = [
    { id: "select" as const, icon: MousePointer, label: "Select" },
    { id: "text" as const, icon: Type, label: "Text" },
    { id: "rectangle" as const, icon: Square, label: "Rectangle" },
    { id: "circle" as const, icon: Circle, label: "Circle" },
    { id: "star" as const, icon: Star, label: "Star" },
    { id: "image" as const, icon: Image, label: "Image" },
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center p-4 bg-card rounded-lg border shadow-sm">
      {/* History Controls */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-9 w-9 p-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-9 w-9 p-0"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-border mx-2" />

      {/* Drawing Tools */}
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
      
      {/* Text Input */}
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
      
      {/* Object Controls */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onDuplicate}
          className="h-9 w-9 p-0"
          title="Duplicate Selected"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
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
          onClick={onDelete}
          className="h-9 w-9 p-0 text-destructive hover:text-destructive"
          title="Delete Selected"
        >
          <Trash2 className="h-4 w-4" />
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
      </div>

      <div className="h-6 w-px bg-border mx-2" />
      
      {/* Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="bg-gradient-primary hover:opacity-90 gap-1"
          >
            <Download className="h-4 w-4" />
            Export
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onExport('png')}>
            <Download className="h-4 w-4 mr-2" />
            PNG (Transparent)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            High-Res PNG (Print)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('svg')}>
            <Download className="h-4 w-4 mr-2" />
            SVG (Vector)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};