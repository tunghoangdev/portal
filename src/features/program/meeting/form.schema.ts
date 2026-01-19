// const EditorField = dynamic(
//   () =>
//     import("~/features/shared/components/form-fields/editor-field").then(
//       (mod) => mod.EditorField
//     ),
//   { ssr: false }
// );
import {
  EditorField,
  FileField,
  PermissionDocTypeField,
  SwitchField,
} from "~/features/shared/components/form-fields";
import { generateDefaultValues, generateZodSchema } from "~/schema-validations";
import { now, getLocalTimeZone } from "@internationalized/date";
import z from "zod";
export const formFields: any[] = [
  {
    name: "title_name",
    label: "Tiêu đề",
    placeholder: "Nhập tiêu đề...",
    type: "text",
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
  {
    name: "start_date",
    label: "Thời gian bắt đầu",
    placeholder: "Nhập thời gian bắt đầu...",
    type: "datetime",
    isRequired: true,
    // isFeatured: true,
    defaultValue: now(getLocalTimeZone()).toAbsoluteString(),
    col: 6,
  },
  {
    name: "id_meeting",
    label: "ID cuộc họp",
    placeholder: "Nhập ID cuộc họp...",
    type: "text",
    defaultValue: "",
    isRequired: true,
    col: 6,
  },

  {
    name: "pass_meeting",
    label: "Mật khẩu cuộc họp",
    placeholder: "Nhập mật khẩu cuộc họp...",
    type: "text",
    isRequired: true,
    col: 6,
  },
  {
    name: "permission_doc",
    label: "Phân quyền",
    placeholder: "Chọn phân quyền...",
    extra: PermissionDocTypeField,
    defaultValue: "all",
    isRequired: true,
    col: 6,
  },
  {
    name: "permission_doc_name",
    defaultValue: "",
    type: "hidden",
  },
  {
    name: "is_hide",
    label: "Ẩn cuộc họp",
    extra: SwitchField,
    classNames: {
      wrapper: "flex flex-col justify-end h-full",
    },
    defaultValue: false,
    col: 3,
  },
  {
    name: "is_hot",
    label: "Cuộc họp nổi bật",
    extra: SwitchField,
    classNames: {
      wrapper: "flex flex-col justify-end h-full",
    },
    defaultValue: false,
    col: 3,
  },
  {
    name: "link_meeting",
    label: "Link cuộc họp",
    placeholder: "Nhập link cuộc họp...",
    type: "textarea",
    defaultValue: "",
    isRequired: true,
    isUrl: true,
    col: 6,
    fieldProps: {
      minRows: 5,
    },
  },
  {
    name: "link_image",
    label: "Hình ảnh",
    placeholder: "Nhập hình ảnh...",
    // type: 'upload',
    // extra: ImageUploadField,
    extra: FileField,
    isRequired: true,
    col: 6,
  },
  {
    name: "description",
    label: "Nội dung",
    placeholder: "Nhập nội dung...",
    extra: EditorField,
    defaultValue: "",
    isRequired: true,
    col: 12,
  },
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
