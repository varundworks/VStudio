
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FilePlus, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

const invoices = [
  { id: 'INV001', client: 'Acme Inc', amount: '$250.00', date: '2023-11-23' },
  { id: 'INV002', client: 'Stark Industries', amount: '$150.00', date: '2023-11-15' },
  { id: 'INV003', client: 'Wayne Enterprises', amount: '$350.00', date: '2023-11-10' },
  { id: 'INV004', client: 'Ollivander\'s Wand Shop', amount: '$450.00', date: '2023-10-25' },
  { id: 'INV005', client: 'Gekko & Co', amount: '$550.00', date: '2023-11-30' },
];

export default function InvoicesPage() {
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
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="text-right">{invoice.amount}</TableCell>
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
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
