import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Key,
  Calendar,
  RotateCw,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  History,
} from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  service: string;
  key_preview: string;
  created_at: string;
  expires_at: string | null;
  last_rotated: string | null;
  rotation_frequency: number; // days
  auto_rotate: boolean;
  status: 'active' | 'expiring_soon' | 'expired';
}

interface RotationHistory {
  id: string;
  key_name: string;
  rotated_at: string;
  rotated_by: string;
  method: 'manual' | 'automatic';
  status: 'success' | 'failed';
}

export default function KeyRotationScheduler() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [history, setHistory] = useState<RotationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);

  useEffect(() => {
    loadApiKeys();
    loadRotationHistory();
  }, []);

  const loadApiKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/api-keys', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      } else {
        // Mock data for demonstration
        setApiKeys([
          {
            id: '1',
            name: 'Stripe API Key',
            service: 'Payment Gateway',
            key_preview: 'sk_live_***abc123',
            created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
            expires_at: new Date(Date.now() + 86400000 * 30).toISOString(),
            last_rotated: new Date(Date.now() - 86400000 * 60).toISOString(),
            rotation_frequency: 90,
            auto_rotate: true,
            status: 'expiring_soon',
          },
          {
            id: '2',
            name: 'SendGrid API Key',
            service: 'Email Service',
            key_preview: 'SG.***xyz789',
            created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
            expires_at: new Date(Date.now() + 86400000 * 150).toISOString(),
            last_rotated: new Date(Date.now() - 86400000 * 30).toISOString(),
            rotation_frequency: 180,
            auto_rotate: true,
            status: 'active',
          },
          {
            id: '3',
            name: 'Twilio Auth Token',
            service: 'SMS Service',
            key_preview: '***def456',
            created_at: new Date(Date.now() - 86400000 * 200).toISOString(),
            expires_at: null,
            last_rotated: null,
            rotation_frequency: 90,
            auto_rotate: false,
            status: 'active',
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRotationHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/api-keys/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        // Mock data
        setHistory([
          {
            id: '1',
            key_name: 'Stripe API Key',
            rotated_at: new Date(Date.now() - 86400000 * 60).toISOString(),
            rotated_by: 'admin@belkhair.com',
            method: 'automatic',
            status: 'success',
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load rotation history:', error);
    }
  };

  const rotateKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to rotate this API key? The old key will be invalidated.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/api-keys/${keyId}/rotate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('API key rotated successfully');
        
        // Show new key in dialog
        alert(`New API Key: ${data.new_key}\n\nPlease save this key securely. It will not be shown again.`);
        
        loadApiKeys();
        loadRotationHistory();
      } else {
        toast.error('Failed to rotate API key');
      }
    } catch (error) {
      console.error('Failed to rotate key:', error);
      toast.error('Failed to rotate API key');
    }
  };

  const updateKeySettings = async (keyId: string, settings: Partial<ApiKey>) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/api-keys/${keyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Key settings updated');
        loadApiKeys();
      } else {
        toast.error('Failed to update key settings');
      }
    } catch (error) {
      console.error('Failed to update key settings:', error);
      toast.error('Failed to update key settings');
    }
  };

  const getDaysUntilExpiration = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'expiring_soon':
        return <Badge className="bg-yellow-600">Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-red-600">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getExpirationProgress = (key: ApiKey) => {
    if (!key.expires_at) return 100;
    
    const created = new Date(key.created_at).getTime();
    const expires = new Date(key.expires_at).getTime();
    const now = Date.now();
    
    const total = expires - created;
    const remaining = expires - now;
    
    return Math.max(0, Math.min(100, (remaining / total) * 100));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Key className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading API keys...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Key className="h-6 w-6" />
            API Key Rotation
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage API key expiration and rotation schedules
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Keys</p>
                <p className="text-2xl font-bold">{apiKeys.length}</p>
              </div>
              <Key className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {apiKeys.filter((k) => k.status === 'expiring_soon').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Rotation</p>
                <p className="text-2xl font-bold text-green-600">
                  {apiKeys.filter((k) => k.auto_rotate).length}
                </p>
              </div>
              <RotateCw className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((key) => {
          const daysUntilExpiration = getDaysUntilExpiration(key.expires_at);
          const progress = getExpirationProgress(key);

          return (
            <Card key={key.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {key.name}
                      {getStatusBadge(key.status)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span>{key.service}</span>
                      <span>•</span>
                      <span className="font-mono">{key.key_preview}</span>
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedKey(key)}>
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{key.name}</DialogTitle>
                        <DialogDescription>Manage rotation settings and schedule</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Rotation Frequency (days)</Label>
                          <Input
                            type="number"
                            defaultValue={key.rotation_frequency}
                            onChange={(e) =>
                              updateKeySettings(key.id, {
                                rotation_frequency: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Automatic Rotation</Label>
                          <input
                            type="checkbox"
                            checked={key.auto_rotate}
                            onChange={(e) =>
                              updateKeySettings(key.id, { auto_rotate: e.target.checked })
                            }
                          />
                        </div>
                        <Button onClick={() => rotateKey(key.id)} className="w-full">
                          <RotateCw className="mr-2 h-4 w-4" />
                          Rotate Key Now
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time Until Expiration</span>
                    <span className="font-medium">
                      {daysUntilExpiration !== null
                        ? `${daysUntilExpiration} days`
                        : 'No expiration'}
                    </span>
                  </div>
                  {key.expires_at && (
                    <Progress
                      value={progress}
                      className={`h-2 ${
                        progress < 20
                          ? '[&>div]:bg-red-600'
                          : progress < 50
                          ? '[&>div]:bg-yellow-600'
                          : '[&>div]:bg-green-600'
                      }`}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(key.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Rotated</p>
                    <p className="font-medium">
                      {key.last_rotated
                        ? new Date(key.last_rotated).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rotation Frequency</p>
                    <p className="font-medium">{key.rotation_frequency} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Auto-Rotation</p>
                    <p className="font-medium">{key.auto_rotate ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>

                {key.status === 'expiring_soon' && (
                  <Alert>
                    <Bell className="h-4 w-4" />
                    <AlertDescription>
                      This key will expire in {daysUntilExpiration} days. Consider rotating it
                      soon.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => rotateKey(key.id)}
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  Rotate Key
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rotation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Rotation History
          </CardTitle>
          <CardDescription>Recent API key rotation events</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No rotation history available
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{event.key_name}</p>
                      {event.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <Badge variant={event.method === 'automatic' ? 'default' : 'secondary'}>
                        {event.method}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.rotated_at).toLocaleString()}
                      </span>
                      <span>By: {event.rotated_by}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
