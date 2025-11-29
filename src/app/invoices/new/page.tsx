
'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvoiceForm } from '@/components/invoice-form';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FileText, FileSignature } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { InvoiceFullPreview } from '@/components/invoice-full-preview';
import { useAuth } from '@/lib/auth-context';


const initialInvoiceState = {
  id: '',
  invoiceNumber: '',
  type: 'invoice' as 'invoice' | 'quotation',
  company: { name: '', email: '', phone: '', address: '', website: '' },
  client: { name: '', phone: '', address: '' },
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  items: [{ id: uuidv4(), item: '', unit: 'Nos', quantity: 1, unitRate: 0 }],
  tax: 0,
  subtotal: 0,
  total: 0,
  logoUrl: '',
};

export type Invoice = typeof initialInvoiceState;
export type Template = 'classic' | 'modern' | 'professional' | 'ginyard' | 'vss' | 'cvs' | 'sv' | 'gtech';
export type DocumentType = 'invoice' | 'quotation';

function NewInvoicePageContents() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoiceState);
  const [template, setTemplate] = useState<Template>('classic');
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');
  const docType = searchParams.get('type') as DocumentType | null;

  const docTitle = useMemo(() => docType === 'quotation' ? 'Quotation' : 'Invoice', [docType]);
  const docNumberPrefix = useMemo(() => docType === 'quotation' ? 'QUO' : 'INV', [docType]);

  // Get available templates based on user permissions - only show their specific templates
  const availableTemplates = useMemo(() => {
    if (user?.allowedTemplates) {
      const templateLabels: Record<string, string> = {
        'vss': 'VSS',
        'cvs': 'CVS',
        'sv': 'SV Electricals',
        'gtech': 'G-Tech Car Care',
      };
      // Only include the user's specific brand templates (no generic ones)
      return user.allowedTemplates
        .filter(t => ['vss', 'cvs', 'sv', 'gtech'].includes(t))
        .map(t => ({
          value: t,
          label: templateLabels[t] || t
        }));
    }
    return [];
  }, [user]);

  useEffect(() => {
    const loadData = () => {
      if (docType && user) {
        const autoSaveKey = `temp-invoice-${user.email}-${docType}`;
        const savedData = localStorage.getItem(autoSaveKey);
        
        if (savedData) {
          // Restore auto-saved data
          const parsedData = JSON.parse(savedData);
          const timeDiff = Date.now() - (parsedData.lastModified || 0);
          const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
          
          // Only restore if saved within last 7 days
          if (timeDiff < ONE_WEEK) {
            setInvoice(parsedData);
            if (parsedData.template) setTemplate(parsedData.template);
            return;
          } else {
            // Clear old data
            localStorage.removeItem(autoSaveKey);
          }
        }
        
        // No saved data or expired - create new
        const userSettingsKey = `company-settings-${user.email}`;
        const savedSettings = JSON.parse(localStorage.getItem(userSettingsKey) || '{}');
        const newInvoiceNumber = `${docNumberPrefix}-${String(Date.now()).slice(-6)}`;
        // Determine default template based on user's allowed templates
        let defaultTemplate: Template = 'classic';
        if (user.allowedTemplates && user.allowedTemplates.length > 0) {
          defaultTemplate = user.allowedTemplates[0] as Template;
        } else if (user.canAccessVSSTemplates) {
          defaultTemplate = 'vss';
        } else {
          defaultTemplate = 'sv';
        }
        defaultTemplate = (savedSettings.defaultTemplate || defaultTemplate) as Template;
        setInvoice({
          ...initialInvoiceState,
          id: uuidv4(),
          type: docType,
          invoiceNumber: newInvoiceNumber,
          company: savedSettings.company || initialInvoiceState.company,
          logoUrl: savedSettings.logoUrl || '',
        });
        setTemplate(defaultTemplate);
      }
    };
    loadData();
  }, [docType, docNumberPrefix, user]);

  useEffect(() => {
    const subtotal = invoice.items.reduce(
      (acc, item) => acc + item.quantity * item.unitRate,
      0
    );
    const taxAmount = subtotal * (invoice.tax / 100);
    const total = subtotal + taxAmount;
    setInvoice((prev) => ({ ...prev, subtotal, total }));
  }, [invoice.items, invoice.tax]);

  // Auto-save to localStorage (temporary persistence)
  useEffect(() => {
    if (user && invoice.id && docType) {
      const autoSaveKey = `temp-invoice-${user.email}-${docType}`;
      const dataToSave = { ...invoice, template, lastModified: Date.now() };
      localStorage.setItem(autoSaveKey, JSON.stringify(dataToSave));
    }
  }, [invoice, template, user, docType]);

  const handleSelectType = (type: DocumentType) => {
    router.push(`/invoices/new?type=${type}`);
  }

  const handleClearForm = () => {
     if (!docType || !user) return;
     
     // Clear auto-saved data
     const autoSaveKey = `temp-invoice-${user.email}-${docType}`;
     localStorage.removeItem(autoSaveKey);
     
     const userSettingsKey = `company-settings-${user.email}`;
     const savedSettings = JSON.parse(localStorage.getItem(userSettingsKey) || '{}');
     const newInvoiceNumber = `${docNumberPrefix}-${String(Date.now()).slice(-6)}`;
     // Determine default template based on user's allowed templates
     let defaultTemplate: Template = 'classic';
     if (user.allowedTemplates && user.allowedTemplates.length > 0) {
       defaultTemplate = user.allowedTemplates[0] as Template;
     } else if (user.canAccessVSSTemplates) {
       defaultTemplate = 'vss';
     } else {
       defaultTemplate = 'sv';
     }
     defaultTemplate = (savedSettings.defaultTemplate || defaultTemplate) as Template;
     setInvoice({
       ...initialInvoiceState,
       id: uuidv4(),
       type: docType,
       invoiceNumber: newInvoiceNumber,
       company: savedSettings.company || initialInvoiceState.company,
       logoUrl: savedSettings.logoUrl || '',
     });
     setTemplate(defaultTemplate);
  };

  if (!docType) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && router.push('/dashboard')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What would you like to create?</DialogTitle>
            <DialogDescription>
              Choose whether you want to create a new invoice or a quotation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 py-8">
            <Button variant="outline" className="h-24 w-24 flex-col gap-2" onClick={() => handleSelectType('invoice')}>
              <FileText className="w-8 h-8"/>
              <span>Invoice</span>
            </Button>
            <Button variant="outline" className="h-24 w-24 flex-col gap-2" onClick={() => handleSelectType('quotation')}>
              <FileSignature className="w-8 h-8" />
              <span>Quotation</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <div className="space-y-8 max-w-4xl mx-auto pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New {docTitle}</h1>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below to create a new {docTitle.toLowerCase()}.
          </p>
        </div>
        
        <div className="space-y-2">
            <Label>Template</Label>
            <Select
              value={template}
              onValueChange={(value) => setTemplate(value as Template)}
            >
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

        <InvoiceForm
          invoice={invoice}
          setInvoice={setInvoice}
          onClearForm={handleClearForm}
          onPreview={() => setShowPreview(true)}
          template={template}
        />
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[95vw] md:max-w-5xl max-h-[95vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle>{docTitle} Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto">
            <InvoiceFullPreview invoice={invoice} template={template} />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewInvoicePageContents />
    </Suspense>
  )
}
