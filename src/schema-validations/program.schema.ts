import z from "zod";
import { generateZodSchema } from "./custom-validatior";
import {
  FileField,
  PermissionDocTypeField,
  SwitchField,
} from "~/features/shared/components/form-fields";
import { getLocalTimeZone, now } from "@internationalized/date";

const programFormFields: any[] = [
  {
    name: "program_name",
    label: "Tên chương trình",
    placeholder: "Nhập tên chương trình...",
    type: "text",
    defaultValue: "",
    isRequired: true,
    col: 12,
  },
  {
    name: "start_date",
    label: "Ngày bắt đầu",
    type: "datetime",
    isRequired: true,
    // isFeatured: true,
    defaultValue: now(getLocalTimeZone()).toAbsoluteString(),
    col: 6,
  },
  {
    name: "finished_date",
    label: "Ngày kết thúc",
    type: "datetime",
    isRequired: true,
    // isFeatured: true,
    defaultValue: now(getLocalTimeZone()).toAbsoluteString(),
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
    name: "is_hide",
    label: "Ẩn chương trình",
    extra: SwitchField,
    classNames: {
      wrapper: "flex flex-col h-full justify-end",
    },
    defaultValue: false,
    col: 3,
  },
  {
    name: "is_start",
    label: "Đang hoạt động",
    extra: SwitchField,
    classNames: {
      wrapper: "flex flex-col h-full justify-end",
    },
    isRequired: true,
    defaultValue: true,
    col: 3,
  },
  {
    name: "program_image",
    label: "Hình ảnh",
    extra: FileField,
    // extra: ImageUploadField,
    // type: 'upload',
    isRequired: true,
    defaultValue: "",
    col: 12,
  },

  {
    name: "program_file",
    label: "File chương trình",
    // type: 'upload',
    // extra: FileUploadField,
    extra: FileField,
    type: "file",
    variant: "file",
    defaultValue: "",
    col: 6,
  },
  {
    name: "result_file",
    label: "File kết quả",
    // extra: FileUploadField,
    // type: 'upload',
    extra: FileField,
    type: "file",
    variant: "file",
    defaultValue: "",
    col: 6,
  },
  {
    name: "permission_doc_name",
    type: "hidden",
    defaultValue: "",
  },
];

const programUpSchema: any =
  generateZodSchema<programSchema>(programFormFields);
type programSchema = z.infer<typeof programUpSchema>;
export { programFormFields, programUpSchema, type programSchema };
