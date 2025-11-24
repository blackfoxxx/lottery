import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload, RefreshCw, Eye, Save } from "lucide-react";
import { api } from "@/lib/api";

export default function UISettings() {
  const [settings, setSettings] = useState({
    site_title: "Belkhair E-Commerce",
    site_tagline: "Shop Premium Products, Win Amazing Prizes",
    primary_color: "#3b82f6",
    secondary_color: "#8b5cf6",
    theme_mode: "light",
    logo_url: "/logo.png",
    favicon_url: "/favicon.ico",
    font_family: "Inter",
  });

  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.getSiteSettings();
      if (response.success) {
        setSettings({ ...settings, ...response.data });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const settingsToSave = Object.entries(settings).map(([key, value]) => ({
        key,
        value: { value, type: typeof value === "number" ? "number" : "string" },
      }));

      const payload = settingsToSave.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, any>);

      await api.updateSiteSettings(payload);
      
      toast.success("Settings saved successfully!");
      
      // Apply settings to the page
      applySettings();
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all settings to defaults?")) {
      return;
    }

    setLoading(true);
    try {
      await api.resetSiteSettings();
      toast.success("Settings reset to defaults");
      loadSettings();
    } catch (error) {
      console.error("Failed to reset settings:", error);
      toast.error("Failed to reset settings");
    } finally {
      setLoading(false);
    }
  };

  const applySettings = () => {
    // Apply theme
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(settings.theme_mode);

    // Apply colors
    document.documentElement.style.setProperty("--primary", settings.primary_color);
    document.documentElement.style.setProperty("--secondary", settings.secondary_color);

    // Apply font
    document.documentElement.style.setProperty("--font-sans", settings.font_family);

    // Update title
    document.title = settings.site_title;
  };

  const togglePreview = () => {
    if (!previewMode) {
      applySettings();
    }
    setPreviewMode(!previewMode);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">UI Customization</h1>
          <p className="text-muted-foreground mt-1">
            Customize your website's appearance and branding
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={togglePreview}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors & Theme</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Identity</CardTitle>
              <CardDescription>
                Configure your website's name and tagline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_title">Site Title</Label>
                <Input
                  id="site_title"
                  value={settings.site_title}
                  onChange={(e) => handleChange("site_title", e.target.value)}
                  placeholder="Enter site title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_tagline">Site Tagline</Label>
                <Input
                  id="site_tagline"
                  value={settings.site_tagline}
                  onChange={(e) => handleChange("site_tagline", e.target.value)}
                  placeholder="Enter site tagline"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo & Favicon</CardTitle>
              <CardDescription>
                Upload your brand assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="logo_url"
                    value={settings.logo_url}
                    onChange={(e) => handleChange("logo_url", e.target.value)}
                    placeholder="/logo.png"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                {settings.logo_url && (
                  <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                    <img
                      src={settings.logo_url}
                      alt="Logo preview"
                      className="h-12 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon_url">Favicon URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="favicon_url"
                    value={settings.favicon_url}
                    onChange={(e) => handleChange("favicon_url", e.target.value)}
                    placeholder="/favicon.ico"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Customize your website's color palette
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => handleChange("primary_color", e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => handleChange("primary_color", e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => handleChange("secondary_color", e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.secondary_color}
                      onChange={(e) => handleChange("secondary_color", e.target.value)}
                      placeholder="#8b5cf6"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.theme_mode === "light" ? "default" : "outline"}
                    onClick={() => handleChange("theme_mode", "light")}
                  >
                    Light
                  </Button>
                  <Button
                    variant={settings.theme_mode === "dark" ? "default" : "outline"}
                    onClick={() => handleChange("theme_mode", "dark")}
                  >
                    Dark
                  </Button>
                  <Button
                    variant={settings.theme_mode === "auto" ? "default" : "outline"}
                    onClick={() => handleChange("theme_mode", "auto")}
                  >
                    Auto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Font Settings</CardTitle>
              <CardDescription>
                Choose your website's typography
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="font_family">Font Family</Label>
                <select
                  id="font_family"
                  value={settings.font_family}
                  onChange={(e) => handleChange("font_family", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>

              <div className="p-4 border rounded-lg" style={{ fontFamily: settings.font_family }}>
                <h3 className="text-2xl font-bold mb-2">Preview Text</h3>
                <p className="text-muted-foreground">
                  The quick brown fox jumps over the lazy dog. 0123456789
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Advanced customization options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Custom CSS and advanced settings will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
