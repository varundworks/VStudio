'use client';

import { ClassicTemplate } from './invoice-template-classic';
import { GinyardTemplate } from './invoice-template-ginyard';
import { ModernTemplate } from './invoice-template-modern';
import { ProfessionalTemplate } from './invoice-template-professional';
import type { InvoiceFormValues } from './invoice-form';

interface InvoiceTemplateProps {
    data: InvoiceFormValues;
    template: string;
    themeColor: string;
}

export function InvoiceTemplate({ data, template, themeColor }: InvoiceTemplateProps) {
    switch (template) {
        case 'modern':
            return <ModernTemplate data={data} themeColor={themeColor} />;
        case 'professional':
            return <ProfessionalTemplate data={data} themeColor={themeColor} />;
        case 'ginyard':
            return <GinyardTemplate data={data} themeColor={themeColor} />;
        case 'classic':
        default:
            return <ClassicTemplate data={data} themeColor={themeColor} />;
    }
}
