'use client';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface ModernTemplateProps {
  invoice: Invoice;
  accentColor: string;
}

export function ModernTemplate({ invoice, accentColor }: ModernTemplateProps) {
  const { company, client, items, total, subtotal, tax } = invoice;

  return (
    <div className="bg-white p-10 text-black font-sans text-xs">
      <div className="grid grid-cols-2 gap-10">
        {/* Left Column */}
        <div>
            {invoice.logoUrl && <Image src={invoice.logoUrl} alt="Company Logo" width={100} height={100} className="object-contain mb-8" />}
            
            <div className="mb-8">
                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">From</h3>
                <p className="font-bold">{company.name}</p>
                <p className="text-gray-600">{company.address}</p>
                <p className="text-gray-600">{company.phone}</p>
            </div>
            
            <div className="mb-8">
                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">To</h3>
                <p className="font-bold">{client.name}</p>
                <p className="text-gray-600">{client.address}</p>
                <p className="text-gray-600">{client.phone}</p>
            </div>
        </div>

        {/* Right Column */}
        <div className="text-right">
            <h1 className="text-4xl font-thin uppercase mb-6">Invoice</h1>
            <div style={{ backgroundColor: accentColor, color: 'white' }} className="p-4 inline-block">
                <h2 className="text-2xl font-bold">{formatCurrency(total)}</h2>
                <p>Due: {invoice.dueDate}</p>
            </div>
            
            <div className="mt-8 text-gray-500">
                <p><span className="font-bold text-black">Invoice #</span> {invoice.invoiceNumber}</p>
                <p><span className="font-bold text-black">Date:</span> {invoice.invoiceDate}</p>
            </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mt-10">
        <table className="w-full">
            <thead>
                <tr className="border-b-2 border-black">
                    <th className="text-left font-bold uppercase tracking-widest text-[10px] pb-2">Description</th>
                    <th className="text-right font-bold uppercase tracking-widest text-[10px] pb-2">Amount</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id} className="border-b border-gray-200">
                        <td className="py-2">
                            <p className="font-bold">{item.description}</p>
                            <p className="text-gray-500">{item.quantity} x {formatCurrency(item.rate)}</p>
                        </td>
                        <td className="py-2 text-right font-bold">{formatCurrency(item.quantity * item.rate)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      {/* Totals */}
      <div className="mt-8 flex justify-end">
          <div className="w-1/3 text-right">
              <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Tax ({tax}%)</span>
                  <span className="font-bold">{formatCurrency(subtotal * (tax / 100))}</span>
              </div>
              <div className="flex justify-between text-lg p-2" style={{ backgroundColor: accentColor, color: 'white' }}>
                  <span className="font-bold">Total</span>
                  <span className="font-bold">{formatCurrency(total)}</span>
              </div>
          </div>
      </div>
    </div>
  );
}
