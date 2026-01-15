import { generateDefaultValues, generateZodSchema } from "~/schema-validations";
import z from "zod";
import {
  FileField,
  NumberField,
  OutcomeField,
  OutcomeParentField,
} from "~/features/shared/components/form-fields";
export const formFields: any[] = [
  {
    name: "outcome_name_parent",
    label: "Mục cha",
    placeholder: "Chọn mục cha...",
    extra: OutcomeParentField,
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
  {
    name: "id_type",
    label: "Mục chi",
    placeholder: "Chọn mục chi...",
    extra: OutcomeField,
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
  {
    name: "amount",
    label: "Số tiền",
    placeholder: "Nhập số tiền...",
    extra: NumberField,
    defaultValue: "",
    isAmount: true,
    col: 6,
  },
  {
    name: "real_date",
    label: "Ngày chứng từ",
    type: "date",
    isRequired: true,
    isBefore: true,
    defaultValue: new Date().toISOString().split("T")[0],
    col: 6,
  },

  {
    name: "cash_book_image",
    label: "Ảnh chứng từ",
    placeholder: "Nhập ảnh chứng từ...",
    extra: FileField,
    // type: 'upload',
    // extra: ImageUploadField,
    defaultValue: "",
    col: 6,
  },
  {
    name: "cash_book_file",
    label: "File chứng từ",
    placeholder: "Nhập file chứng từ...",
    // type: "upload",
    // extra: FileUploadField,
    extra: FileField,
    type: "file",
    variant: "file",
    defaultValue: "",
    col: 6,
  },
  {
    name: "description",
    label: "Mô tả",
    placeholder: "Nhập mô tả...",
    type: "textarea",
    defaultValue: "",
    col: 12,
  },
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
