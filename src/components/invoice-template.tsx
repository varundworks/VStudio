'use client';

import { format } from 'date-fns';
import type { InvoiceFormValues } from './invoice-form';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface InvoiceTemplateProps {
    data: InvoiceFormValues;
    clients: { id: string; name: string; address: string; email: string; phone: string; }[];
}

interface BrandingInfo {
    name: string;
    email: string;
    logo: string;
    phone: string;
    web: string;
    area: string;
}

export function InvoiceTemplate({ data, clients }: InvoiceTemplateProps) {
  const [branding, setBranding] = useState<BrandingInfo | null>(null);

  useEffect(() => {
    // Cannot access localStorage on the server, so we do it in useEffect.
    const savedName = localStorage.getItem('vstudio-name') || 'Your Company';
    const savedEmail = localStorage.getItem('vstudio-email') || 'your@email.com';
    const savedLogo = localStorage.getItem('vstudio-logo') || 'https://placehold.co/80x80.png';
    const savedPhone = localStorage.getItem('vstudio-phone') || '+999 123 456 789';
    const savedWeb = localStorage.getItem('vstudio-web') || 'www.domain.com';
    const savedArea = localStorage.getItem('vstudio-area') || '123 Street, Town, Postal';
    setBranding({ name: savedName, email: savedEmail, logo: savedLogo, phone: savedPhone, web: savedWeb, area: savedArea });
  }, []);

  const client = clients.find(c => c.id === data.clientId);

  const subtotal = (data.items || []).reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const taxAmount = subtotal * ((Number(data.tax) || 0) / 100);
  const total = subtotal + taxAmount;

  if (!branding) {
    // You can return a loading state or a default template here
    return <div>Loading branding...</div>;
  }

  return (
    <div className="bg-white text-gray-900 font-sans p-10 text-sm shadow-lg max-w-4xl mx-auto border border-gray-200 rounded">
      <div className="flex justify-between items-start">
        <div>
           <Image
              src={branding.logo}
              alt="Company Logo"
              width={80}
              height={80}
              className="rounded-lg object-cover mb-2"
              data-ai-hint="logo company"
            />
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Phone:</strong> {branding.phone}</p>
            <p><strong>Email:</strong> {branding.email}</p>
            <p><strong>Web:</strong> {branding.web}</p>
            <p><strong>Area:</strong> {branding.area}</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs text-gray-600">To:</p>
          <p className="font-semibold">{client?.name}</p>
          <p className="text-xs">{client?.address}</p>
          <p className="text-xs">{client?.email}</p>
          <p className="text-xs">{client?.phone}</p>
        </div>
      </div>
      <div className="mt-8 mb-4 text-right text-sm text-gray-600 space-y-1">
        <p><strong>Invoice No:</strong> {'001'}</p>
        <p><strong>Account No:</strong> {'XXXX'}</p>
        <p><strong>Date:</strong> {data.invoiceDate ? format(data.invoiceDate, 'dd/MM/yyyy') : 'N/A'}</p>
      </div>
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
      <div className="mt-8 text-xs text-gray-700">
        <p className="font-bold mb-1">PAYMENT INFO</p>
        <p>Paypal: paypal@company.com</p>
        <p>Payment: Visa, Master Card</p>
        <p>We accept cheque</p>
      </div>
      <div className="mt-8 flex justify-between items-center text-xs text-gray-600">
        <div>
          <p>Thank you for your business!</p>
          <p className="text-[10px]">Terms: Payment due within 30 days</p>
        </div>
        <div className="text-right">
          <p className="font-bold">{branding.name}</p>
          <p>Accounting Manager</p>
        </div>
      </div>
    </div>
  );
}
