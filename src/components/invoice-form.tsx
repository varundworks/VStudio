
'use client';

import { v4 as uuidv4 } from 'uuid';
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
import type { Invoice, Template } from '@/app/invoices/new/page';
import { InvoiceFullPreview } from '@/components/invoice-full-preview';

interface InvoiceFormProps {
  invoice: Invoice;
  template: Template;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  onSaveDraft: () => void;
  onClearForm: () => void;
  onPreview: () => void;
}

export function InvoiceForm({
  invoice,
  template,
  setInvoice,
  onSaveDraft,
  onClearForm,
  onPreview,
}: InvoiceFormProps) {
  const handleInputChange = (
    section: 'client',
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

  const handleGeneratePDF = () => {
    const input = document.getElementById('pdf-generator');
    if (input) {
      html2canvas(input, {
        scale: 4,
        logging: true,
        useCORS: true,
        width: input.offsetWidth,
        height: input.offsetHeight,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        let width = pdfWidth;
        let height = width / ratio;

        if (height > pdfHeight) {
          height = pdfHeight;
          width = height * ratio;
        }

        const x = (pdfWidth - width) / 2;
        const y = 0;

        pdf.addImage(imgData, 'PNG', x, y, width, height, undefined, 'FAST');
        pdf.save(`${invoice.type}-${invoice.invoiceNumber || 'download'}.pdf`);
      });
    } else {
        console.error("PDF generation failed: element with id 'pdf-generator' not found.");
        alert("Sorry, something went wrong while generating the PDF. Please try again.");
    }
  };
  
  const docTitle = invoice.type === 'quotation' ? 'Quotation' : 'Invoice';

  return (
    <div className="space-y-8">
       {/* Hidden component for PDF generation */}
       <div className="fixed -z-10 -left-[10000px] top-0">
         <div id="pdf-generator" className="w-[800px] h-auto">
            <InvoiceFullPreview invoice={invoice} template={template} />
         </div>
       </div>

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

      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={onClearForm}>
          Clear
        </Button>
        <Button onClick={onSaveDraft}>Save as Draft</Button>
        <Button onClick={onPreview} variant="secondary">Preview</Button>
        <Button onClick={handleGeneratePDF} variant="default">Download PDF</Button>
      </div>
    </div>
  );
}
