import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Images, Save, Folder, Import, Plus } from "lucide-react";
import { toast } from "sonner";

interface SavedStamp {
  id: string;
  name: string;
  description: string;
  data: string;
  createdAt: string;
  preview: string;
}

interface StampGalleryProps {
  onLoadStamp: (stampData: string) => void;
}

export const StampGallery = ({ onLoadStamp }: StampGalleryProps) => {
  const [savedStamps, setSavedStamps] = useState<SavedStamp[]>(() => {
    const saved = localStorage.getItem('savedStamps');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [stampName, setStampName] = useState("");
  const [stampDescription, setStampDescription] = useState("");

  const saveCurrentStamp = () => {
    if (!stampName.trim()) {
      toast.error("Please enter a stamp name");
      return;
    }

    // Get current canvas data (this would need to be passed from parent)
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const newStamp: SavedStamp = {
      id: Date.now().toString(),
      name: stampName,
      description: stampDescription,
      data: "", // This would be the actual canvas JSON
      createdAt: new Date().toLocaleDateString(),
      preview: canvas.toDataURL('image/png', 0.3)
    };

    const updatedStamps = [...savedStamps, newStamp];
    setSavedStamps(updatedStamps);
    localStorage.setItem('savedStamps', JSON.stringify(updatedStamps));
    
    setSaveDialogOpen(false);
    setStampName("");
    setStampDescription("");
    toast.success("Stamp saved successfully!");
  };

  const deleteStamp = (id: string) => {
    const updatedStamps = savedStamps.filter(stamp => stamp.id !== id);
    setSavedStamps(updatedStamps);
    localStorage.setItem('savedStamps', JSON.stringify(updatedStamps));
    toast.success("Stamp deleted!");
  };

  const importStamp = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const stampData = JSON.parse(e.target?.result as string);
        onLoadStamp(stampData);
        toast.success("Stamp imported successfully!");
      } catch (error) {
        toast.error("Invalid stamp file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Images className="h-5 w-5 text-primary" />
            <CardTitle>Stamp Gallery</CardTitle>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Current Stamp</DialogTitle>
                  <DialogDescription>
                    Save your current stamp design to the gallery for later use.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      placeholder="My Custom Stamp"
                      value={stampName}
                      onChange={(e) => setStampName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description (optional)</label>
                    <Textarea
                      placeholder="Describe this stamp..."
                      value={stampDescription}
                      onChange={(e) => setStampDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveCurrentStamp}>
                      Save Stamp
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={importStamp}
                className="hidden"
              />
              <Button size="sm" variant="outline" asChild>
                <span>
                  <Import className="h-4 w-4 mr-1" />
                  Import
                </span>
              </Button>
            </label>
          </div>
        </div>
        
        <CardDescription>
          {savedStamps.length === 0 
            ? "No saved stamps yet. Create and save your first stamp!" 
            : `${savedStamps.length} saved stamp${savedStamps.length === 1 ? '' : 's'}`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {savedStamps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Folder className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Saved Stamps</h3>
            <p className="text-muted-foreground mb-4">
              Start creating stamps and save them to build your collection!
            </p>
            <Button onClick={() => setSaveDialogOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Save Current Stamp
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedStamps.map((stamp) => (
              <Card key={stamp.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
                    <img
                      src={stamp.preview}
                      alt={stamp.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm truncate">{stamp.name}</h4>
                    {stamp.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {stamp.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {stamp.createdAt}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => onLoadStamp(stamp.data)}
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteStamp(stamp.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};