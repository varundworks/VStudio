
'use client';

import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import type { Invoice, Template } from '@/app/invoices/new/page';
import { InvoiceFullPreview } from '@/components/invoice-full-preview';

const COMMON_ITEMS = [
  'Wall Light Fixing',
  'Elevation Light Fixing',
  'Mirror Light Fixing',
  'Foot Light / Night Lamp Fixing',
  'Exhaust Fan Fitting',
  'Chandelier Fixing',
  'Ceiling Fan Fixing',
  'Bulged Fitting',
  'Ceiling Surface Light Fixing',
  'Concealed Light Fixing',
  'Drop Light Fixing',
  'Profile Light Fixing',
  'Solar Light Fixing',
  'One Way Light Point',
  'Two Light Point on One Switch',
  'Two-Way Light Point',
  '3/4 Light Point',
  'Bed Room Two-Way Fan & Light Point',
  'Fan Point with Regulator',
  'Ceiling Fan Point',
  'Exhaust Fan Point',
  '6 Amps Plug Point',
  '10 Amps Plug Point',
  '15 Amps Plug Point',
  '16 Amps Plug Point',
  '32 Amps DP Point',
  'AC Point',
  'Geyser Point',
  'Washing Machine Point',
  'Single Phase Distribution Point',
  'Three Phase Distribution Point',
  '3 Phase Distribution Box with ELCB & MCB',
  'SPN Distribution Box with ELCB & MCB',
  'Meter Board Fixing',
  'Main Cable Laying & Earthing',
  'Lift Panel & Car Light Earth Fixing',
  '6 Sqmm Circuit Wiring',
  '4 Sqmm Circuit Wiring',
  'AH Circuit Wiring',
  '2.5 Sqmm Circuit Wiring',
  '1.5 Sqmm 3 Core Wire Laying',
  '1.5 Sqmm 2 Core Wire Laying',
  '4 Core Cable Laying',
  '3 Core Cable Laying',
  '2 Core Cable Laying',
  'CAT6 Cable Laying',
  'CAT5 Cable Laying',
  'CCTV Cable Laying',
  'TV Cable Laying',
  'Telephone Cable Laying',
  'Internet Cable Laying',
  'Water Level Controller Cable Laying',
  '10*5 Core Armoured Cable Laying',
  '10*5 Core Flexible Cable Laying',
  '4*5 Core Flexible Cable Laying',
  '1.5*3 Core Flexible Cable Laying',
  '1.5*4 Core Flexible Cable Laying',
  '1.5*5 Core Flexible Cable Laying',
  '6*5 Core Flexible Cable Laying',
  'Borewell Cable Laying',
  'Sump Cable Laying',
  'Garden Cable Laying',
  'UG Armoured Cable Laying',
  'DG Cable & Sensor Cable Laying',
  'Switch Box Fixing',
  'MCB Box Fixing',
  'False Ceiling Wiring',
  'Floor Groove Cutting',
  'Wall Groove Cutting',
  'DB Shifting',
  'TV Box Fixing',
  'Internet Box Fixing',
  'Removing Old Wiring & Fittings',
  'Pipe Laying (Open / Concealed)',
  'Complete House Wiring (Sqft Based)',
  'Video Door Phone Point',
  'UPS Point',
  'BESCOM Approval Charges',
  'Inspection Drawing Approval',
  'MRT Test Report',
  'Contractor & Supervisor Charges',
  'RMU Installation',
  'LT Kiosk Box Fixing',
  'LT Cable Laying',
  'HT Cable Laying',
  'Earthing Set',
  'Potted Installation',
  'Transformer Installation',
  'RMU Test',
  'Application & Agreement Charges',
  'Architect Plan Approval',
  'DMD Charges',
  'Estimate Cost',
  '3 Phase Meter Cost',
  'Master Meter CT Coil & Modem',
  'Single Phase Meter Cost',
];

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  onClearForm: () => void;
  onPreview: () => void;
  template: Template;
}

export function InvoiceForm({
  invoice,
  setInvoice,
  onClearForm,
  onPreview,
  template,
}: InvoiceFormProps) {
  const [itemSuggestions, setItemSuggestions] = useState<{ [key: string]: string[] }>({});
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

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

    // Handle item name suggestions
    if (field === 'item' && typeof value === 'string') {
      if (value.trim().length > 0) {
        const filtered = COMMON_ITEMS.filter(item =>
          item.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5); // Limit to 5 suggestions
        setItemSuggestions(prev => ({ ...prev, [id]: filtered }));
        setActiveItemId(id);
      } else {
        setItemSuggestions(prev => ({ ...prev, [id]: [] }));
        setActiveItemId(null);
      }
    }
  };

  const selectSuggestion = (itemId: string, suggestion: string) => {
    handleItemChange(itemId, 'item', suggestion);
    setItemSuggestions(prev => ({ ...prev, [itemId]: [] }));
    setActiveItemId(null);
  };

  const handleAddItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: uuidv4(), item: '', unit: 'Nos', quantity: 1, unitRate: 0 },
      ],
    }));
  };

  const handleRemoveItem = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleGeneratePDF = async () => {
    const input = document.getElementById('pdf-generator');
    if (!input) {
      console.error("PDF generation failed: element with id 'pdf-generator' not found.");
      alert("Sorry, something went wrong while generating the PDF. Please try again.");
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: input.scrollHeight,
        windowWidth: 800,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      let width = pdfWidth;
      let height = width / ratio;

      // If content is taller than one page, fit to page width
      if (height > pdfHeight) {
        height = pdfHeight;
        width = height * ratio;
      }

      const x = (pdfWidth - width) / 2;
      const y = 0;

      pdf.addImage(imgData, 'PNG', x, y, width, height, undefined, 'FAST');
      pdf.save(`${invoice.type}-${invoice.invoiceNumber || 'download'}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Sorry, something went wrong while generating the PDF. Please try again.");
    }
  };
  
  const docTitle = invoice.type === 'quotation' ? 'Quotation' : 'Invoice';

  return (
    <div className="space-y-8">
      {/* Hidden component for PDF generation */}
       <div className="fixed -left-[9999px] top-0 pointer-events-none">
         <div id="pdf-generator" style={{ width: '800px', minHeight: '1128px' }}>
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
            {/* Column Headers - Desktop Only */}
            <div className="hidden md:grid grid-cols-[2fr_100px_100px_100px_100px_auto] gap-2 text-xs font-semibold text-muted-foreground pb-2 border-b">
              <div>Item</div>
              <div>Unit</div>
              <div>Quantity</div>
              <div>Unit Rate</div>
              <div>Amount</div>
              <div></div>
            </div>
            
            {invoice.items.map((item) => (
              <div
                key={item.id}
                className="space-y-3 md:space-y-0 md:grid md:grid-cols-[2fr_100px_100px_100px_100px_auto] gap-2 items-start p-3 md:p-0 border md:border-0 rounded"
              >
                <div className="relative">
                  <div className="grid grid-cols-[80px_1fr] gap-2 items-center md:block">
                    <Label className="md:hidden text-sm font-medium">Item</Label>
                    <Textarea
                      placeholder="Item name"
                      value={item.item}
                      onChange={(e) =>
                        handleItemChange(item.id, 'item', e.target.value)
                      }
                      onBlur={() => {
                        setTimeout(() => {
                          setItemSuggestions(prev => ({ ...prev, [item.id]: [] }));
                          setActiveItemId(null);
                        }, 200);
                      }}
                      className="min-h-[40px]"
                    />
                  </div>
                  {itemSuggestions[item.id]?.length > 0 && activeItemId === item.id && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {itemSuggestions[item.id].map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => selectSuggestion(item.id, suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-center md:block">
                  <Label className="md:hidden text-sm font-medium">Unit</Label>
                  <Select
                    value={item.unit}
                    onValueChange={(value) =>
                      handleItemChange(item.id, 'unit', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nos">Nos</SelectItem>
                      <SelectItem value="Mtrs">Mtrs</SelectItem>
                      <SelectItem value="Lumpsum">Lumpsum</SelectItem>
                      <SelectItem value="Set">Set</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-center md:block">
                  <Label className="md:hidden text-sm font-medium">Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity || ''}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'quantity',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-center md:block">
                  <Label className="md:hidden text-sm font-medium">Unit Rate</Label>
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={item.unitRate || ''}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'unitRate',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-center md:block">
                  <Label className="md:hidden text-sm font-medium">Amount</Label>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={item.quantity * item.unitRate || ''}
                    readOnly
                    className="bg-muted [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="flex items-center justify-end md:items-end md:h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={invoice.items.length === 1}
                    className="md:mt-auto"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
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
        <Button onClick={onPreview} variant="secondary">Preview</Button>
        <Button onClick={handleGeneratePDF} variant="default">Download PDF</Button>
      </div>
    </div>
  );
}
