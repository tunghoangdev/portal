import { generateDefaultValues, generateZodSchema } from '~/schema-validations';
import z from 'zod';
import {
	BankField,
	IssuedPlaceField,
	PermissionField,
} from '~/features/shared/components/form-fields';
export const formFields: any[] = [
	{
		name: 'staff_name',
		type: 'text',
		label: 'Tên thành viên',
		placeholder: 'Nhập tên thành viên...',
		defaultValue: '',
		isRequired: true,
		col: 4,
	},
	{
		name: 'phone',
		label: 'Số điện thoại',
		placeholder: 'Nhập số điện thoại...',
		type: 'text',
		defaultValue: '',
		isRequired: true,
		isPhone: true,
		col: 4,
	},
	{
		name: 'id_permission',
		label: 'Nhóm quyền',
		placeholder: 'Chọn nhóm quyền...',
		extra: PermissionField,
		isRequired: true,
		defaultValue: '',
		col: 4,
	},

	{
		name: 'gender',
		label: 'Giới tính',
		placeholder: 'Chọn giới tính...',
		type: 'select',
		options: [
			{
				label: 'Nam',
				value: 'Nam',
			},
			{
				label: 'Nữ',
				value: 'Nữ',
			},
		],
		isRequired: true,
		defaultValue: 'Nam',
		col: 4,
	},
	{
		name: 'email',
		label: 'Email',
		placeholder: 'Nhập email...',
		type: 'text',
		isRequired: true,
		defaultValue: '',
		isEmail: true,
		col: 4,
	},
	{
		name: 'birthday',
		label: 'Ngày sinh',
		type: 'date',
		defaultValue: '',
		col: 4,
	},

	{
		name: 'address',
		label: 'Địa chỉ',
		placeholder: 'Nhập địa chỉ...',
		type: 'text',
		defaultValue: '',
		col: 12,
	},
	{
		name: 'id_number',
		label: 'Số CCCD',
		placeholder: 'Nhập số CCCD...',
		type: 'number',
		defaultValue: '',
		isCCCD: true,
		col: 4,
	},
	{
		name: 'issued_date',
		label: 'Ngày cấp',
		placeholder: 'Nhập ngày cấp...',
		type: 'date',
		defaultValue: '',
		col: 4,
	},
	{
		name: 'issued_place',
		label: 'Nơi cấp',
		placeholder: 'Chọn nơi cấp...',
		extra: IssuedPlaceField,
		defaultValue: 'Bộ Công An',
		col: 4,
	},
	{
		name: 'id_bank',
		label: 'Tên ngân hàng',
		placeholder: 'Chọn tên ngân hàng...',
		extra: BankField,
		defaultValue: '',
		col: 8,
	},
	{
		name: 'bank_number',
		label: 'Số tài khoản',
		placeholder: 'Nhập số tài khoản...',
		type: 'text',
		defaultValue: '',
		col: 4,
	},
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
