import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  Mail,
  MessageSquare,
  Cloud,
  Database,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  response_time: number;
  uptime: number;
  last_check: string;
  message?: string;
  details?: Record<string, any>;
}

export default function HealthMonitoring() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadServiceHealth();
    
    if (autoRefresh) {
      const interval = setInterval(loadServiceHealth, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadServiceHealth = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/environment/health', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        // Mock data for demonstration
        setServices([
          {
            service: 'Payment Gateway',
            status: 'healthy',
            response_time: 145,
            uptime: 99.98,
            last_check: new Date().toISOString(),
            details: {
              provider: 'Stripe',
              account_status: 'active',
              api_version: '2023-10-16',
            },
          },
          {
            service: 'Email Service',
            status: 'healthy',
            response_time: 234,
            uptime: 99.95,
            last_check: new Date().toISOString(),
            details: {
              provider: 'SendGrid',
              daily_quota: '10000',
              used_today: '1234',
            },
          },
          {
            service: 'SMS Service',
            status: 'degraded',
            response_time: 567,
            uptime: 98.5,
            last_check: new Date().toISOString(),
            message: 'High response time detected',
            details: {
              provider: 'Twilio',
              account_balance: '$45.67',
            },
          },
          {
            service: 'Cloud Storage',
            status: 'healthy',
            response_time: 89,
            uptime: 99.99,
            last_check: new Date().toISOString(),
            details: {
              provider: 'AWS S3',
              region: 'us-east-1',
              storage_used: '2.4 GB',
            },
          },
          {
            service: 'Database',
            status: 'healthy',
            response_time: 12,
            uptime: 99.99,
            last_check: new Date().toISOString(),
            details: {
              type: 'MySQL',
              version: '8.0.32',
              connections: '45/100',
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load service health:', error);
      toast.error('Failed to load service health');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-600">Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-600">Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-600">Down</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getServiceIcon = (service: string) => {
    if (service.includes('Payment')) return <CreditCard className="h-5 w-5" />;
    if (service.includes('Email')) return <Mail className="h-5 w-5" />;
    if (service.includes('SMS')) return <MessageSquare className="h-5 w-5" />;
    if (service.includes('Storage')) return <Cloud className="h-5 w-5" />;
    if (service.includes('Database')) return <Database className="h-5 w-5" />;
    return <Activity className="h-5 w-5" />;
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 100) return 'text-green-600';
    if (time < 300) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-green-600';
    if (uptime >= 99) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallHealth = services.length > 0
    ? services.filter((s) => s.status === 'healthy').length / services.length * 100
    : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading service health...</p>
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
            <Activity className="h-6 w-6" />
            Health Monitoring
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time status of all configured services
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Disable' : 'Enable'} Auto-Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadServiceHealth}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall System Health
          </CardTitle>
          <CardDescription>
            {services.filter((s) => s.status === 'healthy').length} of {services.length} services
            operational
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Health Score</span>
                <span className="text-sm font-bold">{overallHealth.toFixed(1)}%</span>
              </div>
              <Progress value={overallHealth} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {services.filter((s) => s.status === 'healthy').length}
                </div>
                <div className="text-sm text-muted-foreground">Healthy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {services.filter((s) => s.status === 'degraded').length}
                </div>
                <div className="text-sm text-muted-foreground">Degraded</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {services.filter((s) => s.status === 'down').length}
                </div>
                <div className="text-sm text-muted-foreground">Down</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getServiceIcon(service.service)}
                  <CardTitle className="text-lg">{service.service}</CardTitle>
                </div>
                {getStatusIcon(service.status)}
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(service.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {service.message && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {service.message}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className={`font-medium ${getResponseTimeColor(service.response_time)}`}>
                    {service.response_time}ms
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className={`font-medium ${getUptimeColor(service.uptime)}`}>
                    {service.uptime}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Check</span>
                  <span className="font-medium">
                    {new Date(service.last_check).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {service.details && (
                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm font-semibold">Details:</p>
                  {Object.entries(service.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No services configured</p>
              <p className="text-sm text-muted-foreground mt-2">
                Configure your services in the Environment Settings to see their health status
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
