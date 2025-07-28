'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Trash2, PlusCircle, Sparkles, FileDown, Send } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { getAIDescription } from '@/app/invoices/new/actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required.'),
  invoiceDate: z.date(),
  dueDate: z.date(),
  items: z.array(
    z.object({
      description: z.string().min(1, 'Description is required.'),
      quantity: z.coerce.number().min(0),
      rate: z.coerce.number().min(0),
    })
  ).min(1, 'At least one item is required.'),
  tax: z.coerce.number().min(0).optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const mockClients = [
    { id: '1', name: 'Acme Inc.' },
    { id: '2', name: 'Stark Industries' },
    { id: '3', name: 'Wayne Enterprises' },
];

function AIDescriptionDialog({ onGenerate }: { onGenerate: (description: string) => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const serviceType = formData.get('serviceType') as string;
        const hoursWorked = formData.get('hoursWorked') as string;
        const flatRate = formData.get('flatRate') as string;
        const additionalDetails = formData.get('additionalDetails') as string;

        try {
            const description = await getAIDescription({
                serviceType,
                hoursWorked: hoursWorked ? parseFloat(hoursWorked) : undefined,
                flatRate: flatRate ? parseFloat(flatRate) : undefined,
                additionalDetails,
            });
            onGenerate(description);
            setOpen(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error generating description',
                description: 'An unexpected error occurred. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" type="button">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="sr-only">Generate with AI</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Service Description Assistant</DialogTitle>
                    <DialogDescription>
                        Provide some details and let AI write a professional service description for you.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="serviceType">Service Type</Label>
                            <Input id="serviceType" name="serviceType" placeholder="e.g., Web Design, Consultation" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="hoursWorked">Hours Worked (optional)</Label>
                                <Input id="hoursWorked" name="hoursWorked" type="number" step="0.1" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="flatRate">Flat Rate (optional)</Label>
                                <Input id="flatRate" name="flatRate" type="number" step="0.01" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="additionalDetails">Additional Details (optional)</Label>
                            <Textarea id="additionalDetails" name="additionalDetails" placeholder="e.g., Included 3 rounds of revisions" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Generating..." : "Generate Description"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function InvoiceForm() {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: '',
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
  
  const { toast } = useToast();

  function onSubmit(data: InvoiceFormValues) {
    console.log(data);
    toast({
        title: "Invoice Saved!",
        description: "Your invoice has been successfully saved as a draft.",
    });
  }
  
  const watchItems = form.watch('items');
  const watchTax = form.watch('tax');
  const subtotal = watchItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.rate || 0), 0);
  const taxAmount = subtotal * ((watchTax || 0) / 100);
  const total = subtotal + taxAmount;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Client</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a client" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {mockClients.map(client => (
                                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Invoice Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                />
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
                        <FormItem className="flex flex-col">
                            <FormLabel>Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start p-4 border rounded-lg">
                        <div className="grid gap-2 flex-1">
                            <Label>Description</Label>
                            <div className="flex">
                                <Textarea {...form.register(`items.${index}.description`)} className="rounded-r-none"/>
                                <AIDescriptionDialog onGenerate={(desc) => form.setValue(`items.${index}.description`, desc)} />
                            </div>
                            <FormMessage>{form.formState.errors.items?.[index]?.description?.message}</FormMessage>
                        </div>
                        <div className="grid gap-2">
                             <Label>Quantity</Label>
                            <Input type="number" {...form.register(`items.${index}.quantity`)} />
                        </div>
                        <div className="grid gap-2">
                             <Label>Rate</Label>
                            <Input type="number" step="0.01" {...form.register(`items.${index}.rate`)} />
                        </div>
                         <div className="grid gap-2">
                             <Label>Total</Label>
                            <Input value={(watchItems[index].quantity * watchItems[index].rate).toFixed(2)} disabled className="font-mono"/>
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                            className="mt-auto"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ description: '', quantity: 1, rate: 0 })}
                    className="mt-4"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </CardContent>
            <CardFooter className="flex-col items-end gap-2">
                <Separator />
                <div className="grid grid-cols-2 gap-4 pt-4 w-full max-w-sm">
                    <p>Subtotal</p>
                    <p className="text-right font-mono">${subtotal.toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center w-full max-w-sm">
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
                    <p className="text-right font-mono">${taxAmount.toFixed(2)}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm font-bold text-lg">
                    <p>Total</p>
                    <p className="text-right font-mono">${total.toFixed(2)}</p>
                </div>
            </CardFooter>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="submit" variant="secondary">Save Draft</Button>
          <Button type="button" variant="outline" className="text-primary border-primary hover:bg-primary/5 hover:text-primary">
            <FileDown className="mr-2 h-4 w-4"/>
            Generate PDF
          </Button>
          <Button type="button" className="bg-accent hover:bg-accent/90">
            <Send className="mr-2 h-4 w-4"/>
            Send Invoice
          </Button>
        </div>
      </form>
    </Form>
  );
}
