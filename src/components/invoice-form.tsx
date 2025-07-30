
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from './ui/separator';
import { Trash2, PlusCircle, FileDown, Send, Eye, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceTemplate } from './invoice-template';
import { useAuth } from '@/contexts/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const invoiceSchema = z.object({
  clientName: z.string().min(1, 'Client name is required.'),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  invoiceDate: z.date(),
  dueDate: z.date(),
  items: z.array(
    z.object({
      description: z.string().min(1, 'Description is required.'),
      quantity: z.coerce.number().min(0),
      rate: z.coerce.number().min(0),
    })
  ).min(1, 'At least one item is required.'),
  tax: z.coerce.number().min(0).optional().default(0),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface BrandingInfo {
    name: string;
    email: string;
    phone: string;
    web: string;
    area: string;
    template: string;
    themeColor: string;
    logoUrl?: string;
}

interface InvoiceFormProps {
    logoUrl: string | null;
}


export function InvoiceForm({ logoUrl }: InvoiceFormProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [brandingInfo, setBrandingInfo] = useState<BrandingInfo | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
        const fetchSettings = async () => {
            const settingsDocRef = doc(db, 'settings', user.uid);
            const docSnap = await getDoc(settingsDocRef);
            if (docSnap.exists()) {
                setBrandingInfo(docSnap.data() as BrandingInfo);
            } else {
                 setBrandingInfo({
                    name: 'Your Company',
                    email: 'your@email.com',
                    phone: '',
                    web: '',
                    area: '',
                    template: 'classic',
                    themeColor: '#000000'
                });
            }
        };
        fetchSettings();
    }
  }, [user]);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: '',
      clientPhone: '',
      clientAddress: '',
      invoiceDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      items: [{ description: '', quantity: 1, rate: 0 }],
      tax: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });
  
  const watchItems = form.watch('items');
  const watchTax = form.watch('tax');
  const subtotal = watchItems.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const taxAmount = subtotal * ((Number(watchTax) || 0) / 100);
  const total = subtotal + taxAmount;

  function onSubmit(data: InvoiceFormValues) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save an invoice.' });
        return;
    }
    try {
      const storageKey = `vstudio-invoices-${user.uid}`;
      const storedInvoicesRaw = localStorage.getItem(storageKey);
      const storedInvoices = storedInvoicesRaw ? JSON.parse(storedInvoicesRaw) : [];
      
      const newInvoice = {
        ...data,
        id: `INV-${String(storedInvoices.length + 1).padStart(3, '0')}`,
        total: total,
        logoUrl: logoUrl,
      };

      storedInvoices.push(newInvoice);
      localStorage.setItem(storageKey, JSON.stringify(storedInvoices));

      toast({
          title: "Invoice Saved!",
          description: "Your invoice has been successfully saved as a draft.",
      });
    } catch (error) {
      console.error("Failed to save invoice to localStorage", error);
      toast({
        variant: 'destructive',
        title: 'Error saving invoice',
        description: 'Could not save your invoice. Your browser might be blocking local storage.',
      });
    }
  }
  
  const getBrandingInfoWithLogo = (): BrandingInfo | null => {
    if (!brandingInfo) return null;
    return { ...brandingInfo, logoUrl: logoUrl || brandingInfo.logoUrl };
  };

  const validateAndGetData = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
        toast({
            variant: 'destructive',
            title: 'Invalid Form',
            description: 'Please fill out all required fields.',
        });
        return null;
    }
    return form.getValues();
  }

  const handlePreview = async () => {
      const data = await validateAndGetData();
      if (data) {
          setIsPreviewOpen(true);
      }
  }

  const handleGeneratePDF = async () => {
    const data = await validateAndGetData();
    const finalBrandingInfo = getBrandingInfoWithLogo();
    if (!data || !finalBrandingInfo) return;
    
    setIsGeneratingPDF(true);
    const invoiceElement = document.createElement('div');
    invoiceElement.id = 'invoice-pdf-temp-container';
    invoiceElement.style.position = 'absolute';
    invoiceElement.style.left = '-9999px';
    invoiceElement.style.top = '-9999px';
    document.body.appendChild(invoiceElement);
    
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(invoiceElement);
    root.render(
        <div className="w-[210mm]">
            <InvoiceTemplate data={data} brandingInfo={finalBrandingInfo} />
        </div>
    );
    
    // Wait for images to load before generating PDF
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const canvas = await html2canvas(invoiceElement.firstChild as HTMLElement, { 
            scale: 2,
            useCORS: true, // Important for external images
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgProperties = pdf.getImageProperties(imgData);
        const imgWidth = imgProperties.width;
        const imgHeight = imgProperties.height;

        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`invoice-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
            variant: 'destructive',
            title: 'Error generating PDF',
            description: 'An unexpected error occurred. Please try again.',
        });
    } finally {
        root.unmount();
        document.body.removeChild(invoiceElement);
        setIsGeneratingPDF(false);
    }
  };


  return (
    <>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl h-[90vh]">
            <DialogHeader>
                <DialogTitle>Invoice Preview</DialogTitle>
            </DialogHeader>
            <div className="overflow-auto h-full border rounded-md">
              {brandingInfo && <InvoiceTemplate data={form.getValues()} brandingInfo={getBrandingInfoWithLogo()!}/>}
            </div>
        </DialogContent>
      </Dialog>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
                <h2 className="font-semibold">Client Information</h2>
                <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Client's full name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Client's phone number" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="clientAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address (Optional)</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Client's mailing address" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <div className="space-y-4">
                <h2 className="font-semibold">Dates</h2>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="invoiceDate"
                        render={({ field }) => (
                            <FormItem>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : <span>Pick invoice date</span>}
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : <span>Pick due date</span>}
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="font-semibold">Invoice Items</h2>
                <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                            <X className="h-4 w-4" />
                        </Button>
                        <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Service or product description"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-3 gap-4">
                             <FormField
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`items.${index}.rate`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rate</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Total</FormLabel>
                                <Input value={( (Number(watchItems[index].quantity) || 0) * (Number(watchItems[index].rate) || 0) ).toFixed(2)} disabled className="font-mono"/>
                            </FormItem>
                        </div>
                    </div>
                ))}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ description: '', quantity: 1, rate: 0 })}
                    className="w-full"
                >
                    Add Item
                </Button>
            </div>
            
            <div className="space-y-4">
                <h2 className="font-semibold">Summary</h2>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <FormField
                            control={form.control}
                            name="tax"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel className="pt-2">Tax (%)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" {...field} className="w-24" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <span className="font-mono">${taxAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="font-mono">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>


            <div className="flex flex-col gap-2 pt-4">
              <Button type="submit" variant="secondary" className="w-full">Save Draft</Button>
              <Button type="button" variant="secondary" className="w-full" onClick={handlePreview}>
                  Preview
              </Button>
              <Button type="button" variant="secondary" className="w-full" onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? 'Generating...' : 'Generate PDF'}
              </Button>
              <Button type="button" className="w-full">
                <Send className="mr-2 h-4 w-4"/>
                Send Invoice
              </Button>
            </div>
        </form>
      </Form>
    </>
  );
}

    