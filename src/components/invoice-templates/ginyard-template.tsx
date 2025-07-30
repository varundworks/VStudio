'use client';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface GinyardTemplateProps {
  invoice: Invoice;
  accentColor: string;
  secondaryColor: string;
}

export function GinyardTemplate({ invoice, accentColor, secondaryColor }: GinyardTemplateProps) {
  const { company, client, items, total, subtotal, tax } = invoice;

  return (
    <div
      className="text-white font-sans text-sm rounded-lg overflow-hidden flex flex-col min-h-full"
      style={{ backgroundColor: secondaryColor }}
    >
      <header className="p-8">
        <div className="flex items-center gap-4">
          {invoice.logoUrl && (
            <Image
              src={invoice.logoUrl}
              alt="Company Logo"
              width={80}
              height={80}
              className="object-contain rounded-md"
            />
          )}
          <span className="text-2xl font-bold">{company.name}</span>
        </div>
      </header>

      <div className="flex justify-between px-8 py-4">
        <div className="text-xs leading-relaxed">
          <p className="font-bold">ISSUED TO:</p>
          <p>{client.name}</p>
          <p>{client.address}</p>
          <p>{client.phone}</p>
        </div>
        <div className="text-right text-xs">
          <p><span className="font-bold">INVOICE NO:</span> {invoice.invoiceNumber}</p>
          <p>{invoice.invoiceDate}</p>
        </div>
      </div>

      <div className="px-8 py-4">
        <div className="bg-black bg-opacity-20 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead style={{ backgroundColor: accentColor }}>
              <tr>
                <th className="p-3 text-left font-bold">DESCRIPTION</th>
                <th className="p-3 text-center font-bold">QTY</th>
                <th className="p-3 text-right font-bold">RATE</th>
                <th className="p-3 text-right font-bold">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b" style={{ borderColor: accentColor }}>
                  <td className="p-3 text-left">{item.description}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">{formatCurrency(item.rate)}</td>
                  <td className="p-3 text-right">{formatCurrency(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end px-8 py-4">
          <div className="w-full max-w-xs text-xs space-y-2">
            <div className="flex justify-between p-2 rounded-md bg-black bg-opacity-20">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-black bg-opacity-20">
              <span>Tax ({tax}%)</span>
              <span>{formatCurrency(subtotal * (tax / 100))}</span>
            </div>
            <div className="flex justify-between p-2 font-bold text-base rounded-md bg-black bg-opacity-20">
              <span>Amount Due</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>


      <div className="mt-auto p-8 text-center text-gray-300 text-xs">
        <p className="font-bold mb-2">Thank you for your business!</p>
        <p>Payment is due by {invoice.dueDate}</p>
        <p className="mt-4">{company.website}</p>
      </div>
    </div>
  );
}
