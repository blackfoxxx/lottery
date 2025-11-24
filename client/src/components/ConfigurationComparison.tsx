import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  GitCompare,
  Copy,
  Download,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface Environment {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production';
  config: Record<string, string>;
}

interface ConfigDiff {
  key: string;
  leftValue: string | null;
  rightValue: string | null;
  status: 'same' | 'different' | 'missing_left' | 'missing_right';
}

export default function ConfigurationComparison() {
  const [environments, setEnvironments] = useState<Environment[]>([
    {
      id: 'dev',
      name: 'Development',
      type: 'development',
      config: {
        APP_ENV: 'local',
        APP_DEBUG: 'true',
        DB_HOST: '127.0.0.1',
        STRIPE_PUBLIC_KEY: 'pk_test_dev',
        MAIL_HOST: 'smtp.mailtrap.io',
      },
    },
    {
      id: 'staging',
      name: 'Staging',
      type: 'staging',
      config: {
        APP_ENV: 'staging',
        APP_DEBUG: 'true',
        DB_HOST: 'staging-db.example.com',
        STRIPE_PUBLIC_KEY: 'pk_test_staging',
        MAIL_HOST: 'smtp.sendgrid.net',
        AWS_BUCKET: 'belkhair-staging',
      },
    },
    {
      id: 'prod',
      name: 'Production',
      type: 'production',
      config: {
        APP_ENV: 'production',
        APP_DEBUG: 'false',
        DB_HOST: 'prod-db.example.com',
        STRIPE_PUBLIC_KEY: 'pk_live_prod',
        MAIL_HOST: 'smtp.sendgrid.net',
        AWS_BUCKET: 'belkhair-production',
      },
    },
  ]);

  const [leftEnv, setLeftEnv] = useState<string>('dev');
  const [rightEnv, setRightEnv] = useState<string>('prod');
  const [diffs, setDiffs] = useState<ConfigDiff[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEnvironments();
  }, []);

  useEffect(() => {
    compareEnvironments();
  }, [leftEnv, rightEnv, environments]);

  const loadEnvironments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/environments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEnvironments(data);
      }
    } catch (error) {
      console.error('Failed to load environments:', error);
    } finally {
      setLoading(false);
    }
  };

  const compareEnvironments = () => {
    const left = environments.find((e) => e.id === leftEnv);
    const right = environments.find((e) => e.id === rightEnv);

    if (!left || !right) return;

    const allKeys = new Set([
      ...Object.keys(left.config),
      ...Object.keys(right.config),
    ]);

    const differences: ConfigDiff[] = Array.from(allKeys).map((key) => {
      const leftValue = left.config[key] || null;
      const rightValue = right.config[key] || null;

      let status: ConfigDiff['status'] = 'same';
      if (leftValue === null) {
        status = 'missing_left';
      } else if (rightValue === null) {
        status = 'missing_right';
      } else if (leftValue !== rightValue) {
        status = 'different';
      }

      return { key, leftValue, rightValue, status };
    });

    setDiffs(differences.sort((a, b) => {
      const order = { different: 0, missing_left: 1, missing_right: 2, same: 3 };
      return order[a.status] - order[b.status];
    }));
  };

  const copyConfig = async (from: string, to: string, keys: string[]) => {
    if (!confirm(`Copy ${keys.length} configuration values from ${from} to ${to}?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/environments/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ from, to, keys }),
      });

      if (response.ok) {
        toast.success(`Configuration copied from ${from} to ${to}`);
        loadEnvironments();
      } else {
        toast.error('Failed to copy configuration');
      }
    } catch (error) {
      console.error('Failed to copy configuration:', error);
      toast.error('Failed to copy configuration');
    }
  };

  const syncEnvironments = async () => {
    const differentKeys = diffs
      .filter((d) => d.status === 'different')
      .map((d) => d.key);

    if (differentKeys.length === 0) {
      toast.info('Environments are already in sync');
      return;
    }

    await copyConfig(
      environments.find((e) => e.id === leftEnv)?.name || leftEnv,
      environments.find((e) => e.id === rightEnv)?.name || rightEnv,
      differentKeys
    );
  };

  const exportComparison = () => {
    const csv = [
      ['Variable', environments.find((e) => e.id === leftEnv)?.name, environments.find((e) => e.id === rightEnv)?.name, 'Status'],
      ...diffs.map((diff) => [
        diff.key,
        diff.leftValue || '<missing>',
        diff.rightValue || '<missing>',
        diff.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-comparison-${leftEnv}-vs-${rightEnv}-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Comparison exported');
  };

  const getStatusIcon = (status: ConfigDiff['status']) => {
    switch (status) {
      case 'same':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'different':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'missing_left':
      case 'missing_right':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: ConfigDiff['status']) => {
    switch (status) {
      case 'same':
        return <Badge className="bg-green-600">Same</Badge>;
      case 'different':
        return <Badge className="bg-yellow-600">Different</Badge>;
      case 'missing_left':
        return <Badge className="bg-red-600">Missing in {environments.find((e) => e.id === leftEnv)?.name}</Badge>;
      case 'missing_right':
        return <Badge className="bg-red-600">Missing in {environments.find((e) => e.id === rightEnv)?.name}</Badge>;
    }
  };

  const stats = {
    same: diffs.filter((d) => d.status === 'same').length,
    different: diffs.filter((d) => d.status === 'different').length,
    missing: diffs.filter((d) => d.status === 'missing_left' || d.status === 'missing_right').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GitCompare className="h-6 w-6" />
            Configuration Comparison
          </h2>
          <p className="text-muted-foreground mt-1">
            Compare configurations between environments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportComparison}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" onClick={loadEnvironments} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Environment Selectors */}
      <Card>
        <CardHeader>
          <CardTitle>Select Environments to Compare</CardTitle>
          <CardDescription>Choose two environments to see their configuration differences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="mb-2 block">Left Environment</Label>
              <Select value={leftEnv} onValueChange={setLeftEnv}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {environments.map((env) => (
                    <SelectItem key={env.id} value={env.id} disabled={env.id === rightEnv}>
                      {env.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="flex-1">
              <Label className="mb-2 block">Right Environment</Label>
              <Select value={rightEnv} onValueChange={setRightEnv}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {environments.map((env) => (
                    <SelectItem key={env.id} value={env.id} disabled={env.id === leftEnv}>
                      {env.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.same}</div>
              <div className="text-sm text-muted-foreground">Matching</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.different}</div>
              <div className="text-sm text-muted-foreground">Different</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.missing}</div>
              <div className="text-sm text-muted-foreground">Missing</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Button */}
      {stats.different > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {stats.different} configuration difference{stats.different !== 1 ? 's' : ''} detected
            </span>
            <Button size="sm" onClick={syncEnvironments}>
              Sync Configurations
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Differences</CardTitle>
          <CardDescription>
            Side-by-side comparison of {diffs.length} configuration variables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {diffs.map((diff) => (
              <div
                key={diff.key}
                className={`p-4 border rounded-lg ${
                  diff.status === 'same' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(diff.status)}
                    <span className="font-mono font-semibold">{diff.key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(diff.status)}
                    {diff.status === 'different' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyConfig(
                            environments.find((e) => e.id === leftEnv)?.name || leftEnv,
                            environments.find((e) => e.id === rightEnv)?.name || rightEnv,
                            [diff.key]
                          )
                        }
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy →
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {environments.find((e) => e.id === leftEnv)?.name}
                    </p>
                    <code
                      className={`text-sm px-2 py-1 rounded block ${
                        diff.leftValue === null
                          ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
                          : diff.status === 'different'
                          ? 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
                          : 'bg-muted'
                      }`}
                    >
                      {diff.leftValue || '<missing>'}
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {environments.find((e) => e.id === rightEnv)?.name}
                    </p>
                    <code
                      className={`text-sm px-2 py-1 rounded block ${
                        diff.rightValue === null
                          ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
                          : diff.status === 'different'
                          ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                          : 'bg-muted'
                      }`}
                    >
                      {diff.rightValue || '<missing>'}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
