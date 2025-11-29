
'use client';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';
import Image from 'next/image';

interface SvTemplateProps {
  invoice: Invoice;
}

export function SvTemplate({ invoice }: SvTemplateProps) {
  const { client, items, total, subtotal, tax, type } = invoice;
  const svOrange = '#FF6B00';
  const svYellow = '#FFB800';
  const svBrown = '#8B4513';
  const docTitle = type === 'quotation' ? 'QUOTATION' : 'INVOICE';

  // Split items into pages - up to 25 items per page for standard font size
  const ITEMS_PER_PAGE = 25;
  const pages: typeof items[] = [];
  for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
    pages.push(items.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <>
      {pages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className="bg-white p-0 text-black font-sans text-sm flex flex-col min-h-[1128px] relative" style={{ pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto' }}>
            {/* Watermark - SV Logo */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
                {invoice.logoUrl ? (
                  <div className="opacity-5" style={{ width: '600px', height: '600px', position: 'relative' }}>
                    <Image src={invoice.logoUrl} alt="SV Watermark" fill style={{ objectFit: 'contain' }} />
                  </div>
                ) : (
                  <div className="opacity-10 text-9xl font-bold" style={{ color: svOrange }}>SV</div>
                )}
            </div>

            <div className="relative z-10 flex flex-col flex-grow">
                {/* Header - On all pages */}
                <header className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            {invoice.logoUrl ? (
                              <div className="relative" style={{ width: '180px', height: '135px' }}>
                                <Image src={invoice.logoUrl} alt="SV Electricals Logo" fill style={{ objectFit: 'contain' }} />
                              </div>
                            ) : (
                              <div className="w-[180px] h-[135px] flex items-center justify-center border-2 rounded" style={{ borderColor: svOrange }}>
                                <span className="text-4xl font-bold" style={{ color: svOrange }}>SV</span>
                              </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold" style={{ color: svOrange }}>SV ELECTRICALS</h1>
                                <p className="font-semibold text-sm" style={{ color: svBrown }}>Class 1 Govt. Electrical Contractor</p>
                            </div>
                        </div>
                        <div className="text-xs text-white p-3 rounded" style={{ backgroundColor: svOrange }}>
                            <p className="font-bold">Our Services:</p>
                            <p>HT & LT COMMERCIAL</p>
                            <p>INTERNAL WIRING</p>
                            <p>INTERNET CONNECTION WIRING</p>
                            <p>INVERTER INSTALLATION</p>
                            <p>CCTV INSTALLATION</p>
                            <p>CIVIL WORK</p>
                            <p>ALL ELECTRICALS MAINTENANCE & SERVICE</p>
                        </div>
                    </div>
                    <div className="mt-2 h-1" style={{ background: `linear-gradient(to right, ${svOrange} 0%, ${svYellow} 50%, ${svBrown} 100%)` }}></div>
                </header>

                {/* Main Content */}
                <main className="px-8 py-4 flex-grow">
                    {/* Bill To section - Only on first page */}
                    {pageIndex === 0 && (
                      <div className="flex justify-between mb-8">
                          <div>
                              <h3 className="font-bold mb-2" style={{ color: svBrown }}>BILL TO:</h3>
                              <p className="font-semibold text-lg">{client.name}</p>
                              <p>{client.address}</p>
                              <p>{client.phone}</p>
                          </div>
                          <div className="text-right">
                              <h2 className="text-3xl font-bold uppercase mb-2" style={{ color: svOrange }}>{docTitle}</h2>
                              <p><span className="font-bold">{docTitle} #:</span> {invoice.invoiceNumber}</p>
                              <p><span className="font-bold">Date:</span> {invoice.invoiceDate}</p>
                              <p><span className="font-bold">Due Date:</span> {invoice.dueDate}</p>
                          </div>
                      </div>
                    )}

                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr style={{ background: `linear-gradient(to right, ${svOrange}, ${svYellow})`, color: 'white' }}>
                                <th className="p-2">Item</th>
                                <th className="p-2 text-center">Unit</th>
                                <th className="p-2 text-center">Quantity</th>
                                <th className="p-2 text-right">Unit Rate</th>
                                <th className="p-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{item.item}</td>
                                    <td className="p-2 text-center">{item.unit}</td>
                                    <td className="p-2 text-center">{item.quantity}</td>
                                    <td className="p-2 text-right">{formatCurrency(item.unitRate)}</td>
                                    <td className="p-2 text-right">{formatCurrency(item.quantity * item.unitRate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Total section - Only on last page */}
                    {pageIndex === pages.length - 1 && (
                      <div className="flex justify-end mt-6">
                          <div className="w-1/3 space-y-2">
                               <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>{formatCurrency(subtotal)}</span>
                              </div>
                               <div className="flex justify-between">
                                  <span>Tax ({tax}%)</span>
                                  <span>{formatCurrency(subtotal * (tax / 100))}</span>
                              </div>
                              <div className="flex justify-between font-bold text-xl pt-2 border-t-2 text-white p-3 rounded" style={{ background: `linear-gradient(to right, ${svOrange}, ${svYellow})` }}>
                                  <span>TOTAL</span>
                                  <span>{formatCurrency(total)}</span>
                              </div>
                          </div>
                      </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="mt-auto">
                    <div className="h-1" style={{ background: `linear-gradient(to right, ${svOrange} 0%, ${svYellow} 50%, ${svBrown} 100%)` }}></div>
                    <div className="flex items-center text-white text-xs p-3" style={{ backgroundColor: svBrown }}>
                        <div className="flex-grow">
                          <p className="font-semibold">No. 51, Muniveshwara Temple Street, Subanapalaya, MS Nagar Post, Bangalore-33.</p>
                          <p className="mt-1">M: +91 99805 35113 / +91 9380205670 | Email: svelectricalclasal@gmail.com</p>
                        </div>
                        {pages.length > 1 && (
                          <div className="text-white text-xs mx-4">
                            Page {pageIndex + 1} of {pages.length}
                          </div>
                        )}
                        <div className="w-0 h-0 ml-4"
                            style={{
                                borderTop: '20px solid transparent',
                                borderBottom: '20px solid transparent',
                                borderLeft: `15px solid ${svBrown}`,
                                borderRight: `15px solid ${svOrange}`,
                            }}
                        />
                    </div>
                </footer>
            </div>
        </div>
      ))}
    </>
  );
}
