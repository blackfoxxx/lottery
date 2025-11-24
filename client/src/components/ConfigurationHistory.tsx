import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { History, RotateCcw, User, Clock, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ConfigChange {
  id: string;
  timestamp: string;
  user: string;
  action: 'update' | 'rollback' | 'template_applied';
  changes: Array<{
    key: string;
    old_value: string;
    new_value: string;
  }>;
  version: string;
}

interface ConfigurationHistoryProps {
  onRollback: (version: string) => void;
}

export default function ConfigurationHistory({ onRollback }: ConfigurationHistoryProps) {
  const [history, setHistory] = useState<ConfigChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChange, setSelectedChange] = useState<ConfigChange | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/environment/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to load configuration history:', error);
      // Mock data for demonstration
      setHistory([
        {
          id: '1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'admin@belkhair.com',
          action: 'update',
          changes: [
            {
              key: 'STRIPE_SECRET_KEY',
              old_value: 'sk_test_old***',
              new_value: 'sk_test_new***',
            },
            {
              key: 'MAIL_HOST',
              old_value: 'smtp.gmail.com',
              new_value: 'smtp.sendgrid.net',
            },
          ],
          version: 'v1.2.3',
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          user: 'admin@belkhair.com',
          action: 'template_applied',
          changes: [
            {
              key: 'APP_ENV',
              old_value: 'local',
              new_value: 'production',
            },
            {
              key: 'APP_DEBUG',
              old_value: 'true',
              new_value: 'false',
            },
          ],
          version: 'v1.2.2',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (change: ConfigChange) => {
    if (
      !confirm(
        `Are you sure you want to rollback to version ${change.version}? This will restore ${change.changes.length} configuration values.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/environment/rollback/${change.version}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (response.ok) {
        toast.success(`Rolled back to version ${change.version}`);
        onRollback(change.version);
        loadHistory();
      } else {
        toast.error('Failed to rollback configuration');
      }
    } catch (error) {
      console.error('Rollback failed:', error);
      toast.error('Failed to rollback configuration');
    }
  };

  const exportAuditLog = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Version', 'Changes'],
      ...history.map((change) => [
        change.timestamp,
        change.user,
        change.action,
        change.version,
        change.changes.length.toString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-audit-log-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Audit log exported');
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'update':
        return <Badge variant="default">Update</Badge>;
      case 'rollback':
        return <Badge variant="destructive">Rollback</Badge>;
      case 'template_applied':
        return <Badge variant="secondary">Template Applied</Badge>;
      default:
        return <Badge>{action}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <History className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading configuration history...</p>
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
            <History className="h-6 w-6" />
            Configuration History
          </h2>
          <p className="text-muted-foreground mt-1">
            View and rollback configuration changes
          </p>
        </div>
        <Button variant="outline" onClick={exportAuditLog}>
          <FileText className="mr-2 h-4 w-4" />
          Export Audit Log
        </Button>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No configuration changes yet</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((change) => (
            <Card key={change.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getActionBadge(change.action)}
                        <span className="text-sm font-mono text-muted-foreground">
                          {change.version}
                        </span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {change.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(change.timestamp)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedChange(change)}
                        >
                          View Changes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Configuration Changes - {change.version}</DialogTitle>
                          <DialogDescription>
                            {change.changes.length} variable{change.changes.length !== 1 ? 's' : ''}{' '}
                            changed by {change.user}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {change.changes.map((item, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">{item.key}</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Old Value</p>
                                  <code className="text-sm bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                                    {item.old_value || '<empty>'}
                                  </code>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">New Value</p>
                                  <code className="text-sm bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                    {item.new_value || '<empty>'}
                                  </code>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRollback(change)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Rollback
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{change.changes.length} configuration changes</span>
                  <span>•</span>
                  <span>
                    {change.changes.map((c) => c.key).slice(0, 3).join(', ')}
                    {change.changes.length > 3 && ` +${change.changes.length - 3} more`}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Warning:</strong> Rolling back configuration will immediately update your .env
          file and restart services. Make sure to backup current configuration before rolling back.
        </AlertDescription>
      </Alert>
    </div>
  );
}
