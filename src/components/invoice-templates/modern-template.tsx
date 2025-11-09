'use client';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface ModernTemplateProps {
  invoice: Invoice;
  accentColor: string;
  secondaryColor: string;
}

export function ModernTemplate({ invoice, accentColor, secondaryColor }: ModernTemplateProps) {
  const { company, client, items, total, subtotal, tax, type } = invoice;
  const docTitle = type === 'quotation' ? 'QUOTATION' : 'INVOICE';

  return (
    <div className="bg-white text-black font-sans text-sm flex flex-col min-h-full">
      <div
        className="relative text-white h-[180px] w-full"
        style={{
          background: `linear-gradient(to bottom right, ${secondaryColor} 50%, ${accentColor} 50%)`,
          borderBottomLeftRadius: '100% 80px',
          borderBottomRightRadius: '100% 80px',
        }}
      >
        {invoice.logoUrl && (
          <Image
            src={invoice.logoUrl}
            alt="Company Logo"
            width={150}
            height={150}
            className="object-contain absolute top-5 left-8"
          />
        )}
        <h1 className="absolute top-5 right-8 text-3xl font-bold">{docTitle}</h1>
      </div>

      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="font-bold text-base mb-1">BILLING TO:</h3>
            <p className="font-semibold">{client.name}</p>
            <p>{client.address}</p>
            <p>{client.phone}</p>
          </div>
          <div className="text-right text-sm">
            <p>
              <span className="font-semibold">{docTitle} No :</span> #{invoice.invoiceNumber}
            </p>
            <p>
              <span className="font-semibold">{docTitle} Date :</span> {invoice.invoiceDate}
            </p>
            <p>
              <span className="font-semibold">Due Date :</span> {invoice.dueDate}
            </p>
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ backgroundColor: accentColor, color: 'white' }}>
              <th className="border border-gray-300 p-2.5 text-left">ITEM NAME</th>
              <th className="border border-gray-300 p-2.5">PRICE</th>
              <th className="border border-gray-300 p-2.5">QTY</th>
              <th className="border border-gray-300 p-2.5 text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-2.5">{item.description}</td>
                <td className="border border-gray-300 p-2.5 text-center">{formatCurrency(item.rate)}</td>
                <td className="border border-gray-300 p-2.5 text-center">{item.quantity}</td>
                <td className="border border-gray-300 p-2.5 text-right">{formatCurrency(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 flex justify-end">
          <div className="w-[300px]">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="p-2 text-left">SUB TOTAL</td>
                  <td className="p-2 text-right">{formatCurrency(subtotal)}</td>
                </tr>
                <tr>
                  <td className="p-2 text-left">TAX ({tax}%)</td>
                  <td className="p-2 text-right">{formatCurrency(subtotal * (tax / 100))}</td>
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold">TOTAL</td>
                  <td className="p-2 text-right font-bold">{formatCurrency(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 text-right font-bold">SIGNATURE</div>
      </div>

      <div
        className="text-white p-4 text-xs mt-auto flex justify-between items-center"
        style={{ backgroundColor: secondaryColor, borderTop: `5px solid ${accentColor}` }}
      >
        <span>{company.website}</span>
        <div className="flex gap-4 items-center">
          <span>&#128222; {company.phone}</span>
          <span>&#128231; {company.email}</span>
        </div>
      </div>
    </div>
  );
}
