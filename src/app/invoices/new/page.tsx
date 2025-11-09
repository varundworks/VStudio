
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvoiceForm } from '@/components/invoice-form';
import { InvoicePreview } from '@/components/invoice-preview';
import { v4 as uuidv4 } from 'uuid';

const initialInvoiceState = {
  id: '',
  invoiceNumber: '',
  type: 'invoice' as 'invoice' | 'quotation',
  company: { name: '', email: '', phone: '', address: '', website: '' },
  client: { name: '', phone: '', address: '' },
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  items: [{ id: uuidv4(), description: '', quantity: 1, rate: 0 }],
  tax: 0,
  subtotal: 0,
  total: 0,
  logoUrl: '',
};

export type Invoice = typeof initialInvoiceState;
export type Template = 'classic' | 'modern' | 'professional' | 'ginyard' | 'vss' | 'cvs';
export type DocumentType = 'invoice' | 'quotation';

function NewInvoicePageContents() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoiceState);
  const [template, setTemplate] = useState<Template>('classic');
  const [accentColor, setAccentColor] = useState('#F7931E');
  const [secondaryColor, setSecondaryColor] = useState('#0b1f44');
  
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');
  const docType = (searchParams.get('type') as DocumentType) || 'invoice';

  const docTitle = docType === 'quotation' ? 'Quotation' : 'Invoice';
  const docNumberPrefix = docType === 'quotation' ? 'QUO' : 'INV';

  useEffect(() => {
    if (draftId) {
      const savedDrafts = JSON.parse(
        localStorage.getItem('invoice-drafts') || '[]'
      );
      const draftToEdit = savedDrafts.find((d: any) => d.id === draftId);
      if (draftToEdit) {
        setInvoice(draftToEdit);
        if (draftToEdit.template) setTemplate(draftToEdit.template);
        if (draftToEdit.accentColor) setAccentColor(draftToEdit.accentColor);
        if (draftToEdit.secondaryColor) setSecondaryColor(draftToEdit.secondaryColor);
      }
    } else {
      // Load from settings for new invoices
      const savedSettings = JSON.parse(localStorage.getItem('company-settings') || '{}');
      const newInvoiceNumber = `${docNumberPrefix}-${String(Date.now()).slice(-6)}`;
      setInvoice({
        ...initialInvoiceState,
        id: uuidv4(),
        type: docType,
        invoiceNumber: newInvoiceNumber,
        company: savedSettings.company || initialInvoiceState.company,
        logoUrl: savedSettings.logoUrl || '',
      });
      setTemplate(savedSettings.defaultTemplate || 'classic');
      setAccentColor(savedSettings.themeColor || '#F7931E');
      setSecondaryColor(savedSettings.themeSecondaryColor || '#0b1f44');
    }
  }, [draftId, docType, docNumberPrefix]);

  useEffect(() => {
    const subtotal = invoice.items.reduce(
      (acc, item) => acc + item.quantity * item.rate,
      0
    );
    const taxAmount = subtotal * (invoice.tax / 100);
    const total = subtotal + taxAmount;
    setInvoice((prev) => ({ ...prev, subtotal, total }));
  }, [invoice.items, invoice.tax]);

  const handleSaveDraft = () => {
    const dataToSave = { ...invoice, template, accentColor, secondaryColor };
    const savedDrafts = JSON.parse(
      localStorage.getItem('invoice-drafts') || '[]'
    );
    const existingDraftIndex = savedDrafts.findIndex(
      (d: any) => d.id === invoice.id
    );

    if (existingDraftIndex > -1) {
      savedDrafts[existingDraftIndex] = dataToSave;
    } else {
      savedDrafts.push(dataToSave);
    }

    localStorage.setItem('invoice-drafts', JSON.stringify(savedDrafts));
    alert('Draft saved!');
  };

  const handleClearForm = () => {
     // Load from settings for new invoices
     const savedSettings = JSON.parse(localStorage.getItem('company-settings') || '{}');
     const newInvoiceNumber = `${docNumberPrefix}-${String(Date.now()).slice(-6)}`;
     setInvoice({
       ...initialInvoiceState,
       id: uuidv4(),
       type: docType,
       invoiceNumber: newInvoiceNumber,
       company: savedSettings.company || initialInvoiceState.company,
       logoUrl: savedSettings.logoUrl || '',
     });
     setTemplate(savedSettings.defaultTemplate || 'classic');
     setAccentColor(savedSettings.themeColor || '#F7931E');
     setSecondaryColor(savedSettings.themeSecondaryColor || '#0b1f44');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="lg:sticky lg:top-8">
        <InvoicePreview
          invoice={invoice}
          template={template}
          accentColor={accentColor}
          secondaryColor={secondaryColor}
          onTemplateChange={setTemplate}
          onAccentColorChange={setAccentColor}
          onSecondaryColorChange={setSecondaryColor}
        />
      </div>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New {docTitle}</h1>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below to create a new {docTitle.toLowerCase()}.
          </p>
        </div>
        <InvoiceForm
          invoice={invoice}
          setInvoice={setInvoice}
          onSaveDraft={handleSaveDraft}
          onClearForm={handleClearForm}
        />
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewInvoicePageContents />
    </Suspense>
  )
}
