'use client';

import { format } from 'date-fns';
import type { InvoiceFormValues } from './invoice-form';
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

export function ProfessionalTemplate({ data, themeColor }: InvoiceTemplateProps) {
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
  
  const headerStyle = {
    background: `linear-gradient(to right, ${themeColor}, #0055a5)`,
  };
  const thStyle = {
    backgroundColor: themeColor,
  }

  return (
    <div className="bg-white text-gray-900 font-sans p-8 text-sm w-full h-full">
      <div style={headerStyle} className="color-white p-5 flex justify-between items-center text-white">
        <div className="text-3xl font-bold">INVOICE</div>
        <div className="text-base">NO: INV-12345-1</div>
      </div>

      <div className="flex justify-between mt-5">
        <div className="w-[45%]">
          <p className="font-bold">Bill To:</p>
          <p>{data.clientName}</p>
          {data.clientPhone && <p>{data.clientPhone}</p>}
          {data.clientAddress && <p>{data.clientAddress}</p>}
        </div>
        <div className="w-[45%]">
          <p className="font-bold">From:</p>
          <p>{branding.name}</p>
          <p>{branding.phone}</p>
          <p>{branding.area}</p>
        </div>
      </div>

      <div className="my-5">
        <strong>Date:</strong> {data.invoiceDate ? format(data.invoiceDate, 'dd MMMM yyyy') : 'N/A'}
      </div>

      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            <th style={thStyle} className="border border-gray-300 p-2.5 text-white">Description</th>
            <th style={thStyle} className="border border-gray-300 p-2.5 text-white">Qty</th>
            <th style={thStyle} className="border border-gray-300 p-2.5 text-white">Price</th>
            <th style={thStyle} className="border border-gray-300 p-2.5 text-white">Total</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || []).map((item, idx) => (
            <tr key={idx}>
              <td className="border border-gray-300 p-2.5">{item.description}</td>
              <td className="border border-gray-300 p-2.5">{Number(item.quantity) || 0}</td>
              <td className="border border-gray-300 p-2.5">${(Number(item.rate) || 0).toFixed(2)}</td>
              <td className="border border-gray-300 p-2.5">${((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mt-2.5 font-bold">
        Sub Total: ${subtotal.toFixed(2)}
      </div>
      <div className="text-right mt-2.5 font-bold">
        Tax ({Number(data.tax) || 0}%): ${taxAmount.toFixed(2)}
      </div>
      <div className="text-right mt-2.5 font-bold">
        Total: ${total.toFixed(2)}
      </div>


      <div className="mt-8">
        <strong>Note:</strong>
        <p>______________________________________</p>
      </div>

      <div className="mt-8">
        <strong>Payment Information:</strong>
        <p><strong>Bank:</strong> Name Bank</p>
        <p><strong>No Bank:</strong> 123-456-7890</p>
        <p><strong>Email:</strong> {branding.email}</p>
      </div>

      <div className="text-right text-2xl font-bold mt-10" style={{color: themeColor}}>
        Thank You!
      </div>
    </div>
  );
}
