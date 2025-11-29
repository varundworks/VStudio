'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, FileSignature } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {user?.name}! Quick access to create documents.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto w-full">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/invoices/new?type=invoice')}>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Create Invoice</CardTitle>
            <CardDescription>
              Generate a new invoice for your clients
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full" onClick={() => router.push('/invoices/new?type=invoice')}>
              New Invoice
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/invoices/new?type=quotation')}>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FileSignature className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Create Quotation</CardTitle>
            <CardDescription>
              Generate a new quotation for potential work
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full" onClick={() => router.push('/invoices/new?type=quotation')}>
              New Quotation
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Fill in the details, preview, and download your documents instantly.
        </p>
      </div>
    </div>
  );
}
