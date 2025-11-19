
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  onTemplateChange: (template: Template) => void;
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
  onTemplateChange,
}: InvoicePreviewProps) {
  const SelectedTemplate = templates[template];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <div className="grid grid-cols-1 gap-4 pt-4">
          <div className='space-y-4'>
            <div>
              <Label>Template</Label>
              <Select
                value={template}
                onValueChange={(value) => onTemplateChange(value as Template)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="ginyard">Ginyard</SelectItem>
                  <SelectItem value="vss">VSS</SelectItem>
                  <SelectItem value="cvs">CVS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          id="invoice-preview"
          className="aspect-[8.5/11] w-full bg-white rounded-md shadow-lg overflow-hidden"
        >
          <div className="p-2 bg-muted h-full overflow-auto">
            <SelectedTemplate invoice={invoice} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
