import z from "zod";
// import { ProviderField } from '~/components/ui';
import { FormFieldConfig } from "~/types/form-field";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import {
  NumberField,
  ProviderField,
} from "~/features/shared/components/form-fields";
import { generateDefaultValues, generateZodSchema } from "~/schema-validations";

const productFormFields: FormFieldConfig[] = [
  {
    name: "id_abroad_provider",
    label: "Nhà cung cấp",
    placeholder: "Chọn nhà cung cấp",
    extra: ProviderField,
    isRequired: true,
    defaultValue: "",
    col: 6,
    basePath: API_ENDPOINTS.dic.abroadProvider,
    storeName: "abroadProviders",
  },
  {
    name: "product_name",
    label: "Tên sản phẩm",
    placeholder: "Nhập tên sản phẩm...",
    type: "text",
    defaultValue: "",
    isRequired: true,
    col: 6,
  },
  {
    name: "xp_index",
    label: "Hệ số điểm",
    placeholder: "Nhập hệ số điểm",
    type: "number",
    isRequired: true,
    defaultValue: "",
    col: 6,
  },
  {
    name: "commission_provider",
    label: "Tổng thưởng nhà cung cấp (%)",
    placeholder: "Nhập hệ số điểm",
    type: "number",
    isRequired: true,
    defaultValue: "",
    col: 6,
  },
  {
    name: "fee",
    label: "Doanh số",
    placeholder: "Nhập doanh số...",
    defaultValue: "0",
    extra: NumberField,
    isRequired: true,
    col: 6,
  },
  {
    name: "is_hide",
    label: "Ẩn sản phấm",
    type: "checkbox",
    defaultValue: false,
    col: 6,
  },
];

const policyFields: FormFieldConfig[] = [
  {
    name: "percentage_level_1",
    label: "Thưởng AC %",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng AC %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_level_2",
    label: "Thưởng AAM (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng AAM %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_level_3",
    label: "Thưởng AM (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng AM %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_level_4",
    label: "Thưởng AD (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng AD %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_level_5",
    label: "Thưởng TD (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng TD %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_level_6",
    label: "Thưởng RD (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng RD %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },

  {
    name: "percentage_same_level_1",
    label: "Thưởng đồng cấp AC (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng AC %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_same_level_2",
    label: "Thưởng đồng cấp AAM (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng AAM %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_same_level_3",
    label: "Thưởng đồng cấp AM (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng AM %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_same_level_4",
    label: "Thưởng đồng cấp AD (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng AD %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_same_level_5",
    label: "Thưởng đồng cấp TD (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng TD %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_same_level_6",
    label: "Thưởng đồng cấp RD (%)",
    isRequired: true,
    placeholder: "Nhập tỷ lệ thưởng RD %",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
  {
    name: "percentage_same_level_7",
    label: "Thưởng TVTC %",
    isRequired: true,
    placeholder: "Nhập % thưởng TVTC",
    type: "number",
    defaultValue: "0",
    allowZero: true,
    col: 3,
  },
];

const productSchema = generateZodSchema(productFormFields);
const policySchema = generateZodSchema(policyFields);
const initialFormValues = generateDefaultValues(productFormFields);

type ProductFormFields = z.infer<typeof productSchema>;
type PolicyFormFields = z.infer<typeof policySchema>;

export {
  productSchema,
  productFormFields,
  policyFields,
  policySchema,
  initialFormValues,
  type ProductFormFields,
  type PolicyFormFields,
};
