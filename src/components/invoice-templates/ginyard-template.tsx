'use client';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface GinyardTemplateProps {
  invoice: Invoice;
  accentColor: string;
}

export function GinyardTemplate({ invoice, accentColor }: GinyardTemplateProps) {
  const { company, client, items, total, subtotal, tax } = invoice;

  return (
    <div className="bg-white p-8 text-black font-sans text-sm">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <p className="text-gray-500">{company.address}</p>
            </div>
            {invoice.logoUrl && <Image src={invoice.logoUrl} alt="Company Logo" width={80} height={80} className="object-contain rounded-full" />}
        </div>
        
        <div style={{ backgroundColor: accentColor }} className="text-white p-4 my-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <div>
                <p># {invoice.invoiceNumber}</p>
                <p>Date: {invoice.invoiceDate}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
                <h3 className="font-bold mb-2">BILLED TO</h3>
                <p>{client.name}</p>
                <p>{client.address}</p>
                <p>{client.phone}</p>
            </div>
            <div className="text-right">
                <h3 className="font-bold mb-2">FROM</h3>
                <p>{company.name}</p>
                <p>{company.address}</p>
                <p>{company.phone}</p>
            </div>
        </div>

        <table className="w-full text-left mb-8">
            <thead>
                <tr className="border-b-2 border-black">
                    <th className="pb-2">DESCRIPTION</th>
                    <th className="text-center pb-2">QTY</th>
                    <th className="text-right pb-2">PRICE</th>
                    <th className="text-right pb-2">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">{formatCurrency(item.rate)}</td>
                        <td className="py-2 text-right">{formatCurrency(item.quantity * item.rate)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="flex justify-end">
            <div className="w-2/5 space-y-2 text-right">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between"><span>Tax ({tax}%)</span><span>{formatCurrency(subtotal * (tax / 100))}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-black"><span>TOTAL</span><span style={{color: accentColor}}>{formatCurrency(total)}</span></div>
            </div>
        </div>

        <div className="mt-12 text-center">
            <h3 className="text-lg font-bold mb-2" style={{color: accentColor}}>Thank You!</h3>
            <p className="text-xs text-gray-500">Payment is due by {invoice.dueDate}</p>
        </div>

    </div>
  );
}
