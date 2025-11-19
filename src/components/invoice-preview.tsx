
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassicTemplate } from './invoice-templates/classic-template';
import { ModernTemplate } from './invoice-templates/modern-template';
import { ProfessionalTemplate } from './invoice-templates/professional-template';
import { GinyardTemplate } from './invoice-templates/ginyard-template';
import { VssTemplate } from './invoice-templates/vss-template';
import { CvsTemplate } from './invoice-templates/cvs-template';
import type { Invoice, Template } from '@/app/invoices/new/page';

interface InvoicePreviewProps {
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

export function InvoicePreview({
  invoice,
  template,
}: InvoicePreviewProps) {
  const SelectedTemplate = templates[template];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Container for the scaled preview */}
        <div className="w-full aspect-[8.5/11] bg-muted rounded-md border overflow-hidden relative">
          <div
            id="invoice-preview-wrapper"
            className="absolute top-0 left-0 w-full h-full"
          >
            <div
              id="invoice-preview"
              className="absolute origin-top-left bg-white"
              style={{
                width: '800px',
                height: '1128px',
                transform: `scale(calc(100% / 800px))`,
              }}
            >
              <SelectedTemplate invoice={invoice} />
            </div>
          </div>
        </div>
         {/* Hidden, full-sized version for PDF generation is now handled by InvoiceFullPreview */}
      </CardContent>
    </Card>
  );
}
