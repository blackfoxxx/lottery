import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Search,
  Filter,
  User,
  Settings,
  Database,
  ShoppingCart,
  FileUp,
  FileDown,
  Shield,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditEntry {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  user_email: string;
  action_type: string;
  action_category: string;
  resource_type: string;
  resource_id: string | null;
  description: string;
  ip_address: string;
  user_agent: string;
  changes: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  metadata: Record<string, any>;
}

const ACTION_CATEGORIES = [
  { value: 'all', label: 'All Actions' },
  { value: 'configuration', label: 'Configuration Changes' },
  { value: 'user_management', label: 'User Management' },
  { value: 'data_export', label: 'Data Export' },
  { value: 'data_import', label: 'Data Import' },
  { value: 'order_management', label: 'Order Management' },
  { value: 'product_management', label: 'Product Management' },
  { value: 'security', label: 'Security Events' },
];

export default function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    loadAuditLog();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, categoryFilter, userFilter, dateFrom, dateTo]);

  const loadAuditLog = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/audit-log', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data);
        extractUsers(data);
      } else {
        // Mock data
        const mockData: AuditEntry[] = [
          {
            id: '1',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            user_id: '1',
            user_name: 'Admin User',
            user_email: 'admin@belkhair.com',
            action_type: 'update',
            action_category: 'configuration',
            resource_type: 'environment_variable',
            resource_id: 'STRIPE_PUBLIC_KEY',
            description: 'Updated Stripe API key configuration',
            ip_address: '192.168.1.100',
            user_agent: 'Mozilla/5.0...',
            changes: [
              {
                field: 'STRIPE_PUBLIC_KEY',
                old_value: 'pk_test_old',
                new_value: 'pk_test_new',
              },
            ],
            metadata: { environment: 'production' },
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            user_id: '2',
            user_name: 'Manager User',
            user_email: 'manager@belkhair.com',
            action_type: 'export',
            action_category: 'data_export',
            resource_type: 'customer_data',
            resource_id: null,
            description: 'Exported customer data to CSV',
            ip_address: '192.168.1.101',
            user_agent: 'Mozilla/5.0...',
            changes: [],
            metadata: { record_count: 1500, format: 'csv' },
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            user_id: '1',
            user_name: 'Admin User',
            user_email: 'admin@belkhair.com',
            action_type: 'create',
            action_category: 'user_management',
            resource_type: 'user',
            resource_id: '123',
            description: 'Created new admin user account',
            ip_address: '192.168.1.100',
            user_agent: 'Mozilla/5.0...',
            changes: [
              { field: 'email', old_value: null, new_value: 'newadmin@belkhair.com' },
              { field: 'role', old_value: null, new_value: 'admin' },
            ],
            metadata: { permissions: ['read', 'write', 'delete'] },
          },
        ];
        setEntries(mockData);
        extractUsers(mockData);
      }
    } catch (error) {
      console.error('Failed to load audit log:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractUsers = (data: AuditEntry[]) => {
    const uniqueUsers = Array.from(new Set(data.map((entry) => entry.user_email)));
    setUsers(uniqueUsers);
  };

  const filterEntries = () => {
    let filtered = entries;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.resource_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((entry) => entry.action_category === categoryFilter);
    }

    // User filter
    if (userFilter !== 'all') {
      filtered = filtered.filter((entry) => entry.user_email === userFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) <= new Date(dateTo + 'T23:59:59')
      );
    }

    setFilteredEntries(filtered);
  };

  const exportToCSV = () => {
    const csv = [
      [
        'Timestamp',
        'User',
        'Email',
        'Action',
        'Category',
        'Resource',
        'Description',
        'IP Address',
      ],
      ...filteredEntries.map((entry) => [
        new Date(entry.timestamp).toLocaleString(),
        entry.user_name,
        entry.user_email,
        entry.action_type,
        entry.action_category,
        entry.resource_type,
        entry.description,
        entry.ip_address,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Audit log exported');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setUserFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'configuration':
        return <Settings className="h-4 w-4" />;
      case 'user_management':
        return <User className="h-4 w-4" />;
      case 'data_export':
        return <FileDown className="h-4 w-4" />;
      case 'data_import':
        return <FileUp className="h-4 w-4" />;
      case 'order_management':
        return <ShoppingCart className="h-4 w-4" />;
      case 'product_management':
        return <Database className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <Badge className="bg-green-600">Create</Badge>;
      case 'update':
        return <Badge className="bg-blue-600">Update</Badge>;
      case 'delete':
        return <Badge className="bg-red-600">Delete</Badge>;
      case 'export':
        return <Badge className="bg-purple-600">Export</Badge>;
      case 'import':
        return <Badge className="bg-orange-600">Import</Badge>;
      default:
        return <Badge>{action}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FileText className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading audit log...</p>
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
            <FileText className="h-6 w-6" />
            Activity Audit Log
          </h2>
          <p className="text-muted-foreground mt-1">
            Track all administrative actions and changes
          </p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Filtered Results</p>
                <p className="text-2xl font-bold">{filteredEntries.length}</p>
              </div>
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">
                  {
                    entries.filter(
                      (e) =>
                        new Date(e.timestamp).toDateString() === new Date().toDateString()
                    ).length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter audit log entries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>User</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label>Date To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" onClick={clearFilters} className="w-full">
            Clear All Filters
          </Button>
        </CardContent>
      </Card>

      {/* Audit Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Entries</CardTitle>
          <CardDescription>
            Showing {filteredEntries.length} of {entries.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No audit entries found matching your filters
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(entry.action_category)}
                        <p className="font-medium">{entry.description}</p>
                        {getActionBadge(entry.action_type)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.user_name} ({entry.user_email})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                        <span>IP: {entry.ip_address}</span>
                      </div>
                    </div>
                  </div>

                  {entry.changes.length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                        View Changes ({entry.changes.length})
                      </summary>
                      <div className="mt-2 space-y-2">
                        {entry.changes.map((change, idx) => (
                          <div key={idx} className="p-2 bg-muted rounded text-sm">
                            <p className="font-medium mb-1">{change.field}</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-muted-foreground">Old Value</p>
                                <code className="text-xs">
                                  {change.old_value !== null
                                    ? JSON.stringify(change.old_value)
                                    : '<null>'}
                                </code>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">New Value</p>
                                <code className="text-xs">
                                  {change.new_value !== null
                                    ? JSON.stringify(change.new_value)
                                    : '<null>'}
                                </code>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {Object.keys(entry.metadata).length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                        View Metadata
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(entry.metadata, null, 2)}
                      </pre>
                    </details>
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
