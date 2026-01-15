import { API_ENDPOINTS } from "~/constant/api-endpoints";
import {
  PhoneField,
  CustomerField,
  ProductMainField,
  ProviderField,
  NumberField,
  ProductField,
} from "~/features/shared/components/form-fields";
import { generateDefaultValues, generateZodSchema } from "~/schema-validations";
import z from "zod";
const today = new Date();
today.setFullYear(today.getFullYear() + 1);
import { FeeField } from "./custom-fields";

const productFields: any[] = [
  {
    name: "id_abroad_product",
    label: "Sản phẩm",
    placeholder: "Chọn sản phẩm...",
    extra: ProductMainField,
    customPath: API_ENDPOINTS.dic.abroadProduct,
    storeName: "id_abroad_provider",
    defaultValue: "",
    defaultOption: 0,
    isRequired: true,
    col: 6,
  },
  {
    name: "fee",
    label: "Doanh số",
    placeholder: "Nhập doanh số...",
    extra: FeeField,
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
];

export const formFields: any[] = [
  {
    name: "id_customer",
    type: "hidden",
    defaultValue: "",
  },
  {
    name: "id_agent",
    type: "hidden",
    defaultValue: "",
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
    name: "customer_phone",
    label: "SĐT khách hàng",
    placeholder: "Nhập số điện thoại khách hàng...",
    extra: CustomerField,
    type: "text",
    defaultValue: "",
    isRequired: true,
    isPhone: true,
    col: 6,
  },
  {
    name: "id_abroad_provider",
    label: "Nhà cung cấp",
    placeholder: "Chọn nhà cung cấp...",
    extra: ProviderField,
    basePath: API_ENDPOINTS.dic.abroadProvider,
    defaultValue: "",
    defaultOption: 0,
    isRequired: true,
    col: 6,
  },

  {
    name: "number_contract",
    label: "Số hợp đồng",
    placeholder: "Nhập số hợp đồng...",
    type: "text",
    defaultValue: "",
    isRequired: true,
    col: 6,
  },

  {
    name: "list_product",
    extra: ProductField,
    type: "array",
    subFields: productFields,
    customPath: API_ENDPOINTS.dic.abroadProduct,
    col: 12,
  },
];
export const initialFormValues = generateDefaultValues(formFields);
export const formSchema: any = generateZodSchema<IFormFields>(formFields);
export type IFormFields = z.infer<typeof formSchema>;
