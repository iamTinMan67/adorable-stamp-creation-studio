import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, IText, FabricImage, Textbox, Path } from "fabric";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Download, Plus, Minus, RotateCw, Copy, Trash2, ChevronDown, Eye, Square, Type, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const ProfessionalStampCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState(125);
  
  // Text controls
  const [topText, setTopText] = useState("VERITAS ET VIRTUS");
  const [bottomText, setBottomText] = useState("RICHARD BLAKE");
  const [centerText, setCenterText] = useState("");
  
  // Border controls
  const [outerBorderType, setOuterBorderType] = useState("solid");
  const [outerBorderWidth, setOuterBorderWidth] = useState([4]);
  const [outerBorderColor, setOuterBorderColor] = useState("#000000");
  
  const [innerBorderType, setInnerBorderType] = useState("solid");
  const [innerBorderWidth, setInnerBorderWidth] = useState([2]);
  const [innerBorderColor, setInnerBorderColor] = useState("#000000");
  
  // Style controls
  const [fontSize, setFontSize] = useState([16]);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textStyle, setTextStyle] = useState("normal");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 300,
      height: 300,
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);
    
    // Initialize with default circular stamp
    initializeDefaultStamp(canvas);
    
    toast.success("Professional Stamp Creator Ready!");

    return () => {
      canvas.dispose();
    };
  }, []);

  const initializeDefaultStamp = (canvas: FabricCanvas) => {
    // Outer border circle
    const outerBorder = new Circle({
      left: 25,
      top: 25,
      fill: "transparent",
      stroke: outerBorderColor,
      strokeWidth: outerBorderWidth[0],
      radius: 125,
      selectable: false,
      evented: false,
    });

    // Inner border circle
    const innerBorder = new Circle({
      left: 35,
      top: 35,
      fill: "transparent",
      stroke: innerBorderColor,
      strokeWidth: innerBorderWidth[0],
      radius: 115,
      selectable: false,
      evented: false,
    });

    // Top curved text
    const topTextPath = new Path("M 75 75 A 75 75 0 0 1 225 75", {
      fill: "transparent",
      stroke: "transparent",
      selectable: false,
      evented: false,
    });

    const topTextObj = new IText(topText, {
      left: 150,
      top: 60,
      fill: "#000000",
      fontSize: fontSize[0],
      fontFamily: fontFamily,
      textAlign: "center",
      originX: "center",
      originY: "center",
      selectable: true,
    });

    // Bottom curved text
    const bottomTextObj = new IText(bottomText, {
      left: 150,
      top: 240,
      fill: "#000000",
      fontSize: fontSize[0],
      fontFamily: fontFamily,
      textAlign: "center",
      originX: "center",
      originY: "center",
      selectable: true,
    });

    canvas.add(outerBorder, innerBorder, topTextObj, bottomTextObj);
    canvas.renderAll();
  };

  const updateBorders = () => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    objects.forEach(obj => {
      if (obj.type === 'circle' && !obj.selectable) {
        fabricCanvas.remove(obj);
      }
    });

    // Recreate borders
    const outerBorder = new Circle({
      left: 25,
      top: 25,
      fill: "transparent",
      stroke: outerBorderColor,
      strokeWidth: outerBorderWidth[0],
      radius: 125,
      selectable: false,
      evented: false,
    });

    const innerBorder = new Circle({
      left: 35,
      top: 35,
      fill: "transparent",
      stroke: innerBorderColor,
      strokeWidth: innerBorderWidth[0],
      radius: 115,
      selectable: false,
      evented: false,
    });

    fabricCanvas.add(outerBorder, innerBorder);
    fabricCanvas.sendObjectToBack(innerBorder);
    fabricCanvas.sendObjectToBack(outerBorder);
    fabricCanvas.renderAll();
  };

  const updateText = () => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    objects.forEach(obj => {
      if (obj.type === 'i-text') {
        const text = obj as IText;
        text.set({
          fontSize: fontSize[0],
          fontFamily: fontFamily,
          fontWeight: textStyle === "bold" ? "bold" : "normal",
          fontStyle: textStyle === "italic" ? "italic" : "normal",
        });
      }
    });
    
    fabricCanvas.renderAll();
  };

  const handleZoom = (newZoom: number) => {
    setZoom(newZoom);
    if (fabricCanvas) {
      const zoomLevel = newZoom / 100;
      fabricCanvas.setZoom(zoomLevel);
      fabricCanvas.renderAll();
    }
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      FabricImage.fromURL(e.target?.result as string).then((img) => {
        img.scaleToWidth(80);
        img.scaleToHeight(80);
        img.left = 150;
        img.top = 150;
        img.originX = "center";
        img.originY = "center";
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        toast.success("Image added to stamp!");
      });
    };
    reader.readAsDataURL(file);
  };

  const handleExport = (format: 'png' | 'pdf' | 'svg' = 'png') => {
    if (!fabricCanvas) return;
    
    let dataURL: string;
    let filename: string;
    
    switch (format) {
      case 'svg':
        dataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fabricCanvas.toSVG())}`;
        filename = 'professional-stamp.svg';
        break;
      case 'pdf':
        dataURL = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 4
        });
        filename = 'professional-stamp-print.png';
        break;
      default:
        dataURL = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 3
        });
        filename = 'professional-stamp.png';
    }
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    link.click();
    
    toast.success(`Stamp exported as ${format.toUpperCase()}!`);
  };

  useEffect(() => {
    updateBorders();
  }, [outerBorderColor, outerBorderWidth, innerBorderColor, innerBorderWidth, outerBorderType, innerBorderType]);

  useEffect(() => {
    updateText();
  }, [fontSize, fontFamily, textStyle]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Professional Stamp Creator</h1>
        <p className="text-muted-foreground">Create custom circular stamps with professional formatting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Border Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Square className="h-4 w-4" />
              Border Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Round outside border</Label>
              <Select value={outerBorderType} onValueChange={setOuterBorderType}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Label className="text-xs">Width:</Label>
                <Slider
                  value={outerBorderWidth}
                  onValueChange={setOuterBorderWidth}
                  max={10}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs w-6">{outerBorderWidth[0]}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="text-xs">Color:</Label>
                <input
                  type="color"
                  value={outerBorderColor}
                  onChange={(e) => setOuterBorderColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs font-medium">Round inside border</Label>
              <Select value={innerBorderType} onValueChange={setInnerBorderType}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Label className="text-xs">Width:</Label>
                <Slider
                  value={innerBorderWidth}
                  onValueChange={setInnerBorderWidth}
                  max={8}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs w-6">{innerBorderWidth[0]}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="text-xs">Color:</Label>
                <input
                  type="color"
                  value={innerBorderColor}
                  onChange={(e) => setInnerBorderColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center Panel - Canvas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Stamp Preview</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleZoom(Math.max(50, zoom - 25))}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs font-mono w-12 text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleZoom(Math.min(200, zoom + 25))}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center p-4 bg-muted/20 rounded-lg">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4">
                <canvas 
                  ref={canvasRef} 
                  className="border border-border rounded-lg shadow-sm bg-white"
                />
              </div>
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={addImage}
                className="gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Add Image
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="gap-2 bg-gradient-primary">
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('png')}>
                    PNG (Transparent)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    High-Res PNG (Print)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('svg')}>
                    SVG (Vector)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Text & Style Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text & Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Top Text</Label>
              <Input
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Enter top text"
                className="h-8"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Bottom Text</Label>
              <Input
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Enter bottom text"
                className="h-8"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Center Text</Label>
              <Input
                value={centerText}
                onChange={(e) => setCenterText(e.target.value)}
                placeholder="Optional center text"
                className="h-8"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs font-medium">Font</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Style</Label>
              <Select value={textStyle} onValueChange={setTextStyle}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="italic">Italic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Font Size</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  max={32}
                  min={8}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs w-8">{fontSize[0]}px</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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