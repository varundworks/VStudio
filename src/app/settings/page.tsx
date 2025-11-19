
'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Load saved settings from localStorage on component mount
    const savedSettings = localStorage.getItem('company-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCompany(settings.company || { name: '', email: '', phone: '', address: '', website: '' });
      setLogoUrl(settings.logoUrl || '');
      setDefaultTemplate(settings.defaultTemplate || 'classic');
    }
  }, []);

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    const settings = {
      company,
      logoUrl,
      defaultTemplate,
    };
    localStorage.setItem('company-settings', JSON.stringify(settings));
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
              <Select value={defaultTemplate} onValuechange={(value) => setDefaultTemplate(value as Template)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="ginyard">Ginyard</SelectItem>
                  <SelectItem value="vss">VSS</SelectItem>
                  <SelectItem value="cvs">CVS</SelectItem>
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
