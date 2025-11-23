
'use client';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface VssTemplateProps {
  invoice: Invoice;
}

export function VssTemplate({ invoice }: VssTemplateProps) {
  const { company, client, items, total, subtotal, tax, type } = invoice;
  const vssBlue = '#002D62';
  const vssRed = '#E60000';
  const docTitle = type === 'quotation' ? 'QUOTATION' : 'INVOICE';

  // Split items into pages (approximately 20 items per page to avoid font shrinking)
  const ITEMS_PER_PAGE = 20;
  const pages: typeof items[] = [];
  for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
    pages.push(items.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <>
      {pages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className="bg-white p-0 text-black font-sans text-sm flex flex-col min-h-[1128px] relative" style={{ pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto' }}>
            {/* Watermark - Dynamic Logo */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
                {invoice.logoUrl ? (
                  <img src={invoice.logoUrl} alt="Watermark" className="opacity-10" style={{ width: '878px', height: '878px', objectFit: 'contain' }} />
                ) : (
                  <svg width="878" height="878" viewBox="0 0 100 100" className="opacity-10">
                      <path d="M0 50 L20 50 L30 25 L40 75 L50 50 L60 50 L50 90 L40 10 L30 90 L20 10 L10 50 Z" fill="#E60000" transform="translate(5, -5)"/>
                      <path d="M45 50 L55 50 L70 20 L80 80 L90 50 L100 50" stroke="#002D62" strokeWidth="10" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                )}
            </div>

            <div className="relative z-10 flex flex-col flex-grow">
                {/* Header - Only on first page */}
                {pageIndex === 0 && (
                  <header className="p-4">
                      <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                              {invoice.logoUrl ? (
                                <img src={invoice.logoUrl} alt="Company Logo" className="object-contain flex-shrink-0" style={{ width: '176px', height: '132px' }} />
                              ) : (
                                <svg width="176" height="132" viewBox="0 0 65 45" className="flex-shrink-0">
                                    <path d="M0 22.5 L13 22.5 L19.5 11.25 L26 33.75 L32.5 22.5 L39 22.5" stroke="#E60000" strokeWidth="5" fill="none" />
                                    <path d="M30 22.5 L35 40 L40 5 L45 40 L50 5" stroke="#002D62" strokeWidth="5" fill="none" />
                                    <path d="M50 22.5 L65 22.5" stroke="#002D62" strokeWidth="5" fill="none" />
                                </svg>
                              )}
                              <div>
                                  <h1 className="text-2xl font-bold" style={{ color: vssBlue }}>VSS ELECTRICALS</h1>
                                  <p className="font-semibold" style={{ color: vssRed }}>Govt. Licensed Class-I Electrical Contractor</p>
                              </div>
                          </div>
                          <div className="text-xs text-white p-3 rounded mt-8" style={{ backgroundColor: vssBlue }}>
                              <p className="font-bold">Specialist in All Kinds of Electrical Works</p>
                              <p>Domestic • Commercial • Industrial • Villas</p>
                              <p>Electrical Metering Panel Board</p>
                              <p>HT & LT Work & Licensing</p>
                          </div>
                      </div>
                      <div className="mt-2 h-0.5" style={{ backgroundColor: vssBlue }}></div>
                  </header>
                )}

                {/* Main Content */}
                <main className="px-8 py-4 flex-grow">
                    {pageIndex === 0 && (
                      <div className="flex justify-between mb-8">
                          <div>
                              <h3 className="font-bold mb-2">BILL TO:</h3>
                              <p className="font-semibold">{client.name}</p>
                              <p>{client.address}</p>
                              <p>{client.phone}</p>
                          </div>
                          <div className="text-right">
                              <h2 className="text-2xl font-bold uppercase" style={{ color: vssBlue }}>{docTitle}</h2>
                              <p><span className="font-bold">{docTitle} #:</span> {invoice.invoiceNumber}</p>
                              <p><span className="font-bold">Date:</span> {invoice.invoiceDate}</p>
                              <p><span className="font-bold">Due Date:</span> {invoice.dueDate}</p>
                          </div>
                      </div>
                    )}

                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr style={{ backgroundColor: vssBlue, color: 'white' }}>
                                <th className="p-2">Item</th>
                                <th className="p-2 text-center">Unit</th>
                                <th className="p-2 text-center">Quantity</th>
                                <th className="p-2 text-right">Unit Rate</th>
                                <th className="p-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b">
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
                      <div className="flex justify-end mt-4">
                          <div className="w-1/3 space-y-2">
                               <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>{formatCurrency(subtotal)}</span>
                              </div>
                               <div className="flex justify-between">
                                  <span>Tax ({tax}%)</span>
                                  <span>{formatCurrency(subtotal * (tax / 100))}</span>
                              </div>
                              <div className="flex justify-between font-bold text-lg pt-2 border-t-2" style={{ borderColor: vssBlue }}>
                                  <span>TOTAL</span>
                                  <span>{formatCurrency(total)}</span>
                              </div>
                          </div>
                      </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="mt-auto">
                    <div className="h-1.5" style={{ backgroundColor: vssBlue }}></div>
                    <div className="flex items-center text-white text-xs p-2" style={{ backgroundColor: vssBlue }}>
                        <span># 783, Sy. No 136, Arkavathi Layout 19th Block Chelekere Village, Kalyan Nagar Post, Bangalore - 43. M : 98451 61952 / 63604 92911. Email : vsselectricals@gmail.com</span>
                        <div className="w-0 h-0 ml-auto"
                            style={{
                                borderTop: '15px solid transparent',
                                borderBottom: '15px solid transparent',
                                borderLeft: `10px solid ${vssBlue}`,
                                borderRight: `10px solid ${vssRed}`,
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
