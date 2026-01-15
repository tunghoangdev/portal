import { generateDefaultValues, generateZodSchema } from '~/schema-validations';
import z from 'zod';
export const formFields: any[] = [
	{
		name: 'outcome_name_parent',
		label: 'Mục cha',
		placeholder: 'Nhập mục chi cha...',
		type: 'text',
		defaultValue: '',
		isRequired: true,
		col: 12,
	},
	{
		name: 'outcome_name',
		label: 'Mục chi',
		placeholder: 'Nhập mục chi...',
		type: 'text',
		defaultValue: '',
		isRequired: true,
		col: 12,
	},
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
