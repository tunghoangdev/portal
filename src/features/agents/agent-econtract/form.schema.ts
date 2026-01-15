import { PhoneField } from '~/features/shared/components/form-fields';
import { generateDefaultValues, generateZodSchema } from '~/schema-validations';
import z from 'zod';
export const formFields: any[] = [
	{
		name: 'id_agent',
		type: 'hidden',
		defaultValue: '',
		isNumber: true,
	},
	{
		name: 'agent_phone',
		label: 'SĐT thành viên',
		placeholder: 'Nhập số điện thoại...',
		type: 'text',
		extra: PhoneField,
		defaultValue: '',
		isRequired: true,
		isPhone: true,
		col: 12,
	},
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
