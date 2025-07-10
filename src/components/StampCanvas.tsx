import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, IText, Polygon } from "fabric";
import { StampToolbar } from "./StampToolbar";
import { ColorPicker } from "./ColorPicker";
import { toast } from "sonner";

export const StampCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#dc2626");
  const [activeTool, setActiveTool] = useState<"select" | "text" | "rectangle" | "circle" | "star">("select");
  const [stampText, setStampText] = useState("");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 400,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);
    toast.success("Stamp Canvas Ready!");

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 150,
        top: 150,
        fill: "transparent",
        stroke: activeColor,
        strokeWidth: 3,
        width: 100,
        height: 60,
        rx: 5,
        ry: 5,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 150,
        top: 150,
        fill: "transparent",
        stroke: activeColor,
        strokeWidth: 3,
        radius: 50,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (tool === "star") {
      const star = new Polygon([
        { x: 0, y: -50 },
        { x: 14.7, y: -15.4 },
        { x: 47.6, y: -15.4 },
        { x: 23.8, y: 9.2 },
        { x: 29.4, y: 40.4 },
        { x: 0, y: 25 },
        { x: -29.4, y: 40.4 },
        { x: -23.8, y: 9.2 },
        { x: -47.6, y: -15.4 },
        { x: -14.7, y: -15.4 }
      ], {
        left: 175,
        top: 175,
        fill: "transparent",
        stroke: activeColor,
        strokeWidth: 3,
      });
      fabricCanvas.add(star);
      fabricCanvas.setActiveObject(star);
    } else if (tool === "text" && stampText.trim()) {
      const text = new IText(stampText, {
        left: 150,
        top: 180,
        fill: activeColor,
        fontSize: 24,
        fontFamily: "Arial Black",
        fontWeight: "bold",
        textAlign: "center",
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      setStampText("");
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const handleExport = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = 'custom-stamp.png';
    link.href = dataURL;
    link.click();
    
    toast.success("Stamp downloaded!");
  };

  const addBorder = () => {
    if (!fabricCanvas) return;
    
    const border = new Circle({
      left: 50,
      top: 50,
      fill: "transparent",
      stroke: activeColor,
      strokeWidth: 8,
      radius: 150,
    });
    
    fabricCanvas.add(border);
    fabricCanvas.sendObjectToBack(border);
    toast.success("Border added!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <StampToolbar 
          activeTool={activeTool} 
          onToolClick={handleToolClick} 
          onClear={handleClear}
          onExport={handleExport}
          onAddBorder={addBorder}
          stampText={stampText}
          onStampTextChange={setStampText}
        />
        <ColorPicker color={activeColor} onChange={setActiveColor} />
      </div>
      
      <div className="flex justify-center">
        <div className="border-4 border-dashed border-muted-foreground/20 rounded-lg p-4 shadow-canvas bg-card">
          <canvas 
            ref={canvasRef} 
            className="border-2 border-border rounded-lg shadow-inner bg-background"
          />
        </div>
      </div>
    </div>
  );
};