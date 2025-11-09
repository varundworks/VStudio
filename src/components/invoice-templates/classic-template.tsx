'use client';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface ClassicTemplateProps {
  invoice: Invoice;
  accentColor: string;
  secondaryColor: string;
}

export function ClassicTemplate({ invoice, accentColor }: ClassicTemplateProps) {
  const { company, client, items, total, subtotal, tax, type } = invoice;
  const docTitle = type === 'quotation' ? 'QUOTATION' : 'INVOICE';

  return (
    <div className="bg-white p-8 text-black font-serif text-sm">
      <header className="flex justify-between items-start mb-10 border-b-2 pb-4" style={{ borderColor: accentColor }}>
        <div>
          {invoice.logoUrl && <Image src={invoice.logoUrl} alt="Company Logo" width={180} height={180} className="object-contain" />}
          <h1 className="text-4xl font-bold mt-4" style={{ color: accentColor }}>{docTitle}</h1>
          <p className="text-gray-500">{docTitle === 'INVOICE' ? 'Invoice' : 'Quotation'} #: {invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">{company.name}</h2>
          <p>{company.address}</p>
          <p>{company.email}</p>
          <p>{company.phone}</p>
          <p>{company.website}</p>
        </div>
      </header>

      <section className="flex justify-between mb-10">
        <div>
          <h3 className="font-bold text-gray-600 mb-2">BILL TO</h3>
          <p className="font-semibold">{client.name}</p>
          <p>{client.address}</p>
          <p>{client.phone}</p>
        </div>
        <div className="text-right">
          <p><span className="font-bold">{docTitle === 'INVOICE' ? 'Invoice' : 'Quotation'} Date:</span> {invoice.invoiceDate}</p>
          <p><span className="font-bold">Due Date:</span> {invoice.dueDate}</p>
        </div>
      </section>

      <section className="mb-10">
        <table className="w-full">
          <thead style={{ backgroundColor: accentColor, color: 'white' }}>
            <tr>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-center">Quantity</th>
              <th className="p-2 text-right">Rate</th>
              <th className="p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.description}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-right">{formatCurrency(item.rate)}</td>
                <td className="p-2 text-right">{formatCurrency(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between">
            <span className="font-bold">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Tax ({tax}%):</span>
            <span>{formatCurrency(subtotal * (tax / 100))}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-xl" style={{ color: accentColor }}>
            <span>TOTAL:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
