import z from 'zod';
import { generateDefaultValues, generateZodSchema } from './custom-validatior';
import { FormFieldConfig } from '~/types/form-field';

const documentTypeInternalFormFields: FormFieldConfig[] = [
	{
		name: 'document_internal_type_name',
		label: 'Tên loại tài liệu',
		placeholder: 'Nhập tên loại tài liệu...',
		isRequired: true,
		defaultValue: '',
		col: 6,
	},
];
type DocumentTypeInternalFormFields = z.infer<
	typeof documentTypeInternalSchema
>;
const documentTypeInternalSchema: any =
	generateZodSchema<DocumentTypeInternalFormFields>(
		documentTypeInternalFormFields,
	);
const initialTypeInternalFormValues = generateDefaultValues(
	documentTypeInternalFormFields,
);
export {
	documentTypeInternalSchema,
	documentTypeInternalFormFields,
	initialTypeInternalFormValues,
	type DocumentTypeInternalFormFields,
};
