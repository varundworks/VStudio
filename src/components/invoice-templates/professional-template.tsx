'use client';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface ProfessionalTemplateProps {
  invoice: Invoice;
}

export function ProfessionalTemplate({ invoice }: ProfessionalTemplateProps) {
  const { company, client, items, total, subtotal, tax, type } = invoice;
  const docTitle = type === 'quotation' ? 'Quotation' : 'Invoice';
  const accentColor = '#003366'; // Default color

  return (
    <div className="bg-white p-8 text-black font-sans text-sm min-h-[1128px] flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
                {invoice.logoUrl && <img src={invoice.logoUrl} alt="Company Logo" width={200} height={200} className="object-contain" />}
            </div>
            <div className="text-right">
                <h1 className="text-5xl font-extrabold uppercase" style={{ color: accentColor }}>{docTitle}</h1>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 pb-4 border-b">
            <div>
                <p className="font-bold">{company.name}</p>
                <p className="text-gray-600">{company.address}</p>
                <p className="text-gray-600">{company.phone} | {company.email}</p>
                <p className="text-gray-600">{company.website}</p>
            </div>
            <div className="text-right">
                <p><span className="font-bold">{docTitle} Number:</span> {invoice.invoiceNumber}</p>
                <p><span className="font-bold">Date of Issue:</span> {invoice.invoiceDate}</p>
                <p><span className="font-bold">Due Date:</span> {invoice.dueDate}</p>
            </div>
        </div>

        <div className="mb-8">
            <h3 className="font-bold mb-1">Bill To:</h3>
            <p className="font-semibold text-lg" style={{ color: accentColor }}>{client.name}</p>
            <p>{client.address}</p>
            <p>{client.phone}</p>
        </div>
        
        <table className="w-full mb-8">
            <thead style={{ backgroundColor: accentColor }}>
                <tr className="text-white">
                    <th className="text-left font-bold p-2">Item</th>
                    <th className="text-left font-bold p-2">Description</th>
                    <th className="text-center font-bold p-2">Unit</th>
                    <th className="text-center font-bold p-2">Qty</th>
                    <th className="text-right font-bold p-2">Unit Rate</th>
                    <th className="text-right font-bold p-2">Amount</th>
                </tr>
            </thead>
            <tbody className="bg-gray-100">
                {items.map(item => (
                    <tr key={item.id}>
                        <td className="p-2 border-b">{item.item}</td>
                        <td className="p-2 border-b">{item.description}</td>
                        <td className="p-2 border-b text-center">{item.unit}</td>
                        <td className="p-2 border-b text-center">{item.quantity}</td>
                        <td className="p-2 border-b text-right">{formatCurrency(item.unitRate)}</td>
                        <td className="p-2 border-b text-right">{formatCurrency(item.quantity * item.unitRate)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="flex justify-end">
            <div className="w-2/5 space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-700">Tax ({tax}%)</span>
                    <span>{formatCurrency(subtotal * (tax / 100))}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl p-2 rounded" style={{ backgroundColor: accentColor, color: 'white' }}>
                    <span>Amount Due</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>
        </div>

        <div className="mt-auto pt-16 text-center text-xs text-gray-500">
            <p>Thank you for your business.</p>
            <p>Please make payment by the due date.</p>
        </div>

    </div>
  );
}
