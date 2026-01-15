import { generateDefaultValues, generateZodSchema } from './custom-validatior';
import { z } from 'zod';
import {
	BankField,
	ProvinceSelect,
	WardSelect,
} from '~/features/shared/components/form-fields';
export const registerFormFields: any[] = [
	{
		name: 'agent_phone',
		label: 'SĐT thành viên',
		placeholder: 'Nhập số điện thoại...',
		type: 'text',
		defaultValue: '',
		isRequired: true,
		isPhone: true,
		col: 4,
	},
	{
		name: 'email',
		label: 'Email (Không bắt buộc)',
		placeholder: 'Nhập email',
		type: 'text',
		// isRequired: true,
		defaultValue: '',
		col: 8,
	},
	{
		name: 'agent_name',
		label: 'Họ và tên',
		placeholder: 'Nhập họ và tên...',
		type: 'text',
		isRequired: true,
		defaultValue: '',
		col: 4,
	},
	{
		name: 'birthday',
		label: 'Ngày sinh',
		placeholder: 'Nhập ngày sinh',
		type: 'date',
		isRequired: true,
		isBirthday: true,
		defaultValue: null,
		col: 4,
	},
	{
		name: 'gender',
		label: 'Giới tính',
		placeholder: 'Chọn giới tính...',
		type: 'select',
		isRequired: true,
		defaultOpttion: 0,
		defaultValue: 'Nam',
		options: [
			{
				value: 'Nam',
				label: 'Nam',
			},
			{
				value: 'Nữ',
				label: 'Nữ',
			},
		],
		col: 4,
	},
	{
		name: 'id_bank',
		label: 'Ngân hàng',
		placeholder: 'Chọn ngân hàng...',
		extra: BankField,
		isRequired: true,
		defaultValue: false,
		col: 8,
	},
	{
		name: 'bank_number',
		label: 'Số tài khoản',
		placeholder: 'Nhập số tài khoản',
		type: 'text',
		isRequired: true,
		// isNumber: true,
		// allowZero: true,
		defaultValue: null,
		col: 4,
	},
	{
		name: 'id_province',
		label: 'Tỉnh/Thành phố',
		placeholder: 'Chọn tỉnh/ thành phố',
		extra: ProvinceSelect,
		isRequired: true,
		isNumber: true,
		defaultValue: '',
		fieldOptions: {
			col: 4,
			// districtName: 'id_district',
			wardName: 'id_commune',
			streetName: 'address',
		},
		col: 6,
	},
	{
		name: 'id_commune',
		label: 'Phường/Xã',
		placeholder: 'Chọn phường/xã',
		extra: WardSelect,
		isRequired: true,
		isNumber: true,
		defaultValue: '',
		col: 6,
	},
	{
		name: 'address',
		label: 'Số nhà tên đường',
		placeholder: 'Nhập địa chỉ...',
		type: 'text',
		isRequired: true,
		defaultValue: '',
		col: 12,
	},
	{
		name: 'full_address',
		type: 'hidden',
		defaultValue: '',
	},
	// {
	// 	name: 'id_district',
	// 	type: 'hidden',
	// 	defaultValue: '',
	// },
	// {
	// 	name: 'id_commune',
	// 	type: 'hidden',
	// 	defaultValue: '',
	// },
];
export const initialFormValues = generateDefaultValues(registerFormFields);
export const agentRegisterSchema: any =
	generateZodSchema<IAgentRegister>(registerFormFields);
export type IAgentRegister = z.infer<typeof agentRegisterSchema>;

// export const agentRegisterSchema = z.object({
// 	agent_phone: validatePhone('SĐT thành viên'),
// 	agent_name: z
// 		.string({
// 			required_error: 'Tên thành viên không được để trống',
// 			invalid_type_error: 'Tên thành viên không được để trống',
// 		})
// 		.min(1, 'Tên thành viên không được để trống'),

// 	email: z
// 		.string({
// 			required_error: 'Email không được để trống',
// 			invalid_type_error: 'Email không được để trống',
// 		})
// 		.email('Email không hợp lệ')
// 		.min(1, 'Email không được để trống'), // Zod sẽ kiểm tra chuỗi rỗng

// 	birthday: validateBirthdayAndTransform('Ngày sinh'),

// 	bank_number: z
// 		.string({
// 			required_error: 'Số tài khoản không được để trống',
// 			invalid_type_error: 'Số tài khoản không được để trống',
// 		})
// 		.min(1, 'Số tài khoản không được để trống')
// 		.regex(/^\d{9,14}$/, 'Số tài khoản không hợp lệ (9-14 chữ số)'), // Ví dụ cho số tài khoản ngân hàng

// 	id_bank: z
// 		.number({
// 			required_error: 'Ngân hàng không được để trống',
// 			invalid_type_error: 'ID Ngân hàng không hợp lệ',
// 		})
// 		.int('ID Ngân hàng phải là số nguyên')
// 		.min(1, 'Ngân hàng không được để trống'),

// 	id_province: z
// 		.number({
// 			required_error: 'Tỉnh/Thành phố không được để trống',
// 			invalid_type_error: 'ID Tỉnh/Thành phố không hợp lệ',
// 		})
// 		.int('ID Tỉnh/Thành phố phải là số nguyên')
// 		.min(1, 'Tỉnh/Thành phố không được để trống'),

// 	id_district: z
// 		.number({
// 			required_error: 'Quận/Huyện không được để trống',
// 			invalid_type_error: 'ID Quận/Huyện không hợp lệ',
// 		})
// 		.int('ID Quận/Huyện phải là số nguyên')
// 		.min(1, 'Quận/Huyện không được để trống'),

// 	id_commune: z
// 		.number({
// 			required_error: 'Xã/Phường không được để trống',
// 			invalid_type_error: 'ID Xã/Phường không hợp lệ',
// 		})
// 		.int('ID Xã/Phường phải là số nguyên')
// 		.min(1, 'Xã/Phường không được để trống'),

// 	address: z
// 		.string({
// 			required_error: 'Số nhà tên đường không được để trống',
// 			invalid_type_error: 'Số nhà tên đường không được để trống',
// 		})
// 		.min(1, 'Số nhà tên đường không được để trống'),
// });

// Đây là cách bạn suy luận kiểu dữ liệu từ schema Zod
// export type AgentFormData = z.infer<typeof agentRegisterSchema>;
