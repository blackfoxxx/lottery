import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Palette,
  Type,
  Image,
  Layout,
  Mail,
  Bell,
  Save,
  RefreshCw,
  Loader2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * Comprehensive System Settings Page
 * Full control over all UI components, colors, typography, images, and system configuration
 * Connected to Laravel backend API for persistent storage
 */

export default function SystemSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // UI Customization State
  const [uiSettings, setUiSettings] = useState({
    // Colors
    primary_color: "#3b82f6",
    secondary_color: "#10b981",
    accent_color: "#f59e0b",
    background_color: "#ffffff",
    text_color: "#1f2937",
    border_color: "#e5e7eb",
    
    // Typography
    font_family: "Inter",
    heading_font_family: "Inter",
    font_size: "16px",
    heading_size: "32px",
    
    // Layout
    border_radius: "0.5rem",
    spacing: "1rem",
    container_width: "1280px",
    
    // Images
    logo_url: "/logo.png",
    favicon_url: "/favicon.ico",
    hero_image_url: "",
    banner_image_url: "",
    
    // Site Content
    site_name: "Belkhair E-Commerce",
    site_description: "Your trusted online shopping destination in Iraq",
    site_keywords: "ecommerce, shopping, iraq, online store, lottery",
    hero_title: "Welcome to Belkhair",
    hero_subtitle: "Discover amazing products and win exciting prizes",
    footer_text: "© 2024 Belkhair. All rights reserved.",
    
    // Lottery Customization
    lottery_banner_title: "Win Amazing Prizes!",
    lottery_banner_subtitle: "Shop now and get lottery tickets",
    lottery_banner_color: "#fbbf24",
    lottery_button_text: "View My Tickets",
    
    // Features
    enable_lottery: true,
    enable_reviews: true,
    enable_wishlist: true,
    enable_compare: true,
    enable_newsletter: true,
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: "smtp.gmail.com",
    smtp_port: "587",
    smtp_user: "",
    smtp_password: "",
    from_email: "noreply@belkhair.com",
    from_name: "Belkhair",
    enable_email_notifications: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    enable_order_notifications: true,
    enable_lottery_notifications: true,
    enable_promotion_notifications: true,
    enable_stock_alerts: true,
  });

  // Load settings from backend on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/site-settings/`);
      const data = await response.json();

      if (data.success) {
        const settings = data.data;
        
        // Update UI settings
        setUiSettings(prev => ({
          ...prev,
          primary_color: settings.primary_color || prev.primary_color,
          secondary_color: settings.secondary_color || prev.secondary_color,
          accent_color: settings.accent_color || prev.accent_color,
          background_color: settings.background_color || prev.background_color,
          text_color: settings.text_color || prev.text_color,
          border_color: settings.border_color || prev.border_color,
          font_family: settings.font_family || prev.font_family,
          heading_font_family: settings.heading_font_family || prev.heading_font_family,
          font_size: settings.font_size || prev.font_size,
          heading_size: settings.heading_size || prev.heading_size,
          border_radius: settings.border_radius || prev.border_radius,
          spacing: settings.spacing || prev.spacing,
          container_width: settings.container_width || prev.container_width,
          logo_url: settings.logo_url || prev.logo_url,
          favicon_url: settings.favicon_url || prev.favicon_url,
          hero_image_url: settings.hero_image_url || prev.hero_image_url,
          banner_image_url: settings.banner_image_url || prev.banner_image_url,
          site_name: settings.site_name || prev.site_name,
          site_description: settings.site_description || prev.site_description,
          site_keywords: settings.site_keywords || prev.site_keywords,
          hero_title: settings.hero_title || prev.hero_title,
          hero_subtitle: settings.hero_subtitle || prev.hero_subtitle,
          footer_text: settings.footer_text || prev.footer_text,
          lottery_banner_title: settings.lottery_banner_title || prev.lottery_banner_title,
          lottery_banner_subtitle: settings.lottery_banner_subtitle || prev.lottery_banner_subtitle,
          lottery_banner_color: settings.lottery_banner_color || prev.lottery_banner_color,
          lottery_button_text: settings.lottery_button_text || prev.lottery_button_text,
          enable_lottery: settings.enable_lottery !== undefined ? settings.enable_lottery : prev.enable_lottery,
          enable_reviews: settings.enable_reviews !== undefined ? settings.enable_reviews : prev.enable_reviews,
          enable_wishlist: settings.enable_wishlist !== undefined ? settings.enable_wishlist : prev.enable_wishlist,
          enable_compare: settings.enable_compare !== undefined ? settings.enable_compare : prev.enable_compare,
          enable_newsletter: settings.enable_newsletter !== undefined ? settings.enable_newsletter : prev.enable_newsletter,
        }));

        // Update email settings
        setEmailSettings(prev => ({
          ...prev,
          smtp_host: settings.smtp_host || prev.smtp_host,
          smtp_port: settings.smtp_port || prev.smtp_port,
          smtp_user: settings.smtp_user || prev.smtp_user,
          smtp_password: settings.smtp_password || prev.smtp_password,
          from_email: settings.from_email || prev.from_email,
          from_name: settings.from_name || prev.from_name,
          enable_email_notifications: settings.enable_email_notifications !== undefined ? settings.enable_email_notifications : prev.enable_email_notifications,
        }));

        // Update notification settings
        setNotificationSettings(prev => ({
          ...prev,
          enable_order_notifications: settings.enable_order_notifications !== undefined ? settings.enable_order_notifications : prev.enable_order_notifications,
          enable_lottery_notifications: settings.enable_lottery_notifications !== undefined ? settings.enable_lottery_notifications : prev.enable_lottery_notifications,
          enable_promotion_notifications: settings.enable_promotion_notifications !== undefined ? settings.enable_promotion_notifications : prev.enable_promotion_notifications,
          enable_stock_alerts: settings.enable_stock_alerts !== undefined ? settings.enable_stock_alerts : prev.enable_stock_alerts,
        }));

        toast.success("Settings loaded successfully");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings from server");
    } finally {
      setLoading(false);
    }
  };

  const saveAllSettings = async () => {
    setSaving(true);
    try {
      // Combine all settings
      const allSettings = {
        ...uiSettings,
        ...emailSettings,
        ...notificationSettings,
      };

      // Convert to API format
      const settingsPayload: Record<string, { value: any; type: string }> = {};
      
      Object.entries(allSettings).forEach(([key, value]) => {
        settingsPayload[key] = {
          value: value,
          type: typeof value === 'boolean' ? 'boolean' : 
                typeof value === 'number' ? 'number' : 'string'
        };
      });

      const response = await fetch(`${API_BASE_URL}/site-settings/update-multiple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: settingsPayload }),
      });

      const data = await response.json();

      if (data.success) {
        // Apply CSS variables for immediate visual feedback
        applyUISettings();
        toast.success("All settings saved successfully!");
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings to server");
    } finally {
      setSaving(false);
    }
  };

  const applyUISettings = () => {
    // Apply settings to CSS variables for immediate visual feedback
    document.documentElement.style.setProperty('--primary', uiSettings.primary_color);
    document.documentElement.style.setProperty('--secondary', uiSettings.secondary_color);
    document.documentElement.style.setProperty('--accent', uiSettings.accent_color);
    document.documentElement.style.setProperty('--background', uiSettings.background_color);
    document.documentElement.style.setProperty('--foreground', uiSettings.text_color);
    document.documentElement.style.setProperty('--border', uiSettings.border_color);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">System Settings</h2>
            <p className="text-muted-foreground">
              Complete control over all system components and UI customization
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadSettings} disabled={loading || saving}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload
            </Button>
            <Button onClick={saveAllSettings} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save All Settings
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="colors">
              <Palette className="w-4 h-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="w-4 h-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="w-4 h-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="content">
              <Image className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Color Customization</CardTitle>
                <CardDescription>Customize your brand colors and theme</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={uiSettings.primary_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, primary_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={uiSettings.primary_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, primary_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={uiSettings.secondary_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, secondary_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={uiSettings.secondary_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, secondary_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent_color"
                      type="color"
                      value={uiSettings.accent_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, accent_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={uiSettings.accent_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, accent_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background_color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background_color"
                      type="color"
                      value={uiSettings.background_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, background_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={uiSettings.background_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, background_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text_color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text_color"
                      type="color"
                      value={uiSettings.text_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, text_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={uiSettings.text_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, text_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="border_color">Border Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="border_color"
                      type="color"
                      value={uiSettings.border_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, border_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={uiSettings.border_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, border_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lottery_banner_color">Lottery Banner Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="lottery_banner_color"
                      type="color"
                      value={uiSettings.lottery_banner_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, lottery_banner_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={uiSettings.lottery_banner_color}
                      onChange={(e) => setUiSettings({ ...uiSettings, lottery_banner_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography">
            <Card>
              <CardHeader>
                <CardTitle>Typography Settings</CardTitle>
                <CardDescription>Customize fonts and text sizes</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="font_family">Body Font Family</Label>
                  <Input
                    id="font_family"
                    value={uiSettings.font_family}
                    onChange={(e) => setUiSettings({ ...uiSettings, font_family: e.target.value })}
                    placeholder="Inter, sans-serif"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heading_font_family">Heading Font Family</Label>
                  <Input
                    id="heading_font_family"
                    value={uiSettings.heading_font_family}
                    onChange={(e) => setUiSettings({ ...uiSettings, heading_font_family: e.target.value })}
                    placeholder="Inter, sans-serif"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font_size">Base Font Size</Label>
                  <Input
                    id="font_size"
                    value={uiSettings.font_size}
                    onChange={(e) => setUiSettings({ ...uiSettings, font_size: e.target.value })}
                    placeholder="16px"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heading_size">Heading Size</Label>
                  <Input
                    id="heading_size"
                    value={uiSettings.heading_size}
                    onChange={(e) => setUiSettings({ ...uiSettings, heading_size: e.target.value })}
                    placeholder="32px"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout">
            <Card>
              <CardHeader>
                <CardTitle>Layout Settings</CardTitle>
                <CardDescription>Customize spacing, borders, and container sizes</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="border_radius">Border Radius</Label>
                  <Input
                    id="border_radius"
                    value={uiSettings.border_radius}
                    onChange={(e) => setUiSettings({ ...uiSettings, border_radius: e.target.value })}
                    placeholder="0.5rem"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spacing">Base Spacing</Label>
                  <Input
                    id="spacing"
                    value={uiSettings.spacing}
                    onChange={(e) => setUiSettings({ ...uiSettings, spacing: e.target.value })}
                    placeholder="1rem"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="container_width">Container Width</Label>
                  <Input
                    id="container_width"
                    value={uiSettings.container_width}
                    onChange={(e) => setUiSettings({ ...uiSettings, container_width: e.target.value })}
                    placeholder="1280px"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Content</CardTitle>
                  <CardDescription>Manage site-wide text content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={uiSettings.site_name}
                      onChange={(e) => setUiSettings({ ...uiSettings, site_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={uiSettings.site_description}
                      onChange={(e) => setUiSettings({ ...uiSettings, site_description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero_title">Hero Title</Label>
                    <Input
                      id="hero_title"
                      value={uiSettings.hero_title}
                      onChange={(e) => setUiSettings({ ...uiSettings, hero_title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                    <Input
                      id="hero_subtitle"
                      value={uiSettings.hero_subtitle}
                      onChange={(e) => setUiSettings({ ...uiSettings, hero_subtitle: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lottery Content</CardTitle>
                  <CardDescription>Customize lottery banner text</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lottery_banner_title">Banner Title</Label>
                    <Input
                      id="lottery_banner_title"
                      value={uiSettings.lottery_banner_title}
                      onChange={(e) => setUiSettings({ ...uiSettings, lottery_banner_title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lottery_banner_subtitle">Banner Subtitle</Label>
                    <Input
                      id="lottery_banner_subtitle"
                      value={uiSettings.lottery_banner_subtitle}
                      onChange={(e) => setUiSettings({ ...uiSettings, lottery_banner_subtitle: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lottery_button_text">Button Text</Label>
                    <Input
                      id="lottery_button_text"
                      value={uiSettings.lottery_button_text}
                      onChange={(e) => setUiSettings({ ...uiSettings, lottery_button_text: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Toggles</CardTitle>
                  <CardDescription>Enable or disable site features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable_lottery">Enable Lottery System</Label>
                    <Switch
                      id="enable_lottery"
                      checked={uiSettings.enable_lottery}
                      onCheckedChange={(checked) => setUiSettings({ ...uiSettings, enable_lottery: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable_reviews">Enable Product Reviews</Label>
                    <Switch
                      id="enable_reviews"
                      checked={uiSettings.enable_reviews}
                      onCheckedChange={(checked) => setUiSettings({ ...uiSettings, enable_reviews: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable_wishlist">Enable Wishlist</Label>
                    <Switch
                      id="enable_wishlist"
                      checked={uiSettings.enable_wishlist}
                      onCheckedChange={(checked) => setUiSettings({ ...uiSettings, enable_wishlist: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable_newsletter">Enable Newsletter</Label>
                    <Switch
                      id="enable_newsletter"
                      checked={uiSettings.enable_newsletter}
                      onCheckedChange={(checked) => setUiSettings({ ...uiSettings, enable_newsletter: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure SMTP settings for email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_host">SMTP Host</Label>
                    <Input
                      id="smtp_host"
                      value={emailSettings.smtp_host}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp_port">SMTP Port</Label>
                    <Input
                      id="smtp_port"
                      value={emailSettings.smtp_port}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: e.target.value })}
                      placeholder="587"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp_user">SMTP Username</Label>
                    <Input
                      id="smtp_user"
                      value={emailSettings.smtp_user}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_user: e.target.value })}
                      placeholder="your-email@gmail.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp_password">SMTP Password</Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      value={emailSettings.smtp_password}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_password: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from_email">From Email</Label>
                    <Input
                      id="from_email"
                      value={emailSettings.from_email}
                      onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
                      placeholder="noreply@belkhair.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from_name">From Name</Label>
                    <Input
                      id="from_name"
                      value={emailSettings.from_name}
                      onChange={(e) => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
                      placeholder="Belkhair"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Label htmlFor="enable_email_notifications">Enable Email Notifications</Label>
                  <Switch
                    id="enable_email_notifications"
                    checked={emailSettings.enable_email_notifications}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enable_email_notifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure which notifications to send</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable_order_notifications">Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send emails when orders are placed</p>
                  </div>
                  <Switch
                    id="enable_order_notifications"
                    checked={notificationSettings.enable_order_notifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enable_order_notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable_lottery_notifications">Lottery Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send emails to lottery winners</p>
                  </div>
                  <Switch
                    id="enable_lottery_notifications"
                    checked={notificationSettings.enable_lottery_notifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enable_lottery_notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable_promotion_notifications">Promotion Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send promotional emails to customers</p>
                  </div>
                  <Switch
                    id="enable_promotion_notifications"
                    checked={notificationSettings.enable_promotion_notifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enable_promotion_notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable_stock_alerts">Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send alerts when products are low in stock</p>
                  </div>
                  <Switch
                    id="enable_stock_alerts"
                    checked={notificationSettings.enable_stock_alerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enable_stock_alerts: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button at Bottom */}
        <div className="flex justify-end">
          <Button size="lg" onClick={saveAllSettings} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving All Settings...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
