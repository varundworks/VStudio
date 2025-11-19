
'use client';

import { ClassicTemplate } from './invoice-templates/classic-template';
import { ModernTemplate } from './invoice-templates/modern-template';
import { ProfessionalTemplate } from './invoice-templates/professional-template';
import { GinyardTemplate } from './invoice-templates/ginyard-template';
import { VssTemplate } from './invoice-templates/vss-template';
import { CvsTemplate } from './invoice-templates/cvs-template';
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
};

export function InvoiceFullPreview({
  invoice,
  template,
}: InvoiceFullPreviewProps) {
  const SelectedTemplate = templates[template];

  if (!SelectedTemplate) {
    return null;
  }

  return (
    <div id="invoice-full-preview" className="w-[800px] h-auto bg-white shadow-lg mx-auto my-4">
      <SelectedTemplate invoice={invoice} />
    </div>
  );
}
