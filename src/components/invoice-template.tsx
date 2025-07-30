
'use client';

import { ClassicTemplate } from './invoice-template-classic';
import { GinyardTemplate } from './invoice-template-ginyard';
import { ModernTemplate } from './invoice-template-modern';
import { ProfessionalTemplate } from './invoice-template-professional';
import type { InvoiceFormValues } from './invoice-form';

interface BrandingInfo {
    name: string;
    email: string;
    phone: string;
    web: string;
    area: string;
    template: string;
    themeColor: string;
}

interface InvoiceTemplateProps {
    data: InvoiceFormValues;
    brandingInfo: BrandingInfo;
}

export function InvoiceTemplate({ data, brandingInfo }: InvoiceTemplateProps) {
    switch (brandingInfo.template) {
        case 'modern':
            return <ModernTemplate data={data} brandingInfo={brandingInfo} />;
        case 'professional':
            return <ProfessionalTemplate data={data} brandingInfo={brandingInfo} />;
        case 'ginyard':
            return <GinyardTemplate data={data} brandingInfo={brandingInfo} />;
        case 'classic':
        default:
            return <ClassicTemplate data={data} brandingInfo={brandingInfo} />;
    }
}
