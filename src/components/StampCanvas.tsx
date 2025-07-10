import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, IText, Polygon, FabricImage } from "fabric";
import { StampToolbar } from "./StampToolbar";
import { ColorPicker } from "./ColorPicker";
import { StampGallery } from "./StampGallery";
import { toast } from "sonner";

export const StampCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#dc2626");
  const [activeTool, setActiveTool] = useState<"select" | "text" | "rectangle" | "circle" | "star" | "image">("select");
  const [stampText, setStampText] = useState("");
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 400,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);
    
    // Save initial state
    saveState(canvas);
    
    // Add event listeners for automatic state saving
    canvas.on('object:added', () => saveState(canvas));
    canvas.on('object:removed', () => saveState(canvas));
    canvas.on('object:modified', () => saveState(canvas));

    toast.success("Stamp Canvas Ready!");

    return () => {
      canvas.dispose();
    };
  }, []);

  const saveState = (canvas: FabricCanvas) => {
    const currentState = JSON.stringify(canvas.toJSON());
    setCanvasHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(currentState);
      return newHistory.slice(-20); // Keep only last 20 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  };

  const undo = () => {
    if (!fabricCanvas || historyIndex <= 0) return;
    
    const prevState = canvasHistory[historyIndex - 1];
    fabricCanvas.loadFromJSON(prevState, () => {
      fabricCanvas.renderAll();
      setHistoryIndex(prev => prev - 1);
      toast.success("Undone!");
    });
  };

  const redo = () => {
    if (!fabricCanvas || historyIndex >= canvasHistory.length - 1) return;
    
    const nextState = canvasHistory[historyIndex + 1];
    fabricCanvas.loadFromJSON(nextState, () => {
      fabricCanvas.renderAll();
      setHistoryIndex(prev => prev + 1);
      toast.success("Redone!");
    });
  };

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
    } else if (tool === "image") {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        FabricImage.fromURL(e.target?.result as string).then((img) => {
          img.scaleToWidth(100);
          img.scaleToHeight(100);
          img.left = 150;
          img.top = 150;
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          toast.success("Image added!");
        });
      };
      imgElement.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const handleExport = (format: 'png' | 'pdf' | 'svg' = 'png') => {
    if (!fabricCanvas) return;
    
    let dataURL: string;
    let filename: string;
    
    switch (format) {
      case 'svg':
        dataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fabricCanvas.toSVG())}`;
        filename = 'custom-stamp.svg';
        break;
      case 'pdf':
        // For PDF, we'll use PNG and let user convert if needed
        dataURL = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 3
        });
        filename = 'custom-stamp-print.png';
        break;
      default:
        dataURL = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 2
        });
        filename = 'custom-stamp.png';
    }
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    link.click();
    
    toast.success(`Stamp exported as ${format.toUpperCase()}!`);
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

  const duplicateSelected = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) {
      toast.error("Select an object to duplicate");
      return;
    }

    activeObject.clone().then((cloned: any) => {
      cloned.left += 20;
      cloned.top += 20;
      fabricCanvas.add(cloned);
      fabricCanvas.setActiveObject(cloned);
      toast.success("Object duplicated!");
    });
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) {
      toast.error("Select an object to delete");
      return;
    }

    fabricCanvas.remove(activeObject);
    toast.success("Object deleted!");
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
          onUndo={undo}
          onRedo={redo}
          onDuplicate={duplicateSelected}
          onDelete={deleteSelected}
          stampText={stampText}
          onStampTextChange={setStampText}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < canvasHistory.length - 1}
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

      <StampGallery onLoadStamp={(stampData) => {
        if (!fabricCanvas) return;
        fabricCanvas.loadFromJSON(stampData, () => {
          fabricCanvas.renderAll();
          toast.success("Stamp loaded!");
        });
      }} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};