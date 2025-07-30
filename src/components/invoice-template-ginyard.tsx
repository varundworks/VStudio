
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

interface GinyardTemplateProps {
    data: InvoiceFormValues;
    brandingInfo: BrandingInfo & { themeColor: string };
}

function lightenColor(hex: string, percent: number) {
  if (!hex || !hex.startsWith('#')) {
    return '#a94ad1'; // Return a default color if input is invalid
  }
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.min(255, r + (255 - r) * (percent / 100));
  const newG = Math.min(255, g + (255 - g) * (percent / 100));
  const newB = Math.min(255, b + (255 - b) * (percent / 100));

  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}


export function GinyardTemplate({ data, brandingInfo }: GinyardTemplateProps) {
  const subtotal = (data.items || []).reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const taxAmount = subtotal * ((Number(data.tax) || 0) / 100);
  const total = subtotal + taxAmount;
  const themeColor = brandingInfo.themeColor || '#a94ad1';

  const headerStyle = {
    backgroundColor: lightenColor(themeColor, 50),
  };
  
  const mainBgStyle = {
      backgroundColor: themeColor, 
      backgroundImage: `repeating-linear-gradient(45deg, ${lightenColor(themeColor, -25)}, ${lightenColor(themeColor, -25)} 20px, ${themeColor} 20px, ${themeColor} 40px)`
  };

  return (
      <div style={mainBgStyle} className="text-white font-sans p-8 w-full h-full">
          <div className="flex justify-between items-center">
            {brandingInfo.logoUrl && (
              <div className="w-20 h-20 relative">
                  <Image src={brandingInfo.logoUrl} alt={`${brandingInfo.name} Logo`} layout="fill" objectFit="contain" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-1 text-right">INVOICE</h1>
              <div className="text-lg text-right text-white/90">
                  {brandingInfo.name}
              </div>
            </div>
          </div>
          <div className="bg-white/90 p-8 text-gray-800 mt-4 rounded-lg">
              <div className="flex justify-between text-sm">
                  <div>
                      <p><strong>Invoice Date:</strong> {data.invoiceDate ? format(data.invoiceDate, 'dd/MM/yyyy') : 'N/A'}</p>
                      <p><strong>Due Date:</strong> {data.dueDate ? format(data.dueDate, 'dd/MM/yyyy') : 'N/A'}</p>
                      <p className="mt-2"><strong>Invoice To:</strong><br/>{data.clientName}<br/>{data.clientPhone}</p>
                  </div>
                  <div>
                      <p><strong>From:</strong><br/>{brandingInfo.name}<br/>{brandingInfo.area}</p>
                  </div>
              </div>

              <table className="w-full mt-5 border-collapse text-sm">
                  <thead>
                      <tr>
                          <th style={headerStyle} className="text-white p-2.5 border border-gray-300">Service</th>
                          <th style={headerStyle} className="text-white p-2.5 border border-gray-300">Price</th>
                          <th style={headerStyle} className="text-white p-2.5 border border-gray-300">Qty</th>
                          <th style={headerStyle} className="text-white p-2.5 border border-gray-300">Subtotal</th>
                      </tr>
                  </thead>
                  <tbody>
                      {(data.items || []).map((item, idx) => (
                          <tr key={idx}>
                              <td className="p-2.5 text-center border border-gray-300 bg-white">{item.description}</td>
                              <td className="p-2.5 text-center border border-gray-300 bg-white">${(Number(item.rate) || 0).toFixed(2)}</td>
                              <td className="p-2.5 text-center border border-gray-300 bg-white">{Number(item.quantity) || 0}</td>
                              <td className="p-2.5 text-center border border-gray-300 bg-white">${((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>

              <div className="mt-5 flex justify-end font-bold">
                  <div className="w-full max-w-xs text-sm space-y-1">
                      <div className="flex justify-between p-1">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                       <div className="flex justify-between p-1">
                        <span>Tax ({Number(data.tax) || 0}%)</span>
                        <span>${taxAmount.toFixed(2)}</span>
                      </div>
                       <div className="flex justify-between text-white p-2 mt-1 rounded" style={{backgroundColor: lightenColor(themeColor, -10)}}>
                        <span>Total Amount</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                  </div>
              </div>

              <div className="mt-5 text-sm">
                  <strong>Payment Detail:</strong><br/>
                  Central Bank<br/>
                  Account Name: {brandingInfo.name}<br/>
                  Account Number: 1234567890
              </div>

          </div>
            <div className="text-right text-xs mt-2 text-white/90">
                  Please pay by: {data.dueDate ? format(data.dueDate, 'dd MMMM yyyy') : 'N/A'}
              </div>
      </div>
  );
}
