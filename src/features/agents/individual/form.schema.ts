import {
	PhoneField,
	CustomerField,
	ProductMainField,
	ProviderField,
	ContactTypeField,
	ContractNumberField,
	FinanField,
	FeeTypeField,
	NumberField,
	ArrayButtonField,
} from '~/features/shared/components/form-fields';
import { ProductSubField } from '~/features/shared/components/form-fields/product-sub-field';
import { generateDefaultValues, generateZodSchema } from '~/schema-validations';
import z from 'zod';

// const productFields: any[] = [
// 	{
// 		name: 'id_life_product',
// 		label: 'Sản phẩm',
// 		placeholder: 'Chọn sản phẩm...',
// 		extra: ProductMainField,
// 		defaultValue: '',
// 		defaultOption: 0,
// 		isRequired: true,
// 		col: 6,
// 	},
// 	{
// 		name: 'fee',
// 		label: 'Phí đóng',
// 		placeholder: 'Nhập phí đóng...',
// 		extra: NumberField,
// 		defaultValue: '',
// 		isRequired: true,
// 		col: 6,
// 	},
// ];

const subProductFields: any[] = [
	{
		name: 'id_life_product',
		label: 'Sản phẩm bổ trợ',
		placeholder: 'Chọn sản phẩm bổ trợ...',
		extra: ProductSubField,
		defaultValue: '',
		defaultOption: 0,
		isRequired: true,
		col: 6,
	},
	{
		name: 'fee',
		label: 'Phí đóng',
		placeholder: 'Nhập phí đóng...',
		extra: NumberField,
		defaultValue: '',
		isRequired: true,
		isAmount: true,
		col: 6,
	},
];

export const formFields: any[] = [
	[
		{
			name: 'id_customer',
			type: 'hidden',
			defaultValue: '',
		},
		{
			name: 'id_agent',
			type: 'hidden',
			defaultValue: '',
		},
		{
			name: 'id_life_type',
			label: 'Loại hợp đồng',
			placeholder: 'Chọn loại hợp đồng...',
			extra: ContactTypeField,
			defaultValue: '',
			defaultOption: 0,
			isRequired: true,
			isPhone: true,
			col: 6,
		},
		{
			name: 'number_contract',
			label: 'Số hợp đồng',
			placeholder: 'Nhập số hợp đồng...',
			extra: ContractNumberField,
			defaultValue: '',
			// isRequired: true,
			col: 6,
		},
	],
	[
		{
			name: 'agent_phone',
			label: 'SĐT thành viên',
			placeholder: 'Nhập số điện thoại...',
			type: 'text',
			extra: PhoneField,
			defaultValue: '',
			isRequired: true,
			isDisabled: true,
			isPhone: true,
			col: 6,
		},
		{
			name: 'customer_phone',
			label: 'SĐT khách hàng',
			placeholder: 'Nhập số điện thoại khách hàng...',
			type: 'text',
			extra: CustomerField,
			defaultValue: '',
			isRequired: true,
			isPhone: true,
			col: 6,
		},
		{
			name: 'number_request',
			label: 'Số giấy yêu cầu',
			placeholder: 'Nhập số giấy yêu cầu...',
			type: 'text',
			defaultValue: '',
			isRequired: true,
			col: 6,
		},

		{
			name: 'id_life_fee_time',
			label: 'Loại phí đóng',
			placeholder: 'Chọn loại phí đóng...',
			extra: FeeTypeField,
			defaultValue: '',
			defaultOption: 0,
			isRequired: true,
			col: 6,
		},
		{
			name: 'id_life_provider',
			label: 'Nhà cung cấp',
			placeholder: 'Chọn nhà cung cấp...',
			extra: ProviderField,
			defaultValue: '',
			isRequired: true,
			defaultOption: 0,
			col: 6,
		},
		{
			name: 'id_finan',
			label: 'Tư vấn tài chính',
			placeholder: 'Chọn tư vấn tài chính...',
			extra: FinanField,
			defaultValue: '',
			isRequired: true,
			col: 6,
		},
	],
	[
		{
			name: 'id_product_main',
			label: 'Sản phẩm chính',
			placeholder: 'Chọn sản phẩm chính',
			extra: ProductMainField,
			defaultValue: '',
			defaultOption: 0,
			isRequired: true,
			col: 6,
		},
		{
			name: 'fee_main',
			label: 'Phí đóng',
			placeholder: 'Nhập phí đóng...',
			extra: NumberField,
			isAmount: true,
			defaultValue: '',
			col: 6,
		},
		{
			name: 'list_sub_product',
			extra: ArrayButtonField,
			type: 'array',
			subFields: subProductFields,
			col: 12,
		},
		// {
		// 	name: 'list_sub_product',
		// 	label: 'Sản phẩm bổ trợ',
		// 	placeholder: 'Chọn sản phẩm bổ trợ...',
		// 	isRequired: true,
		// 	extra: ProductSubField,
		// 	defaultValue: [],
		// 	// defaultValue: [
		// 	// 	{
		// 	// 		id_life_product: '',
		// 	// 		fee: '0',
		// 	// 	},
		// 	// ],
		// 	col: 12,
		// },
	],
];
export const initialFormValues = generateDefaultValues(formFields.flat());
export const formSchema: any = generateZodSchema<IFormFields>(
	formFields.flat(),
);
export type IFormFields = z.infer<typeof formSchema>;
