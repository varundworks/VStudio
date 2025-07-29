'use client';

import { format } from 'date-fns';
import type { InvoiceFormValues } from './invoice-form';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface InvoiceTemplateProps {
    data: InvoiceFormValues;
    themeColor: string;
}

interface BrandingInfo {
    name: string;
    email: string;
    logo: string;
    phone: string;
    web: string;
    area: string;
}

export function ModernTemplate({ data, themeColor }: InvoiceTemplateProps) {
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

  const subtotal = (data.items || []).reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const taxAmount = subtotal * ((Number(data.tax) || 0) / 100);
  const total = subtotal + taxAmount;

  if (!branding) {
    // You can return a loading state or a default template here
    return <div>Loading branding...</div>;
  }

  return (
    <div className="bg-white text-gray-800 font-sans p-8 text-sm w-full h-full">
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2">
           <Image
              src={branding.logo}
              alt="Company Logo"
              width={60}
              height={60}
              className="object-contain mb-4"
              data-ai-hint="logo company"
            />
          <p className="text-gray-500">From</p>
          <h2 className="text-lg font-bold text-gray-900 mt-1">{branding.name}</h2>
          <p className="text-xs text-gray-600 mt-1">{branding.area}</p>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-bold" style={{color: themeColor}}>INVOICE</h1>
          <p className="text-xs text-gray-500 mt-2">#001</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-10 mt-12">
        <div>
          <p className="text-gray-500 text-sm">Bill to</p>
          <h3 className="text-md font-bold mt-1">{data.clientName}</h3>
          {data.clientAddress && <p className="text-xs text-gray-600 mt-1">{data.clientAddress}</p>}
        </div>
        <div>
          <p className="text-gray-500 text-sm">Sent on</p>
          <p className="text-md font-bold mt-1">{data.invoiceDate ? format(data.invoiceDate, 'MMM dd, yyyy') : 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Due on</p>
          <p className="text-md font-bold mt-1">{data.dueDate ? format(data.dueDate, 'MMM dd, yyyy') : 'N/A'}</p>
        </div>
      </div>

      <div className="mt-12">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-gray-500 uppercase border-b border-gray-300">
              <th className="py-3 font-semibold">Description</th>
              <th className="py-3 text-center font-semibold">Qty</th>
              <th className="py-3 text-center font-semibold">Rate</th>
              <th className="py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {(data.items || []).map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-4">{item.description}</td>
                <td className="py-4 text-center">{Number(item.quantity) || 0}</td>
                <td className="py-4 text-center">${(Number(item.rate) || 0).toFixed(2)}</td>
                <td className="py-4 text-right">${((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-xs text-sm text-gray-800 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
             <span className="text-gray-600">Tax ({Number(data.tax) || 0}%)</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t-2 border-gray-300">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg" style={{color: themeColor}}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center text-xs text-gray-500">
        <p>Thank you for choosing us!</p>
        <p className="mt-1">{branding.email} | {branding.web}</p>
      </div>

    </div>
  );
}
