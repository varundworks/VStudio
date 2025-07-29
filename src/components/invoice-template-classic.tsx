
'use client';

import { format } from 'date-fns';
import type { InvoiceFormValues } from './invoice-form';
import Image from 'next/image';

interface BrandingInfo {
    name: string;
    email: string;
    logo: string;
    phone: string;
    web: string;
    area: string;
}

interface ClassicTemplateProps {
    data: InvoiceFormValues;
    brandingInfo: BrandingInfo;
}

export function ClassicTemplate({ data, brandingInfo }: ClassicTemplateProps) {
  const subtotal = (data.items || []).reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const taxAmount = subtotal * ((Number(data.tax) || 0) / 100);
  const total = subtotal + taxAmount;
  const themeColor = brandingInfo.themeColor || '#004E45';

  return (
    <div className="bg-white text-gray-900 font-sans p-8 text-sm w-full h-full">
      <header className="flex justify-between items-start pb-6 border-b-2" style={{borderColor: themeColor}}>
        <div>
           <Image
              src={brandingInfo.logo}
              alt="Company Logo"
              width={80}
              height={80}
              className="rounded-lg object-cover mb-4"
              data-ai-hint="logo company"
            />
          <h1 className="text-2xl font-bold" style={{color: themeColor}}>{brandingInfo.name}</h1>
          <div className="text-xs text-gray-500 mt-1">
            <p>{brandingInfo.area}</p>
            <p>{brandingInfo.email} | {brandingInfo.phone} | {brandingInfo.web}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold uppercase" style={{color: themeColor}}>Invoice</h2>
          <p className="text-sm text-gray-500 mt-2">Invoice #001</p>
          <p className="text-sm text-gray-500">Date: {data.invoiceDate ? format(data.invoiceDate, 'MMM dd, yyyy') : 'N/A'}</p>
          <p className="text-sm text-gray-500">Due Date: {data.dueDate ? format(data.dueDate, 'MMM dd, yyyy') : 'N/A'}</p>
        </div>
      </header>
      
      <section className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-gray-600 uppercase text-xs tracking-wider mb-2">Bill To</h3>
          <div className="text-sm">
            <p className="font-bold">{data.clientName}</p>
            {data.clientAddress && <p className="text-gray-600">{data.clientAddress}</p>}
            {data.clientPhone && <p className="text-gray-600">{data.clientPhone}</p>}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase" style={{backgroundColor: themeColor, color: 'white'}}>
              <th className="p-3 font-semibold">Description</th>
              <th className="p-3 text-center font-semibold">Quantity</th>
              <th className="p-3 text-center font-semibold">Rate</th>
              <th className="p-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(data.items || []).map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-center">{Number(item.quantity) || 0}</td>
                <td className="p-3 text-center">${(Number(item.rate) || 0).toFixed(2)}</td>
                <td className="p-3 text-right">${((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 flex justify-end">
        <div className="w-full max-w-sm text-sm text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({Number(data.tax) || 0}%)</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 mt-2 border-t-2 border-gray-200">
            <span className="font-bold text-base">Total</span>
            <span className="font-bold text-base">${total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <footer className="mt-16 text-center text-xs text-gray-500 border-t pt-4">
        <p>Thank you for your business!</p>
        <p className="mt-1">{brandingInfo.name} | {brandingInfo.email} | {brandingInfo.web}</p>
      </footer>
    </div>
  );
}
