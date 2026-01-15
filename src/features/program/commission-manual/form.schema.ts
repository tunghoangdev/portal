import {
  NumberField,
  PhoneField,
  PeriodField,
  CommissonTypeField,
} from "~/features/shared/components/form-fields";

import { generateDefaultValues, generateZodSchema } from "~/schema-validations";
import z from "zod";
export const formFields: any[] = [
  {
    name: "id_agent",
    type: "hidden",
    defaultValue: "",
    isNumber: true,
  },
  {
    name: "agent_phone",
    label: "SĐT thành viên",
    placeholder: "Nhập số điện thoại...",
    type: "text",
    extra: PhoneField,
    defaultValue: "",
    isRequired: true,
    isPhone: true,
    col: 6,
  },
  {
    name: "amount",
    label: "Số tiền",
    placeholder: "Nhập số tiền...",
    defaultValue: "0",
    extra: NumberField,
    isRequired: true,
    col: 6,
  },
  {
    name: "period_name",
    label: "Kỳ tính thưởng",
    placeholder: "Nhập kỳ tính thưởng...",
    defaultValue: "",
    extra: PeriodField,
    isRequired: true,
    col: 6,
  },
  {
    name: "commission_type_name",
    label: "Loại thưởng",
    placeholder: "Chọn loại thưởng...",
    extra: CommissonTypeField,
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
