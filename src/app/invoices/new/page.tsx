'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvoiceForm } from '@/components/invoice-form';
import { InvoicePreview } from '@/components/invoice-preview';
import { v4 as uuidv4 } from 'uuid';

const initialInvoiceState = {
  id: '',
  invoiceNumber: '',
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
export type Template = 'classic' | 'modern' | 'professional' | 'ginyard';

export default function NewInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoiceState);
  const [template, setTemplate] = useState<Template>('classic');
  const [accentColor, setAccentColor] = useState('#000000');

  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');

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
      }
    } else {
      const newInvoiceNumber = `INV-${String(Date.now()).slice(-6)}`;
      setInvoice((prev) => ({
        ...prev,
        invoiceNumber: newInvoiceNumber,
        id: uuidv4(),
      }));
    }
  }, [draftId]);

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
    const dataToSave = { ...invoice, template, accentColor };
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
    const newInvoiceNumber = `INV-${String(Date.now()).slice(-6)}`;
    setInvoice({
      ...initialInvoiceState,
      invoiceNumber: newInvoiceNumber,
      id: uuidv4(),
    });
    setTemplate('classic');
    setAccentColor('#000000');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="lg:sticky lg:top-8">
        <InvoicePreview
          invoice={invoice}
          template={template}
          accentColor={accentColor}
          onTemplateChange={setTemplate}
          onAccentColorChange={setAccentColor}
        />
      </div>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New Invoice</h1>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below to create a new invoice.
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
