import { generateDefaultValues, generateZodSchema } from "~/schema-validations";
import z from "zod";
import {
  DocTypeField,
  SwitchField,
  PermissionDocTypeField,
  FileField,
} from "~/features/shared/components/form-fields";
export const formFields: any[] = [
  {
    name: "id_document_type",
    label: "Loại tài liệu",
    placeholder: "Chọn loại tài liệu...",
    extra: DocTypeField,
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
  {
    name: "permission_doc_name",
    label: "Tên quyền tài liệu",
    type: "hidden",
    defaultValue: "",
  },
  {
    name: "document_name",
    label: "Tên tài liệu",
    placeholder: "Nhập tên tài liệu...",
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
  {
    name: "permission_doc",
    label: "Quyền tài liệu",
    placeholder: "Chọn quyền tài liệu...",
    extra: PermissionDocTypeField,
    defaultValue: "all",
    isRequired: true,
    col: 6,
  },
  {
    name: "link_doc",
    label: "File pdf",
    placeholder: "Nhập file pdf...",
    extra: FileField,
    type: "file",
    variant: "file",
    // type: "upload",
    // extra: FileUploadField,
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
  {
    name: "is_hide",
    label: "Ẩn tài liệu",
    extra: SwitchField,
    defaultValue: "",
    col: 6,
  },
  {
    name: "is_hot",
    label: "Tài liệu nổi bật",
    extra: SwitchField,
    defaultValue: true,
    col: 6,
  },
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
