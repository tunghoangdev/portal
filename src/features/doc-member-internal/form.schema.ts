import { generateDefaultValues, generateZodSchema } from "~/schema-validations";
import z from "zod";
import {
  DocTypeInternalField,
  FileField,
} from "~/features/shared/components/form-fields";
export const formFields: any[] = [
  {
    name: "id_document_internal_type",
    label: "Loại tài liệu",
    placeholder: "Chọn loại tài liệu...",
    extra: DocTypeInternalField,
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
  {
    name: "document_internal_name",
    label: "Tên tài liệu",
    placeholder: "Nhập tên tài liệu...",
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
  {
    name: "document_internal_image",
    label: "Hình ảnh",
    placeholder: "Nhập hình ảnh...",
    extra: FileField,
    // extra: ImageUploadField,
    // type: 'upload',
    defaultValue: "",
    col: 6,
  },
  {
    name: "document_internal_file",
    label: "File pdf",
    placeholder: "Nhập file pdf...",
    // type: 'upload',
    // extra: FileUploadField,
    extra: FileField,
    type: "file",
    variant: "file",
    defaultValue: "",
    col: 6,
  },
  // {
  // 	name: 'document_internal_file',
  // 	label: 'File pdf',
  // 	placeholder: 'Nhập file pdf...',
  // 	type: 'file',
  // 	variant: 'file',
  // 	// path: 'document_internal_file',
  // 	extra: FileField,
  // 	defaultValue: '',
  // 	col: 6,
  // },
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
