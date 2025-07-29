'use client';

import { ClassicTemplate } from './invoice-template-classic';
import { ModernTemplate } from './invoice-template-modern';
import { ProfessionalTemplate } from './invoice-template-professional';
import type { InvoiceFormValues } from './invoice-form';

interface InvoiceTemplateProps {
    data: InvoiceFormValues;
    clients: { id: string; name: string; address: string; email: string; phone: string; }[];
    template: string;
    themeColor: string;
}

export function InvoiceTemplate({ data, clients, template, themeColor }: InvoiceTemplateProps) {
    switch (template) {
        case 'modern':
            return <ModernTemplate data={data} clients={clients} themeColor={themeColor} />;
        case 'professional':
            return <ProfessionalTemplate data={data} clients={clients} themeColor={themeColor} />;
        case 'classic':
        default:
            return <ClassicTemplate data={data} clients={clients} themeColor={themeColor} />;
    }
}
