'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';

import type { Template } from '@/app/invoices/new/page';

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

export default function SettingsPage() {
  const [company, setCompany] = useState<CompanyInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
  });
  const [logoUrl, setLogoUrl] = useState('');
  const [defaultTemplate, setDefaultTemplate] = useState<Template>('classic');
  const { user } = useAuth();

  // Get available templates based on user permissions - only show their specific templates
  const availableTemplates = useMemo(() => {
    if (user?.allowedTemplates) {
      const templateLabels: Record<string, string> = {
        vss: 'VSS',
        cvs: 'CVS',
        sv: 'SV Electricals',
        gtech: 'G-Tech Car Care',
      } as const;
      return user.allowedTemplates.map((t) => ({
        value: t,
        label: templateLabels[t as keyof typeof templateLabels] ?? t,
      }));
    }
    return [];
  }, [user]);

  useEffect(() => {
    // Load user-specific saved settings from localStorage on component mount
    if (user) {
      const userSettingsKey = `company-settings-${user.email}`;
      const savedSettings = localStorage.getItem(userSettingsKey);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setCompany(settings.company || { name: '', email: '', phone: '', address: '', website: '' });
        setLogoUrl(settings.logoUrl || '');
        const fallbackTemplate = availableTemplates[0]?.value as Template | undefined;
        const savedTemplate = settings.defaultTemplate as Template | undefined;
        if (savedTemplate && user.allowedTemplates?.includes(savedTemplate)) {
          setDefaultTemplate(savedTemplate);
        } else if (fallbackTemplate) {
          setDefaultTemplate(fallbackTemplate);
        }
      } else {
        const fallbackTemplate = availableTemplates[0]?.value as Template | undefined;
        if (fallbackTemplate) {
          setDefaultTemplate(fallbackTemplate);
        }
      }
    }
  }, [user, availableTemplates]);

  useEffect(() => {
    if (!availableTemplates.length) return;
    setDefaultTemplate((prev) => {
      if (prev && availableTemplates.some((t) => t.value === prev)) {
        return prev;
      }
      return availableTemplates[0]?.value as Template;
    });
  }, [availableTemplates]);

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newLogoUrl = reader.result as string;
        setLogoUrl(newLogoUrl);
        // Immediately save to localStorage so it appears in templates
        if (user) {
          const userSettingsKey = `company-settings-${user.email}`;
          const currentSettings = JSON.parse(localStorage.getItem(userSettingsKey) || '{}');
          currentSettings.logoUrl = newLogoUrl;
          localStorage.setItem(userSettingsKey, JSON.stringify(currentSettings));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    if (!user) return;
    const settings = {
      company,
      logoUrl,
      defaultTemplate,
    };
    const userSettingsKey = `company-settings-${user.email}`;
    localStorage.setItem(userSettingsKey, JSON.stringify(settings));
    alert('Settings saved!');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your company info, logo, and default invoice settings. This information will be used to auto-fill new invoices.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" value={company.name} onChange={(e) => handleInputChange('name', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyEmail">Company Email</Label>
            <Input id="companyEmail" type="email" value={company.email} onChange={(e) => handleInputChange('email', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyPhone">Company Phone</Label>
            <Input id="companyPhone" value={company.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyWebsite">Company Website</Label>
            <Input id="companyWebsite" value={company.website} onChange={(e) => handleInputChange('website', e.target.value)} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Textarea id="companyAddress" value={company.address} onChange={(e) => handleInputChange('address', e.target.value)} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Branding & Defaults</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 items-start">
           <div className="space-y-4">
              <div className="space-y-2">
                  <Label>Company Logo</Label>
                   {logoUrl && (
                      <div className="mt-2">
                        <Image src={logoUrl} alt="Logo Preview" width={120} height={120} className="rounded-md object-contain bg-muted p-2"/>
                      </div>
                    )}
                  <Input id="logo" type="file" onChange={handleLogoChange} accept="image/*" />
              </div>
           </div>
           <div className="space-y-2">
             <Label>Default Template</Label>
              <Select value={defaultTemplate} onValueChange={(value) => setDefaultTemplate(value as Template)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
}
