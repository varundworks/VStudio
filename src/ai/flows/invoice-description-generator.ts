'use server';

/**
 * @fileOverview Generates descriptions of services for invoices using AI.
 *
 * - generateInvoiceDescription - A function that generates the invoice description.
 * - GenerateInvoiceDescriptionInput - The input type for the generateInvoiceDescription function.
 * - GenerateInvoiceDescriptionOutput - The return type for the generateInvoiceDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInvoiceDescriptionInputSchema = z.object({
  serviceType: z.string().describe('The type of service provided.'),
  hoursWorked: z.number().optional().describe('The number of hours worked, if applicable.'),
  flatRate: z.number().optional().describe('The flat rate for the service, if applicable.'),
  additionalDetails: z.string().optional().describe('Any additional details about the service provided.'),
});

export type GenerateInvoiceDescriptionInput = z.infer<typeof GenerateInvoiceDescriptionInputSchema>;

const GenerateInvoiceDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed description of the service provided for the invoice.'),
});

export type GenerateInvoiceDescriptionOutput = z.infer<typeof GenerateInvoiceDescriptionOutputSchema>;

export async function generateInvoiceDescription(input: GenerateInvoiceDescriptionInput): Promise<GenerateInvoiceDescriptionOutput> {
  return generateInvoiceDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'invoiceDescriptionPrompt',
  input: {schema: GenerateInvoiceDescriptionInputSchema},
  output: {schema: GenerateInvoiceDescriptionOutputSchema},
  prompt: `You are an expert at generating clear and concise service descriptions for invoices.

  Based on the following information, create a detailed description of the service provided. Be sure to include specific details and quantify the work performed wherever possible.

  Service Type: {{{serviceType}}}
  {{#if hoursWorked}}Hours Worked: {{{hoursWorked}}}{{/if}}
  {{#if flatRate}}Flat Rate: {{{flatRate}}}{{/if}}
  {{#if additionalDetails}}Additional Details: {{{additionalDetails}}}{{/if}}
  `,
});

const generateInvoiceDescriptionFlow = ai.defineFlow(
  {
    name: 'generateInvoiceDescriptionFlow',
    inputSchema: GenerateInvoiceDescriptionInputSchema,
    outputSchema: GenerateInvoiceDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
