import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Key,
  Mail,
  CreditCard,
  Database,
  Cloud,
  Bell,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import ConfigurationTemplates from '@/components/ConfigurationTemplates';
import ConfigurationHistory from '@/components/ConfigurationHistory';
import HealthMonitoring from '@/components/HealthMonitoring';

interface EnvVariable {
  key: string;
  value: string;
  description: string;
  required: boolean;
  category: string;
  sensitive: boolean;
}

interface EnvCategory {
  name: string;
  icon: React.ReactNode;
  variables: EnvVariable[];
}

export default function EnvironmentSettings() {
  const [envVariables, setEnvVariables] = useState<Record<string, string>>({});
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const envCategories: EnvCategory[] = [
    {
      name: 'Payment Gateways',
      icon: <CreditCard className="h-5 w-5" />,
      variables: [
        {
          key: 'STRIPE_PUBLIC_KEY',
          value: '',
          description: 'Stripe publishable API key for payment processing',
          required: true,
          category: 'payment',
          sensitive: false,
        },
        {
          key: 'STRIPE_SECRET_KEY',
          value: '',
          description: 'Stripe secret API key (keep confidential)',
          required: true,
          category: 'payment',
          sensitive: true,
        },
        {
          key: 'PAYPAL_CLIENT_ID',
          value: '',
          description: 'PayPal client ID for payment integration',
          required: false,
          category: 'payment',
          sensitive: false,
        },
        {
          key: 'PAYPAL_SECRET',
          value: '',
          description: 'PayPal secret key',
          required: false,
          category: 'payment',
          sensitive: true,
        },
      ],
    },
    {
      name: 'Email Service',
      icon: <Mail className="h-5 w-5" />,
      variables: [
        {
          key: 'MAIL_DRIVER',
          value: 'smtp',
          description: 'Mail driver (smtp, sendmail, mailgun, etc.)',
          required: true,
          category: 'email',
          sensitive: false,
        },
        {
          key: 'MAIL_HOST',
          value: '',
          description: 'SMTP server hostname',
          required: true,
          category: 'email',
          sensitive: false,
        },
        {
          key: 'MAIL_PORT',
          value: '587',
          description: 'SMTP server port',
          required: true,
          category: 'email',
          sensitive: false,
        },
        {
          key: 'MAIL_USERNAME',
          value: '',
          description: 'SMTP username',
          required: true,
          category: 'email',
          sensitive: false,
        },
        {
          key: 'MAIL_PASSWORD',
          value: '',
          description: 'SMTP password',
          required: true,
          category: 'email',
          sensitive: true,
        },
        {
          key: 'MAIL_FROM_ADDRESS',
          value: '',
          description: 'Default sender email address',
          required: true,
          category: 'email',
          sensitive: false,
        },
        {
          key: 'MAIL_FROM_NAME',
          value: 'Belkhair',
          description: 'Default sender name',
          required: true,
          category: 'email',
          sensitive: false,
        },
      ],
    },
    {
      name: 'SMS Service',
      icon: <Bell className="h-5 w-5" />,
      variables: [
        {
          key: 'TWILIO_ACCOUNT_SID',
          value: '',
          description: 'Twilio account SID for SMS notifications',
          required: false,
          category: 'sms',
          sensitive: false,
        },
        {
          key: 'TWILIO_AUTH_TOKEN',
          value: '',
          description: 'Twilio authentication token',
          required: false,
          category: 'sms',
          sensitive: true,
        },
        {
          key: 'TWILIO_PHONE_NUMBER',
          value: '',
          description: 'Twilio phone number',
          required: false,
          category: 'sms',
          sensitive: false,
        },
      ],
    },
    {
      name: 'Cloud Storage',
      icon: <Cloud className="h-5 w-5" />,
      variables: [
        {
          key: 'AWS_ACCESS_KEY_ID',
          value: '',
          description: 'AWS access key for S3 storage',
          required: false,
          category: 'storage',
          sensitive: false,
        },
        {
          key: 'AWS_SECRET_ACCESS_KEY',
          value: '',
          description: 'AWS secret access key',
          required: false,
          category: 'storage',
          sensitive: true,
        },
        {
          key: 'AWS_DEFAULT_REGION',
          value: 'us-east-1',
          description: 'AWS region',
          required: false,
          category: 'storage',
          sensitive: false,
        },
        {
          key: 'AWS_BUCKET',
          value: '',
          description: 'S3 bucket name',
          required: false,
          category: 'storage',
          sensitive: false,
        },
      ],
    },
    {
      name: 'Database',
      icon: <Database className="h-5 w-5" />,
      variables: [
        {
          key: 'DB_CONNECTION',
          value: 'mysql',
          description: 'Database driver',
          required: true,
          category: 'database',
          sensitive: false,
        },
        {
          key: 'DB_HOST',
          value: '127.0.0.1',
          description: 'Database host',
          required: true,
          category: 'database',
          sensitive: false,
        },
        {
          key: 'DB_PORT',
          value: '3306',
          description: 'Database port',
          required: true,
          category: 'database',
          sensitive: false,
        },
        {
          key: 'DB_DATABASE',
          value: '',
          description: 'Database name',
          required: true,
          category: 'database',
          sensitive: false,
        },
        {
          key: 'DB_USERNAME',
          value: '',
          description: 'Database username',
          required: true,
          category: 'database',
          sensitive: false,
        },
        {
          key: 'DB_PASSWORD',
          value: '',
          description: 'Database password',
          required: true,
          category: 'database',
          sensitive: true,
        },
      ],
    },
    {
      name: 'Security & Authentication',
      icon: <Lock className="h-5 w-5" />,
      variables: [
        {
          key: 'APP_KEY',
          value: '',
          description: 'Application encryption key (auto-generated)',
          required: true,
          category: 'security',
          sensitive: true,
        },
        {
          key: 'JWT_SECRET',
          value: '',
          description: 'JWT token secret key',
          required: true,
          category: 'security',
          sensitive: true,
        },
        {
          key: 'SESSION_LIFETIME',
          value: '120',
          description: 'Session lifetime in minutes',
          required: true,
          category: 'security',
          sensitive: false,
        },
      ],
    },
    {
      name: 'API Keys',
      icon: <Key className="h-5 w-5" />,
      variables: [
        {
          key: 'GOOGLE_MAPS_API_KEY',
          value: '',
          description: 'Google Maps API key',
          required: false,
          category: 'api',
          sensitive: true,
        },
        {
          key: 'FIREBASE_API_KEY',
          value: '',
          description: 'Firebase API key for push notifications',
          required: false,
          category: 'api',
          sensitive: true,
        },
        {
          key: 'EXPO_PUSH_TOKEN',
          value: '',
          description: 'Expo push notification token',
          required: false,
          category: 'api',
          sensitive: true,
        },
      ],
    },
  ];

  useEffect(() => {
    loadEnvironmentVariables();
  }, []);

  const loadEnvironmentVariables = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/environment', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEnvVariables(data);
      }
    } catch (error) {
      console.error('Failed to load environment variables:', error);
      toast.error('Failed to load environment settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setEnvVariables((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const toggleSecretVisibility = (key: string) => {
    setVisibleSecrets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/environment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(envVariables),
      });

      if (response.ok) {
        toast.success('Environment settings saved successfully');
        setHasChanges(false);
      } else {
        toast.error('Failed to save environment settings');
      }
    } catch (error) {
      console.error('Failed to save environment variables:', error);
      toast.error('Failed to save environment settings');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (category: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/environment/test/${category}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify(envVariables),
        }
      );

      if (response.ok) {
        toast.success(`${category} connection test successful`);
      } else {
        const data = await response.json();
        toast.error(data.message || `${category} connection test failed`);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('Connection test failed');
    }
  };

  const renderVariableInput = (variable: EnvVariable) => {
    const value = envVariables[variable.key] || variable.value;
    const isVisible = visibleSecrets.has(variable.key);
    const isEmpty = !value;

    return (
      <div key={variable.key} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={variable.key} className="flex items-center gap-2">
            {variable.key}
            {variable.required && <Badge variant="destructive">Required</Badge>}
            {variable.sensitive && <Lock className="h-3 w-3 text-muted-foreground" />}
          </Label>
          {isEmpty && variable.required && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
          {!isEmpty && <CheckCircle className="h-4 w-4 text-green-600" />}
        </div>
        <p className="text-sm text-muted-foreground">{variable.description}</p>
        <div className="relative">
          <Input
            id={variable.key}
            type={variable.sensitive && !isVisible ? 'password' : 'text'}
            value={value}
            onChange={(e) => handleChange(variable.key, e.target.value)}
            placeholder={`Enter ${variable.key}`}
            className="pr-10"
          />
          {variable.sensitive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => toggleSecretVisibility(variable.key)}
            >
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Settings className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading environment settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Environment Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Configure API keys, database connections, and service integrations
            </p>
          </div>
          <Button onClick={handleSave} disabled={!hasChanges || saving} size="lg">
            <Save className="mr-2 h-5 w-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {hasChanges && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. Click "Save Changes" to apply your configuration.
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Notice:</strong> Sensitive values are encrypted and stored securely.
            Never share API keys or secrets publicly.
          </AlertDescription>
        </Alert>

        {/* Configuration Templates */}
        <ConfigurationTemplates
          onApplyTemplate={(config) => {
            setEnvVariables((prev) => ({ ...prev, ...config }));
            setHasChanges(true);
          }}
        />

        {/* Health Monitoring */}
        <HealthMonitoring />

        {/* Configuration History */}
        <ConfigurationHistory
          onRollback={(version) => {
            loadEnvironmentVariables();
          }}
        />

        <Tabs defaultValue="payment" className="space-y-6">
          <TabsList className="grid grid-cols-7 w-full">
            {envCategories.map((category) => (
              <TabsTrigger key={category.name} value={category.name.toLowerCase().replace(/ /g, '-')}>
                <span className="flex items-center gap-2">
                  {category.icon}
                  <span className="hidden lg:inline">{category.name}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {envCategories.map((category) => (
            <TabsContent
              key={category.name}
              value={category.name.toLowerCase().replace(/ /g, '-')}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.icon}
                    {category.name}
                  </CardTitle>
                  <CardDescription>
                    Configure {category.name.toLowerCase()} settings and credentials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {category.variables.map(renderVariableInput)}

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() =>
                        testConnection(category.name.toLowerCase().replace(/ /g, '-'))
                      }
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
