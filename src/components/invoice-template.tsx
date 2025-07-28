'use client';

import { format } from 'date-fns';
import type { InvoiceFormValues } from './invoice-form';

interface InvoiceTemplateProps {
    data: InvoiceFormValues;
    clients: { id: string; name: string; address: string; email: string; }[];
}

export function InvoiceTemplate({ data, clients }: InvoiceTemplateProps) {
  const client = clients.find(c => c.id === data.clientId);

  const subtotal = (data.items || []).reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const taxAmount = subtotal * ((Number(data.tax) || 0) / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="bg-white text-gray-900 font-sans p-10 text-sm shadow-lg max-w-4xl mx-auto border border-gray-200 rounded">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-3xl font-bold text-amber-500 mb-2">LOREM</div>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Phone:</strong> +999 123 456 789</p>
            <p><strong>Email:</strong> info@yourname.com</p>
            <p><strong>Web:</strong> www.domain.com</p>
            <p><strong>Area:</strong> 123 Street, Town, Postal</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs text-gray-600">To:</p>
          <p className="font-semibold">{client?.name}</p>
          <p className="text-xs">{client?.address}</p>
          <p className="text-xs">{client?.email}</p>
          <p className="text-xs">+000 0000 000</p>
        </div>
      </div>

      {/* INVOICE HEADER */}
      <div className="mt-8 mb-4 text-right text-sm text-gray-600 space-y-1">
        <p><strong>Invoice No:</strong> {'001'}</p>
        <p><strong>Account No:</strong> {'XXXX'}</p>
        <p><strong>Date:</strong> {data.invoiceDate ? format(data.invoiceDate, 'dd/MM/yyyy') : 'N/A'}</p>
      </div>

      {/* TABLE */}
      <div className="mt-6">
        <table className="w-full border-collapse text-left">
          <thead className="bg-amber-400 text-zinc-800 uppercase text-xs">
            <tr>
              <th className="p-2">Item Description</th>
              <th className="p-2 text-center">Price</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(data.items || []).map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2 text-gray-700">
                  <div className="font-semibold">{item.description}</div>
                  <p className="text-xs text-gray-500">Service work</p>
                </td>
                <td className="p-2 text-center">${(Number(item.rate) || 0).toFixed(2)}</td>
                <td className="p-2 text-center">{Number(item.quantity) || 0}</td>
                <td className="p-2 text-right">${((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS */}
      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-xs text-sm space-y-1">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax Vat ({Number(data.tax) || 0}%)</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between bg-amber-500 text-white font-bold p-2 mt-2 rounded">
            <span>Grand Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* PAYMENT INFO */}
      <div className="mt-8 text-xs text-gray-700">
        <p className="font-bold mb-1">PAYMENT INFO</p>
        <p>Paypal: paypal@company.com</p>
        <p>Payment: Visa, Master Card</p>
        <p>We accept cheque</p>
      </div>

      {/* FOOTER */}
      <div className="mt-8 flex justify-between items-center text-xs text-gray-600">
        <div>
          <p>Thank you for your business!</p>
          <p className="text-[10px]">Terms: Payment due within 30 days</p>
        </div>
        <div className="text-right">
          <p className="font-bold">Thomas Daney</p>
          <p>Accounting Manager</p>
        </div>
      </div>
    </div>
  );
}
