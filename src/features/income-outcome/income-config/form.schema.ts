import { generateDefaultValues, generateZodSchema } from '~/schema-validations';
import z from 'zod';
export const formFields: any[] = [
	{
		name: 'income_name_parent',
		label: 'Mục cha',
		placeholder: 'Nhập mục thu cha...',
		type: 'text',
		defaultValue: '',
		isRequired: true,
		col: 12,
	},
	{
		name: 'income_name',
		label: 'Mục thu',
		placeholder: 'Nhập mục thu...',
		type: 'text',
		defaultValue: '',
		isRequired: true,
		col: 12,
	},
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
