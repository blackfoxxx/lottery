import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Database,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface Backup {
  id: string;
  name: string;
  type: 'manual' | 'automatic';
  size: number;
  created_at: string;
  created_by: string;
  status: 'completed' | 'in_progress' | 'failed';
  verified: boolean;
  tables_count: number;
  records_count: number;
}

interface BackupSchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  retention_days: number;
  last_run: string | null;
  next_run: string | null;
}

export default function BackupManagement() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [schedule, setSchedule] = useState<BackupSchedule>({
    enabled: true,
    frequency: 'daily',
    time: '02:00',
    retention_days: 30,
    last_run: null,
    next_run: null,
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadBackups();
    loadSchedule();
  }, []);

  const loadBackups = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/backups', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBackups(data);
      } else {
        // Mock data
        setBackups([
          {
            id: '1',
            name: 'backup-2025-01-25-02-00',
            type: 'automatic',
            size: 524288000, // 500 MB
            created_at: new Date(Date.now() - 86400000).toISOString(),
            created_by: 'System',
            status: 'completed',
            verified: true,
            tables_count: 45,
            records_count: 125000,
          },
          {
            id: '2',
            name: 'backup-manual-2025-01-24',
            type: 'manual',
            size: 520192000, // 496 MB
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            created_by: 'admin@belkhair.com',
            status: 'completed',
            verified: true,
            tables_count: 45,
            records_count: 124500,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/backups/schedule', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSchedule(data);
      } else {
        // Mock data
        setSchedule({
          enabled: true,
          frequency: 'daily',
          time: '02:00',
          retention_days: 30,
          last_run: new Date(Date.now() - 86400000).toISOString(),
          next_run: new Date(Date.now() + 3600000 * 10).toISOString(),
        });
      }
    } catch (error) {
      console.error('Failed to load schedule:', error);
    }
  };

  const createBackup = async () => {
    setCreating(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/backups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ type: 'manual' }),
      });

      if (response.ok) {
        toast.success('Backup created successfully');
        loadBackups();
      } else {
        toast.error('Failed to create backup');
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setCreating(false);
    }
  };

  const restoreBackup = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to restore backup "${name}"?\n\nThis will replace all current data with the backup data. This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/backups/${id}/restore`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        toast.success('Backup restored successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error('Failed to restore backup');
      }
    } catch (error) {
      console.error('Failed to restore backup:', error);
      toast.error('Failed to restore backup');
    }
  };

  const downloadBackup = async (id: string, name: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/backups/${id}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.sql`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Backup downloaded');
      } else {
        toast.error('Failed to download backup');
      }
    } catch (error) {
      console.error('Failed to download backup:', error);
      toast.error('Failed to download backup');
    }
  };

  const deleteBackup = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete backup "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/backups/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        toast.success('Backup deleted');
        loadBackups();
      } else {
        toast.error('Failed to delete backup');
      }
    } catch (error) {
      console.error('Failed to delete backup:', error);
      toast.error('Failed to delete backup');
    }
  };

  const updateSchedule = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/backups/schedule', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(schedule),
      });

      if (response.ok) {
        toast.success('Backup schedule updated');
        loadSchedule();
      } else {
        toast.error('Failed to update schedule');
      }
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast.error('Failed to update schedule');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-600">In Progress</Badge>;
      case 'failed':
        return <Badge className="bg-red-600">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalBackupSize = backups.reduce((sum, backup) => sum + backup.size, 0);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Database className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading backups...</p>
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
            <Database className="h-6 w-6" />
            Backup Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage database backups and restoration
          </p>
        </div>
        <Button onClick={createBackup} disabled={creating}>
          {creating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Create Backup
            </>
          )}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Backups</p>
                <p className="text-2xl font-bold">{backups.length}</p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{formatFileSize(totalBackupSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Backup</p>
                <p className="text-lg font-bold">
                  {backups.length > 0
                    ? new Date(backups[0].created_at).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {backups.filter((b) => b.verified).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Automatic Backup Schedule
          </CardTitle>
          <CardDescription>Configure automatic backup settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Frequency</Label>
              <Select
                value={schedule.frequency}
                onValueChange={(value: any) => setSchedule({ ...schedule, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time (24-hour format)</Label>
              <Input
                type="time"
                value={schedule.time}
                onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
              />
            </div>
            <div>
              <Label>Retention Period (days)</Label>
              <Input
                type="number"
                value={schedule.retention_days}
                onChange={(e) =>
                  setSchedule({ ...schedule, retention_days: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Status</Label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="schedule-enabled"
                  checked={schedule.enabled}
                  onChange={(e) => setSchedule({ ...schedule, enabled: e.target.checked })}
                />
                <Label htmlFor="schedule-enabled" className="cursor-pointer">
                  Enable automatic backups
                </Label>
              </div>
            </div>
          </div>

          {schedule.last_run && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Last Run</p>
                <p className="font-medium">{new Date(schedule.last_run).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Next Run</p>
                <p className="font-medium">
                  {schedule.next_run
                    ? new Date(schedule.next_run).toLocaleString()
                    : 'Not scheduled'}
                </p>
              </div>
            </div>
          )}

          <Button onClick={updateSchedule} className="w-full">
            Save Schedule Settings
          </Button>
        </CardContent>
      </Card>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Backups</CardTitle>
          <CardDescription>
            {backups.length} backup{backups.length !== 1 ? 's' : ''} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No backups available. Create your first backup to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup) => (
                <div key={backup.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{backup.name}</p>
                        {getStatusBadge(backup.status)}
                        {backup.verified && (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {backup.type === 'automatic' ? 'Auto' : 'Manual'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created by {backup.created_by} on{' '}
                        {new Date(backup.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadBackup(backup.id, backup.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => restoreBackup(backup.id, backup.name)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteBackup(backup.id, backup.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p className="font-medium">{formatFileSize(backup.size)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tables</p>
                      <p className="font-medium">{backup.tables_count}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Records</p>
                      <p className="font-medium">{backup.records_count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{backup.status.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warning */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Always test your backups by restoring them to a test
          environment. Backup verification ensures the backup file is not corrupted, but does not
          guarantee successful restoration.
        </AlertDescription>
      </Alert>
    </div>
  );
}
