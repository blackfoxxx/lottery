import React, { useState } from 'react';
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
import { FileCode, Download, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  environment: 'development' | 'staging' | 'production';
  config: Record<string, string>;
}

interface ConfigurationTemplatesProps {
  onApplyTemplate: (config: Record<string, string>) => void;
}

export default function ConfigurationTemplates({ onApplyTemplate }: ConfigurationTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: ConfigTemplate[] = [
    {
      id: 'development',
      name: 'Development',
      description: 'Local development environment with test credentials',
      environment: 'development',
      config: {
        APP_ENV: 'local',
        APP_DEBUG: 'true',
        APP_URL: 'http://localhost:3000',
        DB_CONNECTION: 'mysql',
        DB_HOST: '127.0.0.1',
        DB_PORT: '3306',
        DB_DATABASE: 'belkhair_dev',
        DB_USERNAME: 'root',
        DB_PASSWORD: '',
        MAIL_DRIVER: 'log',
        MAIL_HOST: 'smtp.mailtrap.io',
        MAIL_PORT: '2525',
        MAIL_USERNAME: '',
        MAIL_PASSWORD: '',
        MAIL_FROM_ADDRESS: 'dev@belkhair.local',
        MAIL_FROM_NAME: 'Belkhair Dev',
        STRIPE_PUBLIC_KEY: 'pk_test_...',
        STRIPE_SECRET_KEY: 'sk_test_...',
        SESSION_LIFETIME: '120',
      },
    },
    {
      id: 'staging',
      name: 'Staging',
      description: 'Staging environment for testing before production',
      environment: 'staging',
      config: {
        APP_ENV: 'staging',
        APP_DEBUG: 'true',
        APP_URL: 'https://staging.belkhair.com',
        DB_CONNECTION: 'mysql',
        DB_HOST: 'staging-db.example.com',
        DB_PORT: '3306',
        DB_DATABASE: 'belkhair_staging',
        DB_USERNAME: 'staging_user',
        DB_PASSWORD: '',
        MAIL_DRIVER: 'smtp',
        MAIL_HOST: 'smtp.sendgrid.net',
        MAIL_PORT: '587',
        MAIL_USERNAME: 'apikey',
        MAIL_PASSWORD: '',
        MAIL_FROM_ADDRESS: 'staging@belkhair.com',
        MAIL_FROM_NAME: 'Belkhair Staging',
        STRIPE_PUBLIC_KEY: 'pk_test_...',
        STRIPE_SECRET_KEY: 'sk_test_...',
        AWS_ACCESS_KEY_ID: '',
        AWS_SECRET_ACCESS_KEY: '',
        AWS_DEFAULT_REGION: 'us-east-1',
        AWS_BUCKET: 'belkhair-staging',
        SESSION_LIFETIME: '120',
      },
    },
    {
      id: 'production',
      name: 'Production',
      description: 'Production environment with live credentials',
      environment: 'production',
      config: {
        APP_ENV: 'production',
        APP_DEBUG: 'false',
        APP_URL: 'https://belkhair.com',
        DB_CONNECTION: 'mysql',
        DB_HOST: 'prod-db.example.com',
        DB_PORT: '3306',
        DB_DATABASE: 'belkhair_prod',
        DB_USERNAME: 'prod_user',
        DB_PASSWORD: '',
        MAIL_DRIVER: 'smtp',
        MAIL_HOST: 'smtp.sendgrid.net',
        MAIL_PORT: '587',
        MAIL_USERNAME: 'apikey',
        MAIL_PASSWORD: '',
        MAIL_FROM_ADDRESS: 'noreply@belkhair.com',
        MAIL_FROM_NAME: 'Belkhair',
        STRIPE_PUBLIC_KEY: 'pk_live_...',
        STRIPE_SECRET_KEY: 'sk_live_...',
        AWS_ACCESS_KEY_ID: '',
        AWS_SECRET_ACCESS_KEY: '',
        AWS_DEFAULT_REGION: 'us-east-1',
        AWS_BUCKET: 'belkhair-production',
        TWILIO_ACCOUNT_SID: '',
        TWILIO_AUTH_TOKEN: '',
        TWILIO_PHONE_NUMBER: '',
        SESSION_LIFETIME: '120',
      },
    },
  ];

  const handleApplyTemplate = (template: ConfigTemplate) => {
    setSelectedTemplate(template.id);
    onApplyTemplate(template.config);
    toast.success(`Applied ${template.name} template`);
  };

  const handleExportConfig = () => {
    // This would export current configuration
    toast.info('Export functionality - implement with current config');
  };

  const handleImportConfig = () => {
    // This would import configuration from file
    toast.info('Import functionality - implement file upload');
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'development':
        return 'bg-blue-500';
      case 'staging':
        return 'bg-yellow-500';
      case 'production':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            Configuration Templates
          </h2>
          <p className="text-muted-foreground mt-1">
            Quick setup with pre-configured environment templates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportConfig}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleImportConfig}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={getEnvironmentColor(template.environment)}>
                  {template.environment.toUpperCase()}
                </Badge>
                {selectedTemplate === template.id && (
                  <Check className="h-5 w-5 text-green-600" />
                )}
              </div>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold mb-2">Includes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Database configuration</li>
                    <li>Email service setup</li>
                    <li>Payment gateway keys</li>
                    {template.environment !== 'development' && <li>Cloud storage</li>}
                    {template.environment === 'production' && <li>SMS service</li>}
                  </ul>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{template.name} Template</DialogTitle>
                      <DialogDescription>{template.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Configuration Variables:</h4>
                        <div className="space-y-2 font-mono text-sm">
                          {Object.entries(template.config).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}</span>
                              <span className="font-medium">
                                {value || '<empty>'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleApplyTemplate(template)}
                        className="w-full"
                      >
                        Apply This Template
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => handleApplyTemplate(template)}
                  className="w-full"
                  variant={selectedTemplate === template.id ? 'default' : 'secondary'}
                >
                  {selectedTemplate === template.id ? 'Applied' : 'Apply Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
