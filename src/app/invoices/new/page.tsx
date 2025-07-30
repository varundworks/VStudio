'use client';

import { AppLayout } from '@/components/app-layout';
import { InvoiceForm } from '@/components/invoice-form';
import { Button } from '@/components/ui/button';
import { LogoUploader } from '@/components/logo-uploader';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NewInvoicePage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleLogoUpload = (url: string) => {
    setLogoUrl(url);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">New Invoice</h1>
          <div className="w-8"></div>
        </header>
        <LogoUploader onLogoUpload={handleLogoUpload} />
        <InvoiceForm logoUrl={logoUrl} />
      </div>
    </AppLayout>
  );
}
