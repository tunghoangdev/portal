import { generateZodSchema } from './custom-validatior';
import z from 'zod';

const commissionTypeFormFields: any[] = [
	{
		name: 'commission_type_name',
		label: 'Loại thưởng',
		placeholder: 'Nhập loại thưởng...',
		type: 'text',
		defaultValue: '',
		isRequired: true,
		col: 12,
	},
];

const commissionTypeSchema: any = generateZodSchema<commssionTypeSchema>(
	commissionTypeFormFields,
);
type commssionTypeSchema = z.infer<typeof commissionTypeSchema>;
export {
	commissionTypeFormFields,
	commissionTypeSchema,
	type commssionTypeSchema,
};
