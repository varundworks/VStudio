'use client';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface GinyardTemplateProps {
  invoice: Invoice;
}

export function GinyardTemplate({ invoice }: GinyardTemplateProps) {
  const { company, client, items, total, subtotal, tax, type } = invoice;
  const docTitle = type === 'quotation' ? 'QUOTATION' : 'INVOICE';
  const secondaryColor = '#ADD8E6'; // Light Blue
  const accentColor = '#4682B4'; // Steel Blue
  const textColor = '#000080'; // Navy

  return (
    <div
      className="font-sans text-sm rounded-lg overflow-hidden flex flex-col min-h-[1128px]"
      style={{ backgroundColor: secondaryColor, color: textColor }}
    >
      <header className="p-8">
        <div className="flex items-center gap-4">
          {invoice.logoUrl && (
            <img
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
          <p><span className="font-bold">{docTitle} NO:</span> {invoice.invoiceNumber}</p>
          <p>{invoice.invoiceDate}</p>
        </div>
      </div>

      <div className="px-8 py-4">
        <div className="bg-white bg-opacity-50 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead style={{ backgroundColor: accentColor, color: 'white' }}>
              <tr>
                <th className="p-3 text-left font-bold">ITEM</th>
                <th className="p-3 text-left font-bold">DESCRIPTION</th>
                <th className="p-3 text-center font-bold">UNIT</th>
                <th className="p-3 text-center font-bold">QTY</th>
                <th className="p-3 text-right font-bold">UNIT RATE</th>
                <th className="p-3 text-right font-bold">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b" style={{ borderColor: accentColor }}>
                  <td className="p-3 text-left">{item.item}</td>
                  <td className="p-3 text-left">{item.description}</td>
                  <td className="p-3 text-center">{item.unit}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">{formatCurrency(item.unitRate)}</td>
                  <td className="p-3 text-right">{formatCurrency(item.quantity * item.unitRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end px-8 py-4">
          <div className="w-full max-w-xs text-xs space-y-2">
            <div className="flex justify-between p-2 rounded-md bg-white bg-opacity-50">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-white bg-opacity-50">
              <span>Tax ({tax}%)</span>
              <span>{formatCurrency(subtotal * (tax / 100))}</span>
            </div>
            <div className="flex justify-between p-2 font-bold text-base rounded-md bg-white bg-opacity-50">
              <span>Amount Due</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>


      <div className="mt-auto p-8 text-center text-gray-700 text-xs">
        <p className="font-bold mb-2">Thank you for your business!</p>
        <p>Payment is due by {invoice.dueDate}</p>
        <p className="mt-4">{company.website}</p>
      </div>
    </div>
  );
}
