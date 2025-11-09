'use client';

import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { PlusCircle, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  onSaveDraft: () => void;
  onClearForm: () => void;
}

export function InvoiceForm({
  invoice,
  setInvoice,
  onSaveDraft,
  onClearForm,
}: InvoiceFormProps) {
  const handleInputChange = (
    section: 'company' | 'client',
    field: string,
    value: string
  ) => {
    setInvoice((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleGeneralChange = (field: string, value: string | number) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: uuidv4(), description: '', quantity: 1, rate: 0 },
      ],
    }));
  };

  const handleRemoveItem = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setInvoice((prev) => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePDF = () => {
    const input = document.getElementById('invoice-preview');
    if (input) {
      html2canvas(input, {
        scale: 2, // Higher scale for better quality
        useCORS: true, 
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth;
        const height = width / ratio;
        
        // If height is greater than pdfHeight, we may need to split pages, 
        // for now, we fit it to one page.
        const finalHeight = height > pdfHeight ? pdfHeight : height;

        pdf.addImage(imgData, 'PNG', 0, 0, width, finalHeight);
        pdf.save(`${invoice.type}-${invoice.invoiceNumber || 'download'}.pdf`);
      });
    }
  };
  
  const docTitle = invoice.type === 'quotation' ? 'Quotation' : 'Invoice';

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              {invoice.logoUrl && (
                <Image
                  src={invoice.logoUrl}
                  alt="Logo Preview"
                  width={80}
                  height={80}
                  className="rounded-md object-contain"
                />
              )}
              <div>
                <Label htmlFor="logo">Company Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  onChange={handleLogoChange}
                  className="mt-1"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Info</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Company Name</Label>
            <Input
              value={invoice.company.name}
              onChange={(e) =>
                handleInputChange('company', 'name', e.target.value)
              }
            />
          </div>
          <div>
            <Label>Company Email</Label>
            <Input
              type="email"
              value={invoice.company.email}
              onChange={(e) =>
                handleInputChange('company', 'email', e.target.value)
              }
            />
          </div>
          <div>
            <Label>Company Phone</Label>
            <Input
              value={invoice.company.phone}
              onChange={(e) =>
                handleInputChange('company', 'phone', e.target.value)
              }
            />
          </div>
          <div>
            <Label>Company Website</Label>
            <Input
              value={invoice.company.website}
              onChange={(e) =>
                handleInputChange('company', 'website', e.target.value)
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label>Company Address</Label>
            <Textarea
              value={invoice.company.address}
              onChange={(e) =>
                handleInputChange('company', 'address', e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Info</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Client Name</Label>
            <Input
              value={invoice.client.name}
              onChange={(e) =>
                handleInputChange('client', 'name', e.target.value)
              }
            />
          </div>
          <div>
            <Label>Client Phone</Label>
            <Input
              value={invoice.client.phone}
              onChange={(e) =>
                handleInputChange('client', 'phone', e.target.value)
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label>Client Address</Label>
            <Textarea
              value={invoice.client.address}
              onChange={(e) =>
                handleInputChange('client', 'address', e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{docTitle} Details</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>{docTitle} Number</Label>
            <Input
              value={invoice.invoiceNumber}
              onChange={(e) =>
                handleGeneralChange('invoiceNumber', e.target.value)
              }
            />
          </div>
          <div>
            <Label>Tax (%)</Label>
            <Input
              type="number"
              value={invoice.tax}
              onChange={(e) =>
                handleGeneralChange('tax', parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div>
            <Label>{docTitle} Date</Label>
            <Input
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) =>
                handleGeneralChange('invoiceDate', e.target.value)
              }
            />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => handleGeneralChange('dueDate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoice.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_auto] gap-2 items-center"
              >
                <Textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(item.id, 'description', e.target.value)
                  }
                  className="min-h-[40px]"
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      item.id,
                      'quantity',
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
                <Input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) =>
                    handleItemChange(
                      item.id,
                      'rate',
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={invoice.items.length === 1}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 flex items-center gap-2"
            onClick={handleAddItem}
          >
            <PlusCircle className="w-4 h-4" /> Add Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">
              {formatCurrency(invoice.subtotal)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tax ({invoice.tax}%)</span>
            <span className="font-medium">
              {formatCurrency(invoice.subtotal * (invoice.tax / 100))}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClearForm}>
          Clear
        </Button>
        <Button onClick={onSaveDraft}>Save Draft</Button>
        <Button onClick={handleGeneratePDF} variant="secondary">Download PDF</Button>
      </div>
    </div>
  );
}
