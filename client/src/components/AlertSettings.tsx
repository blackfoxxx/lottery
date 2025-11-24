import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bell,
  Mail,
  Plus,
  Trash2,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface AlertRule {
  id: string;
  service: string;
  condition: 'down' | 'degraded' | 'slow_response';
  threshold: number;
  enabled: boolean;
}

interface AlertRecipient {
  id: string;
  email: string;
  role: string;
  priority: 'high' | 'medium' | 'low';
}

interface AlertHistory {
  id: string;
  timestamp: string;
  service: string;
  condition: string;
  message: string;
  recipients: string[];
  status: 'sent' | 'failed';
}

export default function AlertSettings() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [recipients, setRecipients] = useState<AlertRecipient[]>([
    {
      id: '1',
      email: 'admin@belkhair.com',
      role: 'Administrator',
      priority: 'high',
    },
  ]);
  const [rules, setRules] = useState<AlertRule[]>([
    {
      id: '1',
      service: 'Payment Gateway',
      condition: 'down',
      threshold: 0,
      enabled: true,
    },
    {
      id: '2',
      service: 'Email Service',
      condition: 'slow_response',
      threshold: 500,
      enabled: true,
    },
  ]);
  const [history, setHistory] = useState<AlertHistory[]>([]);
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientRole, setNewRecipientRole] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAlertSettings();
    loadAlertHistory();
  }, []);

  const loadAlertSettings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/alerts/settings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAlertsEnabled(data.enabled);
        setRecipients(data.recipients || []);
        setRules(data.rules || []);
      }
    } catch (error) {
      console.error('Failed to load alert settings:', error);
    }
  };

  const loadAlertHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/alerts/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        // Mock data for demonstration
        setHistory([
          {
            id: '1',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            service: 'SMS Service',
            condition: 'degraded',
            message: 'Response time exceeded 500ms threshold',
            recipients: ['admin@belkhair.com'],
            status: 'sent',
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load alert history:', error);
    }
  };

  const saveAlertSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/alerts/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          enabled: alertsEnabled,
          recipients,
          rules,
        }),
      });

      if (response.ok) {
        toast.success('Alert settings saved successfully');
      } else {
        toast.error('Failed to save alert settings');
      }
    } catch (error) {
      console.error('Failed to save alert settings:', error);
      toast.error('Failed to save alert settings');
    } finally {
      setLoading(false);
    }
  };

  const addRecipient = () => {
    if (!newRecipientEmail || !newRecipientRole) {
      toast.error('Please enter email and role');
      return;
    }

    const newRecipient: AlertRecipient = {
      id: Date.now().toString(),
      email: newRecipientEmail,
      role: newRecipientRole,
      priority: 'medium',
    };

    setRecipients([...recipients, newRecipient]);
    setNewRecipientEmail('');
    setNewRecipientRole('');
    toast.success('Recipient added');
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter((r) => r.id !== id));
    toast.success('Recipient removed');
  };

  const toggleRule = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const sendTestAlert = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/alerts/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ recipients: recipients.map((r) => r.email) }),
      });

      if (response.ok) {
        toast.success('Test alert sent successfully');
      } else {
        toast.error('Failed to send test alert');
      }
    } catch (error) {
      console.error('Failed to send test alert:', error);
      toast.error('Failed to send test alert');
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'down':
        return 'Service Down';
      case 'degraded':
        return 'Service Degraded';
      case 'slow_response':
        return 'Slow Response Time';
      default:
        return condition;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-600">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-600">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="secondary">Low Priority</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Alert Settings
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure email notifications for service failures
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="alerts-enabled">Alerts Enabled</Label>
            <Switch
              id="alerts-enabled"
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
            />
          </div>
          <Button onClick={saveAlertSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {!alertsEnabled && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Alerts are currently disabled. Enable them to receive notifications about service
            failures.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Recipients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Alert Recipients
            </CardTitle>
            <CardDescription>Manage who receives alert notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{recipient.email}</p>
                    <p className="text-sm text-muted-foreground">{recipient.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(recipient.priority)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRecipient(recipient.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t space-y-2">
              <Label>Add New Recipient</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Email address"
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                />
                <Input
                  placeholder="Role"
                  value={newRecipientRole}
                  onChange={(e) => setNewRecipientRole(e.target.value)}
                />
                <Button onClick={addRecipient}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={sendTestAlert}>
              <Send className="mr-2 h-4 w-4" />
              Send Test Alert
            </Button>
          </CardContent>
        </Card>

        {/* Alert Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alert Rules
            </CardTitle>
            <CardDescription>Configure when alerts should be triggered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{rule.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {getConditionLabel(rule.condition)}
                      {rule.condition === 'slow_response' && ` (>${rule.threshold}ms)`}
                    </p>
                  </div>
                  <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Alert History
          </CardTitle>
          <CardDescription>Recent alert notifications sent</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No alerts have been sent yet
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{alert.service}</p>
                      {alert.status === 'sent' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      <span>Sent to: {alert.recipients.join(', ')}</span>
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
