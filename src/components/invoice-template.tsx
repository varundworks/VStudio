'use client';

import { format } from 'date-fns';
import type { InvoiceFormValues } from './invoice-form';
import { Phone, Mail, MapPin } from 'lucide-react';

interface InvoiceTemplateProps {
    data: InvoiceFormValues;
    clients: { id: string; name: string; address: string; email: string; }[];
}

const LogoPlaceholder = () => (
    <div className="flex items-center gap-2">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-gray-700"
        >
            <path d="M12 2L2 7l10 5 10-5-10-5z" opacity="0.5"/>
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
        <span className="font-semibold text-gray-700 uppercase">Company Name</span>
    </div>
);


export function InvoiceTemplate({ data, clients }: InvoiceTemplateProps) {
  const client = clients.find(c => c.id === data.clientId);

  const subtotal = (data.items || []).reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const taxAmount = subtotal * ((Number(data.tax) || 0) / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="a4-page bg-white text-gray-900 font-sans text-sm relative overflow-hidden">
        {/* Header Curves */}
        <div className="absolute top-0 right-0 h-48 w-96 bg-zinc-800 rounded-bl-full"></div>
        <div className="absolute top-0 right-0 h-40 w-80 bg-amber-400 rounded-bl-full"></div>
      
      <div className="p-8 relative z-10">
        <header className="flex justify-between items-start pb-6">
          <div className="flex items-center gap-4">
            <LogoPlaceholder />
          </div>
          <div className="text-right text-xs space-y-1 text-white pr-4 pt-2">
            <div className="flex items-center justify-end gap-2">
                <span>000 000 000</span>
                <Phone className="w-3 h-3" />
            </div>
            <div className="flex items-center justify-end gap-2">
                <span>your.mail@here</span>
                <Mail className="w-3 h-3" />
            </div>
             <div className="flex items-center justify-end gap-2">
                <span>Address Here, City Here 1234</span>
                <MapPin className="w-3 h-3" />
            </div>
          </div>
        </header>
        
        <section className="grid grid-cols-2 gap-8 my-10">
          <div>
            <h1 className="text-5xl font-bold text-zinc-800">INVOICE</h1>
            <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p><strong>Invoice No:</strong> INV-001</p>
                <p><strong>Account No:</strong> ACC-001</p>
                <p><strong>Invoice Date:</strong> {data.invoiceDate ? format(data.invoiceDate, "dd/MM/yyyy") : 'N/A'}</p>
                <p><strong>Due Date:</strong> {data.dueDate ? format(data.dueDate, "dd/MM/yyyy") : 'N/A'}</p>
            </div>
          </div>
          <div className="text-left pl-10">
            <h3 className="text-lg font-bold text-gray-800 mb-2">INVOICE TO</h3>
            <p className="font-semibold text-gray-700">{client?.name || 'Select a client'}</p>
            <div className="text-xs text-gray-600 mt-1">
                <p>Company Name</p>
                <p>P: +000 0000 000</p>
                <p>E: {client?.email}</p>
                <p>A: {client?.address}</p>
            </div>
          </div>
        </section>
        
        <section>
          <table className="w-full">
            <thead className="bg-amber-400 text-zinc-800">
              <tr>
                <th className="p-3 text-left font-bold uppercase">Item Description</th>
                <th className="p-3 w-32 text-center font-bold uppercase">Unit Price</th>
                <th className="p-3 w-24 text-center font-bold uppercase">Quantity</th>
                <th className="p-3 w-32 text-right font-bold uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {(data.items || []).map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 align-top">
                    <p className="font-semibold">{item.description}</p>
                    <p className="text-xs text-gray-500">Lorem ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </td>
                  <td className="p-3 text-center align-top">${(Number(item.rate) || 0).toFixed(2)}</td>
                  <td className="p-3 text-center align-top">{Number(item.quantity) || 0}</td>
                  <td className="p-3 text-right align-top">${((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        
        <section className="flex justify-end mt-4">
          <div className="w-full max-w-sm space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Vat({Number(data.tax) || 0}%)</span>
              <span className="font-mono">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg text-amber-500">
                <span>Grand Total</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-2 gap-8">
            <div>
                <h4 className="font-bold text-gray-800 mb-2">PAYMENT METHODS</h4>
                <div className="text-xs space-y-2 text-gray-600">
                    <div>
                        <p className="font-semibold">By Bank</p>
                        <p>Account Name: Name Here</p>
                        <p>Account Number: 0123456789</p>
                        <p>Branch Name: ABCD</p>
                    </div>
                    <div>
                        <p className="font-semibold">By Online</p>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    </div>
                </div>
            </div>
            <div>
                <h4 className="font-bold text-gray-800 mb-2">TERMS & CONDITIONS</h4>
                <p className="text-xs text-gray-600">
                    Lorem Ipsum has been the industry's standard dummy text a type specimen book of Letraset sheets containing.
                </p>
            </div>
        </section>
      </div>
      
       {/* Footer Curves */}
       <div className="absolute bottom-0 left-0 h-32 w-full bg-zinc-800" style={{clipPath: 'ellipse(100% 60% at 0% 100%)'}}></div>
       <div className="absolute bottom-0 left-0 h-24 w-full bg-amber-400" style={{clipPath: 'ellipse(100% 60% at 0% 100%)'}}></div>
    </div>
  );
}
