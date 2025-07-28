import { AppLayout } from '@/components/app-layout';
import { InvoiceForm } from '@/components/invoice-form';

export default function NewInvoicePage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">New Invoice</h1>
            <p className="text-muted-foreground">Create a new invoice for your client.</p>
        </header>
        <InvoiceForm />
      </div>
    </AppLayout>
  );
}
