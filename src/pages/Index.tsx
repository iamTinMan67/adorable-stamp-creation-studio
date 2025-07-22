import { useState } from "react";
import { StampCanvas } from "@/components/StampCanvas";
import { ProfessionalStampCreator } from "@/components/ProfessionalStampCreator";
import { StampTemplates } from "@/components/StampTemplates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stamp, Sparkles, Palette, Download, Settings } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("professional");

  const handleTemplateSelect = (template: any) => {
    toast.success(`Selected ${template.name} template! Switch to Create tab to customize.`);
    setActiveTab("create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary shadow-stamp">
                <Stamp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Adorable Stamp Studio
                </h1>
                <p className="text-sm text-muted-foreground">Create beautiful custom stamps</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Professional • Creative • Easy</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Choose a Template</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start with one of our professionally designed templates, then customize it to make it your own.
              </p>
            </div>
            <StampTemplates onSelectTemplate={handleTemplateSelect} />
          </TabsContent>

          <TabsContent value="professional" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Professional Stamp Creator</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create professional circular stamps with precise control over borders, text, and formatting.
              </p>
            </div>
            <ProfessionalStampCreator />
          </TabsContent>

          <TabsContent value="create" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Advanced Creator</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Use our powerful canvas editor to design custom stamps with complete creative freedom.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <StampCanvas />
              </div>
              
              <div className="space-y-6">
                <Card className="border-dashed border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Download className="h-5 w-5" />
                      Export Options
                    </CardTitle>
                    <CardDescription>
                      Download your stamp in high quality for printing or digital use.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      PNG (Transparent)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      PDF (Print Ready)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      SVG (Vector)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pro Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Use circular borders for traditional stamp looks</p>
                    <p>• Bold text works best for clarity</p>
                    <p>• Red and blue are classic stamp colors</p>
                    <p>• Keep designs simple for better print quality</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-card/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Created with ❤️ using Adorable Stamp Studio</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
