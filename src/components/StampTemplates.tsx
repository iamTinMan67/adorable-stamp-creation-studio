import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Sparkles, Crown, Briefcase, Heart, Zap } from "lucide-react";
import { toast } from "sonner";

interface StampTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: "business" | "personal" | "creative";
  premium?: boolean;
  data: any; // Canvas JSON data
}

interface StampTemplatesProps {
  onSelectTemplate: (template: StampTemplate) => void;
}

export const StampTemplates = ({ onSelectTemplate }: StampTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "business" | "personal" | "creative">("all");
  const [previewTemplate, setPreviewTemplate] = useState<StampTemplate | null>(null);

  const templates: StampTemplate[] = [
    {
      id: "approved",
      name: "Approved",
      description: "Classic business approval stamp with professional styling",
      preview: "✓ APPROVED",
      category: "business",
      data: {
        objects: [
          {
            type: 'circle',
            left: 50,
            top: 50,
            radius: 150,
            fill: 'transparent',
            stroke: '#dc2626',
            strokeWidth: 8
          },
          {
            type: 'i-text',
            left: 200,
            top: 180,
            text: 'APPROVED',
            fontSize: 28,
            fontFamily: 'Arial Black',
            fill: '#dc2626',
            textAlign: 'center'
          },
          {
            type: 'i-text',
            left: 200,
            top: 140,
            text: '✓',
            fontSize: 40,
            fill: '#dc2626',
            textAlign: 'center'
          }
        ]
      }
    },
    {
      id: "urgent",
      name: "Urgent",
      description: "High priority marker for time-sensitive documents",
      preview: "⚡ URGENT",
      category: "business",
      data: {
        objects: [
          {
            type: 'rect',
            left: 100,
            top: 160,
            width: 200,
            height: 80,
            fill: 'transparent',
            stroke: '#dc2626',
            strokeWidth: 6,
            rx: 10
          },
          {
            type: 'i-text',
            left: 200,
            top: 185,
            text: 'URGENT',
            fontSize: 24,
            fontFamily: 'Arial Black',
            fill: '#dc2626',
            textAlign: 'center'
          }
        ]
      }
    },
    {
      id: "confidential",
      name: "Confidential",
      description: "Security marking for sensitive information",
      preview: "🔒 CONFIDENTIAL",
      category: "business",
      data: {
        objects: [
          {
            type: 'rect',
            left: 80,
            top: 150,
            width: 240,
            height: 100,
            fill: 'transparent',
            stroke: '#dc2626',
            strokeWidth: 4
          },
          {
            type: 'i-text',
            left: 200,
            top: 190,
            text: 'CONFIDENTIAL',
            fontSize: 20,
            fontFamily: 'Arial Black',
            fill: '#dc2626',
            textAlign: 'center'
          }
        ]
      }
    },
    {
      id: "received",
      name: "Received",
      description: "Document receipt confirmation with date field",
      preview: "📅 RECEIVED",
      category: "business",
      data: {
        objects: [
          {
            type: 'circle',
            left: 50,
            top: 50,
            radius: 150,
            fill: 'transparent',
            stroke: '#2563eb',
            strokeWidth: 6
          },
          {
            type: 'i-text',
            left: 200,
            top: 170,
            text: 'RECEIVED',
            fontSize: 22,
            fontFamily: 'Arial Black',
            fill: '#2563eb',
            textAlign: 'center'
          },
          {
            type: 'line',
            left: 120,
            top: 220,
            width: 160,
            height: 0,
            stroke: '#2563eb',
            strokeWidth: 2
          },
          {
            type: 'i-text',
            left: 200,
            top: 230,
            text: 'DATE',
            fontSize: 12,
            fill: '#2563eb',
            textAlign: 'center'
          }
        ]
      }
    },
    {
      id: "excellent",
      name: "Excellent Work",
      description: "Positive feedback stamp for outstanding performance",
      preview: "⭐ EXCELLENT",
      category: "personal",
      data: {
        objects: [
          {
            type: 'polygon',
            left: 200,
            top: 200,
            points: [
              { x: 0, y: -40 },
              { x: 12, y: -12 },
              { x: 40, y: -12 },
              { x: 20, y: 8 },
              { x: 24, y: 32 },
              { x: 0, y: 20 },
              { x: -24, y: 32 },
              { x: -20, y: 8 },
              { x: -40, y: -12 },
              { x: -12, y: -12 }
            ],
            fill: 'transparent',
            stroke: '#16a34a',
            strokeWidth: 4
          },
          {
            type: 'i-text',
            left: 200,
            top: 270,
            text: 'EXCELLENT',
            fontSize: 18,
            fontFamily: 'Arial Black',
            fill: '#16a34a',
            textAlign: 'center'
          }
        ]
      }
    },
    {
      id: "thankyou",
      name: "Thank You",
      description: "Appreciation stamp with heart design",
      preview: "💝 THANK YOU",
      category: "personal",
      data: {
        objects: [
          {
            type: 'circle',
            left: 50,
            top: 50,
            radius: 150,
            fill: 'transparent',
            stroke: '#9333ea',
            strokeWidth: 6
          },
          {
            type: 'i-text',
            left: 200,
            top: 170,
            text: 'THANK YOU',
            fontSize: 20,
            fontFamily: 'Arial Black',
            fill: '#9333ea',
            textAlign: 'center'
          },
          {
            type: 'i-text',
            left: 200,
            top: 140,
            text: '♥',
            fontSize: 30,
            fill: '#9333ea',
            textAlign: 'center'
          }
        ]
      }
    },
    {
      id: "creative-burst",
      name: "Creative Burst",
      description: "Artistic stamp with dynamic star pattern",
      preview: "✨ CREATIVE",
      category: "creative",
      premium: true,
      data: {
        objects: [
          {
            type: 'circle',
            left: 50,
            top: 50,
            radius: 150,
            fill: 'transparent',
            stroke: '#ea580c',
            strokeWidth: 8,
            strokeDashArray: [10, 5]
          },
          {
            type: 'i-text',
            left: 200,
            top: 180,
            text: 'CREATIVE',
            fontSize: 22,
            fontFamily: 'Arial Black',
            fill: '#ea580c',
            textAlign: 'center'
          }
        ]
      }
    },
    {
      id: "handmade",
      name: "Handmade with Love",
      description: "Artisan stamp for handcrafted items",
      preview: "🎨 HANDMADE",
      category: "creative",
      premium: true,
      data: {
        objects: [
          {
            type: 'rect',
            left: 80,
            top: 140,
            width: 240,
            height: 120,
            fill: 'transparent',
            stroke: '#be123c',
            strokeWidth: 5,
            rx: 20
          },
          {
            type: 'i-text',
            left: 200,
            top: 180,
            text: 'HANDMADE',
            fontSize: 18,
            fontFamily: 'Arial Black',
            fill: '#be123c',
            textAlign: 'center'
          },
          {
            type: 'i-text',
            left: 200,
            top: 210,
            text: 'WITH LOVE',
            fontSize: 14,
            fill: '#be123c',
            textAlign: 'center'
          }
        ]
      }
    }
  ];

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "business": return "bg-stamp-blue text-white";
      case "personal": return "bg-stamp-red text-white";
      case "creative": return "bg-stamp-purple text-white";
      default: return "bg-secondary";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "business": return Briefcase;
      case "personal": return Heart;
      case "creative": return Zap;
      default: return Sparkles;
    }
  };

  const categories = [
    { id: "all", label: "All Templates", icon: Sparkles },
    { id: "business", label: "Business", icon: Briefcase },
    { id: "personal", label: "Personal", icon: Heart },
    { id: "creative", label: "Creative", icon: Zap },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Professional Templates</h3>
      </div>
      
      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
        <TabsList className="grid w-full grid-cols-4">
          {categories.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const CategoryIcon = getCategoryIcon(template.category);
          
          return (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                    {template.premium && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <Badge className={getCategoryColor(template.category)}>
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {template.category}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{template.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="bg-muted rounded-md p-6 text-center mb-4 min-h-[80px] flex items-center justify-center">
                  <div className="text-lg font-bold text-muted-foreground font-mono">
                    {template.preview}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="flex-1">
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {template.name}
                          {template.premium && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </DialogTitle>
                        <DialogDescription>
                          {template.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
                        <div className="text-6xl font-bold text-muted-foreground font-mono">
                          {template.preview}
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => {
                            onSelectTemplate(template);
                            toast.success(`${template.name} template loaded!`);
                          }}
                          className="bg-gradient-primary hover:opacity-90"
                        >
                          Use This Template
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    size="sm" 
                    variant="default"
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                    onClick={() => {
                      onSelectTemplate(template);
                      toast.success(`${template.name} template loaded!`);
                    }}
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found in this category.</p>
        </div>
      )}
    </div>
  );
};