import { NumberField } from '~/features/shared/components/form-fields';
import { generateZodSchema } from './custom-validatior';
import z from 'zod';

const configLevelUpFormFields: any[] = [
	{
		name: 'xp_person_reach',
		label: 'Doanh số cá nhân',
		placeholder: 'Nhập doanh số cá nhân...',
		defaultValue: '0',
		extra: NumberField,
		isRequired: true,
		col: 4,
	},
	{
		name: 'xp_group_reach',
		label: 'Doanh số nhóm',
		placeholder: 'Nhập doanh số nhóm...',
		extra: NumberField,
		isRequired: true,
		defaultValue: '0',
		col: 4,
	},
	{
		name: 'no_child_reach',
		label: 'Thành viên liền kề',
		placeholder: 'Nhập thành viên liền kề...',
		type: 'number',
		isRequired: true,
		defaultValue: '',
		col: 4,
	},
	// {
	//   name: "amount_escrow",
	//   label: "Tiền ký quỹ",
	//   placeholder: "Nhập tiền ký quỹ...",
	//   extra: NumberField,
	//   isRequired: true,
	//   defaultValue: "",
	//   col: 4,
	// },
	// {
	//   name: "percentage_period",
	//   label: "% ký quỹ trên kỳ",
	//   placeholder: "Nhập % ký quỹ trên kỳ",
	//   type: "text",
	//   isRequired: true,
	//   defaultValue: "",
	//   isPercent: true,
	//   col: 4,
	// },
	// {
	//   name: "max_escrow",
	//   label: "Ký quỹ tối đa trên kỳ",
	//   placeholder: "Nhập quỹ tối đa trên kỳ",
	//   extra: NumberField,
	//   defaultValue: "",
	//   isRequired: true,
	//   col: 4,
	// },
];

const configLevelUpSchema: any = generateZodSchema<configLevelupSchema>(
	configLevelUpFormFields,
);
type configLevelupSchema = z.infer<typeof configLevelUpSchema>;
export {
	configLevelUpFormFields,
	configLevelUpSchema,
	type configLevelupSchema,
};
