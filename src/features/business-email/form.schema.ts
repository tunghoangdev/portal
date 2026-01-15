import { generateDefaultValues, generateZodSchema } from '~/schema-validations';
import z from 'zod';
import {
	PhoneField,
	StaffField,
	SwitchField,
} from '~/features/shared/components/form-fields';

export const formFields: any[] = [
	{
		name: 'id_agent_staff',
		type: 'hidden',
		defaultValue: '',
	},
	{
		name: 'agent_phone',
		label: 'SĐT thành viên',
		placeholder: 'Nhập số điện thoại...',
		type: 'text',
		extra: PhoneField,
		watchName: 'id_agent_staff',
		defaultValue: '',
		isRequired: true,
		col: 6,
	},
	{
		name: 'mail',
		label: 'Email',
		type: 'email',
		placeholder: 'Nhập email...',
		defaultValue: '',
		isRequired: true,
		col: 6,
	},
	{
		name: 'password',
		label: 'Mật khẩu',
		placeholder: 'Nhập mật khẩu...',
		type: 'text',
		defaultValue: '',
		// isRequired: true,
		col: 6,
	},
	{
		name: 'storage',
		label: 'Dung lượng',
		placeholder: 'Nhập dung lượng...',
		type: 'text',
		defaultValue: '',
		col: 6,
	},
	{
		name: 'is_lock',
		label: 'Ngừng hoạt động',
		extra: SwitchField,
		defaultValue: false,
		col: 6,
	},
];
export const formStaffFields: any[] = formFields.map((item) => {
	if (item.name === 'agent_phone') {
		return {
			...item,
			label: 'Mã số nhân viên',
			placeholder: 'Nhập mã số nhân viên...',
			extra: StaffField,
		};
	}
	return item;
});
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export const formStaffSchema: any =
	generateZodSchema<IFormFields>(formStaffFields);
export type IFormFields = z.infer<typeof formSchema>;
