
import { SwitchField } from '~/features/shared/components/form-fields';
import { generateDefaultValues, generateZodSchema } from '~/schema-validations';
import z from 'zod';
export const formLevelFields: any[] = [
	{
		name: 'level_code',
		type: 'text',
		label: 'Mã cấp bậc (Tối đa 3 ký tự)',
		placeholder: 'Nhập mã cấp bậc...',
		defaultValue: '',
		isRequired: true,
		maxLength: 3,
		col: 4,
	},
	{
		name: 'is_lock',
		label: 'Khoá',
		extra: SwitchField,
		defaultValue: false,
		classNames: {
			wrapper: "flex flex-col h-full justify-end",
		},
		col: 4,
	},
];
export const initialFormLevelValues = generateDefaultValues(formLevelFields);
export const formLevelSchema: any = generateZodSchema<IFormLevelFields>(formLevelFields);
export type IFormLevelFields = z.infer<typeof formLevelSchema>;
