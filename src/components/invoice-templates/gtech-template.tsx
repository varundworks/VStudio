
'use client';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';
import Image from 'next/image';

interface GtechTemplateProps {
  invoice: Invoice;
}

export function GtechTemplate({ invoice }: GtechTemplateProps) {
  const { client, items, total, subtotal, tax, type } = invoice;
  const gtechNavy = '#2C4B6E';
  const gtechLightBlue = '#7DB4D5';
  const gtechOrange = '#FF8C42';
  const gtechGreen = '#6BAA75';
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
            {/* Watermark - G-Tech Logo */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
                {invoice.logoUrl ? (
                  <div className="opacity-5" style={{ width: '600px', height: '600px', position: 'relative' }}>
                    <Image src={invoice.logoUrl} alt="G-Tech Watermark" fill style={{ objectFit: 'contain' }} />
                  </div>
                ) : (
                  <div className="opacity-10 text-9xl font-bold" style={{ color: gtechNavy }}>G-TECH</div>
                )}
            </div>

            <div className="relative z-10 flex flex-col flex-grow">
                {/* Header - On all pages */}
                <header className="p-6" style={{ backgroundColor: gtechNavy }}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            {invoice.logoUrl ? (
                              <div className="relative bg-white rounded-full p-3" style={{ width: '200px', height: '200px' }}>
                                <Image src={invoice.logoUrl} alt="G-Tech Car Care Logo" fill style={{ objectFit: 'contain', padding: '12px' }} className="rounded-full" />
                              </div>
                            ) : (
                              <div className="w-[200px] h-[200px] flex items-center justify-center border-4 rounded-full bg-white" style={{ borderColor: gtechLightBlue }}>
                                <span className="text-3xl font-bold text-center" style={{ color: gtechNavy }}>G-TECH</span>
                              </div>
                            )}
                            <div className="text-white">
                                <h1 className="text-3xl font-bold mb-1">G-TECH CAR CARE</h1>
                                <p className="text-lg font-semibold" style={{ color: gtechOrange }}>AUTOMOBILE SERVICE CENTRE</p>
                            </div>
                        </div>
                        <div className="text-white text-xs bg-white/10 p-3 rounded backdrop-blur-sm">
                            <p className="font-bold mb-2" style={{ color: gtechOrange }}>Our Expertise:</p>
                            <p className="leading-relaxed">Innova, Tavera, Qualis, Indica,</p>
                            <p className="leading-relaxed">Maruti, Jeep Alteration,</p>
                            <p className="leading-relaxed">Mechanic Tinkering</p>
                            <p className="leading-relaxed">Painting & Water Service</p>
                            <p className="leading-relaxed">Electrical & Upholstary Works</p>
                        </div>
                    </div>
                    <div className="mt-3 h-1" style={{ background: `linear-gradient(to right, ${gtechOrange} 0%, ${gtechLightBlue} 50%, ${gtechGreen} 100%)` }}></div>
                </header>

                {/* Main Content */}
                <main className="px-8 py-4 flex-grow">
                    {/* Bill To section - Only on first page */}
                    {pageIndex === 0 && (
                      <div className="flex justify-between mb-8">
                          <div>
                              <h3 className="font-bold mb-2 text-white px-3 py-1 rounded" style={{ backgroundColor: gtechNavy }}>BILL TO:</h3>
                              <p className="font-semibold text-lg mt-2">{client.name}</p>
                              <p>{client.address}</p>
                              <p>{client.phone}</p>
                          </div>
                          <div className="text-right">
                              <h2 className="text-4xl font-bold uppercase mb-2 px-4 py-2 rounded text-white" style={{ backgroundColor: gtechOrange }}>{docTitle}</h2>
                              <p className="mt-3"><span className="font-bold">{docTitle} #:</span> {invoice.invoiceNumber}</p>
                              <p><span className="font-bold">Date:</span> {invoice.invoiceDate}</p>
                              <p><span className="font-bold">Due Date:</span> {invoice.dueDate}</p>
                          </div>
                      </div>
                    )}

                    <table className="w-full text-left text-sm border-2" style={{ borderColor: gtechNavy }}>
                        <thead>
                            <tr style={{ backgroundColor: gtechNavy, color: 'white' }}>
                                <th className="p-2 border-r border-white/20">Item</th>
                                <th className="p-2 text-center border-r border-white/20">Unit</th>
                                <th className="p-2 text-center border-r border-white/20">Quantity</th>
                                <th className="p-2 text-right border-r border-white/20">Unit Rate</th>
                                <th className="p-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} style={{ borderBottom: `1px solid ${gtechLightBlue}` }}>
                                    <td className="p-2">{item.item}</td>
                                    <td className="p-2 text-center">{item.unit}</td>
                                    <td className="p-2 text-center">{item.quantity}</td>
                                    <td className="p-2 text-right">{formatCurrency(item.unitRate)}</td>
                                    <td className="p-2 text-right font-semibold">{formatCurrency(item.quantity * item.unitRate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Total section - Only on last page */}
                    {pageIndex === pages.length - 1 && (
                      <div className="flex justify-end mt-6">
                          <div className="w-1/3 space-y-2">
                               <div className="flex justify-between p-2 bg-gray-50">
                                  <span>Subtotal</span>
                                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                              </div>
                               <div className="flex justify-between p-2 bg-gray-50">
                                  <span>Tax ({tax}%)</span>
                                  <span className="font-semibold">{formatCurrency(subtotal * (tax / 100))}</span>
                              </div>
                              <div className="flex justify-between font-bold text-xl text-white p-3 rounded" style={{ background: `linear-gradient(135deg, ${gtechNavy}, ${gtechLightBlue})` }}>
                                  <span>TOTAL</span>
                                  <span>{formatCurrency(total)}</span>
                              </div>
                          </div>
                      </div>
                    )}
                </main>

                {/* Footer - On all pages */}
                <footer className="mt-auto">
                    <div className="h-1" style={{ background: `linear-gradient(to right, ${gtechOrange} 0%, ${gtechLightBlue} 50%, ${gtechGreen} 100%)` }}></div>
                    <div className="text-white text-xs p-4" style={{ backgroundColor: gtechNavy }}>
                        <div className="flex items-center justify-between">
                          <div className="flex-grow">
                            <p className="font-semibold">Nanjappa Compound, Near Corporation Bank, RS Palya, Kammanahalli Main Road, Bangalore-33</p>
                            <p className="mt-1">Mobile: 9845 038 327</p>
                          </div>
                          {pages.length > 1 && (
                            <div className="text-white text-xs mx-4 px-3 py-1 rounded" style={{ backgroundColor: gtechOrange }}>
                              Page {pageIndex + 1} of {pages.length}
                            </div>
                          )}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
      ))}
    </>
  );
}
