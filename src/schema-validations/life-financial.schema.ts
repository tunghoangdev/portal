import { generateZodSchema } from './custom-validatior';
import z from 'zod';
import {
	PhoneField,
	SwitchField,
} from '~/features/shared/components/form-fields';
import { ProviderField } from '~/features/shared/components/form-fields/provider-field';

const financialFormFields: any[] = [
	{
		name: 'id_life_provider',
		label: 'Nhà cung cấp',
		placeholder: 'Chọn nhà cung cấp',
		extra: ProviderField,
		isRequired: true,
		defaultValue: '',
		col: 6,
	},
	{
		name: 'agent_phone',
		label: 'SĐT thành viên',
		placeholder: 'Nhập số điện thoại...',
		extra: PhoneField,
		defaultValue: '',
		isRequired: true,
		col: 6,
	},
	{
		name: 'id_agent',
		type: 'hidden',
		defaultValue: '',
	},
	{
		name: 'finan_code',
		label: 'Mã số tư vấn',
		placeholder: 'Nhập mã số tư vấn',
		type: 'text',
		isRequired: true,
		defaultValue: '',
		col: 6,
	},
	{
		name: 'is_active',
		label: 'Trạng thái hoạt động',
		extra: SwitchField,
		classNames: {
			wrapper: 'flex flex-col h-full justify-end',
		},
		// type: 'checkbox',
		defaultValue: true,
		col: 6,
	},
];

const lifeFinancialSchema: any =
	generateZodSchema<LifeFinancialSchema>(financialFormFields);
type LifeFinancialSchema = z.infer<typeof lifeFinancialSchema>;
export { financialFormFields, lifeFinancialSchema, type LifeFinancialSchema };
