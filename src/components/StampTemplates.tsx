import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sparkles } from "lucide-react";

interface StampTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: "business" | "personal" | "creative";
}

interface StampTemplatesProps {
  onSelectTemplate: (template: StampTemplate) => void;
}

export const StampTemplates = ({ onSelectTemplate }: StampTemplatesProps) => {
  const templates: StampTemplate[] = [
    {
      id: "approved",
      name: "Approved",
      description: "Classic approval stamp",
      preview: "✓ APPROVED",
      category: "business"
    },
    {
      id: "urgent",
      name: "Urgent",
      description: "High priority marker",
      preview: "⚡ URGENT",
      category: "business"
    },
    {
      id: "confidential",
      name: "Confidential",
      description: "Security marking",
      preview: "🔒 CONFIDENTIAL",
      category: "business"
    },
    {
      id: "date",
      name: "Date Stamp",
      description: "Custom date marker",
      preview: "📅 DATE",
      category: "business"
    },
    {
      id: "star",
      name: "Star Badge",
      description: "Achievement marker",
      preview: "⭐ EXCELLENT",
      category: "personal"
    },
    {
      id: "heart",
      name: "Love Stamp",
      description: "Affection marker",
      preview: "💝 WITH LOVE",
      category: "personal"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "business": return "bg-stamp-blue text-white";
      case "personal": return "bg-stamp-red text-white";
      case "creative": return "bg-stamp-purple text-white";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Quick Templates</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{template.name}</CardTitle>
                <Badge className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
              </div>
              <CardDescription className="text-xs">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-muted rounded-md p-4 text-center mb-3">
                <div className="text-lg font-bold text-muted-foreground font-mono">
                  {template.preview}
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => onSelectTemplate(template)}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};