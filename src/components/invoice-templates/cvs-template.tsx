
'use client';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface CvsTemplateProps {
  invoice: Invoice;
}

export function CvsTemplate({ invoice }: CvsTemplateProps) {
  const { client, items, total, subtotal, tax, type } = invoice;
  const cvsBlue = '#003366';
  const cvsOrange = '#FF6600';
  const cvsGreen = '#339933';
  const docTitle = type === 'quotation' ? 'Quotation' : 'Invoice';

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
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
              <svg width="300" height="300" viewBox="0 0 100 100" className="opacity-10">
                  <circle cx="50" cy="50" r="45" stroke="#003366" strokeWidth="2" fill="none" />
                  <circle cx="50" cy="50" r="42" stroke="#FF6600" strokeWidth="2" fill="none" />
                  <circle cx="50" cy="50" r="39" stroke="#339933" strokeWidth="2" fill="none" />
                  <text x="50" y="58" textAnchor="middle" fontSize="30" fontWeight="bold" fill="#003366">C</text>
                  <path d="M48 45 L50 60 L52 45" stroke="#FF6600" strokeWidth="3" fill="none" />
                  <text x="69" y="58" textAnchor="middle" fontSize="30" fontWeight="bold" fill="#003366">S</text>
              </svg>
          </div>
          
          <div className="relative z-10 flex flex-col flex-grow">
            {/* Header - Only on first page */}
            {pageIndex === 0 && (
              <header className="p-8 pb-4">
                  <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center">
                              <svg width="60" height="60" viewBox="0 0 100 100">
                                 <circle cx="50" cy="50" r="48" stroke={cvsBlue} strokeWidth="4" fill="none" />
                                  <circle cx="50" cy="50" r="42" stroke={cvsOrange} strokeWidth="4" fill="none" />
                                  <text x="28" y="65" textAnchor="middle" fontSize="40" fontWeight="bold" fill={cvsBlue}>C</text>
                                  <path d="M48 40 L50 65 L52 40" stroke={cvsOrange} strokeWidth="5" fill="none" />
                                  <text x="72" y="65" textAnchor="middle" fontSize="40" fontWeight="bold" fill={cvsBlue}>S</text>
                              </svg>
                          </div>
                          <div>
                              <h1 className="text-2xl font-bold" style={{ color: cvsBlue }}>CHANDRA VINAYAKA</h1>
                              <h2 className="text-2xl font-bold" style={{ color: cvsBlue }}>SOLUTIONS</h2>
                          </div>
                      </div>
                      <div className="text-right text-xs" style={{color: cvsBlue}}>
                          <p className="font-bold">Supply & Installation of :</p>
                          <p>We Undertake All Kinds of Electrical Works</p>
                          <p>(Domestic, Commercial & Industrial)</p>
                          <p>UPS, CCTV, Water Level Unit Electrical Metering</p>
                          <p>Panel Board & Gas Line</p>
                      </div>
                  </div>
                  <div className="h-0.5 mt-2" style={{ background: `linear-gradient(to right, ${cvsBlue} 90%, ${cvsOrange} 90%)` }}></div>
                  <div className="h-1 mt-1" style={{ background: `linear-gradient(to right, ${cvsBlue} 90%, ${cvsOrange} 90%)` }}></div>
              </header>
            )}

            {/* Main Content */}
            <main className="px-8 py-4 flex-grow">
                {pageIndex === 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <h3 className="font-bold mb-2 text-gray-500">BILLED TO</h3>
                        <p className="font-semibold text-lg" style={{color: cvsBlue}}>{client.name}</p>
                        <p>{client.address}</p>
                        <p>{client.phone}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-bold mb-2 text-gray-500 text-xl uppercase">{docTitle}</h3>
                        <p><span className="font-bold">{docTitle} #:</span> {invoice.invoiceNumber}</p>
                        <p><span className="font-bold">Date of Issue:</span> {invoice.invoiceDate}</p>
                        <p><span className="font-bold">Due Date:</span> {invoice.dueDate}</p>
                    </div>
                  </div>
                )}
                
                <table className="w-full mb-8 text-sm">
                    <thead>
                        <tr className="text-white" style={{ backgroundColor: cvsBlue }}>
                            <th className="text-left font-bold p-2">Item</th>
                            <th className="text-center font-bold p-2">Unit</th>
                            <th className="text-center font-bold p-2">Qty</th>
                            <th className="text-right font-bold p-2">Unit Rate</th>
                            <th className="text-right font-bold p-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-100">
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 border-b">{item.item}</td>
                                <td className="p-2 border-b text-center">{item.unit}</td>
                                <td className="p-2 border-b text-center">{item.quantity}</td>
                                <td className="p-2 border-b text-right">{formatCurrency(item.unitRate)}</td>
                                <td className="p-2 border-b text-right">{formatCurrency(item.quantity * item.unitRate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Total section - Only on last page */}
                {pageIndex === pages.length - 1 && (
                  <div className="flex justify-end">
                      <div className="w-2/5 space-y-2">
                          <div className="flex justify-between">
                              <span className="text-gray-700">Subtotal</span>
                              <span>{formatCurrency(subtotal)}</span>
                          </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Tax ({tax}%)</span>
                              <span>{formatCurrency(subtotal * (tax / 100))}</span>
                          </div>
                          <div className="flex justify-between font-bold text-2xl p-2 rounded" style={{ backgroundColor: cvsBlue, color: 'white' }}>
                              <span>Total Amount</span>
                              <span>{formatCurrency(total)}</span>
                          </div>
                      </div>
                  </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-auto text-white text-xs">
              <div className="flex">
                <div className="p-2 w-3/4" style={{backgroundColor: cvsBlue}}>
                  <p># 783, Sy. No 136, Arkavathi Layout 19th Block, Chelekere Village, Kalyan Nagar Post, Bangalore - 43. Email : cvsolutions1982@gmail.com</p>
                </div>
                <div className="w-0 h-0" style={{
                  borderTop: '36px solid transparent',
                  borderLeft: `20px solid ${cvsBlue}`
                }}></div>
                <div className="w-1/4 flex">
                    <div style={{backgroundColor: cvsGreen, width: '20px'}}></div>
                     <div className="p-2 flex-grow" style={{backgroundColor: cvsOrange}}>
                        <p>M : 99869 50966 / 97437 19923,</p>
                    </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      ))}
    </>
  );
}
