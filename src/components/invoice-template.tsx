'use client';

import { format } from 'date-fns';
import type { InvoiceFormValues } from './invoice-form';
import VStudioIcon from './v-studio-icon';

interface InvoiceTemplateProps {
    data: InvoiceFormValues;
    clients: { id: string; name: string; address: string; email: string; }[];
}

export function InvoiceTemplate({ data, clients }: InvoiceTemplateProps) {
  const client = clients.find(c => c.id === data.clientId);

  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity || 0) * (item.rate || 0), 0);
  const taxAmount = subtotal * ((data.tax || 0) / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="a4-page p-8 bg-white text-gray-900 font-sans text-sm">
      <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <VStudioIcon className="h-16 w-16 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Company Name</h1>
            <p className="text-gray-500">123 Your Street, Your City, ST 12345</p>
            <p className="text-gray-500">your.email@example.com</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-bold text-gray-700 uppercase tracking-wider">Invoice</h2>
          <p className="text-gray-500 mt-2">#INV-001</p>
        </div>
      </header>
      
      <section className="grid grid-cols-2 gap-8 my-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
          <p className="font-bold text-gray-800">{client?.name || 'Select a client'}</p>
          <p className="text-gray-600">{client?.address}</p>
          <p className="text-gray-600">{client?.email}</p>
        </div>
        <div className="text-right">
          <div className="grid grid-cols-2">
            <p className="font-semibold text-gray-600">Invoice Date:</p>
            <p>{format(data.invoiceDate, 'PPP')}</p>
          </div>
          <div className="grid grid-cols-2 mt-1">
            <p className="font-semibold text-gray-600">Due Date:</p>
            <p>{format(data.dueDate, 'PPP')}</p>
          </div>
        </div>
      </section>
      
      <section>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-600 uppercase">Description</th>
              <th className="p-3 w-24 text-right font-semibold text-gray-600 uppercase">Qty</th>
              <th className="p-3 w-32 text-right font-semibold text-gray-600 uppercase">Rate</th>
              <th className="p-3 w-32 text-right font-semibold text-gray-600 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.items.map((item, index) => (
              <tr key={index}>
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-right">{item.quantity}</td>
                <td className="p-3 text-right">${item.rate.toFixed(2)}</td>
                <td className="p-3 text-right">${(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      <section className="flex justify-end mt-8">
        <div className="w-full max-w-xs space-y-2 text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({data.tax || 0}%)</span>
            <span className="font-mono">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500">
        <p>Thank you for your business!</p>
        <p>Please make payment within 30 days.</p>
      </footer>
    </div>
  );
}
