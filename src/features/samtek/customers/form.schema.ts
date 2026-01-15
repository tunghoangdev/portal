import { generateDefaultValues, generateZodSchema } from '~/schema-validations';
import z from 'zod';
export const formFields: any[] = [
	{
		name: 'customer_name',
		type: 'text',
		label: 'Tên khách hàng',
		placeholder: 'Nhập tên khách hàng...',
		defaultValue: '',
		isRequired: true,
		col: 6,
	},
	{
		name: 'customer_phone',
		label: 'Số điện thoại',
		placeholder: 'Nhập số điện thoại...',
		type: 'text',
		defaultValue: '',
		isRequired: true,
		isPhone: true,
		col: 6,
	},
	{
		name: 'customer_email',
		label: 'Email',
		placeholder: 'Nhập email...',
		type: 'text',
		isRequired: true,
		defaultValue: '',
		isEmail: true,
		col: 6,
	},
	{
		name: 'company_name',
		label: 'Tên công ty',
		placeholder: 'Nhập tên công ty...',
		isRequired: true,
		type: 'text',
		defaultValue: '',
		col: 6,
	},
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
