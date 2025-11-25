import { useState } from "react";
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
  Shield,
  Database,
  Save,
  RefreshCw,
} from "lucide-react";

/**
 * Comprehensive System Settings Page
 * Full control over all UI components, colors, typography, images, and system configuration
 */

export default function SystemSettings() {
  // UI Customization State
  const [uiSettings, setUiSettings] = useState({
    // Colors
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderColor: "#e5e7eb",
    
    // Typography
    fontFamily: "Inter",
    headingFontFamily: "Inter",
    fontSize: "16px",
    headingSize: "32px",
    
    // Layout
    borderRadius: "0.5rem",
    spacing: "1rem",
    containerWidth: "1280px",
    
    // Images
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
    heroImageUrl: "",
    bannerImageUrl: "",
    
    // Site Content
    siteName: "Belkhair E-Commerce",
    siteDescription: "Your trusted online shopping destination in Iraq",
    siteKeywords: "ecommerce, shopping, iraq, online store, lottery",
    heroTitle: "Welcome to Belkhair",
    heroSubtitle: "Discover amazing products and win exciting prizes",
    footerText: "© 2024 Belkhair. All rights reserved.",
    
    // Lottery Customization
    lotteryBannerTitle: "Win Amazing Prizes!",
    lotteryBannerSubtitle: "Shop now and get lottery tickets",
    lotteryBannerColor: "#fbbf24",
    lotteryButtonText: "View My Tickets",
    
    // Features
    enableLottery: true,
    enableReviews: true,
    enableWishlist: true,
    enableCompare: true,
    enableNewsletter: true,
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@belkhair.com",
    fromName: "Belkhair",
    enableEmailNotifications: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    enableOrderNotifications: true,
    enableLotteryNotifications: true,
    enablePromotionNotifications: true,
    enableStockAlerts: true,
  });

  const handleSaveUISettings = () => {
    // Apply settings to CSS variables
    document.documentElement.style.setProperty('--primary', uiSettings.primaryColor);
    document.documentElement.style.setProperty('--secondary', uiSettings.secondaryColor);
    document.documentElement.style.setProperty('--accent', uiSettings.accentColor);
    document.documentElement.style.setProperty('--background', uiSettings.backgroundColor);
    document.documentElement.style.setProperty('--foreground', uiSettings.textColor);
    document.documentElement.style.setProperty('--border', uiSettings.borderColor);
    document.documentElement.style.setProperty('--radius', uiSettings.borderRadius);
    
    // Save to localStorage
    localStorage.setItem('uiSettings', JSON.stringify(uiSettings));
    
    toast.success("UI settings saved successfully!");
  };

  const handleSaveEmailSettings = () => {
    localStorage.setItem('emailSettings', JSON.stringify(emailSettings));
    toast.success("Email settings saved successfully!");
  };

  const handleSaveNotificationSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    toast.success("Notification settings saved successfully!");
  };

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      window.location.reload();
      toast.success("Settings reset to defaults!");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">System Settings</h2>
            <p className="text-muted-foreground">
              Complete control over all system components and appearance
            </p>
          </div>
          <Button variant="outline" onClick={handleResetToDefaults}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

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
            <TabsTrigger value="images">
              <Image className="w-4 h-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="w-4 h-4 mr-2" />
              Layout
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
          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
                <CardDescription>Customize the color palette of your entire website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={uiSettings.primaryColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, primaryColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={uiSettings.primaryColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, primaryColor: e.target.value })}
                        placeholder="#3b82f6"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Main brand color for buttons and links</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={uiSettings.secondaryColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, secondaryColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={uiSettings.secondaryColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, secondaryColor: e.target.value })}
                        placeholder="#10b981"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Secondary accent color</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={uiSettings.accentColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, accentColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={uiSettings.accentColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, accentColor: e.target.value })}
                        placeholder="#f59e0b"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Highlight and special elements</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={uiSettings.backgroundColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, backgroundColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={uiSettings.backgroundColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, backgroundColor: e.target.value })}
                        placeholder="#ffffff"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Main background color</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={uiSettings.textColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, textColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={uiSettings.textColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, textColor: e.target.value })}
                        placeholder="#1f2937"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Main text color</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Border Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={uiSettings.borderColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, borderColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={uiSettings.borderColor}
                        onChange={(e) => setUiSettings({ ...uiSettings, borderColor: e.target.value })}
                        placeholder="#e5e7eb"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Borders and dividers</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Lottery Banner Colors</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Lottery Banner Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={uiSettings.lotteryBannerColor}
                          onChange={(e) => setUiSettings({ ...uiSettings, lotteryBannerColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={uiSettings.lotteryBannerColor}
                          onChange={(e) => setUiSettings({ ...uiSettings, lotteryBannerColor: e.target.value })}
                          placeholder="#fbbf24"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Background color for lottery banner</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveUISettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Color Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Typography Settings</CardTitle>
                <CardDescription>Customize fonts and text sizes across the website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Body Font Family</Label>
                    <Input
                      value={uiSettings.fontFamily}
                      onChange={(e) => setUiSettings({ ...uiSettings, fontFamily: e.target.value })}
                      placeholder="Inter, sans-serif"
                    />
                    <p className="text-xs text-muted-foreground">Font for body text</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Heading Font Family</Label>
                    <Input
                      value={uiSettings.headingFontFamily}
                      onChange={(e) => setUiSettings({ ...uiSettings, headingFontFamily: e.target.value })}
                      placeholder="Inter, sans-serif"
                    />
                    <p className="text-xs text-muted-foreground">Font for headings</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Base Font Size</Label>
                    <Input
                      value={uiSettings.fontSize}
                      onChange={(e) => setUiSettings({ ...uiSettings, fontSize: e.target.value })}
                      placeholder="16px"
                    />
                    <p className="text-xs text-muted-foreground">Base text size</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Heading Size</Label>
                    <Input
                      value={uiSettings.headingSize}
                      onChange={(e) => setUiSettings({ ...uiSettings, headingSize: e.target.value })}
                      placeholder="32px"
                    />
                    <p className="text-xs text-muted-foreground">Main heading size</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveUISettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Typography Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Assets</CardTitle>
                <CardDescription>Manage logos, icons, and banner images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={uiSettings.logoUrl}
                      onChange={(e) => setUiSettings({ ...uiSettings, logoUrl: e.target.value })}
                      placeholder="/logo.png"
                    />
                    <p className="text-xs text-muted-foreground">Main site logo</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Favicon URL</Label>
                    <Input
                      value={uiSettings.faviconUrl}
                      onChange={(e) => setUiSettings({ ...uiSettings, faviconUrl: e.target.value })}
                      placeholder="/favicon.ico"
                    />
                    <p className="text-xs text-muted-foreground">Browser tab icon</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Hero Image URL</Label>
                    <Input
                      value={uiSettings.heroImageUrl}
                      onChange={(e) => setUiSettings({ ...uiSettings, heroImageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                    <p className="text-xs text-muted-foreground">Homepage hero section background</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Banner Image URL</Label>
                    <Input
                      value={uiSettings.bannerImageUrl}
                      onChange={(e) => setUiSettings({ ...uiSettings, bannerImageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                    <p className="text-xs text-muted-foreground">Promotional banner image</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveUISettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Image Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Layout & Spacing</CardTitle>
                <CardDescription>Control layout dimensions and spacing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Border Radius</Label>
                    <Input
                      value={uiSettings.borderRadius}
                      onChange={(e) => setUiSettings({ ...uiSettings, borderRadius: e.target.value })}
                      placeholder="0.5rem"
                    />
                    <p className="text-xs text-muted-foreground">Roundness of corners</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Base Spacing</Label>
                    <Input
                      value={uiSettings.spacing}
                      onChange={(e) => setUiSettings({ ...uiSettings, spacing: e.target.value })}
                      placeholder="1rem"
                    />
                    <p className="text-xs text-muted-foreground">Base spacing unit</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Container Width</Label>
                    <Input
                      value={uiSettings.containerWidth}
                      onChange={(e) => setUiSettings({ ...uiSettings, containerWidth: e.target.value })}
                      placeholder="1280px"
                    />
                    <p className="text-xs text-muted-foreground">Maximum content width</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Site Content</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Site Name</Label>
                      <Input
                        value={uiSettings.siteName}
                        onChange={(e) => setUiSettings({ ...uiSettings, siteName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Site Description</Label>
                      <Textarea
                        value={uiSettings.siteDescription}
                        onChange={(e) => setUiSettings({ ...uiSettings, siteDescription: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hero Title</Label>
                      <Input
                        value={uiSettings.heroTitle}
                        onChange={(e) => setUiSettings({ ...uiSettings, heroTitle: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hero Subtitle</Label>
                      <Input
                        value={uiSettings.heroSubtitle}
                        onChange={(e) => setUiSettings({ ...uiSettings, heroSubtitle: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lottery Banner Title</Label>
                      <Input
                        value={uiSettings.lotteryBannerTitle}
                        onChange={(e) => setUiSettings({ ...uiSettings, lotteryBannerTitle: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lottery Banner Subtitle</Label>
                      <Input
                        value={uiSettings.lotteryBannerSubtitle}
                        onChange={(e) => setUiSettings({ ...uiSettings, lotteryBannerSubtitle: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lottery Button Text</Label>
                      <Input
                        value={uiSettings.lotteryButtonText}
                        onChange={(e) => setUiSettings({ ...uiSettings, lotteryButtonText: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Feature Toggles</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Lottery System</Label>
                        <p className="text-xs text-muted-foreground">Show lottery banners and tickets</p>
                      </div>
                      <Switch
                        checked={uiSettings.enableLottery}
                        onCheckedChange={(checked) => setUiSettings({ ...uiSettings, enableLottery: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Product Reviews</Label>
                        <p className="text-xs text-muted-foreground">Allow customers to leave reviews</p>
                      </div>
                      <Switch
                        checked={uiSettings.enableReviews}
                        onCheckedChange={(checked) => setUiSettings({ ...uiSettings, enableReviews: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Wishlist</Label>
                        <p className="text-xs text-muted-foreground">Allow customers to save favorites</p>
                      </div>
                      <Switch
                        checked={uiSettings.enableWishlist}
                        onCheckedChange={(checked) => setUiSettings({ ...uiSettings, enableWishlist: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Newsletter</Label>
                        <p className="text-xs text-muted-foreground">Show newsletter signup</p>
                      </div>
                      <Switch
                        checked={uiSettings.enableNewsletter}
                        onCheckedChange={(checked) => setUiSettings({ ...uiSettings, enableNewsletter: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveUISettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Layout Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure SMTP settings for email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                      placeholder="587"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SMTP Username</Label>
                    <Input
                      value={emailSettings.smtpUser}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                      placeholder="your-email@gmail.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SMTP Password</Label>
                    <Input
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>From Email</Label>
                    <Input
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                      placeholder="noreply@belkhair.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>From Name</Label>
                    <Input
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                      placeholder="Belkhair"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                  <div>
                    <Label>Enable Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send automated emails to customers</p>
                  </div>
                  <Switch
                    checked={emailSettings.enableEmailNotifications}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableEmailNotifications: checked })}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveEmailSettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Email Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control which notifications are sent to customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order Notifications</Label>
                      <p className="text-xs text-muted-foreground">Notify customers about order status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.enableOrderNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enableOrderNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Lottery Notifications</Label>
                      <p className="text-xs text-muted-foreground">Notify winners and send lottery updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.enableLotteryNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enableLotteryNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Promotion Notifications</Label>
                      <p className="text-xs text-muted-foreground">Send promotional emails and offers</p>
                    </div>
                    <Switch
                      checked={notificationSettings.enablePromotionNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enablePromotionNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Stock Alerts</Label>
                      <p className="text-xs text-muted-foreground">Alert admins when products are low in stock</p>
                    </div>
                    <Switch
                      checked={notificationSettings.enableStockAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enableStockAlerts: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotificationSettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
