
'use client';

import { ClassicTemplate } from './invoice-templates/classic-template';
import { ModernTemplate } from './invoice-templates/modern-template';
import { ProfessionalTemplate } from './invoice-templates/professional-template';
import { GinyardTemplate } from './invoice-templates/ginyard-template';
import { VssTemplate } from './invoice-templates/vss-template';
import { CvsTemplate } from './invoice-templates/cvs-template';
import { SvTemplate } from './invoice-templates/sv-template';
import { GtechTemplate } from './invoice-templates/gtech-template';
import type { Invoice, Template } from '@/app/invoices/new/page';

interface InvoiceFullPreviewProps {
  invoice: Invoice;
  template: Template;
}

const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  ginyard: GinyardTemplate,
  vss: VssTemplate,
  cvs: CvsTemplate,
  sv: SvTemplate,
  gtech: GtechTemplate,
};

export function InvoiceFullPreview({
  invoice,
  template,
}: InvoiceFullPreviewProps) {
  const SelectedTemplate = templates[template];

  if (!SelectedTemplate) {
    console.error('Template not found:', template);
    return <div className="p-4 text-red-500">Template not found: {template}</div>;
  }

  return (
    <div id="invoice-full-preview" className="w-full max-w-[800px] h-auto bg-white shadow-lg mx-auto">
      <div className="w-full">
        <SelectedTemplate invoice={invoice} />
      </div>
    </div>
  );
}
