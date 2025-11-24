import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Webhook,
  Plus,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  enabled: boolean;
  created_at: string;
  last_triggered: string | null;
}

interface WebhookEvent {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: any;
  response_status: number | null;
  response_body: string | null;
  triggered_at: string;
  status: 'success' | 'failed' | 'pending';
  retry_count: number;
}

const EVENT_TYPES = [
  { value: 'order.created', label: 'Order Created' },
  { value: 'order.updated', label: 'Order Updated' },
  { value: 'order.cancelled', label: 'Order Cancelled' },
  { value: 'payment.completed', label: 'Payment Completed' },
  { value: 'payment.failed', label: 'Payment Failed' },
  { value: 'inventory.low', label: 'Low Inventory Alert' },
  { value: 'inventory.out', label: 'Out of Stock' },
  { value: 'user.registered', label: 'User Registered' },
  { value: 'review.submitted', label: 'Review Submitted' },
  { value: 'system.error', label: 'System Error' },
];

export default function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [history, setHistory] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
  });

  useEffect(() => {
    loadWebhooks();
    loadHistory();
  }, []);

  const loadWebhooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/webhooks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWebhooks(data);
      } else {
        // Mock data
        setWebhooks([
          {
            id: '1',
            name: 'Slack Notifications',
            url: 'https://hooks.slack.com/services/xxx/yyy/zzz',
            secret: 'whsec_***abc123',
            events: ['order.created', 'payment.completed'],
            enabled: true,
            created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
            last_triggered: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/webhooks/history', {
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
            webhook_id: '1',
            event_type: 'order.created',
            payload: { order_id: '12345', total: 299.99 },
            response_status: 200,
            response_body: 'OK',
            triggered_at: new Date(Date.now() - 3600000).toISOString(),
            status: 'success',
            retry_count: 0,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load webhook history:', error);
    }
  };

  const createWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(newWebhook),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Webhook created successfully');
        setShowCreateDialog(false);
        setNewWebhook({ name: '', url: '', events: [] });
        loadWebhooks();
        
        // Show secret key
        alert(`Webhook Secret: ${data.secret}\n\nPlease save this secret key securely. It will not be shown again.`);
      } else {
        toast.error('Failed to create webhook');
      }
    } catch (error) {
      console.error('Failed to create webhook:', error);
      toast.error('Failed to create webhook');
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/webhooks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        toast.success('Webhook deleted');
        loadWebhooks();
      } else {
        toast.error('Failed to delete webhook');
      }
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      toast.error('Failed to delete webhook');
    }
  };

  const toggleWebhook = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/webhooks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        toast.success(`Webhook ${enabled ? 'enabled' : 'disabled'}`);
        loadWebhooks();
      } else {
        toast.error('Failed to update webhook');
      }
    } catch (error) {
      console.error('Failed to update webhook:', error);
      toast.error('Failed to update webhook');
    }
  };

  const testWebhook = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/webhooks/${id}/test`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        toast.success('Test webhook sent successfully');
        loadHistory();
      } else {
        toast.error('Failed to send test webhook');
      }
    } catch (error) {
      console.error('Failed to test webhook:', error);
      toast.error('Failed to send test webhook');
    }
  };

  const retryWebhook = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/webhooks/events/${eventId}/retry`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        toast.success('Webhook retry initiated');
        loadHistory();
      } else {
        toast.error('Failed to retry webhook');
      }
    } catch (error) {
      console.error('Failed to retry webhook:', error);
      toast.error('Failed to retry webhook');
    }
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    toast.success('Secret copied to clipboard');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-600">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Webhook className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading webhooks...</p>
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
            <Webhook className="h-6 w-6" />
            Webhook Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure webhooks to receive real-time notifications
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
              <DialogDescription>
                Configure a webhook endpoint to receive event notifications
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Webhook Name</Label>
                <Input
                  placeholder="e.g., Slack Notifications"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Webhook URL</Label>
                <Input
                  placeholder="https://your-app.com/webhooks"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                />
              </div>
              <div>
                <Label>Events to Subscribe</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {EVENT_TYPES.map((event) => (
                    <div key={event.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={event.value}
                        checked={newWebhook.events.includes(event.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewWebhook({
                              ...newWebhook,
                              events: [...newWebhook.events, event.value],
                            });
                          } else {
                            setNewWebhook({
                              ...newWebhook,
                              events: newWebhook.events.filter((ev) => ev !== event.value),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={event.value} className="cursor-pointer">
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={createWebhook} className="w-full">
                Create Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Webhooks</p>
                <p className="text-2xl font-bold">{webhooks.length}</p>
              </div>
              <Webhook className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {webhooks.filter((w) => w.enabled).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events Today</p>
                <p className="text-2xl font-bold">{history.length}</p>
              </div>
              <Send className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {webhook.name}
                    {webhook.enabled ? (
                      <Badge className="bg-green-600">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <code className="text-xs">{webhook.url}</code>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={webhook.enabled}
                    onCheckedChange={(enabled) => toggleWebhook(webhook.id, enabled)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testWebhook(webhook.id)}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteWebhook(webhook.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Secret Key</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm px-2 py-1 bg-muted rounded flex-1">
                    {webhook.secret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copySecret(webhook.secret)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Subscribed Events</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {webhook.events.map((event) => (
                    <Badge key={event} variant="outline">
                      {EVENT_TYPES.find((e) => e.value === event)?.label || event}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(webhook.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Triggered</p>
                  <p className="font-medium">
                    {webhook.last_triggered
                      ? new Date(webhook.last_triggered).toLocaleString()
                      : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delivery History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Delivery History
          </CardTitle>
          <CardDescription>Recent webhook delivery attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No webhook events yet
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">
                        {EVENT_TYPES.find((e) => e.value === event.event_type)?.label ||
                          event.event_type}
                      </p>
                      {getStatusBadge(event.status)}
                      {event.response_status && (
                        <Badge variant="outline">HTTP {event.response_status}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span>{new Date(event.triggered_at).toLocaleString()}</span>
                      {event.retry_count > 0 && <span>Retries: {event.retry_count}</span>}
                    </div>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted-foreground">
                        View payload
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </details>
                  </div>
                  {event.status === 'failed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => retryWebhook(event.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
