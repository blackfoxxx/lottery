import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebhookManagement from '@/components/WebhookManagement';
import BackupManagement from '@/components/BackupManagement';
import AuditLog from '@/components/AuditLog';
import { Webhook, Database, FileText } from 'lucide-react';

export default function System() {
  const [activeTab, setActiveTab] = useState('webhooks');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage webhooks, backups, and audit logs
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="backups" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Backups
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webhooks" className="mt-6">
            <WebhookManagement />
          </TabsContent>

          <TabsContent value="backups" className="mt-6">
            <BackupManagement />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AuditLog />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
