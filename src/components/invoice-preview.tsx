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
import { ChromePicker } from 'react-color';
import { ClassicTemplate } from './invoice-templates/classic-template';
import { ModernTemplate } from './invoice-templates/modern-template';
import { ProfessionalTemplate } from './invoice-templates/professional-template';
import { GinyardTemplate } from './invoice-templates/ginyard-template';
import type { Invoice, Template } from '@/app/invoices/new/page';

interface InvoicePreviewProps {
  invoice: Invoice;
  template: Template;
  accentColor: string;
  onTemplateChange: (template: Template) => void;
  onAccentColorChange: (color: string) => void;
}

const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  ginyard: GinyardTemplate,
};

export function InvoicePreview({
  invoice,
  template,
  accentColor,
  onTemplateChange,
  onAccentColorChange,
}: InvoicePreviewProps) {
  const SelectedTemplate = templates[template];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <div className="grid grid-cols-2 gap-4 pt-4">
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
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Accent Color</Label>
            <ChromePicker
              color={accentColor}
              onChange={(color) => onAccentColorChange(color.hex)}
              disableAlpha
              className="!shadow-none"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-[8.5/11] w-full bg-white rounded-md shadow-lg overflow-hidden">
          <div className="p-2 bg-muted h-full overflow-auto">
             <SelectedTemplate invoice={invoice} accentColor={accentColor} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
