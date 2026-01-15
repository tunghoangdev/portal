import { generateDefaultValues, generateZodSchema } from "~/schema-validations";
import z from "zod";
import {
  FileField,
  PermissionDocTypeField,
  SwitchField,
} from "~/features/shared/components/form-fields";
export const formFields: any[] = [
  {
    name: "announcement_name",
    label: "Tên thông báo",
    placeholder: "Nhập tên thông báo...",
    type: "text",
    defaultValue: "",
    isRequired: true,
    col: 12,
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
    name: "is_hide",
    label: "Ẩn thông báo",
    extra: SwitchField,
    classNames: {
      wrapper: "flex flex-col h-full justify-end",
    },
    defaultValue: "",
    col: 3,
  },
  {
    name: "is_hot",
    label: "Thông báo nổi bật",
    extra: SwitchField,
    classNames: {
      wrapper: "flex flex-col h-full justify-end",
    },
    defaultValue: true,
    col: 3,
  },
  {
    name: "announcement_image",
    label: "Hình ảnh",
    placeholder: "Nhập hình ảnh...",
    // type: 'upload',
    // extra: ImageUploadField,
    extra: FileField,
    defaultValue: "",
    col: 6,
  },
  {
    name: "announcement_file",
    label: "File pdf",
    placeholder: "Nhập file pdf...",
    extra: FileField,
    type: "file",
    variant: "file",
    // type: 'upload',
    // extra: FileUploadField,
    defaultValue: "",
    col: 6,
  },
  {
    name: "permission_doc_name",
    type: "hidden",
    defaultValue: "",
  },
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
