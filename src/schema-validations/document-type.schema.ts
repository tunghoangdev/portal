import z from 'zod';
import { generateZodSchema } from './custom-validatior';
// import { ProviderField } from '~/components/ui';
import { FormFieldConfig } from '~/types/form-field';
import { ProviderField } from '~/features/shared/components/form-fields';

const documentTypeFormFields: FormFieldConfig[] = [
	{
		name: 'document_type_name',
		label: 'Tên loại tài liệu',
		placeholder: 'Nhập tên loại tài liệu...',
		extra: ProviderField,
		isRequired: true,
		defaultValue: '',
		col: 6,
	},
];
type DocumentTypeFormFields = z.infer<typeof documentTypeSchema>;
const documentTypeSchema: any = generateZodSchema<DocumentTypeFormFields>(
	documentTypeFormFields,
);

export {
	documentTypeSchema,
	documentTypeFormFields,
	type DocumentTypeFormFields,
};
