'use server';

import { generateInvoiceDescription, type GenerateInvoiceDescriptionInput } from '@/ai/flows/invoice-description-generator';

export async function getAIDescription(input: GenerateInvoiceDescriptionInput): Promise<string> {
    const result = await generateInvoiceDescription(input);
    return result.description;
}
