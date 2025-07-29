
'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FilePlus, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import type { InvoiceFormValues } from '@/components/invoice-form';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/auth-context';

interface StoredInvoice extends InvoiceFormValues {
  id: string;
  total: number;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const storedInvoices = localStorage.getItem(`vstudio-invoices-${user.uid}`);
      if (storedInvoices) {
        setInvoices(JSON.parse(storedInvoices));
      }
    }
  }, [user]);

  const deleteInvoice = (invoiceId: string) => {
    const updatedInvoices = invoices.filter(inv => inv.id !== invoiceId);
    setInvoices(updatedInvoices);
    if(user) {
        localStorage.setItem(`vstudio-invoices-${user.uid}`, JSON.stringify(updatedInvoices));
    }
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Invoices</h1>
          <p className="text-muted-foreground">Here is a list of all your invoices.</p>
        </div>
        <Button asChild size="sm" className="gap-1">
          <Link href="/invoices/new">
            <FilePlus className="h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{invoice.invoiceDate ? format(new Date(invoice.invoiceDate), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                    <TableCell className="text-right">${invoice.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteInvoice(invoice.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No invoices yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
