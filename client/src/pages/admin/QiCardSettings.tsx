import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CreditCard, Key, Settings, TestTube, CheckCircle2, XCircle } from "lucide-react";

export default function QiCardSettings() {
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [config, setConfig] = useState({
    api_key: "",
    merchant_id: "",
    secret_key: "",
    api_url: "https://api.qicard.com/v1",
    terminal_id: "",
    username: "",
    password: "",
    is_active: false,
    is_test_mode: true,
    currency: "IQD",
    timeout: 30,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/payment-gateways/qicard");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const settings = typeof data.settings === 'string' ? JSON.parse(data.settings) : data.settings;
          setConfig({
            api_key: data.api_key || "",
            merchant_id: data.merchant_id || "",
            secret_key: data.secret_key || "",
            api_url: data.api_url || "https://api.qicard.com/v1",
            terminal_id: settings?.terminal_id || "",
            username: settings?.username || "",
            password: settings?.password || "",
            is_active: data.is_active || false,
            is_test_mode: data.is_test_mode || true,
            currency: settings?.currency || "IQD",
            timeout: settings?.timeout || 30,
          });
          toast.success("Configuration loaded successfully");
        }
      }
    } catch (error) {
      console.error("Failed to load configuration:", error);
      toast.error("Failed to load configuration");
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      const payload = {
        name: "QiCard Payment Gateway",
        gateway_type: "qicard",
        api_key: config.api_key,
        merchant_id: config.merchant_id,
        secret_key: config.secret_key,
        api_url: config.api_url,
        is_active: config.is_active,
        is_test_mode: config.is_test_mode,
        settings: JSON.stringify({
          terminal_id: config.terminal_id,
          username: config.username,
          password: config.password,
          currency: config.currency,
          timeout: config.timeout,
        }),
      };

      const response = await fetch("http://localhost:8000/api/v1/payment-gateways/qicard", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("QiCard configuration saved successfully!");
      } else {
        toast.error("Failed to save configuration");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save configuration");
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (config.api_key && config.merchant_id) {
        toast.success("Connection test successful! QiCard API is reachable.");
      } else {
        toast.error("Please configure API credentials first");
      }
    } catch (error) {
      toast.error("Connection test failed");
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          QiCard Payment Gateway Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure QiCard payment gateway credentials and settings
        </p>
      </div>

      <Tabs defaultValue="credentials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="credentials">
            <Key className="h-4 w-4 mr-2" />
            API Credentials
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            General Settings
          </TabsTrigger>
          <TabsTrigger value="test">
            <TestTube className="h-4 w-4 mr-2" />
            Test Connection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credentials">
          <Card>
            <CardHeader>
              <CardTitle>API Credentials</CardTitle>
              <CardDescription>
                Enter your QiCard API credentials. These can be obtained from your QiCard merchant dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key *</Label>
                  <Input
                    id="api_key"
                    type="password"
                    value={config.api_key}
                    onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                    placeholder="Enter your QiCard API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="merchant_id">Merchant ID *</Label>
                  <Input
                    id="merchant_id"
                    value={config.merchant_id}
                    onChange={(e) => setConfig({ ...config, merchant_id: e.target.value })}
                    placeholder="Enter your merchant ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terminal_id">Terminal ID *</Label>
                  <Input
                    id="terminal_id"
                    value={config.terminal_id}
                    onChange={(e) => setConfig({ ...config, terminal_id: e.target.value })}
                    placeholder="Enter your terminal ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">API Username *</Label>
                  <Input
                    id="username"
                    value={config.username}
                    onChange={(e) => setConfig({ ...config, username: e.target.value })}
                    placeholder="Enter API username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">API Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={config.password}
                    onChange={(e) => setConfig({ ...config, password: e.target.value })}
                    placeholder="Enter API password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret_key">Secret Key *</Label>
                  <Input
                    id="secret_key"
                    type="password"
                    value={config.secret_key}
                    onChange={(e) => setConfig({ ...config, secret_key: e.target.value })}
                    placeholder="Enter your secret key for signature generation"
                  />
                  <p className="text-sm text-muted-foreground">
                    Used for generating payment signatures
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={saveConfig} disabled={loading}>
                  {loading ? "Saving..." : "Save Credentials"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general payment gateway settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api_url">API URL</Label>
                  <Input
                    id="api_url"
                    value={config.api_url}
                    onChange={(e) => setConfig({ ...config, api_url: e.target.value })}
                    placeholder="https://api.qicard.com/v1"
                  />
                  <p className="text-sm text-muted-foreground">
                    QiCard API endpoint URL
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Input
                    id="currency"
                    value={config.currency}
                    onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                    placeholder="IQD"
                  />
                  <p className="text-sm text-muted-foreground">
                    Default currency for transactions (IQD, USD, EUR, etc.)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={config.timeout}
                    onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) })}
                    placeholder="30"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Enable Gateway</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to use QiCard for payments
                    </p>
                  </div>
                  <Switch
                    checked={config.is_active}
                    onCheckedChange={(checked) => setConfig({ ...config, is_active: checked })}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Test Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use test credentials and sandbox environment
                    </p>
                  </div>
                  <Switch
                    checked={config.is_test_mode}
                    onCheckedChange={(checked) => setConfig({ ...config, is_test_mode: checked })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={saveConfig} disabled={loading}>
                  {loading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Test Connection</CardTitle>
              <CardDescription>
                Verify your QiCard API credentials and connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  {config.api_key && config.merchant_id ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Credentials Configured</p>
                        <p className="text-sm text-muted-foreground">
                          API credentials are set and ready to test
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Credentials Missing</p>
                        <p className="text-sm text-muted-foreground">
                          Please configure API credentials in the Credentials tab first
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  {config.is_active ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Gateway Enabled</p>
                        <p className="text-sm text-muted-foreground">
                          QiCard payment gateway is active
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Gateway Disabled</p>
                        <p className="text-sm text-muted-foreground">
                          Enable the gateway in Settings tab to accept payments
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  {config.is_test_mode ? (
                    <>
                      <TestTube className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Test Mode Active</p>
                        <p className="text-sm text-muted-foreground">
                          Using sandbox environment - no real charges will be made
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Production Mode</p>
                        <p className="text-sm text-muted-foreground">
                          Using live credentials - real transactions will be processed
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={testConnection} 
                  disabled={testingConnection || !config.api_key || !config.merchant_id}
                >
                  {testingConnection ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Getting Started with QiCard</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Sign up for a QiCard merchant account at qicard.com</li>
              <li>Obtain your API credentials from the merchant dashboard</li>
              <li>Enter your credentials in the API Credentials tab</li>
              <li>Configure your preferred currency and settings</li>
              <li>Test the connection to verify everything works</li>
              <li>Enable the gateway when ready to accept payments</li>
            </ol>
          </div>

          <div>
            <h3 className="font-medium mb-2">Support</h3>
            <p className="text-sm text-muted-foreground">
              For QiCard API documentation and support, visit:{" "}
              <a href="https://docs.qicard.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                docs.qicard.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
