import type z from 'zod';
import { generateZodSchema } from './custom-validatior';
import type { FormFieldConfig } from '~/types/form-field';

const providerFormFields: FormFieldConfig[] = [
	{
		name: 'provider_code',
		label: 'Mã nhà cung cấp',
		placeholder: 'Nhập mã nhà cung cấp...',
		defaultValue: '',
		isRequired: true,
		col: 6,
	},
	{
		name: 'provider_name',
		label: 'Tên nhà cung cấp',
		placeholder: 'Nhập tên nhà cung cấp...',
		defaultValue: '',
		isRequired: true,
		col: 6,
	},
	{
		name: 'phone',
		label: 'Số điện thoại',
		placeholder: 'Nhập số diện thoại...',
		defaultValue: '',
		col: 6,
	},
	{
		name: 'email',
		label: 'Email',
		placeholder: 'Nhập email...',
		defaultValue: '',
		col: 6,
	},
	{
		name: 'address',
		label: 'Địa chỉ',
		placeholder: 'Nhập địa chỉ...',
		defaultValue: '',
		col: 12,
	},
	{
		name: 'person_contact',
		label: 'Người liên hệ',
		placeholder: 'Nhập người liên hệ...',
		defaultValue: '',
		col: 6,
	},
	{
		name: 'person_contact_phone',
		label: 'Điện thoại người liên hệ',
		placeholder: 'Nhập số điện thoại người liên hệ...',
		defaultValue: '',
		col: 6,
	},
];

type LifeProviderFormFields = z.infer<typeof lifeProviderSchema>;
const lifeProviderSchema: any =
	generateZodSchema<LifeProviderFormFields>(providerFormFields);

export { lifeProviderSchema, providerFormFields, type LifeProviderFormFields };
