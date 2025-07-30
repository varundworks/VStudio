
'use client';

import { format } from 'date-fns';
import type { InvoiceFormValues } from './invoice-form';
import Image from 'next/image';

interface BrandingInfo {
    name: string;
    email: string;
    phone: string;
    web: string;
    area: string;
    themeColor: string;
    logoUrl?: string;
}

interface ProfessionalTemplateProps {
    data: InvoiceFormValues;
    brandingInfo: BrandingInfo & { themeColor: string };
}

export function ProfessionalTemplate({ data, brandingInfo }: ProfessionalTemplateProps) {
  const subtotal = (data.items || []).reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const taxAmount = subtotal * ((Number(data.tax) || 0) / 100);
  const total = subtotal + taxAmount;
  const themeColor = brandingInfo.themeColor || '#000000';
  
  const headerStyle = {
    backgroundColor: themeColor,
  };
  const thStyle = {
    backgroundColor: themeColor,
  }

  return (
    <div className="bg-white text-gray-900 font-sans p-8 text-sm w-full h-full">
      <div style={headerStyle} className="color-white p-5 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
            {brandingInfo.logoUrl && (
              <div className="w-16 h-16 relative">
                  <Image src={brandingInfo.logoUrl} alt={`${brandingInfo.name} Logo`} layout="fill" objectFit="contain" />
              </div>
            )}
            <div className="text-3xl font-bold">INVOICE</div>
        </div>
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
          <p>{brandingInfo.name}</p>
          {brandingInfo.phone && <p>{brandingInfo.phone}</p>}
          {brandingInfo.area && <p>{brandingInfo.area}</p>}
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

      <div className="flex justify-end mt-4 text-sm">
        <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between">
                <span>Sub Total:</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Tax ({Number(data.tax) || 0}%):</span>
                <span>${taxAmount.toFixed(2)}</span>
            </div>
             <div className="flex justify-between font-bold text-base pt-2 border-t mt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
      </div>


      <div className="mt-8">
        <strong>Note:</strong>
        <p>______________________________________</p>
      </div>

      <div className="mt-8">
        <strong>Payment Information:</strong>
        <p><strong>Bank:</strong> Name Bank</p>
        <p><strong>No Bank:</strong> 123-456-7890</p>
        <p><strong>Email:</strong> {brandingInfo.email}</p>
      </div>

      <div className="text-right text-2xl font-bold mt-10" style={{color: themeColor}}>
        Thank You!
      </div>
    </div>
  );
}
